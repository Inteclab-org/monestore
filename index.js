const {tgBot} = require("./src/bot");
const configs = require("./src/config");
const sequelize = require("./src/db/db");
const { init } = require("./src/db/init");
const app = require("./src/server");
;
(async () => {
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