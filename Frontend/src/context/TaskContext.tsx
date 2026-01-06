import { createContext, useState } from "react";
import type { ReactNode } from "react";
import api from "../utils/api";
import type { Task } from "../types/Task";

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  fetchTasks: () => Promise<void>;
  createTask: (title: string, description: string) => Promise<void>;
  updateTask: (id: string, taskData: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskContext = createContext<TaskContextType | null>(null);

function TaskContextProvider({ children }: TaskProviderProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTasks = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await api.get<Task[]>("/tasks/");
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (
    title: string,
    description: string
  ): Promise<void> => {
    try {
      setLoading(true);
      const response = await api.post<{ message: string; data: Task }>(
        "/tasks/",
        {
          title,
          description,
          status: "active",
        }
      );
      setTasks((prev) => [...prev, response.data.data]);
    } catch (error) {
      console.error("Failed to create task", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (
    id: string,
    taskData: Partial<Task>
  ): Promise<void> => {
    try {
      setLoading(true);
      const response = await api.put<{ message: string; data: Task }>(
        `/tasks/${id}`,
        taskData
      );
      setTasks((prev) =>
        prev.map((task) => (task._id === id ? response.data.data : task))
      );
    } catch (error) {
      console.error("Failed to update task", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Failed to delete task", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: TaskContextType = {
    tasks,
    loading,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export default TaskContextProvider;
