const { sendTelegramMessage } = require('../utils/sendTelegramMessage')
const Order = require('../models/Order')

/**
 * Handle contact form submission
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const handleContactSubmission = async (req, res) => {
  try {
    // Extract and process form data with trim and type conversion
    const { name, email, phone, message } = req.body

    // Trim all string values and provide defaults for optional fields
    const payload = {
      name: String(name || '').trim() || "Noma'lum",
      email: String(email || '').trim() || "Email ko'rsatilmagan",
      phone: String(phone || '').trim() || "Telefon ko'rsatilmagan",
      message: String(message || '').trim() || "Xabar yo'q",
    }

    // Log the payload for debugging
    // console.log('📤 Contact form payload:', payload)

    // Format message according to specification
    const text = `📩 *Yangi xabar!*
*Ism:* ${payload.name}
*Email:* ${payload.email}
*Telefon:* ${payload.phone}
*Xabar:* ${payload.message}`

    // Send message to Telegram using the new structured approach
    const result = await sendTelegramMessage({
      type: 'contact',
      data: payload,
      parseMode: 'Markdown',
    })

    // Log the result for debugging
    // console.log('📥 Telegram response for contact:', result)

    // Terminal logging based on success or failure
    if (result && result.success) {
      // console.log('✅ Contact form message sent successfully to Telegram')
      return res.status(200).json({
        success: true,
        message: '✅ Xabar muvaffaqiyatli yuborildi',
      })
    } else {
      // console.log('❌ Failed to send contact form message to Telegram:', result.message)
      return res.status(500).json({
        success: false,
        message: '❌ Xabar yuborilmadi! Tekshiring console log',
      })
    }
  } catch (error) {
    // console.error('❌ Error in contact form submission:', error)
    // console.log('❌ Error sending contact form message to Telegram:', error.message)
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
    // Extract and process form data with trim and type conversion
    const { name, phone, address, product, note, cartItems } = req.body

    // Trim all string values and provide defaults for optional fields
    const payload = {
      name: String(name || '').trim() || "Noma'lum",
      phone: String(phone || '').trim() || "Noma'lum",
      address: String(address || '').trim() || "Manzil ko'rsatilmagan",
      product: String(product || '').trim() || "Mahsulot ko'rsatilmagan",
      note: String(note || '').trim() || "Qo'shimcha ma'lumot yo'q",
    }

    // Process cart items if provided
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

        cartDetails += `\n  ${index + 1}. ${title} - ${quantity} dona - $${price.toFixed(
          2
        )}`

        // Add to order items for database
        orderItems.push({
          title,
          quantity,
          price,
        })
      })
    }

    // Log the payload for debugging
    // console.log('📤 Order form payload:', payload)
    // if (cartItems) console.log('🛒 Cart items:', cartItems)

    // Format message according to specification
    const text = `📦 *Yangi buyurtma!*
*Ism:* ${payload.name}
*Telefon:* ${payload.phone}
*Manzil:* ${payload.address}
*Mahsulot:* ${payload.product}
*Qo'shimcha:* ${payload.note}${cartDetails}`

    // Save order to database
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
    // console.log('💾 Order saved to database:', order._id)

    // Send message to Telegram using the new structured approach
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

    // Log the result for debugging
    // console.log('📥 Telegram response for order:', result)

    // Terminal logging based on success or failure
    if (result && result.success) {
      // console.log('✅ Order form message sent successfully to Telegram')
      return res.status(200).json({
        success: true,
        message: '✅ Xabar muvaffaqiyatli yuborildi',
        data: order,
      })
    } else {
      // console.log('❌ Failed to send order form message to Telegram:', result.message)
      // Even if Telegram fails, we still saved to database
      return res.status(200).json({
        success: true,
        message: '✅ Buyurtma qabul qilindi (Telegramda xatolik yuz berdi)',
        data: order,
      })
    }
  } catch (error) {
    // console.error('❌ Error in order form submission:', error)
    // console.log('❌ Error sending order form message to Telegram:', error.message)
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
    // Extract and process form data with trim and type conversion
    const { fullName, phone, date, time, guests, tableType, comment } = req.body

    // Trim all string values and provide defaults for optional fields
    const payload = {
      name: String(fullName || '').trim() || "Noma'lum",
      phone: String(phone || '').trim() || "Noma'lum",
      date: String(date || '').trim() || "Sana ko'rsatilmagan",
      time: String(time || '').trim() || "Vaqt ko'rsatilmagan",
      guests: parseInt(guests) || 1,
      tableType: String(tableType || '').trim() || "Joy turi ko'rsatilmagan",
      comment: String(comment || '').trim() || "Izoh yo'q",
    }

    // Log the payload for debugging
    // console.log('📤 Reservation form payload:', payload)

    // Format message according to specification
    const text = `🪑 *Yangi rezervatsiya!*
*Ism:* ${payload.name}
*Telefon:* ${payload.phone}
*Sana:* ${payload.date}
*Vaqt:* ${payload.time}
*Odamlar soni:* ${payload.guests}
*Joy turi:* ${payload.tableType}
*Izoh:* ${payload.comment}`

    // Send message to Telegram using the new structured approach
    const result = await sendTelegramMessage({
      type: 'reservation',
      data: payload,
      parseMode: 'Markdown',
    })

    // Log the result for debugging
    // console.log('📥 Telegram response for reservation:', result)

    // Terminal logging based on success or failure
    if (result && result.success) {
      // console.log('✅ Reservation form message sent successfully to Telegram')
      return res.status(200).json({
        success: true,
        message: '✅ Xabar muvaffaqiyatli yuborildi',
      })
    } else {
      // console.log(
      //   '❌ Failed to send reservation form message to Telegram:',
      //   result.message
      // )
      return res.status(500).json({
        success: false,
        message: '❌ Xabar yuborilmadi! Tekshiring console log',
      })
    }
  } catch (error) {
    // console.error('❌ Error in reservation form submission:', error)
    // console.log('❌ Error sending reservation form message to Telegram:', error.message)
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

    // Send message to Telegram
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
