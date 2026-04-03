import type { GeneratedFile } from '../types';

interface TerraformServiceDef {
  name: string;
  serviceType: string;
  techStack: string;
  port: number;
  config: Record<string, unknown>;
}

export function generateAwsTerraform(
  projectName: string,
  services: TerraformServiceDef[],
): GeneratedFile[] {
  const slug = projectName.toLowerCase().replace(/\s+/g, '-');
  const files: GeneratedFile[] = [];

  // Main provider config
  files.push({
    path: 'infrastructure/main.tf',
    content: `terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "${slug}"
}

locals {
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}
`,
    source: 'template',
  });

  // VPC
  files.push({
    path: 'infrastructure/vpc.tf',
    content: `# VPC for the application
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "\${var.project_name}-\${var.environment}"
  cidr = "10.0.0.0/16"

  azs             = ["\${var.aws_region}a", "\${var.aws_region}b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]

  enable_nat_gateway   = true
  single_nat_gateway   = true
  enable_dns_hostnames = true

  tags = local.common_tags
}
`,
    source: 'template',
  });

  // ECR repos for each service
  const containerServices = services.filter(s => ['api-service', 'frontend', 'auth-service', 'serverless'].includes(s.serviceType));
  if (containerServices.length > 0) {
    let ecr = '# ECR Repositories\n';
    for (const svc of containerServices) {
      ecr += `
resource "aws_ecr_repository" "${svc.name.replace(/-/g, '_')}" {
  name                 = "\${var.project_name}-${svc.name}"
  image_tag_mutability = "MUTABLE"
  force_delete         = true

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = local.common_tags
}
`;
    }
    files.push({ path: 'infrastructure/ecr.tf', content: ecr, source: 'template' });
  }

  // ECS cluster + services
  const ecsServices = services.filter(s => ['api-service', 'frontend', 'auth-service'].includes(s.serviceType));
  if (ecsServices.length > 0) {
    let ecs = `# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "\${var.project_name}-\${var.environment}"
  tags = local.common_tags

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

`;
    for (const svc of ecsServices) {
      const safeName = svc.name.replace(/-/g, '_');
      ecs += `# ECS Service: ${svc.name}
resource "aws_ecs_task_definition" "${safeName}" {
  family                   = "\${var.project_name}-${svc.name}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = aws_iam_role.ecs_execution.arn

  container_definitions = jsonencode([{
    name      = "${svc.name}"
    image     = "\${aws_ecr_repository.${safeName}.repository_url}:latest"
    essential = true
    portMappings = [{
      containerPort = ${svc.port}
      protocol      = "tcp"
    }]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = "/ecs/\${var.project_name}-${svc.name}"
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "ecs"
      }
    }
  }])

  tags = local.common_tags
}

resource "aws_ecs_service" "${safeName}" {
  name            = "${svc.name}"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.${safeName}.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = module.vpc.private_subnets
    security_groups  = [aws_security_group.ecs.id]
    assign_public_ip = false
  }

  tags = local.common_tags
}

`;
    }

    ecs += `# ECS IAM Role
resource "aws_iam_role" "ecs_execution" {
  name = "\${var.project_name}-ecs-execution"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
    }]
  })

  tags = local.common_tags
}

resource "aws_iam_role_policy_attachment" "ecs_execution" {
  role       = aws_iam_role.ecs_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_security_group" "ecs" {
  name_prefix = "\${var.project_name}-ecs-"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
    cidr_blocks = [module.vpc.vpc_cidr_block]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = local.common_tags
}
`;
    files.push({ path: 'infrastructure/ecs.tf', content: ecs, source: 'template' });
  }

  // RDS for database services
  const dbServices = services.filter(s => s.serviceType === 'database');
  if (dbServices.length > 0) {
    const db = dbServices[0];
    const engine = (db.config as { engine?: string }).engine || 'postgresql';
    const dbName = (db.config as { databaseName?: string }).databaseName || 'app_db';

    files.push({
      path: 'infrastructure/rds.tf',
      content: `# RDS Database
variable "db_password" {
  description = "Database master password"
  type        = string
  sensitive   = true
}

resource "aws_db_subnet_group" "main" {
  name       = "\${var.project_name}-\${var.environment}"
  subnet_ids = module.vpc.private_subnets
  tags       = local.common_tags
}

resource "aws_security_group" "rds" {
  name_prefix = "\${var.project_name}-rds-"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port       = ${engine === 'postgresql' ? 5432 : 1433}
    to_port         = ${engine === 'postgresql' ? 5432 : 1433}
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs.id]
  }

  tags = local.common_tags
}

resource "aws_db_instance" "main" {
  identifier     = "\${var.project_name}-\${var.environment}"
  engine         = "${engine === 'postgresql' ? 'postgres' : 'sqlserver-ex'}"
  engine_version = "${engine === 'postgresql' ? '16' : '15.00'}"
  instance_class = "db.t3.micro"

  allocated_storage     = 20
  max_allocated_storage = 100
  storage_encrypted     = true

  db_name  = "${dbName}"
  username = "postgres"
  password = var.db_password

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  skip_final_snapshot = true
  deletion_protection = var.environment == "prod"

  tags = local.common_tags
}

output "db_endpoint" {
  value = aws_db_instance.main.endpoint
}
`,
      source: 'template',
    });
  }

  // S3 for storage services
  const storageServices = services.filter(s => s.serviceType === 'storage');
  if (storageServices.length > 0) {
    const buckets = (storageServices[0].config as { buckets?: { name: string; public: boolean }[] }).buckets || [];
    let s3 = '# S3 Buckets\n';
    for (const bucket of buckets) {
      const safeName = bucket.name.replace(/-/g, '_');
      s3 += `
resource "aws_s3_bucket" "${safeName}" {
  bucket = "\${var.project_name}-${bucket.name}-\${var.environment}"
  tags   = local.common_tags
}

resource "aws_s3_bucket_public_access_block" "${safeName}" {
  bucket = aws_s3_bucket.${safeName}.id

  block_public_acls       = ${!bucket.public}
  block_public_policy     = ${!bucket.public}
  ignore_public_acls      = ${!bucket.public}
  restrict_public_buckets = ${!bucket.public}
}
`;
    }
    files.push({ path: 'infrastructure/s3.tf', content: s3, source: 'template' });
  }

  // Outputs
  files.push({
    path: 'infrastructure/outputs.tf',
    content: `output "vpc_id" {
  value = module.vpc.vpc_id
}

output "ecs_cluster_name" {
  value = ${ecsServices.length > 0 ? 'aws_ecs_cluster.main.name' : '"n/a"'}
}
`,
    source: 'template',
  });

  // README for infrastructure
  files.push({
    path: 'infrastructure/README.md',
    content: `# ${projectName} - Infrastructure

## Prerequisites
- Terraform >= 1.5
- AWS CLI configured

## Deploy
\`\`\`bash
cd infrastructure
terraform init
terraform plan -var="db_password=YOUR_SECURE_PASSWORD"
terraform apply -var="db_password=YOUR_SECURE_PASSWORD"
\`\`\`

## Destroy
\`\`\`bash
terraform destroy -var="db_password=YOUR_SECURE_PASSWORD"
\`\`\`
`,
    source: 'template',
  });

  return files;
}
