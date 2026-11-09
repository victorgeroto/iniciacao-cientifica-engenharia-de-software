"""M2 — regra de negócio: no máximo 3 tarefas "doing" por usuário (409 ao exceder)."""
import sys
from pathlib import Path

B = Path(sys.argv[1])
MSG = "Limite de 3 tarefas em andamento atingido"

def rep(rel, pairs):
    p = B / rel
    s = p.read_text(encoding="utf-8")
    for a, b in pairs:
        assert a in s, (rel, a[:70])
        s = s.replace(a, b, 1)
    p.write_text(s, encoding="utf-8")

def new(rel, content):
    (B / rel).parent.mkdir(parents=True, exist_ok=True)
    (B / rel).write_text(content, encoding="utf-8")

# ---- A: módulo único -------------------------------------------------------
rep("api-monolito/src/server.ts", [
    ("function sign(user: { id: number; email: string }) {",
     f'''const WIP_LIMIT = 3;

async function doingCount(userId: number): Promise<number> {{
  const {{ rows }} = await pool.query("SELECT COUNT(*)::int AS n FROM tasks WHERE user_id = $1 AND status = 'doing'", [userId]);
  return rows[0].n;
}}

function sign(user: {{ id: number; email: string }}) {{'''),
    ("    const t = parsed.data;\n",
     f'    const t = parsed.data;\n    if (t.status === "doing" && (await doingCount(userId)) >= WIP_LIMIT) {{\n      return res.status(409).json({{ error: "{MSG}" }});\n    }}\n'),
    ("    const merged = { ...current.rows[0], ...parsed.data };\n",
     f'    if (parsed.data.status === "doing" && current.rows[0].status !== "doing" && (await doingCount(userId)) >= WIP_LIMIT) {{\n      return res.status(409).json({{ error: "{MSG}" }});\n    }}\n    const merged = {{ ...current.rows[0], ...parsed.data }};\n'),
])

# ---- B: camadas ------------------------------------------------------------
rep("api-camadas/src/repositories/TaskRepository.ts", [
    ("  async delete(id: number, userId: number): Promise<boolean> {",
     '''  async countByStatus(userId: number, status: string): Promise<number> {
    const { rows } = await pool.query("SELECT COUNT(*)::int AS n FROM tasks WHERE user_id = $1 AND status = $2", [
      userId,
      status,
    ]);
    return rows[0].n;
  }

  async delete(id: number, userId: number): Promise<boolean> {'''),
])
rep("api-camadas/src/services/TaskService.ts", [
    ("export class TaskService {\n  constructor(private readonly repository = new TaskRepository()) {}\n",
     f'''const WIP_LIMIT = 3;

export class TaskService {{
  constructor(private readonly repository = new TaskRepository()) {{}}

  private async assertWipLimit(userId: number): Promise<void> {{
    if ((await this.repository.countByStatus(userId, "doing")) >= WIP_LIMIT) {{
      throw new HttpError(409, "{MSG}");
    }}
  }}
'''),
    ("    if (!parsed.success) throw new HttpError(400, \"Dados inválidos\", parsed.error.issues);\n    return this.repository.create(userId, parsed.data);",
     "    if (!parsed.success) throw new HttpError(400, \"Dados inválidos\", parsed.error.issues);\n    if (parsed.data.status === \"doing\") await this.assertWipLimit(userId);\n    return this.repository.create(userId, parsed.data);"),
    ("    if (!current) throw new HttpError(404, \"Tarefa não encontrada\");\n    const merged",
     "    if (!current) throw new HttpError(404, \"Tarefa não encontrada\");\n    if (parsed.data.status === \"doing\" && current.status !== \"doing\") await this.assertWipLimit(userId);\n    const merged"),
])

# ---- C: clean --------------------------------------------------------------
rep("api-clean/src/domain/ports/index.ts", [
    ("  save(task: Task): Promise<Task>;\n", "  save(task: Task): Promise<Task>;\n  countByStatus(userId: number, status: TaskStatus): Promise<number>;\n"),
    ('import type { Task, TaskPriority, TaskStatus } from "../entities/Task";', 'import type { Task, TaskPriority, TaskStatus } from "../entities/Task";'),
])
new("api-clean/src/domain/policies/WipLimit.ts", f'''import {{ ConflictError }} from "../errors/DomainErrors";
import type {{ TaskRepository }} from "../ports";

/** Regra de negócio: no máximo 3 tarefas em andamento por usuário. */
export const WIP_LIMIT = 3;

export async function assertWithinWipLimit(tasks: TaskRepository, userId: number): Promise<void> {{
  if ((await tasks.countByStatus(userId, "doing")) >= WIP_LIMIT) {{
    throw new ConflictError("{MSG}");
  }}
}}
''')
rep("api-clean/src/domain/usecases/CreateTask.ts", [
    ('import type { TaskRepository } from "../ports";', 'import type { TaskRepository } from "../ports";\nimport { assertWithinWipLimit } from "../policies/WipLimit";'),
    ("  execute(userId: number, input: CreateTaskInput): Promise<Task> {\n    return this.tasks.create({ userId, ...input });",
     "  async execute(userId: number, input: CreateTaskInput): Promise<Task> {\n    if (input.status === \"doing\") await assertWithinWipLimit(this.tasks, userId);\n    return this.tasks.create({ userId, ...input });"),
])
rep("api-clean/src/domain/usecases/UpdateTask.ts", [
    ('import { assertId } from "./assertId";', 'import { assertWithinWipLimit } from "../policies/WipLimit";\nimport { assertId } from "./assertId";'),
    ("    if (!current) throw new NotFoundError();\n",
     "    if (!current) throw new NotFoundError();\n    if (changes.status === \"doing\" && current.data.status !== \"doing\") await assertWithinWipLimit(this.tasks, userId);\n"),
])
rep("api-clean/src/infrastructure/database/PgTaskRepository.ts", [
    ("  async delete(id: number, userId: number): Promise<boolean> {",
     '''  async countByStatus(userId: number, status: string): Promise<number> {
    const { rows } = await this.pool.query("SELECT COUNT(*)::int AS n FROM tasks WHERE user_id = $1 AND status = $2", [
      userId,
      status,
    ]);
    return rows[0].n;
  }

  async delete(id: number, userId: number): Promise<boolean> {'''),
])
# O dublê em memória precisa cumprir a porta ampliada (exigência de tipo da interface).
rep("api-clean/test/usecases.test.ts", [
    ("  async delete(id: number, userId: number) {\n    const before",
     "  async countByStatus(userId: number, status: string) {\n    return this.rows.filter((t) => t.belongsTo(userId) && t.data.status === status).length;\n  }\n  async delete(id: number, userId: number) {\n    const before"),
])
print("M2 aplicada")
