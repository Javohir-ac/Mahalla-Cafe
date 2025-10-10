const axios = require('axios')

/**
 * Escape minimal Markdown special characters for Telegram Markdown
 * Only escape what we actually use for bold/italics to reduce breakage
 */
const escapeMd = value =>
  String(value || '')
    .replace(/([_*\[\]`])/g, '\\$1')
    .trim()

/**
 * Build message text by type from structured data
 * @param {"order"|"contact"|"reservation"} type
 * @param {Record<string, any>} data
 */
const buildMessageByType = (type, data) => {
  switch (type) {
    case 'order': {
      const name = escapeMd(data.name)
      const phone = escapeMd(data.phone)
      const address = escapeMd(data.address)
      const product = escapeMd(data.product)
      const note = escapeMd(data.note)
      return `📦 *Yangi buyurtma!*\n*Ism:* ${name}\n*Telefon:* ${phone}\n*Manzil:* ${address}\n*Mahsulot:* ${product}\n*Qo'shimcha:* ${note}`
    }
    case 'contact': {
      const name = escapeMd(data.name)
      const email = escapeMd(data.email)
      const phone = escapeMd(data.phone)
      const message = escapeMd(data.message)
      return `📩 *Yangi xabar!*\n*Ism:* ${name}\n*Email:* ${email}\n*Telefon:* ${phone}\n*Xabar:* ${message}`
    }
    case 'reservation': {
      const name = escapeMd(data.name)
      const phone = escapeMd(data.phone)
      const date = escapeMd(data.date)
      const time = escapeMd(data.time)
      const guests = escapeMd(data.guests)
      const tableType = escapeMd(data.tableType)
      const comment = escapeMd(data.comment)
      return `🪑 *Yangi rezervatsiya!*\n*Ism:* ${name}\n*Telefon:* ${phone}\n*Sana:* ${date}\n*Vaqt:* ${time}\n*Odamlar soni:* ${guests}\n*Joy turi:* ${tableType}\n*Izoh:* ${comment}`
    }
    default: {
      // Unknown type; fallback to simple text if provided
      return null
    }
  }
}

/**
 * Send a formatted message or document to Telegram chat
 * Backward compatible: if a string is passed, it will be sent as-is (Markdown)
 * @param {string|{type?: 'order'|'contact'|'reservation', data?: any, text?: string, fileUrl?: string, parseMode?: 'Markdown'|'MarkdownV2'|'HTML'}} options
 * @returns {Promise<{success: boolean, message: string}>}
 */
const sendTelegramMessage = async options => {
  try {
    // Use REACT_APP_ prefixed environment variables for consistency with frontend
    const botToken =
      process.env.REACT_APP_TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.REACT_APP_TELEGRAM_CHAT_ID || process.env.TELEGRAM_CHAT_ID

    if (!botToken || !chatId) {
      console.error(
        '❌ Telegram bot token or chat ID not configured in environment variables'
      )
      return {
        success: false,
        message: '❌ Xabar yuborilmadi! Telegram sozlamalari topilmadi.',
      }
    }

    const telegramBase = `https://api.telegram.org/bot${botToken}`

    let text = null
    let fileUrl = null
    let parseMode = 'Markdown'

    if (typeof options === 'string') {
      text = options
    } else if (options && typeof options === 'object') {
      const { type, data, text: rawText, fileUrl: url, parseMode: mode } = options

      if (mode) parseMode = mode

      if (type) {
        text = buildMessageByType(type, data || {})
      }

      if (!text && rawText) {
        text = rawText
      }

      if (url) {
        fileUrl = url
      }

      // Log payload for debugging
      // console.log('🧾 Outgoing payload:')
      // console.log('  Type:', type || 'raw')
      // console.log('  Data:', data || {})
      // if (fileUrl) console.log('  File URL:', fileUrl)
      // if (text) console.log('  Message text:', text)
    }

    if (!text && !fileUrl) {
      // console.error('❌ Nothing to send: missing text and fileUrl')
      return { success: false, message: "❌ Xabar yuborilmadi! Bo'sh kontent." }
    }

    // Send file if provided
    if (fileUrl) {
      const url = `${telegramBase}/sendDocument`
      const payload = {
        chat_id: chatId,
        document: fileUrl,
        caption: text || undefined,
        parse_mode: parseMode,
      }
      // console.log('📤 Sending document to Telegram...')
      const response = await axios.post(url, payload)
      if (!response || !response.data) {
        console.error('❌ No response received from Telegram API (document)')
        return {
          success: false,
          message: "❌ Xabar yuborilmadi! Telegramdan javob yo'q.",
        }
      }
      // console.log('📥 Telegram response (document):', response.data)
      if (response.data.ok === true) {
        return { success: true, message: '✅ Xabar muvaffaqiyatli yuborildi!' }
      }
      return {
        success: false,
        message:
          '❌ Xabar yuborilmadi! ' +
          (response.data.description || 'Telegram xatosi yuz berdi.'),
      }
    }

    // Send text message
    const url = `${telegramBase}/sendMessage`
    // console.log('📤 Sending message to Telegram...')
    // console.log('   Message:', text)

    const response = await axios.post(url, {
      chat_id: chatId,
      text,
      parse_mode: parseMode,
    })

    if (!response || !response.data) {
      console.error('❌ No response received from Telegram API')
      return { success: false, message: "❌ Xabar yuborilmadi! Telegramdan javob yo'q." }
    }

    // console.log('📥 Telegram response:', response.data)

    if (response.data.ok === true) {
      return { success: true, message: '✅ Xabar muvaffaqiyatli yuborildi!' }
    }

    // console.error('❌ Failed to send Telegram message:', response.data)
    // if (response.data.error_code)
    //   console.error('   Error code:', response.data.error_code)
    // if (response.data.description)
    //   console.error('   Description:', response.data.description)
    return {
      success: false,
      message:
        '❌ Xabar yuborilmadi! ' +
        (response.data.description || 'Telegram xatosi yuz berdi.'),
    }
  } catch (error) {
    // console.error('❌ Error sending Telegram message:')
    // console.error('   Message:', error.message)

    if (error.response) {
      // console.error('   Response status:', error.response.status)
      // console.error('   Response data:', error.response.data)
      if (error.response.status === 401) {
        return {
          success: false,
          message: '❌ Xabar yuborilmadi! Telegram bot tokeni noto‘g‘ri.',
        }
      } else if (error.response.status === 400) {
        return {
          success: false,
          message: '❌ Xabar yuborilmadi! Telegram so‘rovi noto‘g‘ri formatda.',
        }
      } else if (error.response.status === 403) {
        return {
          success: false,
          message: '❌ Xabar yuborilmadi! Telegram botga ruxsat berilmagan.',
        }
      }
    }

    if (error.request) {
      // console.error('   No response received:', error.request)
      return {
        success: false,
        message: '❌ Xabar yuborilmadi! Telegram serveriga ulanishda xatolik.',
      }
    }

    return {
      success: false,
      message:
        '❌ Xabar yuborilmadi! ' + (error.message || "Noma'lum xatolik yuz berdi."),
    }
  }
}

module.exports = { sendTelegramMessage }
