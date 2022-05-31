const { sign } = require("jsonwebtoken")
const { Op } = require("sequelize")
const configs = require("../../../config")
const sequelize = require("../../../db/db")
const { compareCrypt } = require("../../../modules/bcrypt")
const { users, admin_users } = sequelize.models

class UsersController{

    static async Login(req, res, next) {
        try {
            const { body } = req

            const user = await users.findOne({
                where: {
                    telegram_id: body.tgid
                },
                include: [
                    {
                        model: admin_users
                    }
                ],
                raw: true
            })

            if (!user) {
                res.status(400).json({
                    ok: false,
                    message: "User not found! Check ID!"
                })
            }
            if (user.role != 2) {
                res.status(400).json({
                    ok: false,
                    message: "Not an admin! Access denied!"
                })
            }
            if (!compareCrypt(body.password, user["admin_users.password"])) {
                res.status(400).json({
                    ok: false,
                    message: "Incorrect ID or password!"
                })
            }

            req.user = {
                tgid: user.telegram_id,
                id: user.id,
                role: user.role, 
            }

            next()
        } catch (error) {
            next(error)
        }
    }

    static async GenerateToken(req, res, next) {
        const {
            user,
        } = req;

        const token = sign({
            tgid: user.telegram_id,
            id: user.id,
            role: user.role, 
        }, configs.JWT_KEY)

        res.status(200).json({
            ok: true,
            message: "Logged in succesfully!",
            data: {
                token: token, 
            },
        });

    };


    static async GetAllAdmins(req, res, next) {
        try {
            const { query } = req

            const limit = query.limit || 20
            const page = query.page - 1 || 0
            const offset = page * limit

            const allUsers = await users.findAndCountAll({
                limit: limit,
                offset: offset,
                where: {
                    role: 2
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