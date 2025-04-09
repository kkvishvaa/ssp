const mongoose = require('mongoose');

const PdfFileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  data: { type: Buffer, required: true },
  contentType: { type: String, default: 'application/pdf' },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PdfFile', PdfFileSchema);
