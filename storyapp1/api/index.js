import express from "express";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import seriesRoutes from "./routes/series.js";
import chaptersRoutes from "./routes/chapters.js";
import pagesRoutes from "./routes/pages.js";
import searchRoutes from "./routes/search.js";

const app = express();
const PORT = process.env.PORT || 8800;

// Needed to resolve file paths when using ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ====================
// ✅ CORS Setup
// ====================
const CLIENT_ORIGIN = "https://z-creates-yteg.onrender.com";

app.use(cors({
  origin: CLIENT_ORIGIN,
  credentials: true,
}));

// ✅ Handle preflight (OPTIONS) requests
app.options("*", cors({
  origin: CLIENT_ORIGIN,
  credentials: true,
}));

// ====================
// ✅ Middleware
// ====================
app.use(cookieParser());
app.use(express.json());

// ====================
// ✅ Multer Storage
// ====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "public/upload")),
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
});

const chapterStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "public/chapterPages")),
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
});

const upload = multer({ storage });
const uploadPage = multer({ storage: chapterStorage });

// ====================
// ✅ Upload Endpoints
// ====================
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json(req.file.filename);
});

app.post("/api/updatePage", uploadPage.single("file"), (req, res) => {
  res.status(200).json(req.file.filename);
});

// ====================
// ✅ Static Files for Images
// ====================
app.use("/upload", express.static(path.join(__dirname, "public/upload")));
app.use("/chapterPages", express.static(path.join(__dirname, "public/chapterPages")));

// ====================
// ✅ Routes
// ====================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/series", seriesRoutes);
app.use("/api/chapters", chaptersRoutes);
app.use("/api/pages", pagesRoutes);
app.use("/api/search", searchRoutes);

// ====================
// ✅ Start Server
// ====================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
