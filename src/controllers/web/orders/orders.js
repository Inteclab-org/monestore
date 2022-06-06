const { Op } = require("sequelize")
const { sendCost, sendVerification } = require("../../../bot")
const sequelize = require("../../../db/db")
const { users, orders, order_items, transactions } = sequelize.models

class OrdersController{
    static async GetAll(req, res, next) {
        try {
            const { query } = req

            const limit = query.limit || 20
            const page = query.page - 1 || 0
            const offset = page * limit
            const status = query.status 

            let conditions = {}

            if (status != null && status != undefined) {
                conditions.status = status
            }

            const allOrders = await orders.findAll({
                limit: limit,
                offset: offset,
                where: conditions,
                include: [
                    {
                        model: users
                    },
                    {
                        model: order_items,
                        attributes: ["order_id"]
                    }
                ],
                order: [
                    ["updated_at", "DESC"]
                ]
            })
            const count = await orders.count({
                where: conditions
            })

            res.status(200).json({
                ok: true,
                data: {
                    orders: allOrders.rows,
                    count: count
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
                    },
                    {
                        model: transactions
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

            console.log(params);

            const order = await orders.update({
                price: body.cost,
                text: body.text,
                status: 2
            },{
                where: {
                    id: params.id
                },
                returning: true
            })

            const user = await users.findOne({
                where: {
                    id: order[1][0].dataValues.user_id
                },
                raw: true
            })

            await sendCost(user.telegram_id, params.id, body.cost, body.text)

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

            const o = await orders.findOne({
                where: {
                    id: params.id
                },
                include: [
                    {
                        model: transactions
                    }
                ],
                order: [
                    [transactions, "created_at", "DESC"]
                ]
            })

            if(!o.payment_image_id){
                res.status(200).json({
                    ok: false,
                    message: "Order has no payment image!"
                })
                return
            }

            if(body.is_paid && o.transactions[0].valid){
                res.status(200).json({
                    ok: false,
                    message: "Payment already verified!"
                })
                return
            }

            let status = body.is_paid == true ? 4 : 2
            
            const order = await orders.update({
                is_paid: body.is_paid,
                payment_pending: false,
                status: status
            },{
                where: {
                    id: params.id
                },
                returning: true
            })

            const transaction = await transactions.create({
                order_id: order[1][0].dataValues.id,
                price: order[1][0].dataValues.price,
                text: body.text,
                valid: body.is_paid,
            })

            const user = await users.findOne({
                where: {
                    id: order[1][0].dataValues.user_id
                },
                raw: true
            })

            await sendVerification(user.telegram_id, body.is_paid)

            res.status(200).json({
                ok: true,
                message: "Order updated"
            })
        } catch (error) {
            next(error)
        }
    }

    static async UpdateStatus(req, res, next) {
        try {
            const { params, body } = req
            
            const order = await orders.update({
                status: body.status
            },{
                where: {
                    id: params.id
                }
            })

            res.status(200).json({
                ok: true,
                message: "Order status updated"
            })
        } catch (error) {
            next(error)
        }
    }
} 

module.exports = OrdersController