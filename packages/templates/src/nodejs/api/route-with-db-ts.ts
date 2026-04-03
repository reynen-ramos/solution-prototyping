export const template = `import { Router } from 'express';
import { query, queryOne } from '../db';
import { AppError } from '../middleware/error-handler';
import type { {{name}} } from '../models/{{nameLower}}';

export const {{nameLower}}Router = Router();

// GET all {{namePlural}}
{{nameLower}}Router.get('/', async (_req, res, next) => {
  try {
    const items = await query<{{name}}>('SELECT * FROM {{namePlural}} ORDER BY created_at DESC');
    res.json(items);
  } catch (err) {
    next(err);
  }
});

// GET {{nameLower}} by id
{{nameLower}}Router.get('/:id', async (req, res, next) => {
  try {
    const item = await queryOne<{{name}}>('SELECT * FROM {{namePlural}} WHERE id = $1', [req.params.id]);
    if (!item) throw new AppError(404, '{{name}} not found');
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// POST create {{nameLower}}
{{nameLower}}Router.post('/', async (req, res, next) => {
  try {
    const { {{#each fields}}{{name}}{{#unless @last}}, {{/unless}}{{/each}} } = req.body;
    const result = await query<{{name}}>(
      \`INSERT INTO {{namePlural}} ({{#each fields}}{{name}}{{#unless @last}}, {{/unless}}{{/each}})
       VALUES ({{#each fields}}$\${{{@index}} + 1}{{#unless @last}}, {{/unless}}{{/each}})
       RETURNING *\`,
      [{{#each fields}}{{name}}{{#unless @last}}, {{/unless}}{{/each}}]
    );
    res.status(201).json(result[0]);
  } catch (err) {
    next(err);
  }
});

// PUT update {{nameLower}}
{{nameLower}}Router.put('/:id', async (req, res, next) => {
  try {
    const { {{#each fields}}{{name}}{{#unless @last}}, {{/unless}}{{/each}} } = req.body;
    const result = await query<{{name}}>(
      \`UPDATE {{namePlural}}
       SET {{#each fields}}{{name}} = $\${{{@index}} + 1}{{#unless @last}}, {{/unless}}{{/each}}
       WHERE id = $\${{{fields.length}} + 1}
       RETURNING *\`,
      [{{#each fields}}{{name}}, {{/each}}req.params.id]
    );
    if (result.length === 0) throw new AppError(404, '{{name}} not found');
    res.json(result[0]);
  } catch (err) {
    next(err);
  }
});

// DELETE {{nameLower}}
{{nameLower}}Router.delete('/:id', async (req, res, next) => {
  try {
    const result = await query('DELETE FROM {{namePlural}} WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.length === 0) throw new AppError(404, '{{name}} not found');
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});
`;
