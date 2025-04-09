// Backend: server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const PdfFile = require('./models/PdfFile');
require('dotenv').config();

const app = express();
const port = 5000;
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB error:', err));

// File routes
app.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    const newFile = new PdfFile({
      name: req.file.originalname,
      data: req.file.buffer,
      contentType: req.file.mimetype
    });
    await newFile.save();
    res.json({ message: 'File uploaded successfully!', id: newFile._id });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed' });
  }
});

app.get('/files', async (req, res) => {
  try {
    const files = await PdfFile.find({}, '_id name');
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch files' });
  }
});

app.get('/file/:id', async (req, res) => {
  try {
    const file = await PdfFile.findById(req.params.id);
    if (!file) return res.status(404).send('File not found');
    
    res.set('Content-Type', file.contentType);
    res.send(file.data);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});