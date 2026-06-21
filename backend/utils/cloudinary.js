const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage: uploads directly to Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'bytebrainiacs/college-ids',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
    // Keep original filename (sanitised) so admin can identify the file
    public_id: (req, file) => {
      const timestamp = Date.now();
      const name = file.originalname.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
      return `${name}_${timestamp}`;
    },
  },
});

/**
 * Delete a file from Cloudinary by its public_id.
 * Extracted from the full URL stored in the DB.
 */
const deleteFromCloudinary = async (url) => {
  if (!url) return;
  try {
    // Cloudinary URL format: https://res.cloudinary.com/<cloud>/image/upload/v.../folder/public_id.ext
    // Extract everything after /upload/v<version>/ and strip extension
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
    if (match) {
      const publicId = match[1]; // e.g. bytebrainiacs/college-ids/filename_123
      await cloudinary.uploader.destroy(publicId, { resource_type: 'auto' });
    }
  } catch (err) {
    console.error(`⚠️  Could not delete Cloudinary file: ${err.message}`);
    // Non-fatal — don't throw, just log
  }
};

module.exports = { cloudinary, storage, deleteFromCloudinary };
