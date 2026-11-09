using FluentValidation;
using HabitForge.Application.Features.Tareas.DTOs;

namespace HabitForge.Application.Features.Tareas.Validators;

public class CreateTareaValidator : AbstractValidator<CreateTareaRequestDto> {
    public CreateTareaValidator() {
        RuleFor(x => x.Titulo)
            .NotEmpty().WithMessage("El título de la tarea no puede estar vacío.")
            .MinimumLength(3).WithMessage("La tarea debe tener al menos 3 caracteres.")
            .MaximumLength(150).WithMessage("El título no puede superar los 150 caracteres.");

        RuleFor(x => x.ProyectoId)
            .GreaterThan(0).WithMessage("Debe seleccionar un proyecto válido.");
    }
}
