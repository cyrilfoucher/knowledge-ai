import express from "express";
import cors from "cors";
import ErrorMiddleware from "./middlewares/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use(ErrorMiddleware);

export default app;
