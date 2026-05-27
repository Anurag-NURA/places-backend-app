import multer from "multer";

import type { Multer } from "multer";

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = Object.keys(MIME_TYPE_MAP);

  if(!allowed.includes(file.mimetype)) {
    return cb(new Error("UNSUPPORTED_FILE_TYPE"), false);
  }

  cb(null, true);
}

const upload: Multer = multer({
  storage,
  fileFilter,
  limits: { fileSize: 25 * 1024 * 1024 }, // limit file size to 100MB
});

export default upload;
