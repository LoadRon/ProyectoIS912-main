namespace HabitForge.Application.Features.Proyectos.DTOs;

public class CreateProyectoRequestDto {
    public string Nombre { get; set; } = string.Empty;
    public int UsuarioId { get; set; }
}
