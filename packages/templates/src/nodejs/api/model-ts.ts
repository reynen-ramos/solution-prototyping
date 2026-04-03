export const template = `export interface {{name}} {
  id: string;
{{#each fields}}
  {{name}}: {{tsType}};
{{/each}}
}
`;
