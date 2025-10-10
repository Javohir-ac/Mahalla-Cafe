const { spawn } = require('child_process')
const path = require('path')

// Function to spawn a process with proper shell support
function spawnProcess(command, args, options, name) {
  const proc = spawn(command, args, { ...options, shell: true }) // shell:true qo'shildi

  proc.stdout.on('data', data => {
    console.log(`[${name}] ${data.toString()}`)
  })

  proc.stderr.on('data', data => {
    console.error(`[${name} ERROR] ${data.toString()}`)
  })

  proc.on('error', error => {
    console.error(`[${name} SPAWN ERROR] ${error.message}`)
  })

  proc.on('close', code => {
    console.log(`[${name}] Process exited with code ${code}`)
  })

  return proc
}

console.log('Starting Mahalla Cafe application...')

// Start backend server
console.log('Starting backend server...')
const backend = spawnProcess(
  'node',
  [path.join(__dirname, 'backend', 'src', 'server.js')],
  { cwd: path.join(__dirname, 'backend'), env: process.env },
  'BACKEND'
)

// Wait a bit for backend to start, then start frontend
let frontend
setTimeout(() => {
  console.log('Starting frontend server...')
  frontend = spawnProcess(
    'npx',
    ['serve', '-s', 'build'], // 'serve -s build' frontendni ishga tushuradi
    {
      cwd: path.join(__dirname, 'frontend'),
      env: { ...process.env, PORT: '3000' },
    },
    'FRONTEND'
  )
}, 3000)

// Handle process termination
const shutdown = () => {
  console.log('Shutting down servers...')
  backend.kill()
  if (frontend) frontend.kill()
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
