import type { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'

const NEWSDATA_BASE = 'https://newsdata.io/api/1/news'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = process.env.NEWSDATA_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'NEWSDATA_API_KEY is not configured' })
    return
  }

  try {
    const response = await axios.get(NEWSDATA_BASE, {
      params: {
        apikey: apiKey,
        category: 'environment,science,technology',
        ...req.query,
      },
    })
    res.status(200).json(response.data)
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 502
      const message = (err.response?.data as { message?: string })?.message ?? err.message
      res.status(status).json({ error: message })
    } else {
      res.status(500).json({ error: 'Unexpected error' })
    }
  }
}
