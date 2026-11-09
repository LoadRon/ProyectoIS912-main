using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using HabitForge.Application.Interfaces;
using HabitForge.Application.Features.Usuarios.DTOs;
using HabitForge.Domain.Entities;

namespace HabitForge.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsuariosController : ControllerBase {
    private readonly IUsuarioRepository _repository;
    private readonly IValidator<CreateUsuarioRequestDto> _validator;

    public UsuariosController(IUsuarioRepository repository, IValidator<CreateUsuarioRequestDto> validator) {
        _repository = repository;
        _validator = validator;
    }

    // Mapeo Manual: Entidad -> DTO
    private static UsuarioResponseDto ToDto(Usuario u) => new() {
        Id = u.Id,
        Nombre = u.Nombre,
        Email = u.Email
    };

    // GET /api/usuarios
    [HttpGet]
    public async Task<IActionResult> GetUsuarios() {
        var usuarios = await _repository.GetAllAsync();
        return Ok(usuarios.Select(ToDto));
    }

    // GET /api/usuarios/{id}
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetUsuario(int id) {
        var usuario = await _repository.GetByIdAsync(id);
        if (usuario is null) return NotFound(new { mensaje = $"No existe el usuario con id {id}." });
        return Ok(ToDto(usuario));
    }

    // POST /api/usuarios
    [HttpPost]
    public async Task<IActionResult> CrearUsuario([FromBody] CreateUsuarioRequestDto request) {
        // 1. FluentValidation
        var validationResult = await _validator.ValidateAsync(request);
        if (!validationResult.IsValid) {
            return BadRequest(validationResult.Errors);
        }

        // 2. Regla de negocio: el email debe ser único
        if (await _repository.ExisteEmailAsync(request.Email)) {
            return Conflict(new { mensaje = $"Ya existe un usuario registrado con el email {request.Email.Trim()}." });
        }

        // 3. Mapeo DTO -> Entidad y persistencia
        var usuarioCreado = await _repository.AddAsync(new Usuario {
            Nombre = request.Nombre.Trim(),
            Email = request.Email.Trim().ToLower()
        });

        var response = ToDto(usuarioCreado);
        return CreatedAtAction(nameof(GetUsuario), new { id = response.Id }, response);
    }

    // DELETE /api/usuarios/{id}  (borra en cascada sus proyectos y tareas)
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> EliminarUsuario(int id) {
        var usuario = await _repository.GetByIdAsync(id);
        if (usuario is null) return NotFound(new { mensaje = $"No existe el usuario con id {id}." });

        await _repository.DeleteAsync(usuario);
        return NoContent(); // HTTP 204
    }
}
