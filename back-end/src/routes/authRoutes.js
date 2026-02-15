import express from "express";

const router = express.Router();

import { register } from "../controller/authController.js";
import { login } from "../controller/authController.js";
import { logout } from "../controller/authController.js";

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);;

export default router;
