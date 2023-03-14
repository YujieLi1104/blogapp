/** @format */

import multer from 'multer';
import sharp from 'sharp';
import path from 'path';

// Storage
const fileStorage = multer.memoryStorage();

// File type checking
const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    // rejected files
    cb(
      {
        message: 'Unsupported file format',
      },
      false
    );
  }
};

const profilePhotoUpload = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1000000,
  },
});

// Image resizing
const resizeImage = async (req, res, next) => {
  // check if there is no file
  if (!req.file) {
    return next();
  }

  req.file.filename = `user-${Date.now()}-${req.file.originalname}`;

  await sharp(req.file.buffer)
    .resize(250, 250)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(path.join(`public/images/profile/${req.file.filename}`));

  next();
};

export { profilePhotoUpload, resizeImage };
