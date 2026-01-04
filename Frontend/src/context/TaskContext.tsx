import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import axios from "axios";
import type { Task } from "../types/Task";

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;



interface TaskContextType {
  task: Task[];
  loading: boolean;
  fetchData: () => Promise<void>;
  setTask: React.Dispatch<React.SetStateAction<Task[]>>;
}

interface TaskProviderProps {
  children: ReactNode;
}

interface TaskResponse {
  tasks: Task[];
}


export const TaskContext = createContext<TaskContextType | null>(null);



function TaskContextProvider({ children }: TaskProviderProps) {
  const [task, setTask] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function fetchData(): Promise<void> {
    try {
      setLoading(true);

      const response = await axios.get<TaskResponse>(
        `${BACKEND_URL}/tasks`,
        { withCredentials: true }
      );

      setTask(response.data.tasks);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const value: TaskContextType = {
    task,
    loading,
    fetchData,
    setTask,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

export default TaskContextProvider;
