import express from "express";
import connectDB from "./config/db";
import dotenv from 'dotenv';
import taskRouter from "./routes/task.route";
const app = express();
const PORT = process.env.PORT ||  3000;

dotenv.config();
connectDB();

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use('/api/tasks', taskRouter);


app.get("/home",(req,res)=>{
    res.send("<h1>this is home page</h1>")
})

app.get("/",(req,res)=>{
    res.send("welcome to backend")
})

app.listen(PORT,()=>{
    console.log(`Server is listing at ${PORT} on http://localhost:${PORT}`);
})