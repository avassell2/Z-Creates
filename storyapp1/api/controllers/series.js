import { db } from "../routes/connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getSeries = (req, res) => {
  const userId = req.query.userId;
 
  const token = req.cookies.accessToken;

  // Define the query and values initially
  let q;
  let values = [];

  if (userId !== "undefined") {
      q = `SELECT p.*, u.id AS userId, username, name, profilePic 
           FROM series AS p 
           JOIN users AS u ON (u.id = p.userId)  
           WHERE p.userId = ? 
           ORDER BY p.title DESC`;
      values = [userId];
  } else {
      q = `SELECT p.*, u.id AS userId, username, name, profilePic 
           FROM series AS p 
           JOIN users AS u ON (u.id = p.userId) 
           ORDER BY p.title DESC`;
  }

  // If there is no token, execute query without authentication
  if (!token) {
      return db.query(q, values, (err, data) => {
          if (err) return res.status(500).json(err);
          return res.status(200).json(data);
      });
  }

  // If there's a token, verify it but don't block access if it's invalid
  jwt.verify(token, "secretkey", (err, userInfo) => {
      if (err) {
          console.warn("Invalid token, but allowing access to series.");
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
        "INSERT INTO series(`title`, `desc`, `thumbnail`, `userId`) VALUES (?)";
      const values = [
        req.body.title,
        req.body.desc,
        req.body.thumbnail,
        
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
  
      const q =
        "DELETE FROM series WHERE `id`=? AND `userId` = ?";
  
      db.query(q, [req.params.id, userInfo.id], (err, data) => {
        if (err) return res.status(500).json(err);
        if(data.affectedRows>0) return res.status(200).json("Series has been deleted.");
        return res.status(403).json("You can delete only your series")
      });
    });
  };



   export const updateSeries = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not authenticated!");
  
    jwt.verify(token, "secretkey", (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");
  
      const q =
        `
        UPDATE series AS s 
       
         JOIN users AS u ON u.id = s.userId
         SET s.title = ?, s.desc = ?, s.thumbnail = ? 
         WHERE s.id = ? `;
  
      db.query(
        q,
        [
          req.body.title,
          req.body.desc,
          req.body.thumbnail,
          req.body.id, // this should be passed from the frontend!
          userInfo.userId,
        ],
        (err, data) => {
          if (err) res.status(500).json(err);
          if (data.affectedRows > 0) return res.json("Updated!");
          return res.status(403).json("You can update only your post!");
        }
      );
    });
  };
  