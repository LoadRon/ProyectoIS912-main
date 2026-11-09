using HabitForge.Domain.Entities;

namespace HabitForge.Application.Interfaces;

public interface ITareaRepository {
    Task<IEnumerable<Tarea>> GetAllAsync(int? proyectoId = null);
    Task<Tarea?> GetByIdAsync(int id);
    Task<Tarea> AddAsync(Tarea tarea);
    Task DeleteAsync(Tarea tarea);
}
