export const template = `import { Router } from 'express';
import type { {{name}} } from '../models/{{nameLower}}';

export const {{nameLower}}Router = Router();

// In-memory store — replace with database queries
let items: {{name}}[] = [];
let nextId = 1;

// GET all {{namePlural}}
{{nameLower}}Router.get('/', (_req, res) => {
  res.json(items);
});

// GET {{nameLower}} by id
{{nameLower}}Router.get('/:id', (req, res) => {
  const item = items.find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: '{{name}} not found' });
  res.json(item);
});

// POST create {{nameLower}}
{{nameLower}}Router.post('/', (req, res) => {
  const item: {{name}} = { ...req.body, id: String(nextId++) };
  items.push(item);
  res.status(201).json(item);
});

// PUT update {{nameLower}}
{{nameLower}}Router.put('/:id', (req, res) => {
  const index = items.findIndex(i => i.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: '{{name}} not found' });
  items[index] = { ...items[index], ...req.body };
  res.json(items[index]);
});

// DELETE {{nameLower}}
{{nameLower}}Router.delete('/:id', (req, res) => {
  items = items.filter(i => i.id !== req.params.id);
  res.status(204).send();
});
`;
