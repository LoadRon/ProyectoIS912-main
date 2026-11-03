using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using HabitForge.Application.Interfaces;
using HabitForge.Infrastructure.Data;
using HabitForge.Infrastructure.Repositories;

namespace HabitForge.Infrastructure;

public static class DependencyInjection {
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, string connectionString) {
        
        // 1. Configuramos el acceso a PostgreSQL
        services.AddDbContext<HabitForgeDbContext>(options =>
            options.UseNpgsql(connectionString));

        // 2. LA INYECCIÓN CLAVE (El contrato firmado por el Gerente):
        // "Cada vez que un Chef (Controlador) pida la Receta (IHabitoRepository), 
        // entrégale los datos de la Finca PostgreSQL (HabitoRepository)"
        services.AddScoped<IHabitoRepository, HabitoRepository>();

        return services;
    }
}