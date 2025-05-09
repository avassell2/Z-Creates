import { db } from "../routes/connect.js";
import jwt from "jsonwebtoken";



export const searchComicsAndUsers = (req, res) => {
    const searchTerm = req.query.q;
  
    if (!searchTerm) {
      return res.status(400).json({ message: "Search term is required" });
    }
  
    const searchQuery = `
      SELECT 'comic' AS type, id, title AS name FROM series WHERE title LIKE ?
      UNION
      SELECT 'user' AS type, id, username AS name FROM users WHERE username LIKE ?
    `;
  
    const likeSearch = `%${searchTerm}%`;
  
    db.query(searchQuery, [likeSearch, likeSearch], (err, results) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(results);
    });
  };