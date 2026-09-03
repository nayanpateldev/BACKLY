import express from "express";
// import cors from "cors";
import cookieParser from "cookie-parser";
// import helmet from "helmet";
import morgan from "morgan";
import errorHandler from "./middleware/error.middleware.js";
import dotenv from "dotenv"
import routes from "./routes/index.js"
dotenv.config();
import cors from "cors";


const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.BASE_URL,
    credentials: true,
  })
);


app.get("/", (req, res) =>
{
  res.status(200).json({
    success: true,
    message: "🚀 Server running fine"
  })
})

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    uptime: process.uptime()
  });
});

app.use("/", routes);
app.use(errorHandler);

export default app
