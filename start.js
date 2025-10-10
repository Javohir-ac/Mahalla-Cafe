const { spawn } = require('child_process')
const path = require('path')

// Backend va frontend jarayonlarini saqlash uchun o'zgaruvchilar
let backendProcess
let frontendProcess

// Backend ni ishga tushirish
function startBackend() {
  console.log('🔄 Backend ishga tushirilmoqda...')

  backendProcess = spawn('node', ['src/server.js'], {
    cwd: path.join(__dirname, 'backend'),
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      NODE_ENV: 'development',
    },
  })

  backendProcess.on('spawn', () => {
    console.log('✅ Backend muvaffaqiyatli ishga tushdi (port 5000)')
    // Backend ishga tushgandan keyin frontend ni ishga tushirish
    setTimeout(startFrontend, 3000) // 3 soniya kutish
  })

  backendProcess.on('error', error => {
    console.error('❌ Backend da xatolik yuz berdi:', error.message)
  })

  backendProcess.on('close', code => {
    console.log(`🛑 Backend jarayoni tugadi, kod: ${code}`)
    // Agar backend to'xtasa, frontend ni ham to'xtatamiz
    if (frontendProcess && !frontendProcess.killed) {
      frontendProcess.kill()
    }
  })
}

// Frontend ni ishga tushirish
function startFrontend() {
  console.log('🔄 Frontend ishga tushirilmoqda...')

  frontendProcess = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, 'frontend'),
    stdio: 'inherit',
    shell: true,
  })

  frontendProcess.on('spawn', () => {
    console.log('✅ Frontend muvaffaqiyatli ishga tushdi (port 3000)')
  })

  frontendProcess.on('error', error => {
    console.error('❌ Frontend da xatolik yuz berdi:', error.message)
  })

  frontendProcess.on('close', code => {
    console.log(`🛑 Frontend jarayoni tugadi, kod: ${code}`)
    // Agar frontend to'xtasa, backend ni ham to'xtatamiz
    if (backendProcess && !backendProcess.killed) {
      backendProcess.kill()
    }
  })
}

// Ikkala jarayonni to'xtatish
function shutdown() {
  console.log("\n🔄 Ikkala jarayon to'xtatilmoqda...")

  if (backendProcess && !backendProcess.killed) {
    backendProcess.kill()
  }

  if (frontendProcess && !frontendProcess.killed) {
    frontendProcess.kill()
  }

  process.exit(0)
}

// SIGINT (Ctrl+C) va SIGTERM signallarini tinglash
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

// Backend ni ishga tushirish
startBackend()
