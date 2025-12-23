/**
 * Start Gradio server as a child process
 * This allows Gradio to run alongside the Node.js backend
 */
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const GRADIO_SCRIPT = join(__dirname, 'app.py');
const GRADIO_ENABLED = process.env.ENABLE_GRADIO !== 'false'; // Enable by default

// Check if we're on Render (Render doesn't support multiple ports)
const isRender = !!process.env.RENDER_EXTERNAL_URL || !!process.env.RENDER_URL;

if (!GRADIO_ENABLED) {
  console.log('⚠️  Gradio is disabled (ENABLE_GRADIO=false)');
  process.exit(0);
}

if (isRender) {
  console.log('⚠️  Gradio cannot run on Render (Render does not support multiple ports)');
  console.log('💡 Gradio is only available in local development');
  console.log('💡 The backend API is running normally without Gradio');
  process.exit(0);
}

if (!existsSync(GRADIO_SCRIPT)) {
  console.error('❌ Gradio script not found:', GRADIO_SCRIPT);
  process.exit(1);
}

console.log('🚀 Starting Gradio server...');

// Start Gradio as a child process
const gradioProcess = spawn('python', [GRADIO_SCRIPT], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

gradioProcess.on('error', (error) => {
  if (error.code === 'ENOENT') {
    console.error('❌ Python not found!');
    console.error('💡 Please install Python 3.8+ from https://www.python.org/');
  } else {
    console.error('❌ Failed to start Gradio:', error.message);
  }
  console.error('💡 To install Gradio dependencies, run:');
  console.error('   cd backend/gradio_server');
  console.error('   pip install -r requirements.txt');
  // Don't exit - let backend continue running
});

gradioProcess.stderr?.on('data', (data) => {
  const errorMsg = data.toString();
  if (errorMsg.includes('ModuleNotFoundError') || errorMsg.includes('No module named')) {
    console.error('❌ Gradio dependencies not installed!');
    console.error('💡 To fix this, run:');
    console.error('   cd backend/gradio_server');
    console.error('   pip install -r requirements.txt');
    console.error('💡 The backend will continue running without Gradio.');
  } else if (errorMsg.includes('Cannot find empty port') || errorMsg.includes('OSError')) {
    console.error('❌ Port conflict detected!');
    console.error('💡 This usually happens on Render or when the port is already in use.');
    console.error('💡 Gradio cannot run on Render (Render only supports one port per service).');
    console.error('💡 The backend API is running normally without Gradio.');
  }
});

gradioProcess.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`❌ Gradio process exited with code ${code}`);
    console.error('💡 The backend API is still running. Gradio is optional.');
    console.error('💡 To install Gradio: cd backend/gradio_server && pip install -r requirements.txt');
  }
});

// Handle process termination
process.on('SIGTERM', () => {
  console.log('🛑 Stopping Gradio server...');
  gradioProcess.kill('SIGTERM');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Stopping Gradio server...');
  gradioProcess.kill('SIGINT');
  process.exit(0);
});

