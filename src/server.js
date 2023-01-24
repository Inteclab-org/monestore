import express from "express";
import path from "path";
const { dirname } = path
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

import cors from "cors";
import { errorMiddleware } from "./middlewares/error/errorMiddleware.js";
import errorHandler from "./modules/error/errorHandler.js";
import fileUpload from "express-fileupload"
import router from "./routes/routes.js";

import { config } from "dotenv"
config()

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}))

app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.use(errorMiddleware)

app.use(cors({ origin: "*" }))
app.use("/api", router)
app.use(errorHandler)

export default app
