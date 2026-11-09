using HabitForge.Domain.Entities;

namespace HabitForge.Application.Interfaces;

public interface IUsuarioRepository {
    Task<IEnumerable<Usuario>> GetAllAsync();
    Task<Usuario?> GetByIdAsync(int id);
    Task<bool> ExisteEmailAsync(string email);
    Task<Usuario> AddAsync(Usuario usuario);
    Task DeleteAsync(Usuario usuario);
}
