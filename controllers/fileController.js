import { v2 as cloudinary } from "cloudinary";
import File from "../models/File.js";

import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "mini-drive",
      resource_type: "auto",
    });

    const newFile = new File({
      filename: req.file.originalname,
      owner: req.user._id,
      url: uploadResult.secure_url,
    });

    await newFile.save();

    res.json(newFile);
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Error uploading file" });
  }
};

export const getMyFiles = async (req, res) => {
  try {
    const files = await File.find({ owner: req.user._id });
    res.json(files);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ message: "Error fetching files" });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    if (file.owner.toString() !== req.user._id.toString() && !req.user.isAdmin)
      return res.status(403).json({ message: "Not authorized" });

    const publicId = file.url.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`mini-drive/${publicId}`);

    await file.deleteOne();
    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ message: "Error deleting file" });
  }
};
