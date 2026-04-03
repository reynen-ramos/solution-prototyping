export interface TemplateContext {
  projectName: string;
  serviceName: string;
  serviceType: string;
  techStack: string;
  port: number;
  basePath?: string;
  authentication?: boolean;
  models: ModelDef[];
  endpoints: EndpointDef[];
  tables: TableDef[];
  pages: PageDef[];
  connections: ConnectionDef[];
  database?: {
    engine: string;
    name: string;
    host: string;
    port: number;
  };
  styling?: string;
}

export interface ModelDef {
  name: string;
  nameLower: string;
  namePlural: string;
  fields: FieldDef[];
}

export interface FieldDef {
  name: string;
  type: string;
  tsType: string;
  pyType: string;
  csType: string;
  sqlType: string;
  required: boolean;
}

export interface EndpointDef {
  method: string;
  path: string;
  description: string;
  requestBody?: string;
  responseBody?: string;
}

export interface TableDef {
  name: string;
  columns: ColumnDef[];
}

export interface ColumnDef {
  name: string;
  type: string;
  primaryKey: boolean;
  nullable: boolean;
  defaultValue?: string;
}

export interface PageDef {
  name: string;
  route: string;
  description: string;
}

export interface ConnectionDef {
  targetServiceName: string;
  targetServiceType: string;
  targetPort: number;
}

export interface GeneratedFile {
  path: string;
  content: string;
  source: 'template' | 'ai';
}
