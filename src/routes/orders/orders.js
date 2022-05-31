const { GetAll, GetOne, Verification, SetCost } = require("../../controllers/web/orders/orders")
const protect = require("../../middlewares/auth/protect")

const OrdersRouter = require("express").Router()

OrdersRouter.use(protect)

OrdersRouter.get("/", GetAll)
OrdersRouter.get("/:id", GetOne)
OrdersRouter.put("/cost/:id", SetCost)
OrdersRouter.put("/verification/:id", Verification)

module.exports = OrdersRouter