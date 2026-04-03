import type { Node, Edge } from '@xyflow/react';
import type {
  ServiceType,
  ApiServiceConfig,
  DatabaseConfig,
  FrontendConfig,
  AuthServiceConfig,
  MessageQueueConfig,
  StorageConfig,
  ServerlessConfig,
} from './service-types';

// Node Data Types

export interface BaseServiceData {
  [key: string]: unknown;
  label: string;
  description: string;
  serviceType: ServiceType;
}

export interface ApiServiceData extends BaseServiceData {
  serviceType: 'api-service';
  config: ApiServiceConfig;
}

export interface DatabaseData extends BaseServiceData {
  serviceType: 'database';
  config: DatabaseConfig;
}

export interface FrontendData extends BaseServiceData {
  serviceType: 'frontend';
  config: FrontendConfig;
}

export interface AuthServiceNodeData extends BaseServiceData {
  serviceType: 'auth-service';
  config: AuthServiceConfig;
}

export interface MessageQueueData extends BaseServiceData {
  serviceType: 'message-queue';
  config: MessageQueueConfig;
}

export interface StorageData extends BaseServiceData {
  serviceType: 'storage';
  config: StorageConfig;
}

export interface ServerlessData extends BaseServiceData {
  serviceType: 'serverless';
  config: ServerlessConfig;
}

export type ServiceNodeData =
  | ApiServiceData | DatabaseData | FrontendData
  | AuthServiceNodeData | MessageQueueData | StorageData | ServerlessData;

// React Flow Node Types

export type ServiceNode = Node<ServiceNodeData, string>;

// Edge Data

export type ConnectionType = 'api-to-db' | 'frontend-to-api' | 'custom';

export interface ConnectionData {
  [key: string]: unknown;
  label: string;
  connectionType: ConnectionType;
  description: string;
}

export type ServiceEdge = Edge<ConnectionData>;

// Design Document

export interface DesignDocument {
  id: string;
  name: string;
  version: '1';
  nodes: ServiceNode[];
  edges: ServiceEdge[];
  viewport: { x: number; y: number; zoom: number };
  createdAt: string;
  updatedAt: string;
}
