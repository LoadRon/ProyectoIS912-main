using HabitForge.Domain.Entities;

namespace HabitForge.Application.Interfaces;

public interface IHabitoRepository {
    Task<IEnumerable<HabitoGlobal>> GetAllAsync();
    Task<HabitoGlobal> AddAsync(HabitoGlobal habito); // Agregamos el contrato para el POST
    Task<HabitoGlobal?> GetByIdAsync(int id);
    Task DeleteAsync(HabitoGlobal habito);            // Contrato para el DELETE
}