import express from "express";
import cors from "cors";
import ErrorMiddleware from "./middlewares/errorMiddleware.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use(ErrorMiddleware);

export default app;
