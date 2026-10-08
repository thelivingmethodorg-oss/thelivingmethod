import { mkdir, writeFile } from 'node:fs/promises';
import { median } from '../src/lib/median';

async function main() {
  await mkdir('./generated', { recursive: true });
  await writeFile('./generated/cms-schemas.ts', await median.generateSchemas());
  console.log('[generate-schemas] Done.');
}

main().catch((err) => {
  console.error('[generate-schemas] Failed:', err);
  process.exit(1);
});
