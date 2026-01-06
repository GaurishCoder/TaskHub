import { useState, useEffect, useContext } from "react";
import { TaskContext } from "../context/TaskContext";
import type { Task } from "../types/Task";

interface TaskFormProps {
  task?: Task | null;
  onClose: () => void;
  onSuccess: () => void;
}

function TaskForm({ task, onClose, onSuccess }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const taskContext = useContext(TaskContext);

  if (!taskContext) {
    throw new Error("TaskForm must be used within TaskContextProvider");
  }

  const { createTask, updateTask } = taskContext;

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (task) {
        await updateTask(task._id, { title, description });
      } else {
        await createTask(title, description);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto" onClick={onClose}></div>
      <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full p-6 border border-white/20 pointer-events-auto transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">
            {task ? "Edit Task" : "New Task"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition-colors"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100/80 backdrop-blur-sm border border-red-400/50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 bg-white/60 backdrop-blur-sm border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition placeholder:text-gray-400"
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-2 bg-white/60 backdrop-blur-sm border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-none placeholder:text-gray-400"
              placeholder="Enter task description"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-white/60 backdrop-blur-sm border border-gray-300/50 text-gray-700 rounded-lg font-medium hover:bg-white/80 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-indigo-500/30"
            >
              {loading ? "Saving..." : task ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;