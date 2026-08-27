const express = require('express')
const path = require('path')
const { HOST } = require('./src/constants')
const database = require('./src/database')

const PORT = process.env.PORT || 5000
const MAX_UINT256 = (2n ** 256n) - 1n

function parseTokenId(value) {
  if (!/^(0|[1-9][0-9]*)$/.test(value)) {
    return null
  }

  const tokenId = BigInt(value)

  return tokenId <= MAX_UINT256 ? tokenId.toString() : null
}

const app = express()
  .disable('x-powered-by')
  .set('port', PORT)
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  next()
})

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function(req, res) {
  res.send('Get ready for OpenSea!')
})

app.get('/api/token/:token_id', function(req, res) {
  const tokenId = parseTokenId(req.params.token_id)

  if (tokenId === null) {
    return res.status(400).json({ error: 'Token ID must be a canonical uint256 decimal value' })
  }

  const token = database[tokenId]

  if (!token) {
    return res.status(404).json({ error: 'Token not found' })
  }

  return res.json({
    name: `Dawn of Daylight Token #${tokenId}`,
    description: 'Description.',
    image: `${HOST}/images/dawn_of_daylight.png`,
    background_colour: 'FF5900',
    attributes: [
      { trait_type: 'Name', value: token.name },
      { trait_type: 'Birthday', value: token.birthday },
    ],
  })
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'))
})
