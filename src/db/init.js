import { createRequire } from "module";
const require = createRequire(import.meta.url);

const configs = require("../config");
const { createCrypt } = require("../modules/bcrypt");
const sequelize = require("./db");

const { users, admin_users } = sequelize.models

module.exports.init = async function() {

    const admins = await users.count({
        where:{
            role: 2
        }
    })

    if(await admins == 0){
        const user = await users.create({
            full_name: "admin",
            language_code: "uz",
            role: 2,
            telegram_id: configs.ADMIN_ID
        })
    
        const admin = await admin_users.create({
            user_id: user.id,
            password: createCrypt(configs.PASSWORD)
        })
    }
}