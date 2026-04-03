import type { TemplateContext } from '../types';

export interface DockerComposeService {
  name: string;
  serviceType: string;
  techStack: string;
  port: number;
  buildDir: string;
  dependsOn?: string[];
  environment?: string[];
  volumes?: string[];
}

export function generateDockerCompose(services: DockerComposeService[]): string {
  let yaml = 'services:\n';

  for (const svc of services) {
    yaml += `  ${svc.name}:\n`;
    yaml += `    build: ./${svc.buildDir}\n`;

    if (svc.serviceType === 'database') {
      const internalPort = svc.techStack === 'postgresql' ? 5432 : 1433;
      yaml += `    ports:\n      - "${svc.port}:${internalPort}"\n`;
    } else if (svc.serviceType === 'frontend') {
      yaml += `    ports:\n      - "${svc.port}:80"\n`;
    } else {
      yaml += `    ports:\n      - "${svc.port}:${svc.port}"\n`;
    }

    if (svc.environment && svc.environment.length > 0) {
      yaml += `    environment:\n`;
      for (const env of svc.environment) {
        yaml += `      - ${env}\n`;
      }
    }

    if (svc.dependsOn && svc.dependsOn.length > 0) {
      yaml += `    depends_on:\n`;
      for (const dep of svc.dependsOn) {
        yaml += `      - ${dep}\n`;
      }
    }

    if (svc.volumes && svc.volumes.length > 0) {
      yaml += `    volumes:\n`;
      for (const vol of svc.volumes) {
        yaml += `      - ${vol}\n`;
      }
    }

    yaml += '\n';
  }

  const hasDb = services.some(s => s.serviceType === 'database');
  if (hasDb) {
    yaml += 'volumes:\n  db-data:\n';
  }

  return yaml;
}
