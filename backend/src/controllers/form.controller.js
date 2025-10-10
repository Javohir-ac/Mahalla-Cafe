const { sendSuccess, sendError } = require('../utils/response.utils')
const { sendTelegramMessage } = require('../utils/sendTelegramMessage')

// Handle contact form submission
const handleContactForm = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body

    // Validate required fields
    if (!name || !email || !message) {
      return sendError(res, 'Name, email, and message are required', 400)
    }

    // Prepare message for Telegram
    const telegramMessage = `
📬 *Yangi xabar*

👤 Ism: ${name}
📧 Email: ${email}
📞 Telefon: ${phone || 'Berilmagan'}
💬 Xabar: ${message}
📅 Sana: ${new Date().toLocaleString('uz-UZ')}
    `

    // Send message to Telegram
    await sendTelegramMessage(telegramMessage)

    sendSuccess(res, null, 'Xabar muvaffaqiyatli yuborildi')
  } catch (error) {
    console.error('Error handling contact form:', error)
    sendError(res, 'Xabar yuborishda xatolik yuz berdi')
  }
}

module.exports = {
  handleContactForm,
}
