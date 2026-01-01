import express from "express";
const router = express.Router();

// Import your Task controller (assuming you have one)
import taskController from "../controllers/task.controller";



router.get("/", taskController.getAllTasks);

router.post("/", taskController.createTask);

// 4. Update a task by ID
router.put("/:id", taskController.updateTask);

// 5. Delete a task by ID
router.delete("/:id", taskController.deleteTask);

export default router;
