import { db } from "../routes/connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";
import multer from "multer";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getImageQuery = "SELECT imageUrl FROM pages WHERE id = ?";



export const getPages = (req, res) => {
    const chapterId = parseInt(req.query.chapterId);
  
    const q = `
      SELECT p.*, c.id AS chapterId, s.id AS seriesId
      FROM pages AS p
      INNER JOIN chapters AS c ON c.id = p.chapterId
      INNER JOIN series AS s ON s.id = c.seriesId
      WHERE p.chapterId = ?
      ORDER BY p.pageNumber ASC
    `;
  
    db.query(q, [chapterId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  };





 export const addPages = (req, res) => {
       const token = req.cookies.accessToken;
       if (!token) return res.status(401).json("Not logged in!");
     
       jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");
    
        if (!req.file) {
          return res.status(400).json({ message: "No image file uploaded" });
        }
    
        const imageUrl = `${req.file.filename}`;

    
        const q = "INSERT INTO pages(`pageNumber`, `imageUrl`, `chapterId`) VALUES (?)";
        const values = [ req.body.pageNumber,
           `${imageUrl}`,  // Ensure full path
            req.body.chapterId];
    
        db.query(q, [values], (err, data) => {
          if (err) return res.status(500).json(err);
          return res.status(200).json({ message: "Page uploaded successfully", imageUrl });
        });
      });
     };




   export const deletePage = (req, res) => {
             const token = req.cookies.accessToken;
             if (!token) return res.status(401).json("Not logged in!");
           
             jwt.verify(token, "secretkey", (err, userInfo) => {
               if (err) return res.status(403).json("Token is not valid!");


 //delete file
 db.query(getImageQuery, [req.params.id], (err, results) => {
  if (err) return res.status(500).json(err);

  const ImgFileToDelete = results[0]?.imageUrl;
  const ImgFilePath = path.join(__dirname, "../public/chapterPages", ImgFileToDelete);

  // Delete imagefile
  if (ImgFileToDelete && fs.existsSync(ImgFilePath)) {
    fs.unlink(ImgFilePath, (unlinkErr) => {
      if (unlinkErr) console.error("Error deleting old image:", unlinkErr);
    });
  }
})



           
               const q = `
       DELETE p
       FROM pages AS p
       JOIN chapters AS c ON c.id = p.chapterId
       JOIN series AS s ON s.id = c.seriesId
       WHERE p.id = ? AND s.userId = ?
     `;
               
               db.query(q, [req.params.id, userInfo.id], (err, data) => {
                 if (err) return res.status(500).json(err);
                 if(data.affectedRows>0) return res.status(200).json("Page has been deleted.");
                 return res.status(403).json("You can delete only your pages")
               });
             });
           };





          export const updatePage = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    // First, get the current image filename from DB
    const getImageQuery = "SELECT imageUrl FROM pages WHERE id = ?";
    db.query(getImageQuery, [req.body.id], (err, results) => {
      if (err) return res.status(500).json(err);

      const oldImage = results[0]?.imageUrl;
      const oldImagePath = path.join(__dirname, "../public/chapterPages", oldImage);

      // Delete old image if it exists
      if (oldImage && fs.existsSync(oldImagePath)) {
        fs.unlink(oldImagePath, (unlinkErr) => {
          if (unlinkErr) console.error("Error deleting old image:", unlinkErr);
        });
      }

      // Update DB with new imageUrl
      const updateQuery = `
        UPDATE pages AS p
        JOIN chapters AS c ON c.id = p.chapterId
        JOIN series AS s ON s.id = c.seriesId
        JOIN users AS u ON u.id = s.userId
        SET p.imageUrl = ?
        WHERE p.id = ? AND u.id = ?
      `;

      db.query(
        updateQuery,
        [req.body.imageUrl, req.body.id, userInfo.id],
        (err, data) => {
          if (err) return res.status(500).json(err);
          if (data.affectedRows > 0) return res.status(200).json("Updated!");
          return res.status(403).json("You can update only your pages!");
        }
      );
    });
  });
};
