import express from "express";
const router = express.Router();

import taskController from "../controllers/task.controller";
import { authMiddleware } from "../middlewares/auth.middleware";


router.get("/print",taskController.printData)

router.get("/", authMiddleware, taskController.getAllTasks);

router.post("/",authMiddleware, taskController.createTask);

router.put("/:id",authMiddleware, taskController.updateTask);

router.delete("/:id",authMiddleware, taskController.deleteTask);

export default router;

