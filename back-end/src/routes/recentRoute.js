import express from "express";
import { recent } from "../controller/recentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/played", authMiddleware, recent);
router.post("/played", authMiddleware, recent);

export default router;
