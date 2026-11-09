"""M3 — troca de tecnologia: bcryptjs -> scrypt nativo (node:crypto) para senhas."""
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

def new(rel, content):
    (B / rel).parent.mkdir(parents=True, exist_ok=True)
    (B / rel).write_text(content, encoding="utf-8")

def delete(rel):
    (B / rel).unlink()

HELPERS = '''const scrypt = promisify(scryptCallback) as (plain: string, salt: Buffer, keylen: number) => Promise<Buffer>;

export async function hashPassword(plain: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scrypt(plain, salt, 24);
  return `scrypt$${salt.toString("hex")}$${key.toString("hex")}`;
}

export async function verifyPassword(plain: string, stored: string): Promise<boolean> {
  const [alg, saltHex, keyHex] = stored.split("$");
  if (alg !== "scrypt" || !saltHex || !keyHex) return false;
  const key = await scrypt(plain, Buffer.from(saltHex, "hex"), 24);
  return timingSafeEqual(key, Buffer.from(keyHex, "hex"));
}
'''
IMPORTS = 'import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";\nimport { promisify } from "node:util";\n'

# ---- A: módulo único -------------------------------------------------------
rep("api-monolito/src/server.ts", [
    ('import bcrypt from "bcryptjs";\n', IMPORTS),
    ("export const app = express();", HELPERS + "\nexport const app = express();"),
    ("const hash = await bcrypt.hash(password, 8);", "const hash = await hashPassword(password);"),
    ("!(await bcrypt.compare(parsed.data.password, user.password_hash))", "!(await verifyPassword(parsed.data.password, user.password_hash))"),
])
rep("api-monolito/test/server.test.ts", [
    ('import bcrypt from "bcryptjs";\n', ""),
    ('import { app, pool } from "../src/server";', 'import { app, hashPassword, pool } from "../src/server";'),
    ('const hash = bcrypt.hashSync("certa", 4);', 'const hash = await hashPassword("certa");'),
])

# ---- B: camadas ------------------------------------------------------------
new("api-camadas/src/utils/password.ts", IMPORTS + "\n" + HELPERS)
rep("api-camadas/src/services/AuthService.ts", [
    ('import bcrypt from "bcryptjs";\n', ""),
    ('import { UserRepository } from "../repositories/UserRepository";',
     'import { UserRepository } from "../repositories/UserRepository";\nimport { hashPassword, verifyPassword } from "../utils/password";'),
    ("await bcrypt.hash(password, 8)", "await hashPassword(password)"),
    ("!(await bcrypt.compare(parsed.data.password, found.passwordHash))", "!(await verifyPassword(parsed.data.password, found.passwordHash))"),
])
rep("api-camadas/test/services.test.ts", [
    ('import bcrypt from "bcryptjs";\n', ""),
    ('import { TaskService } from "../src/services/TaskService";', 'import { TaskService } from "../src/services/TaskService";\nimport { hashPassword } from "../src/utils/password";'),
    ('const hash = bcrypt.hashSync("certa", 4);', 'const hash = await hashPassword("certa");'),
])

# ---- C: clean --------------------------------------------------------------
new("api-clean/src/infrastructure/security/ScryptHasher.ts", IMPORTS + 'import type { PasswordHasher } from "../../domain/ports";\n\n'
    + HELPERS.replace("export async function hashPassword", "async function hashPassword").replace("export async function verifyPassword", "async function verifyPassword")
    + '''
export class ScryptHasher implements PasswordHasher {
  hash(plain: string): Promise<string> {
    return hashPassword(plain);
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return verifyPassword(plain, hash);
  }
}
''')
delete("api-clean/src/infrastructure/security/BcryptHasher.ts")
rep("api-clean/src/main.ts", [
    ('import { BcryptHasher } from "./infrastructure/security/BcryptHasher";', 'import { ScryptHasher } from "./infrastructure/security/ScryptHasher";'),
    ("const hasher = new BcryptHasher();", "const hasher = new ScryptHasher();"),
])
print("M3 aplicada")
