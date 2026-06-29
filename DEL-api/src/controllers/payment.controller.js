const { z } = require('zod');
const Payment = require('../models/Payment');
const Invoice = require('../models/Invoice');
const asyncHandler = require('../utils/asyncHandler');
const generatePaymentNumber = require('../utils/generatePaymentNumber');
const { recalculateInvoiceBalance } = require('./invoice.controller');

const statuses = ['PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED'];
const methods = ['CASH', 'BANK_TRANSFER', 'MOBILE_MONEY', 'CHEQUE', 'CRYPTO', 'OTHER'];
const schema = z.object({ invoiceId: z.string().min(1), amount: z.coerce.number().positive(), currency: z.enum(['XOF', 'USD', 'EUR']).optional(), method: z.enum(methods).default('BANK_TRANSFER'), paymentDate: z.coerce.date().optional(), reference: z.string().optional(), proofUrl: z.string().optional(), notes: z.string().optional(), status: z.enum(statuses).optional() });
const updateSchema = schema.omit({ invoiceId: true }).partial();
const statusSchema = z.object({ status: z.enum(statuses) });
async function uniquePaymentNumber() { for (let i = 0; i < 5; i += 1) { const paymentNumber = generatePaymentNumber(); if (!(await Payment.exists({ paymentNumber }))) return paymentNumber; } return `${generatePaymentNumber()}-${Date.now().toString().slice(-3)}`; }

exports.createPayment = asyncHandler(async (req, res) => { const data = schema.parse(req.body); const invoice = await Invoice.findById(data.invoiceId); if (!invoice) return res.status(404).json({ success: false, message: 'Facture introuvable' }); if (invoice.status === 'CANCELLED') return res.status(400).json({ success: false, message: 'Impossible de payer une facture annulée' }); const payment = await Payment.create({ ...data, paymentNumber: await uniquePaymentNumber(), contractId: invoice.contractId, companyName: invoice.companyName, currency: data.currency || invoice.currency, status: data.status || 'CONFIRMED' }); const updatedInvoice = await recalculateInvoiceBalance(invoice._id); res.status(201).json({ success: true, data: { payment, invoice: updatedInvoice } }); });
exports.getPayments = asyncHandler(async (req, res) => { const data = await Payment.find().sort({ createdAt: -1 }); res.json({ success: true, count: data.length, data }); });
exports.getPaymentById = asyncHandler(async (req, res) => { const data = await Payment.findById(req.params.id); if (!data) return res.status(404).json({ success: false, message: 'Paiement introuvable' }); res.json({ success: true, data }); });
exports.getPaymentsByInvoice = asyncHandler(async (req, res) => { const data = await Payment.find({ invoiceId: req.params.invoiceId }).sort({ paymentDate: -1, createdAt: -1 }); res.json({ success: true, count: data.length, data }); });
exports.updatePayment = asyncHandler(async (req, res) => { const data = updateSchema.parse(req.body); const payment = await Payment.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true }); if (!payment) return res.status(404).json({ success: false, message: 'Paiement introuvable' }); const invoice = await recalculateInvoiceBalance(payment.invoiceId); res.json({ success: true, data: { payment, invoice } }); });
exports.updatePaymentStatus = asyncHandler(async (req, res) => { const { status } = statusSchema.parse(req.body); const payment = await Payment.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true }); if (!payment) return res.status(404).json({ success: false, message: 'Paiement introuvable' }); const invoice = await recalculateInvoiceBalance(payment.invoiceId); res.json({ success: true, data: { payment, invoice } }); });
exports.deletePayment = asyncHandler(async (req, res) => { const payment = await Payment.findByIdAndDelete(req.params.id); if (!payment) return res.status(404).json({ success: false, message: 'Paiement introuvable' }); const invoice = await recalculateInvoiceBalance(payment.invoiceId); res.json({ success: true, data: { payment, invoice } }); });
