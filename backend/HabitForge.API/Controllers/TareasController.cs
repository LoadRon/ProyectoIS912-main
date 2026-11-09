using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using HabitForge.Application.Interfaces;
using HabitForge.Application.Features.Tareas.DTOs;
using HabitForge.Domain.Entities;

namespace HabitForge.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TareasController : ControllerBase {
    private readonly ITareaRepository _repository;
    private readonly IProyectoRepository _proyectoRepository;
    private readonly IValidator<CreateTareaRequestDto> _validator;

    public TareasController(
        ITareaRepository repository,
        IProyectoRepository proyectoRepository,
        IValidator<CreateTareaRequestDto> validator) {
        _repository = repository;
        _proyectoRepository = proyectoRepository;
        _validator = validator;
    }

    private static TareaResponseDto ToDto(Tarea t) => new() {
        Id = t.Id,
        Titulo = t.Titulo,
        Completada = t.Completada,
        ProyectoId = t.ProyectoId
    };

    // GET /api/tareas  |  GET /api/tareas?proyectoId=1
    [HttpGet]
    public async Task<IActionResult> GetTareas([FromQuery] int? proyectoId) {
        var tareas = await _repository.GetAllAsync(proyectoId);
        return Ok(tareas.Select(ToDto));
    }

    // GET /api/tareas/{id}
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetTarea(int id) {
        var tarea = await _repository.GetByIdAsync(id);
        if (tarea is null) return NotFound(new { mensaje = $"No existe la tarea con id {id}." });
        return Ok(ToDto(tarea));
    }

    // POST /api/tareas
    [HttpPost]
    public async Task<IActionResult> CrearTarea([FromBody] CreateTareaRequestDto request) {
        var validationResult = await _validator.ValidateAsync(request);
        if (!validationResult.IsValid) {
            return BadRequest(validationResult.Errors);
        }

        // Integridad referencial: el proyecto debe existir
        if (await _proyectoRepository.GetByIdAsync(request.ProyectoId) is null) {
            return BadRequest(new { mensaje = $"El proyecto con id {request.ProyectoId} no existe." });
        }

        var tareaCreada = await _repository.AddAsync(new Tarea {
            Titulo = request.Titulo.Trim(),
            Completada = false, // Toda tarea nace pendiente
            ProyectoId = request.ProyectoId
        });

        var response = ToDto(tareaCreada);
        return CreatedAtAction(nameof(GetTarea), new { id = response.Id }, response);
    }

    // DELETE /api/tareas/{id}
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> EliminarTarea(int id) {
        var tarea = await _repository.GetByIdAsync(id);
        if (tarea is null) return NotFound(new { mensaje = $"No existe la tarea con id {id}." });

        await _repository.DeleteAsync(tarea);
        return NoContent();
    }
}
