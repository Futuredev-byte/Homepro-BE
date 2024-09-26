import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import AuthRouter from "./src/routes/auth.js"
import { globalMiddleware } from "./src/middlewares/auth.js";
import { connectDb } from "./src/config/db config.js";
import cors from 'cors'

dotenv.config();

const app = express();

app.use(express.json()); // For parsing req body


// Enable CORS
app.use(cors())

// middlewares
app.use(morgan("dev"));
app.use(globalMiddleware)
 

app.get("/", (req, res) => {
  res.json({ success: true, message: "Welcome to Homepro Backend API" });
});
// Auth Routes
app.use("/api/auth", AuthRouter); // localhost:8080/api/auth/login

const port = process.env.PORT || 3000;
const dbUrl = process.env.MONGODB_URL;

// connect to MongoDB database
connectDb (dbUrl)

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});