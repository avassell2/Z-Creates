import express from "express";
import {getChapters } from "../controllers/chapter.js";
import {addChapter } from "../controllers/chapter.js";
import {deleteChapter } from "../controllers/chapter.js";
import {updateChapter } from "../controllers/chapter.js";

const router = express.Router()

router.get("/", getChapters)
router.post("/", addChapter);
router.delete("/:id", deleteChapter);
router.put("/:id", updateChapter);



export default router