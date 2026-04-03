import { ApiServiceNode } from './ApiServiceNode';
import { DatabaseNode } from './DatabaseNode';
import { FrontendNode } from './FrontendNode';
import { AuthServiceNode } from './AuthServiceNode';
import { MessageQueueNode } from './MessageQueueNode';
import { StorageNode } from './StorageNode';
import { ServerlessNode } from './ServerlessNode';

export const nodeTypes = {
  'api-service': ApiServiceNode,
  'database': DatabaseNode,
  'frontend': FrontendNode,
  'auth-service': AuthServiceNode,
  'message-queue': MessageQueueNode,
  'storage': StorageNode,
  'serverless': ServerlessNode,
} as const;
