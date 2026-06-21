const multer = require('multer');
const { storage } = require('../utils/cloudinary');

// Only allow image and PDF file types
const fileFilter = (req, file, cb) => {
  const allowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Only PDF, JPG, and PNG files are allowed for ${file.fieldname}.`), false);
  }
};

const upload = multer({
  storage,         // ← Cloudinary storage (was: diskStorage)
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max (was: 5MB)
});

module.exports = upload;
