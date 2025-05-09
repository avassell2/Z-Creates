import { db } from "../routes/connect.js";
import jwt from "jsonwebtoken";
export const getChapters = (req, res) => {
    //const userId = req.query.userId;
    //const token = req.cookies.accessToken;
    //if (!token) return res.status(401).json("Not logged in!");
  
 //   jwt.verify(token, "secretkey", (err, userInfo) => {
   //   if (err) return res.status(403).json("Token is not valid!");
  
     // console.log(userId);
  
      const q =
       `SELECT c.*, s.id AS seriesId, s.title, s.desc, s.thumbnail, c.chapterTitle, chapterNumber, u.id AS userId, username, u.profilePic
        FROM chapters AS c 
        INNER JOIN series AS s ON (s.id = c.seriesId)
        INNER JOIN users AS u ON ((u.id = s.userId)  )
        WHERE c.seriesId = ? ORDER BY chapterNumber DESC`;
        
      //const values =
        //userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id];
  
        db.query(q, [req.query.seriesId], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
          });
  };



  export const addChapter = (req, res) => {
      const token = req.cookies.accessToken;
      if (!token) return res.status(401).json("Not logged in!");
    
      jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");
    
        const q =
          "INSERT INTO chapters(`chapterTitle`, `chapterNumber`, `seriesId`) VALUES (?)";
        const values = [
          req.body.chapterTitle,
          req.body.chapterNumber,
          req.body.seriesId,
          
          
        ];
    
        db.query(q, [values], (err, data) => {
          if (err) return res.status(500).json(err);
          return res.status(200).json("Chapter has been added.");
        });
      });
    };


     export const deleteChapter = (req, res) => {
        const token = req.cookies.accessToken;
        if (!token) return res.status(401).json("Not logged in!");
      
        jwt.verify(token, "secretkey", (err, userInfo) => {
          if (err) return res.status(403).json("Token is not valid!");
      
          const q = 
           `
  DELETE c
  FROM chapters AS c
  JOIN series AS s ON c.seriesId = s.id
  WHERE c.id = ? AND s.userId = ?
`;
      
          db.query(q, [req.params.id, userInfo.id], (err, data) => {
            if (err) return res.status(500).json(err);
            if(data.affectedRows>0) return res.status(200).json("Series has been deleted.");
            return res.status(403).json("You can delete only your series")
          });
        });
      };
      
    

      export const updateChapter = (req, res) => {
        const token = req.cookies.accessToken;
        if (!token) return res.status(401).json("Not authenticated!");
      
        jwt.verify(token, "secretkey", (err, userInfo) => {
          if (err) return res.status(403).json("Token is not valid!");
      
          const q = `
            UPDATE chapters AS c
            JOIN series AS s ON c.seriesId = s.id
            JOIN users AS u ON u.id = s.userId
            SET c.chapterTitle = ?, c.chapterNumber = ?
            WHERE c.id = ? 
          `;
      
          db.query(
            q,
            [
             
              req.body.chapterTitle,
              req.body.chapterNumber,
              req.body.id, // this should be passed from the frontend!
              userInfo.userId,
       
            ],
            (err, data) => {
              if (err) return res.status(500).json(err);
              if (data.affectedRows > 0) return res.json("Chapter updated!");
              return res.status(403).json("You can update only your own chapters!");
            }
          );
        });
      };