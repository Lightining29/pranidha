import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Disk storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filters
const galleryFilter = (req, file, cb) => {
  const allowedTypes = ['.png', '.jpg', '.jpeg'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, and PNG images are allowed for the gallery'), false);
  }
};

const admissionsFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (file.fieldname === 'birthCertificate') {
    if (ext === '.pdf') {
      cb(null, true);
    } else {
      cb(new Error('Birth certificate must be a PDF file'), false);
    }
  } else if (file.fieldname === 'photo') {
    const allowedImages = ['.png', '.jpg', '.jpeg'];
    if (allowedImages.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Passport size photo must be a JPG, JPEG, or PNG image'), false);
    }
  } else {
    cb(null, true);
  }
};

export const uploadGallery = multer({
  storage,
  fileFilter: galleryFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export const uploadAdmissions = multer({
  storage,
  fileFilter: admissionsFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});
