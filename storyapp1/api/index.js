import express from "express";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import seriesRoutes from "./routes/series.js";
import chaptersRoutes from "./routes/chapters.js";
import pagesRoutes from "./routes/pages.js";
import searchRoutes from "./routes/search.js";

const app = express();
const PORT = process.env.PORT || 8800;


app.use(cors({
  origin: "https://z-creates-yteg.onrender.com",
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());



const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "../comcreates/src/upload"),
  filename: (req, file, cb) => cb(null, Date.now() + file.originalname),
});

const ChapterStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "../comcreates/src/chapterPages"),
  filename: (req, file, cb) => cb(null, Date.now() + file.originalname),
});

const upload = multer({ storage });
const uploadPage = multer({ storage: ChapterStorage });


app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json(req.file.filename);
});

app.post("/api/updatePage", uploadPage.single("file"), (req, res) => {
  res.status(200).json(req.file.filename);
});


app.use("/chapterPages", express.static("../comcreates/src/chapterPages"));


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/series", seriesRoutes);
app.use("/api/chapters", chaptersRoutes);
app.use("/api/pages", pagesRoutes);
app.use("/api/search", searchRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
