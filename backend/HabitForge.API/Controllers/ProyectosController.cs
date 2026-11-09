using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using HabitForge.Application.Interfaces;
using HabitForge.Application.Features.Proyectos.DTOs;
using HabitForge.Domain.Entities;

namespace HabitForge.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProyectosController : ControllerBase {
    private readonly IProyectoRepository _repository;
    private readonly IUsuarioRepository _usuarioRepository;
    private readonly IValidator<CreateProyectoRequestDto> _validator;

    public ProyectosController(
        IProyectoRepository repository,
        IUsuarioRepository usuarioRepository,
        IValidator<CreateProyectoRequestDto> validator) {
        _repository = repository;
        _usuarioRepository = usuarioRepository;
        _validator = validator;
    }

    private static ProyectoResponseDto ToDto(Proyecto p) => new() {
        Id = p.Id,
        Nombre = p.Nombre,
        UsuarioId = p.UsuarioId
    };

    // GET /api/proyectos  |  GET /api/proyectos?usuarioId=1
    [HttpGet]
    public async Task<IActionResult> GetProyectos([FromQuery] int? usuarioId) {
        var proyectos = await _repository.GetAllAsync(usuarioId);
        return Ok(proyectos.Select(ToDto));
    }

    // GET /api/proyectos/{id}
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetProyecto(int id) {
        var proyecto = await _repository.GetByIdAsync(id);
        if (proyecto is null) return NotFound(new { mensaje = $"No existe el proyecto con id {id}." });
        return Ok(ToDto(proyecto));
    }

    // POST /api/proyectos
    [HttpPost]
    public async Task<IActionResult> CrearProyecto([FromBody] CreateProyectoRequestDto request) {
        var validationResult = await _validator.ValidateAsync(request);
        if (!validationResult.IsValid) {
            return BadRequest(validationResult.Errors);
        }

        // Integridad referencial: el usuario dueño debe existir
        if (await _usuarioRepository.GetByIdAsync(request.UsuarioId) is null) {
            return BadRequest(new { mensaje = $"El usuario con id {request.UsuarioId} no existe." });
        }

        var proyectoCreado = await _repository.AddAsync(new Proyecto {
            Nombre = request.Nombre.Trim(),
            UsuarioId = request.UsuarioId
        });

        var response = ToDto(proyectoCreado);
        return CreatedAtAction(nameof(GetProyecto), new { id = response.Id }, response);
    }

    // DELETE /api/proyectos/{id}  (borra en cascada sus tareas)
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> EliminarProyecto(int id) {
        var proyecto = await _repository.GetByIdAsync(id);
        if (proyecto is null) return NotFound(new { mensaje = $"No existe el proyecto con id {id}." });

        await _repository.DeleteAsync(proyecto);
        return NoContent();
    }
}
