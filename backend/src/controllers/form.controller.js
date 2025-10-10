const { sendTelegramMessage } = require('../utils/sendTelegramMessage')
const Order = require('../models/Order')

/**
 * Handle contact form submission
 * @param {import('express').Request} req
 * @param {import('express').Response} res
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
 * @param {import('express').Request} req
 * @param {import('express').Response} res
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
        const itemTotal = quantity * price
        totalAmount += itemTotal

        cartDetails += `\n  ${index + 1}. ${title} - ${quantity} dona - $${price.toFixed(2)}`

        orderItems.push({
          title,
          quantity,
          price,
        })
      })
    }

    const orderData = {
      customerName: payload.name,
      customerPhone: payload.phone,
      customerAddress: payload.address,
      items: orderItems,
      totalAmount: totalAmount,
      status: 'pending',
      notes: payload.note,
    }

    const order = new Order(orderData)
    await order.save()

    const result = await sendTelegramMessage({
      type: 'order',
      data: {
        name: payload.name,
        phone: payload.phone,
        address: payload.address,
        product: payload.product,
        note: payload.note,
      },
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
 * @param {import('express').Request} req
 * @param {import('express').Response} res
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
 * Handle sending Telegram messages through backend
 * @param {import('express').Request} req
 * @param {import('express').Response} res
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
    console.error('❌ Error sending Telegram message:', error)
    return res.status(500).json({
      success: false,
      message: '❌ Xabar yuborishda xatolik yuz berdi',
    })
  }
}

module.exports = {
  handleContactSubmission,
  handleOrderSubmission,
  handleReservationSubmission,
  sendTelegramMessageHandler,
}
