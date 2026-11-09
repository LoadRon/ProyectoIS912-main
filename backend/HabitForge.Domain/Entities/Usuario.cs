namespace HabitForge.Domain.Entities;

// Tabla: usuarios (id, nombre, email)
public class Usuario
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;

    // Navegación 1:N -> Un usuario tiene muchos proyectos
    public ICollection<Proyecto> Proyectos { get; set; } = new List<Proyecto>();
}
