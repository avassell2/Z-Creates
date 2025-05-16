import { db } from "../routes/connect.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";


// Get pages by chapter
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

// Add new page
export const addPages = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    try {
      const q = "INSERT INTO pages (`pageNumber`, `imageUrl`, `publicId`, `chapterId`) VALUES (?)";
      const values = [
        req.body.pageNumber,
        req.file.path,         // already uploaded to Cloudinary
        req.file.filename,     // public_id from multer-storage-cloudinary
        req.body.chapterId,
      ];

      db.query(q, [values], (err, data) => {
        if (err) {
          console.error("DB insert error:", err);
          return res.status(500).json(err);
        }
        return res.status(200).json({ message: "Page uploaded", imageUrl: req.file.path });
      });
    } catch (uploadErr) {
      console.error("Upload error:", uploadErr);
      return res.status(500).json(uploadErr);
    }
  });
};

// Delete a page
export const deletePage = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const getImageQuery = "SELECT publicId FROM pages WHERE id = ?";
    db.query(getImageQuery, [req.params.id], (err, results) => {
      if (err) return res.status(500).json(err);
      const publicId = results[0]?.publicId;

      // Delete from Cloudinary
      if (publicId) {
       cloudinary.uploader.destroy(publicId, (error) => {
          if (error) console.error("Cloudinary deletion error:", error);
        });
      }

      const q = `
        DELETE p
        FROM pages AS p
        JOIN chapters AS c ON c.id = p.chapterId
        JOIN series AS s ON s.id = c.seriesId
        WHERE p.id = ? AND s.userId = ?
      `;

      db.query(q, [req.params.id, userInfo.id], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.affectedRows > 0) return res.status(200).json("Page deleted");
        return res.status(403).json("You can delete only your pages");
      });
    });
  });
};

// Update a page's image
export const updatePage = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const getImageQuery = "SELECT publicId FROM pages WHERE id = ?";
    db.query(getImageQuery, [req.body.id], async (err, results) => {
      if (err) return res.status(500).json(err);

      const oldPublicId = results[0]?.publicId;

      // ✅ Delete old image from Cloudinary
      if (oldPublicId) {
       cloudinary.uploader.destroy(oldPublicId, (error) => {
          if (error) console.error("Cloudinary deletion error:", error);
        });
      }

      try {
        // ✅ Use info from already uploaded file
        const imageUrl = req.file?.path;
        const publicId = req.file?.filename;

        const updateQuery = `
          UPDATE pages AS p
          JOIN chapters AS c ON c.id = p.chapterId
          JOIN series AS s ON s.id = c.seriesId
          JOIN users AS u ON u.id = s.userId
          SET p.imageUrl = ?, p.publicId = ?
          WHERE p.id = ? AND u.id = ?
        `;

        db.query(
          updateQuery,
          [imageUrl, publicId, req.body.id, userInfo.id],
          (err, data) => {
            if (err) return res.status(500).json(err);
            if (data.affectedRows > 0) return res.status(200).json("Page updated");
            return res.status(403).json("You can update only your pages!");
          }
        );
      } catch (uploadErr) {
        return res.status(500).json(uploadErr);
      }
    });
  });
};

