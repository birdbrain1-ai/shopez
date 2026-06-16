const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Shopez E-Commerce Platform...');

function logOutput(prefix, colorCode, data) {
  const lines = data.toString().trim().split('\n');
  lines.forEach(line => {
    if (line) {
      console.log(`\x1b[${colorCode}m[${prefix}]\x1b[0m ${line}`);
    }
  });
}

// Start Backend on Port 5000
const backend = spawn('npm', ['start'], {
  cwd: path.join(__dirname, 'backend'),
  shell: true
});

backend.stdout.on('data', (data) => logOutput('Backend', '36', data)); // Cyan
backend.stderr.on('data', (data) => logOutput('Backend-Err', '31', data)); // Red

// Start Frontend on Port 5173
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'frontend'),
  shell: true
});

frontend.stdout.on('data', (data) => logOutput('Frontend', '35', data)); // Magenta
frontend.stderr.on('data', (data) => logOutput('Frontend-Err', '31', data)); // Red

process.on('SIGINT', () => {
  console.log('Stopping servers...');
  backend.kill();
  frontend.kill();
  process.exit();
});
