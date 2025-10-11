const { spawn } = require('child_process')
const path = require('path')

// Platformga mos node va npm nomi
const nodeCmd = process.platform === 'win32' ? 'node.exe' : 'node'
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'

// Spawn funksiyasi
function spawnProcess(command, args, options, name) {
  console.log(`[${name}] Jarayon ishga tushirilmoqda: ${command} ${args.join(' ')}`)
  const proc = spawn(command, args, { ...options, shell: true })

  proc.stdout.on('data', data => {
    console.log(`[${name}] ${data.toString()}`)
  })

  proc.stderr.on('data', data => {
    console.error(`[${name} XATO] ${data.toString()}`)
  })

  proc.on('error', error => {
    console.error(`[${name} JARAYON XATOSI] ${error.message}`)
  })

  proc.on('close', code => {
    console.log(`[${name}] Jarayon ${code} kod bilan tugadi`)
  })

  return proc
}

console.log('Mahalla Cafe dasturi ishga tushirilmoqda...')

// Backend ishga tushirish
console.log('Backend server ishga tushirilmoqda...')
const backend = spawnProcess(
  nodeCmd,
  [path.join(__dirname, 'backend', 'src', 'server.js')],
  {
    cwd: path.join(__dirname, 'backend'),
    stdio: 'pipe',
    env: { ...process.env, PORT: '5000' },
  },
  'BACKEND'
)

// Frontend ishga tushirish
console.log('Frontend server ishga tushirilmoqda...')
const frontend = spawnProcess(
  npmCmd,
  ['run', 'dev'],
  {
    cwd: path.join(__dirname, 'frontend'),
    stdio: 'pipe',
    env: {
      ...process.env,
      // Frontend proxy uchun backend manzilini belgilash
      REACT_APP_API_URL: 'http://localhost:5000/api',
    },
  },
  'FRONTEND'
)

// Serverlarni to'xtatish
function shutdown() {
  console.log("Serverlar to'xtatilmoqda...")
  if (backend) backend.kill()
  if (frontend) frontend.kill()
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
