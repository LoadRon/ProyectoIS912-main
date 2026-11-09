namespace HabitForge.Domain.Entities;

// Tabla: proyectos (id, nombre, usuario_id)
public class Proyecto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;

    // Llave foránea -> usuarios.id
    public int UsuarioId { get; set; }
    public Usuario? Usuario { get; set; }

    // Navegación 1:N -> Un proyecto tiene muchas tareas
    public ICollection<Tarea> Tareas { get; set; } = new List<Tarea>();
}
