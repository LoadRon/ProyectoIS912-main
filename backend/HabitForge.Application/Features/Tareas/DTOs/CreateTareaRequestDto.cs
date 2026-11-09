namespace HabitForge.Application.Features.Tareas.DTOs;

public class CreateTareaRequestDto {
    public string Titulo { get; set; } = string.Empty;
    public int ProyectoId { get; set; }
}
