const http = require('http')

// Test the menu API endpoint
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/menu',
  method: 'GET',
}

console.log(
  'Testing API endpoint:',
  `http://${options.hostname}:${options.port}${options.path}`
)

const req = http.request(options, res => {
  console.log(`Status Code: ${res.statusCode}`)
  console.log(`Content-Type: ${res.headers['content-type']}`)

  let data = ''

  res.on('data', chunk => {
    data += chunk
  })

  res.on('end', () => {
    try {
      const jsonData = JSON.parse(data)
      console.log('Response:', JSON.stringify(jsonData, null, 2))

      if (jsonData.data && Array.isArray(jsonData.data) && jsonData.data.length > 0) {
        console.log('\nFirst menu item:')
        console.log(JSON.stringify(jsonData.data[0], null, 2))

        console.log('\nImage URL analysis:')
        const firstItem = jsonData.data[0]
        console.log('imageUrl field:', firstItem.imageUrl)
        console.log('image field:', firstItem.image)

        if (firstItem.imageUrl) {
          console.log(
            'imageUrl starts with /uploads/:',
            firstItem.imageUrl.startsWith('/uploads/')
          )
        }
      }
    } catch (error) {
      console.error('JSON Parse Error:', error.message)
      console.log('Raw data:', data)
    }
  })
})

req.on('error', error => {
  console.error('Request Error:', error.message)
})

req.end()
