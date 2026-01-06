export interface Task {
  _id: string;
  title: string;
  description: string;
  status: "active" | "completed";
  userId: string;
  createdAt?: string;
}
