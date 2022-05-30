const { Op } = require("sequelize")
const sequelize = require("../../../db/db")
const { users, orders, order_items } = sequelize.models

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

    static async GetOne(req, res, next) {
        try {
            const { query, params } = req

            const order = await orders.findOne({
                where: {
                    id: params.id
                },
                include: [
                    {
                        model: users
                    },
                    {
                        model: order_items
                    }
                ]
            })

            res.status(200).json({
                ok: true,
                data: {
                    order
                }
            })
        } catch (error) {
            next(error)
        }
    }

    static async SetCost(req, res, next) {
        try {
            const { query, params, body } = req

            const order = await orders.update({
                price: body.cost,
                text: body.text,
                status: 2
            },{
                where: {
                    id: params.id
                }
            })

            res.status(200).json({
                ok: true,
                message: "Order updated"
            })
        } catch (error) {
            next(error)
        }
    }

    static async Verification(req, res, next) {
        try {
            const { query, params, body } = req

            let status = query.verified == true ? 4 : 3

            const order = await orders.update({
                is_paid: query.verified,
                status: status
            },{
                where: {
                    id: params.id
                }
            })

            res.status(200).json({
                ok: true,
                message: "Order updated"
            })
        } catch (error) {
            next(error)
        }
    }
} 

module.exports = OrdersController