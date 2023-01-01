 
 

import OrdersController from "../../controllers/web/orders/orders.js"
const { GetAll, GetOne, Verification, SetCost, UpdateStatus } = OrdersController
import protect from "../../middlewares/auth/protect.js"

import express from "express"
const OrdersRouter = express.Router()

OrdersRouter.use(protect)

OrdersRouter.get("/", GetAll)
OrdersRouter.get("/:id", GetOne)
OrdersRouter.put("/cost/:id", SetCost)
OrdersRouter.put("/verification/:id", Verification)
OrdersRouter.put("/status/:id", UpdateStatus)

export default OrdersRouter