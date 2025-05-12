import express from "express";
import multer from "multer";
import { addPages, getPages, deletePage, updatePage } from "../controllers/pages.js";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const chapterDir = path.join(__dirname, "public/chapterPages");

router.get("/", getPages);
router.post("/", addPages);
router.delete("/:id", deletePage);
router.put("/", updatePage);

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, chapterDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
  
  const upload = multer({ storage });
  
  // Upload page route
  router.post("/:chapterNumber/upload", upload.single("image"), addPages);

  router.put("/pages", upload.single("image"), updatePage);

router.use("/chapterPages", express.static(chapterDir));

export default router;
