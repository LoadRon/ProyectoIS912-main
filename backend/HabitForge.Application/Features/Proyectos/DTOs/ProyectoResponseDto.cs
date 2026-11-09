namespace HabitForge.Application.Features.Proyectos.DTOs;

public class ProyectoResponseDto {
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public int UsuarioId { get; set; }
}
