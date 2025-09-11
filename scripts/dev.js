import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import 'dotenv/config.js';

const mockConfig = {
  VITE_FIREBASE_API_KEY: 'MOCK_API_KEY',
  VITE_FIREBASE_AUTH_DOMAIN: 'mock-project-id.firebaseapp.com',
  VITE_FIREBASE_PROJECT_ID: 'mock-project-id',
  VITE_FIREBASE_STORAGE_BUCKET: 'mock-project-id.appspot.com',
  VITE_FIREBASE_MESSAGING_SENDER_ID: '1234567890',
  VITE_FIREBASE_APP_ID: '1:1234567890:web:abcdef1234567890',
  VITE_FIREBASE_MEASUREMENT_ID: 'G-1234567890',
  VITE_FIREBASE_DATABASE_URL:
    'https://mock-project-default-rtdb.firebasedatabase.app',
};

const requiredConfigVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_FIREBASE_MEASUREMENT_ID',
  'VITE_FIREBASE_DATABASE_URL',
];

const argv = yargs(hideBin(process.argv))
  .option('emulators', {
    type: 'boolean',
    description: 'Run the project with Firebase Emulators',
  })
  .option('import', {
    type: 'string',
    description: 'Path to import data from when running the emulators',
  }).argv;

function getIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

function checkEnvironmentVariables() {
  const dotEnvPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(dotEnvPath)) {
    console.error(
      'Error: No .env file found in the project root. Please create file with the following variables.'
    );
    requiredConfigVars.forEach((v) => console.error(`- ${v}`));
    process.exit(1);
  }

  const missingVars = requiredConfigVars.filter(
    (envVar) => !process.env[envVar]
  );
  if (missingVars.length > 0) {
    console.error(
      'Error: The following required Firebase variables are missing from your .env file:'
    );
    missingVars.forEach((v) => console.error(`- ${v}`));
    process.exit(1);
  }
}

function checkFirebaseCLI() {
  try {
    execSync('firebase --version', { stdio: 'ignore' });
  } catch (error) {
    console.error('Error: Firebase CLI is not installed.');
    console.error(
      "Please install it globally with 'npm install -g firebase-tools'."
    );
    process.exit(1);
  }
}

function runDevServer() {
  const devServerCommand = 'vite --host';
  console.log(`\nStarting dev server: ${devServerCommand}\n`);
  execSync(devServerCommand, { stdio: 'inherit' });
}

function runEmulators() {
  checkFirebaseCLI();

  // Merge existing environment variables with the mock config,
  // giving precedence to existing variables.
  const finalConfig = { ...mockConfig, ...process.env };
  const projectId = finalConfig.VITE_FIREBASE_PROJECT_ID;

  Object.keys(finalConfig).forEach(
    (key) => (process.env[key] = finalConfig[key])
  );

  let emulatorCommand = `firebase emulators:start --project ${projectId} --only auth,firestore,database,apphosting`;

  if (argv.import) {
    emulatorCommand += ` --import "${argv.import}"`;
  }

  process.env.VITE_USE_EMULATOR = 'true';

  // Set the VITE_EMULATOR_HOST dynamically
  const ipAddress = getIpAddress();
  process.env.VITE_EMULATOR_HOST = ipAddress;
  console.log(`Emulator host set to: ${ipAddress}`);

  console.log(`\nRunning with emulator: ${emulatorCommand}\n`);
  execSync(emulatorCommand, { stdio: 'inherit' });
}

if (argv.emulators) {
  runEmulators();
} else {
  checkEnvironmentVariables();
  runDevServer();
}
