import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "./config/db";
import taskRouter from "./routes/task.route";
import userRouter from "./routes/user.route";

dotenv.config(); // ✅ FIRST

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.use("/api/tasks", taskRouter);
app.use("/api/auth", userRouter);

app.get("/", (_req: Request, res: Response) => {
  res.send("<h1> Welcome to TaskHub Backend </h1>");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
