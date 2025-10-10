const mongoose = require('mongoose')
const dotenv = require('dotenv')

// Load environment variables
dotenv.config({ path: './.env' })

// Check if MONGO_URI is available
if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI environment variable not found!')
  console.exit(1)
}

// Import the Menu model with correct path
const Menu = require('./src/models/Menu')

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB')

    // List all menu items
    Menu.find({})
      .then(items => {
        console.log(`\n📋 Found ${items.length} menu items:`)
        items.forEach((item, index) => {
          console.log(`\n${index + 1}. ${item.name}`)
          console.log(`   ID: ${item._id}`)
          console.log(`   Description: ${item.description}`)
          console.log(`   Price: $${item.price}`)
          console.log(`   Category: ${item.category}`)
          console.log(`   Image: ${item.imageUrl}`)
          console.log(`   Available: ${item.isAvailable ? 'Yes' : 'No'}`)
        })
        mongoose.connection.close()
        console.log('\n✅ Database connection closed')
      })
      .catch(error => {
        console.error('❌ Error fetching menu items:', error.message)
        mongoose.connection.close()
      })
  })
  .catch(error => {
    console.error('❌ Error connecting to MongoDB:', error.message)
    process.exit(1)
  })
