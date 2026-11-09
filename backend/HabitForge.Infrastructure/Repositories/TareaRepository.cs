using Microsoft.EntityFrameworkCore;
using HabitForge.Application.Interfaces;
using HabitForge.Domain.Entities;
using HabitForge.Infrastructure.Data;

namespace HabitForge.Infrastructure.Repositories;

public class TareaRepository : ITareaRepository {
    private readonly HabitForgeDbContext _context;

    public TareaRepository(HabitForgeDbContext context) {
        _context = context;
    }

    public async Task<IEnumerable<Tarea>> GetAllAsync(int? proyectoId = null) {
        var consulta = _context.Tareas.AsQueryable();
        if (proyectoId.HasValue) {
            consulta = consulta.Where(t => t.ProyectoId == proyectoId.Value);
        }
        return await consulta.OrderBy(t => t.Id).ToListAsync();
    }

    public async Task<Tarea?> GetByIdAsync(int id) {
        return await _context.Tareas.FindAsync(id);
    }

    public async Task<Tarea> AddAsync(Tarea tarea) {
        await _context.Tareas.AddAsync(tarea);
        await _context.SaveChangesAsync();
        return tarea;
    }

    public async Task DeleteAsync(Tarea tarea) {
        _context.Tareas.Remove(tarea);
        await _context.SaveChangesAsync();
    }
}
