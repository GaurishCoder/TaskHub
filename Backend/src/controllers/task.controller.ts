import { Request, Response } from "express";
import Task, { ITask } from "../models/task.model";

const getAllTasks = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user._id;

    const tasks = await Task.find({ user: userId });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching tasks",
      error,
    });
  }
};

const createTask = async (req: Request, res: Response) => {
  try {
    const task: ITask = req.body;

    const data = await Task.create(task);

    res.status(201).json({
      message: "Task created successfully",
      data,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create task",
      error,
    });
  }
};

const updateTask = async (req: Request, res: Response) => {
  try {
    const taskData: ITask = req.body;
    if (!taskData) {
      return res.status(400).json({ message: "Undefined Data" });
    }
    const taskId = req.params.id;
    
    const data = await Task.findByIdAndUpdate(taskId, taskData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ message: "success", data: data });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update task",
      error,
    });
  }
};
const deleteTask = async (req: Request, res: Response) => {
  try {
    
    const taskId = req.params.id;
    
    await Task.findByIdAndDelete(taskId);

    res.status(200).json({ message: "Deleted Successfully"});
  } catch (error) {
    res.status(400).json({
      message: "Failed to update task",
      error,
    });
  }
};



export default {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask
};
