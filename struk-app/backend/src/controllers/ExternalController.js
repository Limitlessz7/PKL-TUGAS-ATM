const axios = require('axios')

/**
 * Contoh endpoint yang pakai axios di backend (sesuai request):
 * GET /api/external/ping => fetch ke EXTERNAL_PING_URL (default httpbin)
 */
const ping = async (req, res) => {
  const url = process.env.EXTERNAL_PING_URL || 'https://httpbin.org/get'
  try {
    const r = await axios.get(url, { timeout: 15000 })
    res.json({ ok: true, url, data: r.data })
  } catch (e) {
    res.status(502).json({ ok: false, message: e.message })
  }
}

module.exports = {
  ping
}
