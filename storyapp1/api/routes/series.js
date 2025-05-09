import express from "express";
import { getSeries, addSeries, deletePost, getIndvidSeries, updateSeries} from "../controllers/series.js";

const router = express.Router();

router.get("/", getSeries);
router.get("/find/:seriesId", getIndvidSeries);
router.post("/", addSeries);
router.delete("/:id", deletePost);
router.put("/", updateSeries);

export default router;