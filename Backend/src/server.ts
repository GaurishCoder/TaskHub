import express from "express";
import connectDB from "./config/db";
import dotenv from 'dotenv';
const app = express();
const PORT = process.env.PORT ||  3000;

dotenv.config();
connectDB();

app.get("/home",(req,res)=>{
    res.send("<h1>this is home page</h1>")
})

app.get("/",(req,res)=>{
    res.send("welcome to backend")
})

app.listen(PORT,()=>{
    console.log(`Server is listing at ${PORT} on http://localhost:${PORT}`);
})