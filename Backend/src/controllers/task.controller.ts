import { Request, Response } from "express";
import Task from "../models/task.model";

// GET all tasks 
const getAllTasks = async (req: Request, res: Response) => {
  try {
    const userId:any = req.user._id;
    const tasks = await Task.findById(userId);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
};

