import express from "express";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import seriesRoutes from "./routes/series.js";
import chaptersRoutes from "./routes/chapters.js";
import pagesRoutes from "./routes/pages.js";
import searchRoutes from "./routes/search.js";

import { storage as cloudinaryStorage } from "./cloudinary.js";
import { chapterStorage as cloudinaryChapterStorage } from "./cloudinary.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({
  origin: "https://z-creates-yteg.onrender.com",
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());


// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const uploadDir = path.join(__dirname, "public/upload");
const chapterDir = path.join(__dirname, "public/chapterPages");

// File upload setup
const Localstorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const LocalchapterStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, chapterDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});



const upload = multer({ storage: cloudinaryStorage });
const uploadPage = multer({ storage: cloudinaryChapterStorage });


// Cloudinary upload endpoint
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  console.log("Cloudinary file upload result:", req.file);

  res.status(200).json({
    secure_url: req.file.path,        // Cloudinary URL
    public_id: req.file.filename,     // Cloudinary public_id
  });
});

// (Optional) For pages you can reuse the same middleware
app.post("/api/updatePage", uploadPage.single("file"), (req, res) => {
  const file = req.file;
    res.status(200).json(file.filename);

});

// Remove static file serving as Cloudinary serves them
 app.use("/upload", express.static(uploadDir));
 app.use("/chapterPages", express.static(chapterDir));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/series", seriesRoutes);
app.use("/api/chapters", chaptersRoutes);
app.use("/api/pages", pagesRoutes);
app.use("/api/search", searchRoutes);

app.get("/api/test", (req, res) => {
  res.status(200).json({ message: "Test route working!" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
