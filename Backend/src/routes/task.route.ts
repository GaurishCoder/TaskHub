import express from "express";
const router = express.Router();

import taskController from "../controllers/task.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

router.get("/", taskController.getAllTasks);

router.post("/", taskController.createTask);

router.put("/:id", taskController.updateTask);

router.delete("/:id", taskController.deleteTask);

export default router;
