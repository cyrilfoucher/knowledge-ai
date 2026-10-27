import express from "express";
import cors from "cors";
import ErrorMiddleware from "./middlewares/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import knowledgesRoutes from "./routes/knowledgeRoutes.js";
import exploreRoute from "./routes/exploreRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import likeRoutes from "./routes/likeRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRoutes);
app.use("/knowledges", knowledgesRoutes);
app.use("/explore", exploreRoute);
app.use("/categories", categoryRoutes);
app.use("/admin", adminRoutes);
app.use("/favorites", favoriteRoutes);
app.use("/likes", likeRoutes);
app.use("/users", userRoutes);
app.use(ErrorMiddleware);

export default app;
