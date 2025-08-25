import { mkdirSync, readdirSync, writeFileSync } from 'fs';
import { join, parse } from 'path';

const avatarsDir = join(process.cwd(), 'public/assets/avatars');
const outputDir = join(process.cwd(), 'src/constants');
const outputFile = join(outputDir, 'avatars.ts');

const files = readdirSync(avatarsDir)
  .filter((f) => /\.(svg)$/i.test(f))
  .map((f) => parse(f).name);

// Make sure the constants folder exists
mkdirSync(outputDir, { recursive: true });

const output = `// 🚨 AUTO-GENERATED FILE. Do not edit manually.
export const avatarList = ${JSON.stringify(files, null, 2)};\n`;

writeFileSync(outputFile, output);

console.log(`✅ Generated avatars.ts with ${files.length} avatars.`);
