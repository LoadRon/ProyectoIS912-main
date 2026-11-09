using Microsoft.EntityFrameworkCore;
using HabitForge.Application.Interfaces;
using HabitForge.Domain.Entities;
using HabitForge.Infrastructure.Data;

namespace HabitForge.Infrastructure.Repositories;

public class HabitoRepository : IHabitoRepository {
    private readonly HabitForgeDbContext _context;
    
    public HabitoRepository(HabitForgeDbContext context) {
        _context = context;
    }

    // Método anterior de lectura
    public async Task<IEnumerable<HabitoGlobal>> GetAllAsync() {
        return await _context.HabitosGlobales.ToListAsync();
    }

    // Nuevo método para agregar registros (el que se añade en el Paso B)
    public async Task<HabitoGlobal> AddAsync(HabitoGlobal habito) {
        await _context.HabitosGlobales.AddAsync(habito);
        
        // SaveChangesAsync envuelve la operación en una transacción SQL (COMMIT)
        await _context.SaveChangesAsync(); 
        
        return habito;
    }

    public async Task<HabitoGlobal?> GetByIdAsync(int id) {
        return await _context.HabitosGlobales.FindAsync(id);
    }

    public async Task DeleteAsync(HabitoGlobal habito) {
        _context.HabitosGlobales.Remove(habito);
        await _context.SaveChangesAsync();
    }
}