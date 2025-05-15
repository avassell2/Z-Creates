 import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

import { addPages, getPages, deletePage, updatePage } from "../controllers/pages.js";
import { storage as cloudinaryStorage } from "../cloudinary.js";

const router = express.Router();

router.get("/", getPages);
router.post("/", addPages);
router.delete("/:id", deletePage);
router.put("/", updatePage);


//const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);

// Set destination for uploaded page images
//const chapterPagesPath = path.join(__dirname, "../public/chapterPages");

// Multer storage config
//const storage = multer.diskStorage({
 // destination: (req, file, cb) => cb(null, chapterPagesPath),
 // filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
//});



//const upload = multer({ storage });
const upload = multer({ storage: cloudinaryStorage });




//  Accept upload in addPages if image is present
router.post("/:chapterNumber/upload", upload.single("image"), addPages);

// Accept upload in updatePage
router.put("/pages", upload.single("image"), updatePage);

export default router;
