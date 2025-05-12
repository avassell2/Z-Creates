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

const app = express();
const PORT = process.env.PORT || 8080;

// CORS setup
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
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const chapterStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, chapterDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });
const uploadPage = multer({ storage: chapterStorage });

// Upload endpoints
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json(req.file.filename);
});

app.post("/api/updatePage", uploadPage.single("file"), (req, res) => {
  res.status(200).json(req.file.filename);
});

// Static file serving (make files accessible)
app.use("/upload", express.static(uploadDir));
app.use("/chapterPages", express.static(chapterDir));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/series", seriesRoutes);
app.use("/api/chapters", chaptersRoutes);
app.use("/api/pages", pagesRoutes);
app.use("/api/search", searchRoutes);

// Test route
app.get("/api/test", (req, res) => {
  res.status(200).json({ message: "Test route working!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
