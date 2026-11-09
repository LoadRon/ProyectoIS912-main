namespace HabitForge.Domain.Entities;

// Tabla: tareas (id, titulo, completada, proyecto_id)
public class Tarea
{
    public int Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public bool Completada { get; set; }

    // Llave foránea -> proyectos.id
    public int ProyectoId { get; set; }
    public Proyecto? Proyecto { get; set; }
}
