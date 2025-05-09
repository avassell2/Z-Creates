import express from "express";
import { searchComicsAndUsers } from "../controllers/search.js";

const router = express.Router();

router.get("/", searchComicsAndUsers);

export default router;