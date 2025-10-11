const mongoose = require('mongoose')
require('dotenv').config()

// User model
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
)

const User = mongoose.model('User', userSchema)

// Connect to database
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB ga ulandi')

    // Check if any admins exist
    const admins = await User.find({ role: 'admin' })
    console.log(`\nAdminlar soni: ${admins.length}`)

    if (admins.length > 0) {
      console.log('\nMavjud adminlar:')
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. ${admin.username} (ID: ${admin._id})`)
      })
    } else {
      console.log('\nHech qanday admin topilmadi')
    }

    // Check total users
    const totalUsers = await User.countDocuments()
    console.log(`\nJami foydalanuvchilar: ${totalUsers}`)

    mongoose.connection.close()
  })
  .catch(error => {
    console.error('❌ MongoDB ga ulanishda xatolik:', error.message)
    process.exit(1)
  })
