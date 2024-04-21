import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import projectRoutes from "./routes/project.route.js"
import cookieParser from "cookie-parser";
import cors from "cors";
import coonectDB from "./config/db.config.js";
import path from 'path';
import jiraroute from './routes/jira.route.js';
import jirAuthRoute from './routes/auth2.js';


dotenv.config();
coonectDB();

const __dirname = path.resolve();

const app = express();



app.use(cors());
app.use(express.json({ limit: '2gb' }));
app.use(express.urlencoded({ limit: '2gb', extended: true }));
app.use(cookieParser());



app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/project", projectRoutes);
app.use('/api', jiraroute);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

app.use("*", (req, res) => {
  res
    .status(404)
    .json({ message: "page not found 404, bad url", status: false });
});

app.listen(process.env.PORT || 3001, () => {
  console.log(
    `Server listening on port ${process.env.PORT || "3001"}`
  );
});