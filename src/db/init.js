 
 

import configs from "../config/index.js"
import { createCrypt } from "../modules/bcrypt.js"
import sequelize from "./db.js"

const { users, admin_users } = sequelize.models

export const init = async function() {

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