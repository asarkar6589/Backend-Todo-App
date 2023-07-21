import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import connectDatabase from "./data/database.js";
import userRouter from "./routes/user.js"
import taskRouter from "./routes/task.js"
import cors from "cors";

const app = express();

config({
    path: "./data/config.env",
});

//middlewares.
app.use(express.json()); // for getting data from body.
app.use(cookieParser()); // for geting the value of cookie from body.

// app.use(cors({
//     // origin: "http://localhost:3000",
//     origin: process.env.FRONTEND_URL,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
// }));

// Allow requests from 'http://localhost:3000'
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Handle preflight requests
app.options('*', (req, res) => {
    res.status(200).end();
});

app.use(userRouter);
app.use(taskRouter);

app.get("/", (request, response) => {
    response.send("Nicely Working");
})

connectDatabase();

app.listen(process.env.PORT_NUMBER, () => {
    console.log(`Server is working on ${process.env.PORT_NUMBER}`);
});
