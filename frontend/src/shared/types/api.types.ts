// frontend/src/shared/types/api.types.ts

// Contrato de Error de FluentValidation (.NET ValidationFailure)
export interface FluentValidationError {
    propertyName: string;
    errorMessage: string;
    attemptedValue?: unknown;
    errorCode?: string;
}
