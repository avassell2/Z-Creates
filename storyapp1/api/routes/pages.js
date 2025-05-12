import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { addPages, getPages, deletePage, updatePage } from "../controllers/pages.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set destination for uploaded page images
const chapterPagesPath = path.join(__dirname, "../public/chapterPages");

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, chapterPagesPath),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// Routes
router.get("/", getPages);
router.post("/", addPages);
router.delete("/:id", deletePage);

// Upload new page
router.post("/:chapterNumber/upload", upload.single("image"), addPages);

// Update image file only (not DB)
router.post("/updatePage", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Just return filename (you already include imageUrl in the PUT request later)
  return res.status(200).json(req.file.filename);
});

// Final update that sets imageUrl in DB
router.put("/pages", upload.single("image"), updatePage);

export default router;
