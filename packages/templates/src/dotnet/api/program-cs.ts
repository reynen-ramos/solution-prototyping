export const template = `var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(o => o.AddDefaultPolicy(b =>
    b.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));
{{#if authentication}}
builder.Services.AddAuthentication().AddJwtBearer();
builder.Services.AddAuthorization();
{{/if}}

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
{{#if authentication}}
app.UseAuthentication();
app.UseAuthorization();
{{/if}}
app.MapControllers();
app.MapGet("/health", () => Results.Json(new { status = "ok", service = "{{serviceName}}" }));
app.Run();
`;
