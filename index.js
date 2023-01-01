 
 
import {tgBot} from "./src/bot.js";
import configs from "./src/config/index.js";
import sequelize from "./src/db/db.js";
import { init } from "./src/db/init.js";
import app from "./src/server.js";

;(async () => {
    try {
        await sequelize.sync({
            force: false
        })
        await init()

    } catch (error) {
        console.log("Sequelize error:", error);
    }
})()

tgBot()

const port = configs.PORT
app.listen(port, () => console.log(`Running on ${port}🚀...`))