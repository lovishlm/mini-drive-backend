import File from "../models/File.js";

export const getAllFiles = async (req, res) => {
  try {
    const files = await File.find().populate("owner", "email");
    const formatted = files.map((f) => ({
      _id: f._id,
      filename: f.filename,
      ownerEmail: f.owner?.email || "Unknown",
      url: f.url,
      createdAt: f.createdAt,
    }));
    res.json(formatted);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ message: "Server error fetching files" });
  }
};
