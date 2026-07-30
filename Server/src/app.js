import express from "express";
// import cors from "cors";
// import helmet from "helmet";
import morgan from "morgan";
import errorHandler from "./middleware/error.middleware.js";
import dotenv from "dotenv"
import routes from "./routes/index.js"
dotenv.config();

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => 
{
  res.status(200).json({
    success: true,
    message: `Server is running on Port: ${process.env.PORT}`
  })
})

app.use("/", routes);
app.use(errorHandler);

export default app