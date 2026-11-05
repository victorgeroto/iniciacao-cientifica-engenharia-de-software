import { ValidationError } from "../errors/DomainErrors";

export function assertId(id: number): void {
  if (!Number.isInteger(id) || id < 1) throw new ValidationError("Id inválido");
}
