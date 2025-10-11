const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')
const authRoutes = require('./routes/auth.routes')
const formRoutes = require('./routes/form.routes')
const adminRoutes = require('./routes/admin.routes')
const recipeRoutes = require('./routes/recipe.routes')
const orderRoutes = require('./routes/order.routes')
const reservationRoutes = require('./routes/reservation.routes')
const menuRoutes = require('./routes/menu.routes')
const activityRoutes = require('./routes/activity.routes')
const dashboardRoutes = require('./routes/dashboard.routes')
require('dotenv').config()

const app = express()

const PORT = process.env.PORT || 5000

// CORS configuration - Updated for Render deployment
const allowedOrigins = [
  'https://mahalla-cafe-buxorodagi-eng-zo-r-kafe.onrender.com',
  'https://mahalla-cafe-backend.onrender.com',
  'http://localhost:3000',
  'http://localhost:5000',
]

// Dynamic origin configuration for development and production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)

    // Check if the origin is in our allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))

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
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    const server = app.listen(PORT, () => {})

    // Graceful shutdown
    process.on('SIGINT', () => {
      server.close(() => {
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
