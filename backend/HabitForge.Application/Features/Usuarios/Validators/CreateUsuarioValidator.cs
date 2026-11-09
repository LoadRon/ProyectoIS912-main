using FluentValidation;
using HabitForge.Application.Features.Usuarios.DTOs;

namespace HabitForge.Application.Features.Usuarios.Validators;

public class CreateUsuarioValidator : AbstractValidator<CreateUsuarioRequestDto> {
    public CreateUsuarioValidator() {
        RuleFor(x => x.Nombre)
            .NotEmpty().WithMessage("El nombre del usuario no puede estar vacío.")
            .MinimumLength(3).WithMessage("El nombre debe tener al menos 3 caracteres.")
            .MaximumLength(100).WithMessage("El nombre no puede superar los 100 caracteres.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("El email no puede estar vacío.")
            .EmailAddress().WithMessage("El email no tiene un formato válido.")
            .MaximumLength(150).WithMessage("El email no puede superar los 150 caracteres.");
    }
}
