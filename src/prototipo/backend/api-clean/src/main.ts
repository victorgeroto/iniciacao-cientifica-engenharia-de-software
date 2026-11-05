/**
 * Composition root: o único ponto que conhece todas as camadas e liga as
 * implementações concretas às portas do domínio.
 */
import { AuthenticateToken } from "./domain/usecases/AuthenticateToken";
import { CreateTask } from "./domain/usecases/CreateTask";
import { DeleteTask } from "./domain/usecases/DeleteTask";
import { GetTask } from "./domain/usecases/GetTask";
import { ListTasks } from "./domain/usecases/ListTasks";
import { LoginUser } from "./domain/usecases/LoginUser";
import { RegisterUser } from "./domain/usecases/RegisterUser";
import { UpdateTask } from "./domain/usecases/UpdateTask";
import { createPool, migrate } from "./infrastructure/database/pool";
import { PgTaskRepository } from "./infrastructure/database/PgTaskRepository";
import { PgUserRepository } from "./infrastructure/database/PgUserRepository";
import { createHttpApp } from "./infrastructure/http/server";
import { ConsoleLogger } from "./infrastructure/logger/Logger";
import { BcryptHasher } from "./infrastructure/security/BcryptHasher";
import { JwtTokenService } from "./infrastructure/security/JwtTokenService";
import { AuthController } from "./interfaces/controllers/AuthController";
import { TaskController } from "./interfaces/controllers/TaskController";

const ARCHITECTURE = "clean";
const PORT = Number(process.env.PORT ?? 3003);
const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-trocar";
const DATABASE_URL = process.env.DATABASE_URL ?? "postgres://proto:proto@localhost:5435/clean";

async function main() {
  const logger = new ConsoleLogger(ARCHITECTURE);
  const pool = createPool(DATABASE_URL);
  await migrate(pool, logger);

  const taskRepo = new PgTaskRepository(pool);
  const userRepo = new PgUserRepository(pool);
  const hasher = new BcryptHasher();
  const tokens = new JwtTokenService(JWT_SECRET);

  const tasks = new TaskController({
    list: new ListTasks(taskRepo),
    get: new GetTask(taskRepo),
    create: new CreateTask(taskRepo),
    update: new UpdateTask(taskRepo),
    remove: new DeleteTask(taskRepo),
  });
  const auth = new AuthController(new RegisterUser(userRepo, hasher, tokens), new LoginUser(userRepo, hasher, tokens));

  const app = createHttpApp({ architecture: ARCHITECTURE, tasks, auth, authenticate: new AuthenticateToken(tokens), logger });
  app.listen(PORT, () => logger.info(`ouvindo na porta ${PORT}`));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
