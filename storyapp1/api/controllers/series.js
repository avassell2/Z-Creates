import { db } from "../routes/connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";
import { v2 as cloudinary } from "cloudinary";


import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getImageQuery = "SELECT thumbnail FROM series WHERE id = ?";



export const getSeries = (req, res) => {
  const userId = req.query.userId;
  const token = req.cookies.accessToken;

  let q;
  let values = [];

  if (userId) {
    // Show series by specific user
    q = `SELECT p.*, u.id AS userId, username, name, profilePic 
         FROM series AS p 
         JOIN users AS u ON (u.id = p.userId)  
         WHERE p.userId = ? 
         ORDER BY p.title DESC`;
    values = [userId];
  } else {
    // Show all series
    q = `SELECT p.*, u.id AS userId, username, name, profilePic 
         FROM series AS p 
         JOIN users AS u ON (u.id = p.userId) 
         ORDER BY p.title DESC`;
  }

  // Don't block access if token is missing or invalid
  if (!token) {
    return db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  }

  jwt.verify(token, "secretkey", (err) => {
    if (err) {
      console.warn("Invalid token, but allowing public access to series.");
    }

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};



export const getIndvidSeries = (req, res) => {
  const seriesId = req.params.seriesId;
  const q = "SELECT * FROM series WHERE id=?";

  db.query(q, [seriesId], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("Series not found");
    return res.status(200).json(data[0]); // Return full series data
  });
};



 export const addSeries = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO series(`title`, `desc`, `thumbnail`, `thumbnail_Id`, `userId`) VALUES (?)";
    const values = [
      req.body.title,
      req.body.desc,
      req.body.thumbnail,     // Cloudinary URL
      req.body.thumbnail_Id,   // Cloudinary public_id
      userInfo.id,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Series has been created.");
    });
  });
};



export const deletePost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    // First, get the Cloudinary public_id
    const getImageQuery = "SELECT thumbnail_Id FROM series WHERE id = ?";

    db.query(getImageQuery, [req.params.id], (err, results) => {
      if (err) return res.status(500).json(err);

      const publicId = results[0]?.thumbnail_Id;

      // Delete Cloudinary image if it exists
      if (publicId) {
        cloudinary.uploader.destroy(publicId, (error, result) => {
          if (error) console.error("Cloudinary deletion error:", error);
        });
      }

      // Now delete from the database
      const q = "DELETE FROM series WHERE `id`=? AND `userId` = ?";
      db.query(q, [req.params.id, userInfo.id], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.affectedRows > 0)
          return res.status(200).json("Series has been deleted.");
        return res.status(403).json("You can delete only your series.");
      });
    });
  });
};






 export const updateSeries = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const getImageQuery = "SELECT thumbnail_Id FROM series WHERE id = ?";

    db.query(getImageQuery, [req.body.id], (err, results) => {
      if (err) return res.status(500).json(err);

      const oldPublicId = results[0]?.thumbnail_Id;
      const oldthumbnail = results[0]?.thumbnail;

       //Delete old image from Cloudinary
      if (oldPublicId !== req.body.thumbnail_Id && oldthumbnail !== "https://res.cloudinary.com/dmvlhxlpe/image/upload/v1747322448/no_image_gb87q1.png") {
        cloudinary.uploader.destroy(oldPublicId, (error, result) => {
          if (error) console.error("Cloudinary deletion error:", error);
        });
      }

      const q = `
        UPDATE series AS s 
        JOIN users AS u ON u.id = s.userId
        SET s.title = ?, s.desc = ?, s.thumbnail = ?, s.thumbnail_Id = ?
        WHERE s.id = ? AND s.userId = ?
      `;

      db.query(
        q,
        [
          req.body.title,
          req.body.desc,
          req.body.thumbnail,     // Cloudinary URL
          req.body.thumbnail_Id,   // Cloudinary public_id
          req.body.id,
          userInfo.id,
        ],
        (err, data) => {
          if (err) return res.status(500).json(err);
          if (data.affectedRows > 0) return res.json("Updated!");
          return res.status(403).json("You can update only your post!");
        }
      );
    });
  });
};
