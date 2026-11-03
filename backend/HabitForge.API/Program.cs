using DotNetEnv;
using HabitForge.Infrastructure;
using HabitForge.Application; // Capa de aplicacion.
using Scalar.AspNetCore; // 1. Importamos Scalar

var builder = WebApplication.CreateBuilder(args);

Env.Load();
var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__PostgresConnection") 
                       ?? throw new InvalidOperationException("Falta la cadena de conexión.");
// Registramos los servicios de la capa de Aplicación (FluentValidation automático)
builder.Services.AddApplication();


builder.Services.AddInfrastructure(connectionString);
builder.Services.AddControllers();

// Generación nativa de OpenAPI (viene por defecto en .NET 10)
builder.Services.AddOpenApi(); 

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    // 3. Genera el documento JSON con el contrato de la API
    app.MapOpenApi();
    
    // 4. Levanta la interfaz gráfica moderna consumiendo ese JSON
    app.MapScalarApiReference(); 
}

app.MapControllers();
app.Run();