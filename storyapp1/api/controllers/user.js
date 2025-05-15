import { db } from "../routes/connect.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getProfileImageQuery = "SELECT profilePic FROM users WHERE id = ?";
const getCoverImageQuery = "SELECT coverPic FROM users WHERE id = ?";



export const getUser = (req, res) => {
    const userId = req.params.userId;
    const q = "SELECT * FROM users WHERE id=?";
  
    db.query(q, [userId], (err, data) => {
      if (err) return res.status(500).json(err);
      const { password, ...info } = data[0];
      return res.json(info);
    });
  }; 




 export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    // Get current user data to find old Cloudinary public_ids
    const getUserQuery = "SELECT profilePicId, coverPicId FROM users WHERE id = ?";
    db.query(getUserQuery, [userInfo.id], async (err, results) => {
      if (err) return res.status(500).json(err);

      const currentUser = results[0];
      const oldProfilePicId = currentUser?.profilePicId;
      const oldCoverPicId = currentUser?.coverPicId;

     
      // Update user in DB
      const q = `
        UPDATE users 
        SET name=?, city=?, website=?, 
            profilePic=?, profilePicId=?, 
            coverPic=?, coverPicId=? 
        WHERE id=?
      `;

      db.query(
        q,
        [
          req.body.name,
          req.body.city,
          req.body.website,
          req.body.profilePic,   // secure_url
          req.body.profilePicId, // public_id
          req.body.coverPic,     // secure_url
          req.body.coverPicId,   // public_id
          userInfo.id,
        ],
        (err, data) => {
          if (err) return res.status(500).json(err);
          if (data.affectedRows > 0) return res.json("Updated!");
          return res.status(403).json("You can update only your profile!");
        }
      );
    });
  });
};
