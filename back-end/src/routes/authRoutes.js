import express from "express";

const router = express.Router();

import { register } from "../controller/authController.js";

router.post("/register", register);
export default router;
