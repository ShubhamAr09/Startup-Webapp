import express from "express";
import {
  google,
  register,
  signOut,
  signin,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/sign-in", signin);
router.post("/google", google);
router.get("/sign-out", signOut);

export default router;
