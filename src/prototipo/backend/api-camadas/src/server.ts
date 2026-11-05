import { createApp } from "./app";
import { env } from "./config/env";
import { initDatabase } from "./config/database";

async function main() {
  await initDatabase();
  createApp().listen(env.port, () => console.log(`[${env.architecture}] ouvindo na porta ${env.port}`));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
