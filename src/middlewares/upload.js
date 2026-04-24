import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads/logos";

// garante pasta
fs.mkdirSync(uploadDir, { recursive: true });

const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Arquivo inválido. Apenas imagens são permitidas."));
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `logo-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

export default upload;