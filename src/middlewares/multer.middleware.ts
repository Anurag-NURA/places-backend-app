import multer from "multer";
import type { Multer } from "multer";

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
    // specify the directory to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
    // can customize the filename if needed
  },
});

const upload: Multer = multer({
  limits: { fileSize: 100 * 1024 * 1024 }, // limit file size to 100MB
  storage: storage,
});

export default upload;
