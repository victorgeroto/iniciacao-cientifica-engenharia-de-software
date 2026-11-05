export class DomainError extends Error {}

export class ValidationError extends DomainError {
  constructor(
    message = "Dados inválidos",
    public readonly details?: unknown,
  ) {
    super(message);
  }
}

export class NotFoundError extends DomainError {
  constructor(message = "Tarefa não encontrada") {
    super(message);
  }
}

export class ConflictError extends DomainError {}

export class UnauthorizedError extends DomainError {}
