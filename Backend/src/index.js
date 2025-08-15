import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import conversationRoutes from './routes/conversation.routes.js';
import messageRoutes from './routes/message.routes.js';



dotenv.config()

import db from './utils/db.js';
import cookieParser from 'cookie-parser';

const app = express();

const port= process.env.PORT || 8080;


app.use(cors({
    origin: 'https://persona-based-chat-app.vercel.app' ,
    credentials: true,               
     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
     allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/auth",authRoutes );
app.use("/api/v1/conversation",conversationRoutes);
app.use("/api/v1/message/", messageRoutes);


db();


app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})

app.get("/api/v1/healthcheck",(req,res)=>{
    res.send("Server is running")
})
