const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// POST /api/upload
router.post('/', (req, res) => {
  const { image } = req.body;

  if (!image || !image.startsWith('data:image/jpeg;base64,')) {
    return res.status(400).json({ error: 'Invalid image data' });
  }

  const base64Data = image.replace(/^data:image\/jpeg;base64,/, '');
  const filename = `wheel-${Date.now()}.jpg`;
  const filePath = path.join(__dirname, '..', 'uploads', filename);

  fs.writeFile(filePath, base64Data, 'base64', (err) => {
    if (err) {
      console.error('❌ Failed to save image:', err);
      return res.status(500).json({ error: 'Failed to save image' });
    }

    const publicUrl = `${req.protocol}://${req.get('host')}/uploads/${filename}`;
    res.json({ url: publicUrl });
  });
});

module.exports = router;
