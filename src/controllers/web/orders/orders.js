const { Op } = require("sequelize")
const sequelize = require("../../../db/db")
const { users, orders } = sequelize.models

class OrdersController{
    static async GetAll(req, res, next) {
        try {
            const { query } = req

            const limit = query.limit || 20
            const page = query.page - 1 || 0
            const offset = page * limit

            const allOrders = await orders.findAndCountAll({
                limit: limit,
                offset: offset,
                include: [
                    {
                        model: users
                    }
                ]
            })

            res.status(200).json({
                ok: true,
                data: {
                    orders: allOrders.rows,
                    count: allOrders.count
                }
            })
        } catch (error) {
            next(error)
        }
    }
} 

module.exports = OrdersController