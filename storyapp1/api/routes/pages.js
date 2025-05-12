import express from "express";
import multer from "multer";
import { addPages, getPages, deletePage, updatePage } from "../controllers/pages.js";

const router = express.Router();

router.get("/", getPages);
router.post("/", addPages);
router.delete("/:id", deletePage);
router.put("/", updatePage);

// Set up Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./chapterPages/"); // Ensure the folder exists
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });
  
  const upload = multer({ storage });
  
  // Upload page route
  router.post("/:chapterNumber/upload", upload.single("image"), addPages);

  router.put("/pages", upload.single("image"), updatePage);

export default router;
