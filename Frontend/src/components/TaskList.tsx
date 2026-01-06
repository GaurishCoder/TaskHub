import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TaskContext } from "../context/TaskContext";
import { UserContext } from "../context/UserContext";
import type { Task } from "../types/Task";
import TaskForm from "./TaskForm";

function TaskList() {
  const taskContext = useContext(TaskContext);
  const userContext = useContext(UserContext);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  if (!taskContext || !userContext) {
    throw new Error("TaskList must be used within TaskContextProvider and UserContextProvider");
  }

  const { tasks, loading, fetchTasks, updateTask, deleteTask } = taskContext;
  const { logout } = userContext;
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleToggleStatus = async (task: Task) => {
    try {
      await updateTask(task._id, {
        status: task.status === "active" ? "completed" : "active",
      });
    } catch (error) {
      console.error("Failed to update task status", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(id);
      } catch (error) {
        console.error("Failed to delete task", error);
      }
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const activeTasks = tasks.filter((task) => task.status === "active");
  const completedTasks = tasks.filter((task) => task.status === "completed");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-800">TaskHub</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">My Tasks</h2>
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
          >
            + New Task
          </button>
        </div>

        {showForm && (
          <TaskForm
            task={editingTask}
            onClose={handleFormClose}
            onSuccess={() => {
              handleFormClose();
              fetchTasks();
            }}
          />
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading tasks...</p>
          </div>
        )}

        {!loading && tasks.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 text-lg">No tasks yet. Create your first task!</p>
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Tasks */}
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Active ({activeTasks.length})
              </h3>
              <div className="space-y-4">
                {activeTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onToggleStatus={() => handleToggleStatus(task)}
                    onEdit={() => handleEdit(task)}
                    onDelete={() => handleDelete(task._id)}
                  />
                ))}
                {activeTasks.length === 0 && (
                  <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                    No active tasks
                  </div>
                )}
              </div>
            </div>

            {/* Completed Tasks */}
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Completed ({completedTasks.length})
              </h3>
              <div className="space-y-4">
                {completedTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onToggleStatus={() => handleToggleStatus(task)}
                    onEdit={() => handleEdit(task)}
                    onDelete={() => handleDelete(task._id)}
                  />
                ))}
                {completedTasks.length === 0 && (
                  <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                    No completed tasks
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface TaskCardProps {
  task: Task;
  onToggleStatus: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function TaskCard({ task, onToggleStatus, onEdit, onDelete }: TaskCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">{task.title}</h4>
          <p className="text-gray-600 mb-3">{task.description}</p>
          {task.createdAt && (
            <p className="text-sm text-gray-400">Created: {task.createdAt}</p>
          )}
        </div>
        <div className="ml-4 flex flex-col gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              task.status === "completed"
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {task.status}
          </span>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          onClick={onToggleStatus}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
            task.status === "completed"
              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
              : "bg-green-100 text-green-800 hover:bg-green-200"
          }`}
        >
          {task.status === "completed" ? "Mark Active" : "Mark Complete"}
        </button>
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-lg text-sm font-medium hover:bg-indigo-200 transition"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="px-4 py-2 bg-red-100 text-red-800 rounded-lg text-sm font-medium hover:bg-red-200 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskList;