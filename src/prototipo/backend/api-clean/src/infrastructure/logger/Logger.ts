export interface Logger {
  info(message: string): void;
  error(message: string, err?: unknown): void;
}

export class ConsoleLogger implements Logger {
  constructor(private readonly prefix: string) {}

  info(message: string): void {
    console.log(`[${this.prefix}] ${message}`);
  }

  error(message: string, err?: unknown): void {
    console.error(`[${this.prefix}] ${message}`, err ?? "");
  }
}
