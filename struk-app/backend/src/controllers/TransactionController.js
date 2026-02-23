const { Transaction, TransactionItem } = require('../models')
const { makeCode, computeTotals } = require('../utils/receipt')

const getAll = async (req, res) => {
  const items = await Transaction.findAll({
    where: { deletedAt: null },
    order: [['createdAt', 'DESC']],
    include: [{ model: TransactionItem, as: 'items', where: { deletedAt: null }, required: false }]
  })
  res.json({ data: items })
}

const getById = async (req, res) => {
  const id = Number(req.params.id)
  const item = await Transaction.findByPk(id, {
    include: [{ model: TransactionItem, as: 'items', where: { deletedAt: null }, required: false }]
  })
  if (!item || item.deletedAt) return res.status(404).json({ message: 'Transaksi tidak ditemukan' })
  res.json({ data: item })
}

const create = async (req, res) => {
  const payload = req.body || {}
  const items = Array.isArray(payload.items) ? payload.items : []

  if (!items.length) return res.status(400).json({ message: 'Minimal 1 item.' })

  const normalized = items.map((it) => ({
    name: String(it.name || 'Item').trim(),
    qty: Math.max(1, Number(it.qty || 1)),
    price: Math.max(0, Number(it.price || 0))
  }))

  const totals = computeTotals(normalized, payload.discount, payload.tax, payload.paid)

  if (totals.paid < totals.total) {
    return res.status(400).json({ message: 'Nominal bayar kurang dari total.' })
  }

  const t = await Transaction.sequelize.transaction()
  try {
    const trx = await Transaction.create({
      code: makeCode(),
      patientName: payload.patientName || null,
      unit: payload.unit || null,
      paymentMethod: payload.paymentMethod || 'Cash',
      note: payload.note || null,
      subtotal: totals.subtotal,
      discount: totals.discount,
      tax: totals.tax,
      total: totals.total,
      paid: totals.paid,
      change: totals.change
    }, { transaction: t })

    await TransactionItem.bulkCreate(
      normalized.map((it) => ({
        transactionId: trx.id,
        name: it.name,
        qty: it.qty,
        price: it.price
      })),
      { transaction: t }
    )

    await t.commit()

    const created = await Transaction.findByPk(trx.id, {
      include: [{ model: TransactionItem, as: 'items' }]
    })

    res.status(201).json({ data: created })
  } catch (e) {
    await t.rollback()
    res.status(500).json({ message: e.message })
  }
}

const destroy = async (req, res) => {
  const id = Number(req.params.id)
  const t = await Transaction.sequelize.transaction()
  try {
    const transaction = await Transaction.findByPk(id, { transaction: t })
    if (!transaction || transaction.deletedAt) return res.status(404).json({ message: 'Transaksi tidak ditemukan' })
    
    await TransactionItem.update({ deletedAt: new Date() }, { where: { transactionId: id }, transaction: t })
    await Transaction.update({ deletedAt: new Date() }, { where: { id }, transaction: t })
    await t.commit()
    res.json({ ok: true })
  } catch (e) {
    await t.rollback()
    res.status(500).json({ message: e.message })
  }
}

const getDeleted = async (req, res) => {
  const items = await Transaction.findAll({
    where: { deletedAt: { [require('sequelize').Op.ne]: null } },
    order: [['deletedAt', 'DESC']],
    include: [{ model: TransactionItem, as: 'items' }]
  })
  res.json({ data: items })
}

const restore = async (req, res) => {
  const id = Number(req.params.id)
  const t = await Transaction.sequelize.transaction()
  try {
    const transaction = await Transaction.findByPk(id, { transaction: t })
    if (!transaction) return res.status(404).json({ message: 'Transaksi tidak ditemukan' })
    if (!transaction.deletedAt) return res.status(400).json({ message: 'Transaksi ini belum dihapus' })
    
    await TransactionItem.update({ deletedAt: null }, { where: { transactionId: id }, transaction: t })
    await Transaction.update({ deletedAt: null }, { where: { id }, transaction: t })
    await t.commit()
    
    const restored = await Transaction.findByPk(id, {
      include: [{ model: TransactionItem, as: 'items' }]
    })
    
    res.json({ data: restored })
  } catch (e) {
    await t.rollback()
    res.status(500).json({ message: e.message })
  }
}

const permanentDelete = async (req, res) => {
  const id = Number(req.params.id)
  const t = await Transaction.sequelize.transaction()
  try {
    const transaction = await Transaction.findByPk(id, { transaction: t })
    if (!transaction) return res.status(404).json({ message: 'Transaksi tidak ditemukan' })
    
    await TransactionItem.destroy({ where: { transactionId: id }, transaction: t, force: true })
    await Transaction.destroy({ where: { id }, transaction: t, force: true })
    await t.commit()
    res.json({ ok: true })
  } catch (e) {
    await t.rollback()
    res.status(500).json({ message: e.message })
  }
}

module.exports = {
  getAll,
  getById,
  create,
  destroy,
  getDeleted,
  restore,
  permanentDelete
}
