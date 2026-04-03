import type { ServiceNode, ApiServiceData, DatabaseData, FrontendData } from '@/types/design';
import type { DatabaseTable, DatabaseColumn, ApiModel } from '@/types/service-types';

export interface ConnectionSuggestion {
  id: string;
  type: 'sync-models-to-tables' | 'sync-tables-to-models' | 'set-edge-label';
  title: string;
  description: string;
  sourceNodeId: string;
  targetNodeId: string;
  apply: (
    updateNodeConfig: (nodeId: string, config: Record<string, unknown>) => void,
    updateEdgeData: (edgeId: string, data: Record<string, unknown>) => void,
    edgeId: string,
  ) => void;
}

function modelToTable(model: ApiModel): DatabaseTable {
  const columns: DatabaseColumn[] = [
    { name: 'id', type: 'uuid', primaryKey: true, nullable: false, defaultValue: 'gen_random_uuid()' },
  ];

  for (const field of model.fields) {
    columns.push({
      name: toSnakeCase(field.name),
      type: fieldTypeToSql(field.type),
      primaryKey: false,
      nullable: !field.required,
    });
  }

  columns.push({
    name: 'created_at',
    type: 'timestamp',
    primaryKey: false,
    nullable: false,
    defaultValue: 'now()',
  });

  return {
    name: toSnakeCase(model.name) + 's',
    columns,
  };
}

function fieldTypeToSql(type: string): string {
  switch (type) {
    case 'number': return 'decimal';
    case 'boolean': return 'boolean';
    case 'Date': return 'timestamp';
    default: return 'varchar';
  }
}

function toSnakeCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
}

export function getSuggestionsForConnection(
  sourceNode: ServiceNode,
  targetNode: ServiceNode,
): ConnectionSuggestion[] {
  const suggestions: ConnectionSuggestion[] = [];

  // API → Database: offer to create tables from models
  if (sourceNode.data.serviceType === 'api-service' && targetNode.data.serviceType === 'database') {
    const apiData = sourceNode.data as ApiServiceData;
    const dbData = targetNode.data as DatabaseData;

    if (apiData.config.models.length > 0) {
      const existingTableNames = new Set(dbData.config.tables.map(t => t.name));
      const newModels = apiData.config.models.filter(
        m => !existingTableNames.has(toSnakeCase(m.name) + 's')
      );

      if (newModels.length > 0) {
        suggestions.push({
          id: `sync-models-${sourceNode.id}-${targetNode.id}`,
          type: 'sync-models-to-tables',
          title: `Create ${newModels.length} table${newModels.length > 1 ? 's' : ''} from models`,
          description: `Add tables: ${newModels.map(m => toSnakeCase(m.name) + 's').join(', ')}`,
          sourceNodeId: sourceNode.id,
          targetNodeId: targetNode.id,
          apply: (updateNodeConfig, updateEdgeData, edgeId) => {
            const newTables = newModels.map(modelToTable);
            updateNodeConfig(targetNode.id, {
              tables: [...dbData.config.tables, ...newTables],
            });
            updateEdgeData(edgeId, { label: 'SQL' });
          },
        });
      }
    }

    // Always suggest setting the edge label
    suggestions.push({
      id: `label-${sourceNode.id}-${targetNode.id}`,
      type: 'set-edge-label',
      title: 'Label connection as SQL',
      description: 'Set edge label to indicate database connection',
      sourceNodeId: sourceNode.id,
      targetNodeId: targetNode.id,
      apply: (_updateNodeConfig, updateEdgeData, edgeId) => {
        updateEdgeData(edgeId, { label: 'SQL', connectionType: 'api-to-db' });
      },
    });
  }

  // Frontend → API: offer to set edge label
  if (sourceNode.data.serviceType === 'frontend' && targetNode.data.serviceType === 'api-service') {
    suggestions.push({
      id: `label-fe-${sourceNode.id}-${targetNode.id}`,
      type: 'set-edge-label',
      title: 'Label connection as REST',
      description: 'Set edge label to indicate REST API connection',
      sourceNodeId: sourceNode.id,
      targetNodeId: targetNode.id,
      apply: (_updateNodeConfig, updateEdgeData, edgeId) => {
        updateEdgeData(edgeId, { label: 'REST', connectionType: 'frontend-to-api' });
      },
    });
  }

  // API → Queue: label as publish
  if (sourceNode.data.serviceType === 'api-service' && targetNode.data.serviceType === 'message-queue') {
    suggestions.push({
      id: `label-q-${sourceNode.id}-${targetNode.id}`,
      type: 'set-edge-label',
      title: 'Label connection as Publish',
      description: 'Set edge label for message publishing',
      sourceNodeId: sourceNode.id,
      targetNodeId: targetNode.id,
      apply: (_updateNodeConfig, updateEdgeData, edgeId) => {
        updateEdgeData(edgeId, { label: 'Publish' });
      },
    });
  }

  // API → Storage: label as upload
  if (sourceNode.data.serviceType === 'api-service' && targetNode.data.serviceType === 'storage') {
    suggestions.push({
      id: `label-s-${sourceNode.id}-${targetNode.id}`,
      type: 'set-edge-label',
      title: 'Label connection as Upload',
      description: 'Set edge label for file storage',
      sourceNodeId: sourceNode.id,
      targetNodeId: targetNode.id,
      apply: (_updateNodeConfig, updateEdgeData, edgeId) => {
        updateEdgeData(edgeId, { label: 'Upload' });
      },
    });
  }

  return suggestions;
}
