//  server


import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import AuthRouter from "./src/routes/auth.js";
import PropertyRouter from "./src/routes/property.js";
import propertiesRoutes from './src/routes/property.js'; // Import properties routes here
import { connectDb } from "./src/config/db config.js";
import cors from "cors";

dotenv.config();

const app = express();

app.use(express.json()); // For parsing req body
app.use(cors()); // Enable CORS

// Middlewares
app.use(morgan("dev"));

// Welcome route
app.get("/", (req, res) => {
  res.json({ success: true, message: "Welcome to Homepro Backend API" });
});

// Auth Routes
app.use("/api/auth", AuthRouter); // localhost:8000/api/auth/login
app.use("/api", PropertyRouter); // localhost:8000/api/create

// Property Routes
app.use('/api/properties', propertiesRoutes); // localhost:8000/api/properties

const port = process.env.PORT || 8000;
const dbUrl = process.env.MONGODB_URL;

// Connect to MongoDB database
connectDb(dbUrl)

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});