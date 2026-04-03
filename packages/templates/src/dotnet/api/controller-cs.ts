export const template = `using Microsoft.AspNetCore.Mvc;

namespace {{pascalCase serviceName}}.Controllers;

public record {{name}}Dto({{#each fields}}{{csType}} {{capitalize name}}{{#unless @last}}, {{/unless}}{{/each}});
public record {{name}}Response(string Id, {{#each fields}}{{csType}} {{capitalize name}}{{#unless @last}}, {{/unless}}{{/each}});

[ApiController]
[Route("{{../basePath}}/{{namePlural}}")]
public class {{name}}Controller : ControllerBase
{
    private static readonly List<{{name}}Response> _items = new();
    private static int _nextId = 1;

    [HttpGet]
    public IActionResult GetAll() => Ok(_items);

    [HttpGet("{id}")]
    public IActionResult GetById(string id)
    {
        var item = _items.FirstOrDefault(i => i.Id == id);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpPost]
    public IActionResult Create([FromBody] {{name}}Dto dto)
    {
        var item = new {{name}}Response((_nextId++).ToString(), {{#each fields}}dto.{{capitalize name}}{{#unless @last}}, {{/unless}}{{/each}});
        _items.Add(item);
        return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
    }

    [HttpPut("{id}")]
    public IActionResult Update(string id, [FromBody] {{name}}Dto dto)
    {
        var index = _items.FindIndex(i => i.Id == id);
        if (index == -1) return NotFound();
        _items[index] = new {{name}}Response(id, {{#each fields}}dto.{{capitalize name}}{{#unless @last}}, {{/unless}}{{/each}});
        return Ok(_items[index]);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(string id)
    {
        _items.RemoveAll(i => i.Id == id);
        return NoContent();
    }
}
`;
