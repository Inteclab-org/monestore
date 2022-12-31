import { createRequire } from "module";
const require = createRequire(import.meta.url);
const express = require("express");
const path = require("path");
const cors = require("cors");
const configs = require('./config')
const sequelize = require('./db/db');
const { errorMiddleware } = require("./middlewares/error/errorMiddleware");
const errorHandler = require("./modules/error/errorHandler");
const fileUpload = require("express-fileupload")
const router = require("./routes/routes");
require("dotenv").config()

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

module.exports = app
