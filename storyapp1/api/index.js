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

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({
  origin: "https://z-creates-yteg.onrender.com",
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

const upload = multer({ storage: cloudinaryStorage });

// Cloudinary upload endpoint
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json(req.file.path); // Cloudinary returns a URL in `file.path`
});

// (Optional) For pages you can reuse the same middleware
app.post("/api/updatePage", upload.single("file"), (req, res) => {
  res.status(200).json(req.file.path);
  res.status(200).json({
  secure_url: result.secure_url,
  public_id: result.public_id
});
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
