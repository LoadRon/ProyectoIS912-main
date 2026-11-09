using DotNetEnv;
using HabitForge.Infrastructure;
using HabitForge.Application; // Capa de aplicacion.
using Scalar.AspNetCore; // 1. Importamos Scalar

var builder = WebApplication.CreateBuilder(args);

Env.Load();
var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__PostgresConnection")
                       ?? throw new InvalidOperationException("Falta la cadena de conexión.");

// Leemos los orígenes permitidos desde el archivo .env del Backend
var corsAllowedOrigins = Environment.GetEnvironmentVariable("CORS_ALLOWED_ORIGINS")
                         ?? throw new InvalidOperationException("Falta la variable CORS_ALLOWED_ORIGINS en el archivo .env.");

// Registramos los servicios de la capa de Aplicación (FluentValidation automático)
builder.Services.AddApplication();


builder.Services.AddInfrastructure(connectionString);

// =========================================================================
// 1. DEFINICIÓN DE LA POLÍTICA DE SEGURIDAD CORS DINÁMICA (.env + Wildcards)
// =========================================================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("PoliticaCorsHabitForge", policy =>
    {
        // Separamos por coma por si existen múltiples orígenes (ej. localhost + https://*.unah.edu.hn)
        var origenes = corsAllowedOrigins.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

        policy.WithOrigins(origenes)
              .SetIsOriginAllowedToAllowWildcardSubdomains() // Habilita comodines de subdominio (ej. https://*.unah.edu.hn)
              .AllowAnyHeader()                              // Autoriza encabezados JSON y futuros Tokens JWT
              .AllowAnyMethod();                             // Autoriza verbos GET y Preflights (POST, PUT, DELETE)
    });
});

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

// =========================================================================
// 2. ACTIVACIÓN DEL MIDDLEWARE CORS EN LA PUERTA DE ENTRADA HTTP
// Regla crítica: Siempre debe ubicarse ANTES de MapControllers()
// =========================================================================
app.UseCors("PoliticaCorsHabitForge");

app.MapControllers();
app.Run();
