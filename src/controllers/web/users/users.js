import { createRequire } from "module";
const require = createRequire(import.meta.url);

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
                return
            }
            if (user.role != 2) {
                res.status(400).json({
                    ok: false,
                    message: "Not an admin! Access denied!"
                })
                return
            }
            if (!compareCrypt(body.password, user["admin_users.password"])) {
                res.status(400).json({
                    ok: false,
                    message: "Incorrect ID or password!"
                })
                return
            }

            req.user = {
                tgid: Number(user.telegram_id),
                id: Number(user.id),
                role: Number(user.role),
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
            tgid: Number(user.telegram_id),
            id: Number(user.id),
            role: Number(user.role), 
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

    static async GetOne(req, res, next) {
        try {
            const { params } = req

            const user = await users.findOne({
                where: {
                    id: params.id
                }
            })

            if (!user) {
                throw new res.error(400, "User not found!")
            }

            res.status(200).json({
                ok: true,
                data: {
                    user
                }
            })
        } catch (error) {
            next(error)
        }
    }

    static async Profile(req, res, next) {
        try {

            const user = await users.findOne({
                where: {
                    id: req.user.id
                }
            })

            if (!user) {
                res.status(200).json({
                    ok: false,
                    message: "User not found!"
                })
                throw new res.error(400, "User not found!")
            }

            res.status(200).json({
                ok: true,
                data: {
                    user
                }
            })
        } catch (error) {
            next(error)
        }
    }

    static async GetUserOrders(req, res, next) {
        try {
            const { params } = req

            const user = await users.findOne({
                where: {
                    id: params.id
                },
                raw: true
            })

            if (!user) {
                throw new res.error(400, "User not found!")
            }

            const allUserOrders = await orders.findAndCountAll({
                where: {
                    user_id: user.id
                }
            })

            res.status(200).json({
                ok: true,
                data: {
                    orders: allUserOrders
                }
            })
        } catch (error) {
            next(error)
        }
    }
} 

module.exports = UsersController