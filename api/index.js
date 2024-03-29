import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import startupRouter from "./routes/startup.route.js";
import cookieParser from "cookie-parser";
import path from "path";
dotenv.config();

//Mongodb connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to DB..");
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();

const app = express();

app.use(express.json());

app.use(cookieParser());

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

//routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/startup", startupRouter);

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

//middleware for handling errors
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
