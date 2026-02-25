module.exports = function requireRole(roles) {
  if (!Array.isArray(roles)) roles = [roles]

  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Token tidak ditemukan' })
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Akses ditolak: role tidak mencukupi' })
    }
    next()
  }
}
