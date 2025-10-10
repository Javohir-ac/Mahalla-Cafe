<<<<<<< HEAD
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
=======
const { sendTelegramMessage } = require('../utils/sendTelegramMessage')
const Order = require('../models/Order')

/**
 * Handle contact form submission
 */
const handleContactSubmission = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body

    const payload = {
      name: String(name || '').trim() || "Noma'lum",
      email: String(email || '').trim() || "Email ko'rsatilmagan",
      phone: String(phone || '').trim() || "Telefon ko'rsatilmagan",
      message: String(message || '').trim() || "Xabar yo'q",
    }

    const result = await sendTelegramMessage({
      type: 'contact',
      data: payload,
      parseMode: 'Markdown',
    })

    if (result && result.success) {
      return res.status(200).json({
        success: true,
        message: '✅ Xabar muvaffaqiyatli yuborildi',
      })
    } else {
      return res.status(500).json({
        success: false,
        message: '❌ Xabar yuborilmadi! Tekshiring console log',
      })
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: '❌ Xabar yuborilmadi! Tekshiring console log',
    })
  }
}

/**
 * Handle order form submission
 */
const handleOrderSubmission = async (req, res) => {
  try {
    const { name, phone, address, product, note, cartItems } = req.body

    const payload = {
      name: String(name || '').trim() || "Noma'lum",
      phone: String(phone || '').trim() || "Noma'lum",
      address: String(address || '').trim() || "Manzil ko'rsatilmagan",
      product: String(product || '').trim() || "Mahsulot ko'rsatilmagan",
      note: String(note || '').trim() || "Qo'shimcha ma'lumot yo'q",
    }

    let cartDetails = ''
    let orderItems = []
    let totalAmount = 0

    if (cartItems && Array.isArray(cartItems) && cartItems.length > 0) {
      cartDetails = '\n\n🛍️ *Buyurtmalar:*'
      cartItems.forEach((item, index) => {
        const title = String(item.title || "Noma'lum").trim()
        const quantity = parseInt(item.quantity) || 0
        const price = parseFloat(item.price) || 0
        totalAmount += quantity * price
        cartDetails += `\n  ${index + 1}. ${title} - ${quantity} dona - $${price.toFixed(
          2
        )}`
        orderItems.push({ title, quantity, price })
      })
    }

    const orderData = {
      customerName: payload.name,
      customerPhone: payload.phone,
      customerAddress: payload.address,
      items: orderItems,
      totalAmount,
      status: 'pending',
      notes: payload.note,
    }

    const order = new Order(orderData)
    await order.save()

    const result = await sendTelegramMessage({
      type: 'order',
      data: payload,
      parseMode: 'Markdown',
    })

    if (result && result.success) {
      return res.status(200).json({
        success: true,
        message: '✅ Xabar muvaffaqiyatli yuborildi',
        data: order,
      })
    } else {
      return res.status(200).json({
        success: true,
        message: '✅ Buyurtma qabul qilindi (Telegramda xatolik yuz berdi)',
        data: order,
      })
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: '❌ Xabar yuborilmadi! Tekshiring console log',
    })
  }
}

/**
 * Handle reservation form submission
 */
const handleReservationSubmission = async (req, res) => {
  try {
    const { fullName, phone, date, time, guests, tableType, comment } = req.body

    const payload = {
      name: String(fullName || '').trim() || "Noma'lum",
      phone: String(phone || '').trim() || "Noma'lum",
      date: String(date || '').trim() || "Sana ko'rsatilmagan",
      time: String(time || '').trim() || "Vaqt ko'rsatilmagan",
      guests: parseInt(guests) || 1,
      tableType: String(tableType || '').trim() || "Joy turi ko'rsatilmagan",
      comment: String(comment || '').trim() || "Izoh yo'q",
    }

    const result = await sendTelegramMessage({
      type: 'reservation',
      data: payload,
      parseMode: 'Markdown',
    })

    if (result && result.success) {
      return res.status(200).json({
        success: true,
        message: '✅ Xabar muvaffaqiyatli yuborildi',
      })
    } else {
      return res.status(500).json({
        success: false,
        message: '❌ Xabar yuborilmadi! Tekshiring console log',
      })
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: '❌ Xabar yuborilmadi! Tekshiring console log',
    })
  }
}

/**
 * Handle sending arbitrary Telegram messages
 */
const sendTelegramMessageHandler = async (req, res) => {
  try {
    const { message } = req.body
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Xabar maydoni talab qilinadi',
      })
    }

    const result = await sendTelegramMessage({
      text: message,
      parseMode: 'HTML',
    })

    if (result && result.success) {
      return res.status(200).json({
        success: true,
        message: '✅ Xabar muvaffaqiyatli yuborildi',
      })
    } else {
      return res.status(500).json({
        success: false,
        message: result.message || 'Xabarni yuborishda xatolik yuz berdi',
      })
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: '❌ Xabar yuborishda xatolik yuz berdi',
    })
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
  }
}

module.exports = {
<<<<<<< HEAD
  handleContactForm,
=======
  handleContactSubmission,
  handleOrderSubmission,
  handleReservationSubmission,
  sendTelegramMessageHandler,
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
}
