const axios = require('axios')

// Function to send message to Telegram
const sendTelegramMessage = async message => {
  try {
    // Check if required environment variables are present
    if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
      console.warn('Telegram bot token or chat ID not found. Skipping message send.')
      return
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID
    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`

    // Send message to Telegram
    await axios.post(telegramApiUrl, {
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown',
    })

    console.log('Message sent to Telegram successfully')
  } catch (error) {
    console.error('Error sending message to Telegram:', error.message)
    // Don't throw error to prevent breaking the main application flow
  }
}

module.exports = {
  sendTelegramMessage,
}
