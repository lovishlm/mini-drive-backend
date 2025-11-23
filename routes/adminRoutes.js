import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { getAllFiles } from "../controllers/adminController.js";

const router = express.Router();

router.get("/files", protect, adminOnly, getAllFiles);

export default router;
