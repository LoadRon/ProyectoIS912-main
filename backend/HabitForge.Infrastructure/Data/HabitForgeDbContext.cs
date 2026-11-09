using Microsoft.EntityFrameworkCore;
using HabitForge.Domain.Entities;

namespace HabitForge.Infrastructure.Data;

public class HabitForgeDbContext : DbContext {
    public HabitForgeDbContext(DbContextOptions<HabitForgeDbContext> options) : base(options) { }

    public DbSet<HabitoGlobal> HabitosGlobales { get; set; }

    // Mini base de datos: Sistema de Gestión de Tareas
    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Proyecto> Proyectos { get; set; }
    public DbSet<Tarea> Tareas { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder) {
        base.OnModelCreating(modelBuilder);

        // 1. usuarios (id, nombre, email)
        modelBuilder.Entity<Usuario>(entity => {
            entity.ToTable("usuarios");
            entity.HasKey(u => u.Id);
            entity.Property(u => u.Id).HasColumnName("id");
            entity.Property(u => u.Nombre).HasColumnName("nombre").HasMaxLength(100).IsRequired();
            entity.Property(u => u.Email).HasColumnName("email").HasMaxLength(150).IsRequired();
            entity.HasIndex(u => u.Email).IsUnique(); // No se permiten emails duplicados
        });

        // 2. proyectos (id, nombre, usuario_id)
        modelBuilder.Entity<Proyecto>(entity => {
            entity.ToTable("proyectos");
            entity.HasKey(p => p.Id);
            entity.Property(p => p.Id).HasColumnName("id");
            entity.Property(p => p.Nombre).HasColumnName("nombre").HasMaxLength(100).IsRequired();
            entity.Property(p => p.UsuarioId).HasColumnName("usuario_id");

            // FK proyectos.usuario_id -> usuarios.id (al borrar un usuario se borran sus proyectos)
            entity.HasOne(p => p.Usuario)
                  .WithMany(u => u.Proyectos)
                  .HasForeignKey(p => p.UsuarioId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // 3. tareas (id, titulo, completada, proyecto_id)
        modelBuilder.Entity<Tarea>(entity => {
            entity.ToTable("tareas");
            entity.HasKey(t => t.Id);
            entity.Property(t => t.Id).HasColumnName("id");
            entity.Property(t => t.Titulo).HasColumnName("titulo").HasMaxLength(150).IsRequired();
            entity.Property(t => t.Completada).HasColumnName("completada");
            entity.Property(t => t.ProyectoId).HasColumnName("proyecto_id");

            // FK tareas.proyecto_id -> proyectos.id (al borrar un proyecto se borran sus tareas)
            entity.HasOne(t => t.Proyecto)
                  .WithMany(p => p.Tareas)
                  .HasForeignKey(t => t.ProyectoId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
