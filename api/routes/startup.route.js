import express from "express";
import {
  createStartUp,
  deleteStartUp,
  getStartUp,
  getStartUps,
  updateStartUp,
} from "../controllers/startup.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyUser, createStartUp);
router.delete("/delete/:id", verifyUser, deleteStartUp);
router.post("/update/:id", verifyUser, updateStartUp);
router.get("/get/:id", getStartUp);
router.get("/get", getStartUps);

export default router;
