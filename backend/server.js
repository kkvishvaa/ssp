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

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB error:', err));


// Upload route
app.post('/upload', upload.single('pdf'), async (req, res) => {
  const file = req.file;

  if (!file || file.mimetype !== 'application/pdf') {
    return res.status(400).json({ message: 'Only PDF files allowed.' });
  }

  try {
    const newPdf = new PdfFile({
      name: file.originalname,
      data: file.buffer
    });
    await newPdf.save();
    console.log('Received file:', file);

    res.json({ message: 'PDF uploaded successfully!' });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Upload failed.' });
  }
});

app.get('/files', async (req, res) => {
    try {
      const files = await PdfFile.find({});
      const fileList = files.map(file => ({
        name: file.name,
        data: file.data.toString('base64')
      }));
      res.json(fileList);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch files' });
    }
  });
  

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
