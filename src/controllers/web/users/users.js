const { Op } = require("sequelize")
const sequelize = require("../../../db/db")
const { users } = sequelize.models

class UsersController{
    static async GetAll(req, res, next) {
        try {
            const { query } = req

            const limit = query.limit || 20
            const page = query.page - 1 || 0
            const offset = page * limit

            const allUsers = await users.findAndCountAll({
                limit: limit,
                offset: offset,
                where: {
                    role: {[Op.ne]: 2}
                }
            })

            res.status(200).json({
                ok: true,
                data: {
                    users: allUsers.rows,
                    count: allUsers.count
                }
            })
        } catch (error) {
            next(error)
        }
    }
} 

module.exports = UsersController