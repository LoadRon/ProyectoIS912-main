using FluentValidation;
using HabitForge.Application.Features.Proyectos.DTOs;

namespace HabitForge.Application.Features.Proyectos.Validators;

public class CreateProyectoValidator : AbstractValidator<CreateProyectoRequestDto> {
    public CreateProyectoValidator() {
        RuleFor(x => x.Nombre)
            .NotEmpty().WithMessage("El nombre del proyecto no puede estar vacío.")
            .MinimumLength(3).WithMessage("El proyecto debe tener al menos 3 caracteres.")
            .MaximumLength(100).WithMessage("El nombre del proyecto no puede superar los 100 caracteres.");

        RuleFor(x => x.UsuarioId)
            .GreaterThan(0).WithMessage("Debe seleccionar un usuario válido.");
    }
}
