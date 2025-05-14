import { db } from "../routes/connect.js";
import jwt from "jsonwebtoken";

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


    // First, get the current profile image filename from DB
                 
                 db.query(getProfileImageQuery, [userInfo.id], (err, results) => {
                   if (err) return res.status(500).json(err);
             
                   const oldProfileImage = results[0]?.profilePic;
                   const oldProfileImagePath = path.join(__dirname, "../public/upload", oldProfileImage);
             
                   // Delete old image if it exists and the old and requested images are different(user is changing profile image)
                   if (oldProfileImage && (oldProfileImage != req.body.profilePic) && fs.existsSync(oldProfileImagePath)) {
                     fs.unlink(oldProfileImagePath, (unlinkErr) => {
                       if (unlinkErr) console.error("Error deleting old image:", unlinkErr);
                     });
                   }
                  });

// First, get the current cover image filename from DB
                  db.query(getCoverImageQuery, [userInfo.id], (err, results) => {
                    if (err) return res.status(500).json(err);
              
                    const oldCoverImage = results[0]?.coverPic;
                    const oldCoverImagePath = path.join(__dirname, "../public/upload", oldCoverImage);
              
                    // Delete old image if it exists and the old and requested images are different(user is changing cover image)
                    if (oldCoverImage && (oldCoverImage != req.body.coverPic) && fs.existsSync(oldCoverImagePath)) {
                      fs.unlink(oldCoverImagePath, (unlinkErr) => {
                        if (unlinkErr) console.error("Error deleting old image:", unlinkErr);
                      });
                    }
                   });

      

    const q =
      "UPDATE users SET `name`=?,`city`=?,`website`=?,`profilePic`=?,`coverPic`=? WHERE id=? ";

    db.query(
      q,
      [
        req.body.name,
        req.body.city,
        req.body.website,
        
        req.body.profilePic,
        req.body.coverPic,
        userInfo.id,
      ],
      (err, data) => {
        if (err) res.status(500).json(err);
        if (data.affectedRows > 0) return res.json("Updated!");
        return res.status(403).json("You can update only your post!");
      }
    );
  });
};
