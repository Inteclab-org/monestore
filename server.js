const express = require("express");
const path = require("path");
const { configs } = require("./src/config");
const configs = require('./src/config')
const sequelize = require('./src/db/db');
const { errorMiddleware } = require("./src/middlewares/error/errorMiddleware");
const errorHandler = require("./src/modules/error/errorHandler");
const router = require("./src/routes/routes");
require("dotenv").config()

const port = configs.PORT
const app = express();

;
(async () => {
    try {
        await sequelize.sync({
            force: false
        })
        // await sequelize.sync()

    } catch (error) {
        console.log("Sequelize error:", error);
    }
})()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use("uploads", express.static(path.join(__dirname, "src", "uploads")))

app.use(errorMiddleware)

app.use("/api", router)
app.use(errorHandler)

app.listen(port, _ => console.log(`Running on ${port}🚀...`))