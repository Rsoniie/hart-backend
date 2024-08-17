const multer = require('multer');
const express = require('express');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const user = require('../model/user');
require('dotenv').config();

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Initialize the S3 client with AWS SDK v3
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

router.post('/', upload.array('images', 4), async (req, res) => {

    const bucketName = 'hart-user-photos';
    const region = process.env.AWS_REGION;
    try {
    const uploadPromises = req.files.map(file => {
      const params = {
        Bucket: bucketName,
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype, // Set the content type based on the file type
      };

      return s3Client.send(new PutObjectCommand(params));
    });

    const results = await Promise.all(uploadPromises);
    const urls = results.map((result, index) => {
      const key = encodeURIComponent(req.files[index].originalname);
      return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
    });

    res.status(200).json({ message: "Files uploaded successfully", urls });
  } catch (err) {
    console.error('Error uploading files:', err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;