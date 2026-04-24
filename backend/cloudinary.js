const cloudinaryLib = require('cloudinary').v2;
const multer = require('multer');

cloudinaryLib.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Store file in memory as a buffer (no disk, no multer-storage-cloudinary)
const upload = multer({ storage: multer.memoryStorage() });

// Upload a buffer directly to Cloudinary and return the secure URL
function uploadBuffer(buffer, folder = 'shahedny_uploads') {
  return new Promise((resolve, reject) => {
    const stream = cloudinaryLib.uploader.upload_stream(
      { folder, resource_type: 'auto' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

module.exports = { upload, uploadBuffer };
