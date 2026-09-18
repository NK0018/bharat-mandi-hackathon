import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

const PORT = 5000

const API_BASE_URL = 'https://api.data.gov.in/resource'

const RESOURCE_ID = process.env.MANDI_RESOURCE_ID
const API_KEY = process.env.DATA_GOV_API_KEY

const mandiCache = new Map()

const CACHE_DURATION = 5 * 60 * 1000

app.get('/api/mandi', async (req, res) => {
  try {
    const { state, district, commodity } = req.query

    const cacheKey = JSON.stringify({
      state: state || '',
      district: district || '',
      commodity: commodity || '',
    })

    const cached = mandiCache.get(cacheKey)

    if (
      cached &&
      Date.now() - cached.timestamp < CACHE_DURATION
    ) {
      console.log('CACHE HIT:', cacheKey)

      return res.json({
        success: true,
        count: cached.records.length,
        records: cached.records,
        cached: true,
      })
    }

    const params = new URLSearchParams({
      'api-key': API_KEY,
      format: 'json',
      limit: '100',
    })

    if (state) {
      params.append('filters[state.keyword]', state)
    }

    if (district) {
      params.append('filters[district]', district)
    }

    if (commodity) {
      params.append('filters[commodity]', commodity)
    }

    console.log('API REQUEST:', cacheKey)

    const response = await fetch(
      `${API_BASE_URL}/${RESOURCE_ID}?${params.toString()}`
    )

    if (!response.ok) {
      throw new Error(
        `Data.gov.in error: ${response.status}`
      )
    }

    const data = await response.json()

    const records = data.records || []

    mandiCache.set(cacheKey, {
      timestamp: Date.now(),
      records,
    })

    res.json({
      success: true,
      count: records.length,
      records,
      cached: false,
    })

  } catch (error) {
    console.error(
      'Mandi API Error:',
      error.message
    )

    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

const server = app.listen(PORT, '127.0.0.1', () => {
  console.log(
    `Bharat Mandi backend running on http://localhost:${PORT}`
  )
})

server.on('error', (error) => {
  console.error('SERVER ERROR:', error)
})

server.on('close', () => {
  console.log('SERVER CLOSED')
})

process.on('SIGINT', () => {
  console.log('Stopping Bharat Mandi backend...')
  server.close(() => {
    process.exit(0)
  })
})