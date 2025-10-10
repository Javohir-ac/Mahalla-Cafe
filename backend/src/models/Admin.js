const mongoose = require('mongoose')
<<<<<<< HEAD
const bcrypt = require('bcryptjs')
=======
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b

const adminSchema = new mongoose.Schema(
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
      default: 'admin',
    },
  },
  {
    timestamps: true,
  }
)

<<<<<<< HEAD
// Hash password before saving
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Compare password method
adminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

=======
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
module.exports = mongoose.model('Admin', adminSchema)
