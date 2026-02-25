const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader) {
      return res.status(401).json({ message: 'Token tidak ditemukan' })
    }

    const token = authHeader.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ message: 'Token tidak valid' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
    req.user = decoded
    next()
  } catch (e) {
    if (e.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token sudah kadaluarsa' })
    }
    res.status(401).json({ message: 'Token tidak valid' })
  }
}

module.exports = authMiddleware
