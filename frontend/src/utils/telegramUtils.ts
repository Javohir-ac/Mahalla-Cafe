// Utility functions for Telegram integration
interface TelegramMessageOptions {
  text: string
  parseMode?: 'Markdown' | 'MarkdownV2' | 'HTML'
}

/**
 * Escape special characters for Telegram MarkdownV2
 * @param text Text to escape
 * @returns Escaped text
 */
export const escapeMarkdown = (text: string): string => {
  // List of characters that need to be escaped in MarkdownV2
  const specialChars = [
    '_',
    '*',
    '[',
    ']',
    '(',
    ')',
    '~',
    '`',
    '>',
    '#',
    '+',
    '-',
    '=',
    '|',
    '{',
    '}',
    '.',
    '!',
  ]
  let escapedText = text

  for (const char of specialChars) {
    // Use a regex with global flag to replace all occurrences
    escapedText = escapedText.replace(new RegExp(`\\${char}`, 'g'), `\\${char}`)
  }

  return escapedText
}

/**
 * Escape special characters for HTML
 * @param text Text to escape
 * @returns Escaped text
 */
export const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * Send a message to Telegram using the bot API
 * @param options Message options including text and parse mode
 * @returns Promise with the result of the send operation
 */
export const sendTelegramMessage = async (options: TelegramMessageOptions) => {
  try {
    // Get Telegram configuration from environment variables
    const botToken = process.env.REACT_APP_TELEGRAM_BOT_TOKEN
    const chatId = process.env.REACT_APP_TELEGRAM_CHAT_ID

    // Validate configuration
    if (!botToken || !chatId) {
      console.error('❌ Telegram bot token or chat ID not configured')
      return {
        success: false,
        message: 'Telegram sozlamalari topilmadi',
      }
    }

    // Prepare the message payload
    const payload = {
      chat_id: chatId,
      text: options.text,
      parse_mode: options.parseMode || 'HTML', // Default to HTML to avoid markdown issues
    }

    console.log('📤 Sending Telegram message with payload:', payload)

    // Send message to Telegram API
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    // Parse the response
    const result = await response.json()
    console.log('📥 Telegram API response:', result)

    // Check if the message was sent successfully
    if (result.ok) {
      console.log('✅ Message sent successfully to Telegram')
      return {
        success: true,
        message: 'Xabar muvaffaqiyatli yuborildi',
      }
    } else {
      console.error('❌ Failed to send message to Telegram:', result.description)
      return {
        success: false,
        message: `Xabar yuborilmadi: ${result.description}`,
      }
    }
  } catch (error) {
    console.error('❌ Error sending Telegram message:', error)
    return {
      success: false,
      message: 'Xabar yuborishda xatolik yuz berdi',
    }
  }
}

/**
 * Format contact form data into a Telegram message
 * @param data Contact form data
 * @returns Formatted message string
 */
export const formatContactMessage = (data: {
  name: string
  email: string
  phone: string
  message: string
}) => {
  // Escape user inputs to prevent formatting issues
  const escapedName = escapeHtml(data.name || "Noma'lum")
  const escapedEmail = escapeHtml(data.email || "Noma'lum")
  const escapedPhone = escapeHtml(data.phone || "Noma'lum")
  const escapedMessage = escapeHtml(data.message || "Xabar yo'q")

  return `<b>📩 Yangi xabar!</b>
<b>Ism:</b> ${escapedName}
<b>Email:</b> ${escapedEmail}
<b>Telefon:</b> ${escapedPhone}
<b>Xabar:</b> ${escapedMessage}`
}

/**
 * Format order form data into a Telegram message
 * @param data Order form data
 * @param cartItems Cart items if available
 * @returns Formatted message string
 */
export const formatOrderMessage = (
  data: {
    name: string
    phone: string
    address: string
    product: string
    note: string
  },
  cartItems?: Array<{ title: string; quantity: number; price: number }>
) => {
  // Escape user inputs to prevent formatting issues
  const escapedName = escapeHtml(data.name || "Noma'lum")
  const escapedPhone = escapeHtml(data.phone || "Noma'lum")
  const escapedAddress = escapeHtml(data.address || "Manzil ko'rsatilmagan")
  const escapedProduct = escapeHtml(data.product || "Mahsulot ko'rsatilmagan")
  const escapedNote = escapeHtml(data.note || "Qo'shimcha ma'lumot yo'q")

  let cartDetails = ''
  if (cartItems && cartItems.length > 0) {
    cartDetails = '\n\n<b>🛍️ Buyurtmalar:</b>'
    cartItems.forEach((item, index) => {
      const escapedTitle = escapeHtml(item.title)
      cartDetails += `\n  ${index + 1}. ${escapedTitle} - ${
        item.quantity
      } dona - $${item.price.toFixed(2)}`
    })
  }

  return `<b>📦 Yangi buyurtma!</b>
<b>Ism:</b> ${escapedName}
<b>Telefon:</b> ${escapedPhone}
<b>Manzil:</b> ${escapedAddress}
<b>Mahsulot:</b> ${escapedProduct}
<b>Qo'shimcha:</b> ${escapedNote}${cartDetails}`
}

/**
 * Format reservation form data into a Telegram message
 * @param data Reservation form data
 * @returns Formatted message string
 */
export const formatReservationMessage = (data: {
  name: string
  phone: string
  date: string
  time: string
  guests: string
  tableType: string
  comment: string
}) => {
  // Escape user inputs to prevent formatting issues
  const escapedName = escapeHtml(data.name || "Noma'lum")
  const escapedPhone = escapeHtml(data.phone || "Noma'lum")
  const escapedDate = escapeHtml(data.date || "Sana ko'rsatilmagan")
  const escapedTime = escapeHtml(data.time || "Vaqt ko'rsatilmagan")
  const escapedGuests = escapeHtml(data.guests || "Noma'lum")
  const escapedTableType = escapeHtml(data.tableType || "Joy turi ko'rsatilmagan")
  const escapedComment = escapeHtml(data.comment || "Izoh yo'q")

  return `<b>🪑 Yangi rezervatsiya!</b>
<b>Ism:</b> ${escapedName}
<b>Telefon:</b> ${escapedPhone}
<b>Sana:</b> ${escapedDate}
<b>Vaqt:</b> ${escapedTime}
<b>Odamlar soni:</b> ${escapedGuests}
<b>Joy turi:</b> ${escapedTableType}
<b>Izoh:</b> ${escapedComment}`
}
