"""M1 — campo opcional dueDate (data de vencimento) nas três versões."""
import sys
from pathlib import Path

B = Path(sys.argv[1])

def rep(rel, pairs):
    p = B / rel
    s = p.read_text(encoding="utf-8")
    for a, b in pairs:
        assert a in s, (rel, a[:70])
        s = s.replace(a, b, 1)
    p.write_text(s, encoding="utf-8")

SCHEMA = ("  priority VARCHAR(10) NOT NULL DEFAULT 'medium',\n",
          "  priority VARCHAR(10) NOT NULL DEFAULT 'medium',\n  due_date DATE,\n")
MIGRATE = ("CREATE INDEX IF NOT EXISTS idx_tasks_user ON tasks(user_id);\n",
           "CREATE INDEX IF NOT EXISTS idx_tasks_user ON tasks(user_id);\nALTER TABLE tasks ADD COLUMN IF NOT EXISTS due_date DATE;\n")
ZOD = ('  priority: z.enum(["low", "medium", "high"]).default("medium"),\n});',
       '  priority: z.enum(["low", "medium", "high"]).default("medium"),\n  dueDate: z.string().date().nullable().default(null),\n});')

# ---- A: módulo único -------------------------------------------------------
rep("api-monolito/src/server.ts", [
    SCHEMA, MIGRATE, ZOD,
    ("created_at AS \\\"createdAt\\\", updated_at AS \\\"updatedAt\\\"\";",
     "to_char(due_date, 'YYYY-MM-DD') AS \\\"dueDate\\\", created_at AS \\\"createdAt\\\", updated_at AS \\\"updatedAt\\\"\";"),
    ("`INSERT INTO tasks (user_id, title, description, status, priority) VALUES ($1, $2, $3, $4, $5)",
     "`INSERT INTO tasks (user_id, title, description, status, priority, due_date) VALUES ($1, $2, $3, $4, $5, $6)"),
    ("[userId, t.title, t.description, t.status, t.priority],",
     "[userId, t.title, t.description, t.status, t.priority, t.dueDate],"),
    ("`UPDATE tasks SET title = $1, description = $2, status = $3, priority = $4, updated_at = NOW()\n       WHERE id = $5 AND user_id = $6 RETURNING ${TASK_COLUMNS}`,\n      [merged.title, merged.description, merged.status, merged.priority, id, userId],",
     "`UPDATE tasks SET title = $1, description = $2, status = $3, priority = $4, due_date = $5, updated_at = NOW()\n       WHERE id = $6 AND user_id = $7 RETURNING ${TASK_COLUMNS}`,\n      [merged.title, merged.description, merged.status, merged.priority, merged.dueDate, id, userId],"),
])

# ---- B: camadas ------------------------------------------------------------
rep("api-camadas/src/config/database.ts", [SCHEMA, MIGRATE])
rep("api-camadas/src/models/Task.ts", [
    ("  priority: TaskPriority;\n  createdAt: Date;", "  priority: TaskPriority;\n  dueDate: string | null;\n  createdAt: Date;"),
    ZOD,
])
rep("api-camadas/src/repositories/TaskRepository.ts", [
    ("priority, created_at AS \"createdAt\"", "priority, to_char(due_date, \\'YYYY-MM-DD\\') AS \"dueDate\", created_at AS \"createdAt\""),
    ("`INSERT INTO tasks (user_id, title, description, status, priority) VALUES ($1, $2, $3, $4, $5)",
     "`INSERT INTO tasks (user_id, title, description, status, priority, due_date) VALUES ($1, $2, $3, $4, $5, $6)"),
    ("[userId, t.title, t.description, t.status, t.priority],",
     "[userId, t.title, t.description, t.status, t.priority, t.dueDate],"),
    ("`UPDATE tasks SET title = $1, description = $2, status = $3, priority = $4, updated_at = NOW()\n       WHERE id = $5 AND user_id = $6 RETURNING ${COLUMNS}`,\n      [t.title, t.description, t.status, t.priority, id, userId],",
     "`UPDATE tasks SET title = $1, description = $2, status = $3, priority = $4, due_date = $5, updated_at = NOW()\n       WHERE id = $6 AND user_id = $7 RETURNING ${COLUMNS}`,\n      [t.title, t.description, t.status, t.priority, t.dueDate, id, userId],"),
])
rep("api-camadas/src/services/TaskService.ts", [
    ("      priority: merged.priority,\n    });", "      priority: merged.priority,\n      dueDate: merged.dueDate,\n    });"),
])

# ---- C: clean --------------------------------------------------------------
rep("api-clean/src/infrastructure/database/pool.ts", [SCHEMA, MIGRATE])
rep("api-clean/src/domain/entities/Task.ts", [
    ("  priority: TaskPriority;\n  createdAt: Date;", "  priority: TaskPriority;\n  dueDate: string | null;\n  createdAt: Date;"),
    ('Pick<TaskProps, "title" | "description" | "status" | "priority">', 'Pick<TaskProps, "title" | "description" | "status" | "priority" | "dueDate">'),
])
rep("api-clean/src/domain/ports/index.ts", [
    ("  priority: TaskPriority;\n}\n\nexport interface TaskRepository", "  priority: TaskPriority;\n  dueDate: string | null;\n}\n\nexport interface TaskRepository"),
])
rep("api-clean/src/domain/usecases/CreateTask.ts", [
    ("  priority: TaskPriority;\n}", "  priority: TaskPriority;\n  dueDate: string | null;\n}"),
])
rep("api-clean/src/interfaces/controllers/validators.ts", [ZOD])
rep("api-clean/src/infrastructure/database/PgTaskRepository.ts", [
    ("priority, created_at AS \"createdAt\"", "priority, to_char(due_date, \\'YYYY-MM-DD\\') AS \"dueDate\", created_at AS \"createdAt\""),
    ("`INSERT INTO tasks (user_id, title, description, status, priority) VALUES ($1, $2, $3, $4, $5)",
     "`INSERT INTO tasks (user_id, title, description, status, priority, due_date) VALUES ($1, $2, $3, $4, $5, $6)"),
    ("[t.userId, t.title, t.description, t.status, t.priority],",
     "[t.userId, t.title, t.description, t.status, t.priority, t.dueDate],"),
    ("`UPDATE tasks SET title = $1, description = $2, status = $3, priority = $4, updated_at = NOW()\n       WHERE id = $5 AND user_id = $6 RETURNING ${COLUMNS}`,\n      [t.title, t.description, t.status, t.priority, t.id, t.userId],",
     "`UPDATE tasks SET title = $1, description = $2, status = $3, priority = $4, due_date = $5, updated_at = NOW()\n       WHERE id = $6 AND user_id = $7 RETURNING ${COLUMNS}`,\n      [t.title, t.description, t.status, t.priority, t.dueDate, t.id, t.userId],"),
])
print("M1 aplicada")

# O teste do monólito verifica os parâmetros exatos do SQL; o novo campo os altera.
rep("api-monolito/test/server.test.ts", [
    ('expect(spy.mock.calls[0][1]).toEqual([1, "Tarefa", "", "todo", "medium"]);',
     'expect(spy.mock.calls[0][1]).toEqual([1, "Tarefa", "", "todo", "medium", null]);'),
    ('expect(spy.mock.calls[1][1]).toEqual(["Antigo", "", "done", "high", 1, 1]);',
     'expect(spy.mock.calls[1][1]).toEqual(["Antigo", "", "done", "high", undefined, 1, 1]);'),
])
