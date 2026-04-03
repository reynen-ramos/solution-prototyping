export const template = `-- Database schema for {{databaseName}}
-- Engine: {{engine}}

{{#each tables}}
CREATE TABLE IF NOT EXISTS {{name}} (
{{#each columns}}
  {{name}} {{upper type}}{{#if primaryKey}} PRIMARY KEY{{/if}}{{#unless nullable}}{{#unless primaryKey}} NOT NULL{{/unless}}{{/unless}}{{#if defaultValue}} DEFAULT {{defaultValue}}{{/if}}{{#unless @last}},{{/unless}}
{{/each}}
);

{{/each}}
`;
