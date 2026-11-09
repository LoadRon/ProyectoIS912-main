using HabitForge.Domain.Entities;

namespace HabitForge.Application.Interfaces;

public interface IProyectoRepository {
    Task<IEnumerable<Proyecto>> GetAllAsync(int? usuarioId = null);
    Task<Proyecto?> GetByIdAsync(int id);
    Task<Proyecto> AddAsync(Proyecto proyecto);
    Task DeleteAsync(Proyecto proyecto);
}
