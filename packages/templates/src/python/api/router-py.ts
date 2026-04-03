export const template = `from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from uuid import uuid4

router = APIRouter()


class {{name}}Create(BaseModel):
{{#each fields}}
    {{name}}: {{pyType}}
{{/each}}


class {{name}}({{name}}Create):
    id: str


# In-memory store — replace with database
_items: dict[str, {{name}}] = {}


@router.get("/")
def list_{{namePlural}}():
    return list(_items.values())


@router.get("/{item_id}")
def get_{{nameLower}}(item_id: str):
    if item_id not in _items:
        raise HTTPException(status_code=404, detail="{{name}} not found")
    return _items[item_id]


@router.post("/", status_code=201)
def create_{{nameLower}}(data: {{name}}Create):
    item_id = str(uuid4())
    item = {{name}}(id=item_id, **data.model_dump())
    _items[item_id] = item
    return item


@router.put("/{item_id}")
def update_{{nameLower}}(item_id: str, data: {{name}}Create):
    if item_id not in _items:
        raise HTTPException(status_code=404, detail="{{name}} not found")
    item = {{name}}(id=item_id, **data.model_dump())
    _items[item_id] = item
    return item


@router.delete("/{item_id}", status_code=204)
def delete_{{nameLower}}(item_id: str):
    if item_id not in _items:
        raise HTTPException(status_code=404, detail="{{name}} not found")
    del _items[item_id]
`;
