import multer from "multer";

const storage = multer.memoryStorage(); // Files will be stored in memory, no disk storage

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
}).any();

export default upload;
