export type ServiceType = 'api-service' | 'database' | 'frontend' | 'auth-service' | 'message-queue' | 'storage' | 'serverless';

// Tech Stacks
export type ApiTechStack = 'dotnet' | 'nodejs' | 'python';
export type DatabaseEngine = 'postgresql' | 'sqlserver';
export type FrontendFramework = 'react';

// API Service Config
export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  requestBody?: string;
  responseBody?: string;
}

export interface ApiModelField {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface ApiModel {
  name: string;
  fields: ApiModelField[];
}

export interface ApiServiceConfig {
  techStack: ApiTechStack;
  serviceName: string;
  port: number;
  basePath: string;
  endpoints: ApiEndpoint[];
  models: ApiModel[];
  authentication: boolean;
}

// Database Config
export interface DatabaseColumn {
  name: string;
  type: string;
  primaryKey: boolean;
  nullable: boolean;
  defaultValue?: string;
  references?: {
    table: string;
    column: string;
  };
}

export interface DatabaseTable {
  name: string;
  columns: DatabaseColumn[];
}

export interface DatabaseConfig {
  engine: DatabaseEngine;
  databaseName: string;
  port: number;
  tables: DatabaseTable[];
  seedData: boolean;
}

// Frontend Config
export interface FrontendPage {
  name: string;
  route: string;
  description: string;
  connectedApi?: string;
}

export interface FrontendConfig {
  framework: FrontendFramework;
  appName: string;
  port: number;
  pages: FrontendPage[];
  styling: 'tailwind' | 'css-modules';
}

// Auth Service Config
export type AuthProvider = 'jwt' | 'oauth2' | 'session';

export interface AuthServiceConfig {
  provider: AuthProvider;
  serviceName: string;
  port: number;
  enableRegistration: boolean;
  enablePasswordReset: boolean;
  sessionDuration: string;
}

// Message Queue Config
export type QueueEngine = 'rabbitmq' | 'kafka' | 'redis';

export interface QueueTopic {
  name: string;
  description: string;
}

export interface MessageQueueConfig {
  engine: QueueEngine;
  serviceName: string;
  port: number;
  topics: QueueTopic[];
}

// Storage Config
export type StorageProvider = 's3' | 'azure-blob' | 'local';

export interface StorageBucket {
  name: string;
  public: boolean;
}

export interface StorageConfig {
  provider: StorageProvider;
  serviceName: string;
  buckets: StorageBucket[];
  maxFileSizeMb: number;
}

// Serverless Config
export type ServerlessRuntime = 'nodejs' | 'python' | 'dotnet';
export type ServerlessTrigger = 'http' | 'schedule' | 'queue' | 'storage';

export interface ServerlessFunction {
  name: string;
  trigger: ServerlessTrigger;
  description: string;
  schedule?: string;
}

export interface ServerlessConfig {
  runtime: ServerlessRuntime;
  serviceName: string;
  functions: ServerlessFunction[];
}
