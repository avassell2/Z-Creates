import express from "express";
const app = express();

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import seriesRoutes from "./routes/series.js";
import chaptersRoutes from "./routes/chapters.js";
import pagesRoutes from "./routes/pages.js";
import searchRoutes from "./routes/search.js";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 3000;

//middlewares
app.use((req, res, next) =>{
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Origin : *");
     res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS, HEAD");
    RES.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

    next();
});
app.use(
    cors({origin: "https://z-creates-yteg.onrender.com",})
);
app.use(cookieParser());

app.use(express.json());



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "../comcreates/src/upload");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  });

  const Chapterstorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "../comcreates/src/chapterPages");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  });

  const upload = multer({ storage: storage });
  
  app.post("/api/upload", upload.single("file"), (req, res) => {
    const file = req.file;
    res.status(200).json(file.filename);
   

  });


  const uploadPage = multer({ storage: Chapterstorage });
  

  app.post("/api/updatePage", uploadPage.single("file"), (req, res) => {
    const file = req.file;
    res.status(200).json(file.filename);
   

  });


  app.use("../comcreates/src/chapterPages", express.static("../comcreates/src/chapterPages"));


  
  

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/series", seriesRoutes);
app.use("/api/chapters", chaptersRoutes);
app.use("/api/pages", pagesRoutes);
app.use("/api/search", searchRoutes);


app.listen(8800, () => {
    console.log("API Working!");
});
//app.listen(PORT, () => {
 // console.log(`Server running on port ${PORT}`);
//});
