const { GetAll, GetOne, Verification } = require("../../controllers/web/orders/orders")

const OrdersRouter = require("express").Router()

OrdersRouter.get("/", GetAll)
OrdersRouter.get("/:id", GetOne)
OrdersRouter.put("/verification/:id", Verification)

module.exports = OrdersRouter