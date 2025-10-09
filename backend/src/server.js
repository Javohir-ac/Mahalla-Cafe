const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')

// Load environment variables
dotenv.config()

// Check if environment variables are loaded
if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI environment variable not found!')
  console.error('Please check your .env file in the backend directory')
  process.exit(1)
}

if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET environment variable not found!')
  console.error('Please check your .env file in the backend directory')
  process.exit(1)
}

if (!process.env.ADMIN_SECRET_CODE) {
  console.error('❌ ADMIN_SECRET_CODE environment variable not found!')
  console.error('Please check your .env file in the backend directory')
  process.exit(1)
}

// Import routes
const authRoutes = require('./routes/auth.routes')
const formRoutes = require('./routes/form.routes')
const adminRoutes = require('./routes/admin.routes')
const recipeRoutes = require('./routes/recipe.routes')
const orderRoutes = require('./routes/order.routes')
const reservationRoutes = require('./routes/reservation.routes')
const menuRoutes = require('./routes/menu.routes')
const activityRoutes = require('./routes/activity.routes')
const dashboardRoutes = require('./routes/dashboard.routes')

const app = express()
const PORT = process.env.PORT || 5000

// CORS configuration - Updated for Render deployment
const allowedOrigins = [
  'https://mahalla-cafe-buxorodagi-eng-zo-r-kafe.onrender.com',
  'http://localhost:3000',
]

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    optionsSuccessStatus: 200,
  })
)

// Middleware
app.use(express.json())

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api', formRoutes)
app.use('/api/admins', adminRoutes)
app.use('/api/recipes', recipeRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/reservations', reservationRoutes)
app.use('/api/menu', menuRoutes)
app.use('/api/activity', activityRoutes)
app.use('/api/dashboard', dashboardRoutes)

// Database connection
// Remove console.log statements for production
// console.log('🔄 MongoDB ga ulanish urunilmoqda...')

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // Remove console.log statements for production
    // console.log('✅ MongoDB ga muvaffaqiyatli ulandi')
    // console.log('🚀 Backend server ishga tushmoqda...')

    const server = app.listen(PORT, () => {
      // Remove console.log statements for production
      // console.log(`✅ Server ${PORT} portida muvaffaqiyatli ishga tushdi`)
      // console.log(
      //   `📡 API endpointlar quyidagi manzilda mavjud: http://localhost:${PORT}/api`
      // )
      // console.log('🔐 JWT autentifikatsiya faol')
      // console.log('📂 Server ishga tushdi:', new Date().toLocaleString())
    })

    // Graceful shutdown
    process.on('SIGINT', () => {
      // Remove console.log statements for production
      // console.log("\n🛑 Server to'xtatilmoqda...")
      server.close(() => {
        // Remove console.log statements for production
        // console.log("✅ Server muvaffaqiyatli to'xtadi")
        process.exit(0)
      })
    })
  })
  .catch(error => {
    console.error('❌ MongoDB ga ulanishda xatolik:', error.message)
    console.error("🔧 Tekshirish kerak bo'lgan narsalar:")
    console.error("  1. .env faylingizdagi MONGO_URI to'g'ri ekanligini")
    console.error('  2. Internetga ulanishingizni')
    console.error('  3. MongoDB atlasga kirish huquqingizni')
    process.exit(1)
  })
