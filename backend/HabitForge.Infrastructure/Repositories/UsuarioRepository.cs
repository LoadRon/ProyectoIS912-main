using Microsoft.EntityFrameworkCore;
using HabitForge.Application.Interfaces;
using HabitForge.Domain.Entities;
using HabitForge.Infrastructure.Data;

namespace HabitForge.Infrastructure.Repositories;

public class UsuarioRepository : IUsuarioRepository {
    private readonly HabitForgeDbContext _context;

    public UsuarioRepository(HabitForgeDbContext context) {
        _context = context;
    }

    public async Task<IEnumerable<Usuario>> GetAllAsync() {
        return await _context.Usuarios.OrderBy(u => u.Id).ToListAsync();
    }

    public async Task<Usuario?> GetByIdAsync(int id) {
        return await _context.Usuarios.FindAsync(id);
    }

    public async Task<bool> ExisteEmailAsync(string email) {
        var normalizado = email.Trim().ToLower();
        return await _context.Usuarios.AnyAsync(u => u.Email == normalizado);
    }

    public async Task<Usuario> AddAsync(Usuario usuario) {
        await _context.Usuarios.AddAsync(usuario);
        await _context.SaveChangesAsync();
        return usuario;
    }

    public async Task DeleteAsync(Usuario usuario) {
        _context.Usuarios.Remove(usuario);
        await _context.SaveChangesAsync(); // DELETE en cascada: proyectos -> tareas
    }
}
