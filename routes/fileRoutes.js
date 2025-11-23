import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import { protect } from "../middleware/authMiddleware.js";
import { uploadFile, getMyFiles, deleteFile } from "../controllers/fileController.js";
import path from "path";

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "mini-drive",
    resource_type: "auto", 
    public_id: file.originalname.split(".")[0],
  }),
});

const upload = multer({ storage });

router.post("/upload", protect, upload.single("file"), uploadFile);
router.get("/my", protect, getMyFiles);
router.delete("/:id", protect, deleteFile);

export default router;
