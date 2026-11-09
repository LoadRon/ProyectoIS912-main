namespace HabitForge.Application.Features.Tareas.DTOs;

public class TareaResponseDto {
    public int Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public bool Completada { get; set; }
    public int ProyectoId { get; set; }
}
