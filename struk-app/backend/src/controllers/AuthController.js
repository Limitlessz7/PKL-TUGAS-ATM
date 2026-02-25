const jwt = require('jsonwebtoken')
const { User } = require('../models')

// In-memory store for failed attempts (reset on server restart)
// For production, use Redis or database
const failedAttempts = new Map()

const getFailedAttempts = (identifier) => {
  const record = failedAttempts.get(identifier)
  if (!record) return { count: 0, lockedUntil: null }

  // Check if cooldown has expired
  if (record.lockedUntil && new Date() > record.lockedUntil) {
    failedAttempts.delete(identifier)
    return { count: 0, lockedUntil: null }
  }

  return record
}

const incrementFailedAttempts = (identifier) => {
  const record = getFailedAttempts(identifier)
  const newCount = record.count + 1
  
  let lockedUntil = record.lockedUntil
  if (newCount >= 10) {
    lockedUntil = new Date(Date.now() + 30000) // 30 seconds
  }

  failedAttempts.set(identifier, { count: newCount, lockedUntil })
  return { count: newCount, lockedUntil }
}

const resetFailedAttempts = (identifier) => {
  failedAttempts.delete(identifier)
}

// Debug/unlock endpoint helper
const unlock = async (req, res) => {
  try {
    const { username } = req.body
    if (!username) return res.status(400).json({ message: 'username required' })
    resetFailedAttempts(username)
    return res.json({ message: 'unlocked', username })
  } catch (e) {
    return res.status(500).json({ message: e.message })
  }
}

// Dev: return current failed attempts map
const getLocks = async (req, res) => {
  try {
    const entries = Array.from(failedAttempts.entries()).map(([username, record]) => ({ username, ...record }))
    return res.json({ data: entries })
  } catch (e) {
    return res.status(500).json({ message: e.message })
  }
}

// Dev: reset all locks
const resetAllLocks = async (req, res) => {
  try {
    failedAttempts.clear()
    return res.json({ message: 'all locks cleared' })
  } catch (e) {
    return res.status(500).json({ message: e.message })
  }
}

const login = async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: 'Username dan password harus diisi' })
    }

    // Check if account is locked
    const failureRecord = getFailedAttempts(username)
    if (failureRecord.count >= 10 && failureRecord.lockedUntil) {
      const remainingSeconds = Math.ceil((failureRecord.lockedUntil - new Date()) / 1000)
      return res.status(429).json({
        message: `Akun dikunci. Coba lagi dalam ${remainingSeconds} detik.`,
        locked: true,
        remainingSeconds
      })
    }

    const user = await User.findOne({ where: { username } })

    if (!user) {
      incrementFailedAttempts(username)
      return res.status(401).json({ message: 'Username atau password salah' })
    }

    const isPasswordValid = await user.comparePassword(password)

    if (!isPasswordValid) {
      const attempt = incrementFailedAttempts(username)
      
      if (attempt.count >= 10) {
        return res.status(429).json({
          message: 'Terlalu banyak percobaan gagal. Akun dikunci 30 detik.',
          locked: true,
          attempts: attempt.count
        })
      }

      return res.status(401).json({
        message: 'Username atau password salah',
        attempts: attempt.count,
        attemptsRemaining: 10 - attempt.count
      })
    }

    // Reset failed attempts on successful login
    resetFailedAttempts(username)

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    )

    res.json({
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    })
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

module.exports = {
  login,
  unlock,
  getLocks,
  resetAllLocks
}
