using Microsoft.EntityFrameworkCore;
using HabitForge.Application.Interfaces;
using HabitForge.Domain.Entities;
using HabitForge.Infrastructure.Data;

namespace HabitForge.Infrastructure.Repositories;

public class ProyectoRepository : IProyectoRepository {
    private readonly HabitForgeDbContext _context;

    public ProyectoRepository(HabitForgeDbContext context) {
        _context = context;
    }

    public async Task<IEnumerable<Proyecto>> GetAllAsync(int? usuarioId = null) {
        var consulta = _context.Proyectos.AsQueryable();
        if (usuarioId.HasValue) {
            consulta = consulta.Where(p => p.UsuarioId == usuarioId.Value);
        }
        return await consulta.OrderBy(p => p.Id).ToListAsync();
    }

    public async Task<Proyecto?> GetByIdAsync(int id) {
        return await _context.Proyectos.FindAsync(id);
    }

    public async Task<Proyecto> AddAsync(Proyecto proyecto) {
        await _context.Proyectos.AddAsync(proyecto);
        await _context.SaveChangesAsync();
        return proyecto;
    }

    public async Task DeleteAsync(Proyecto proyecto) {
        _context.Proyectos.Remove(proyecto);
        await _context.SaveChangesAsync(); // DELETE en cascada: tareas
    }
}
