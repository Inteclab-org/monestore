import OrdersRouter from './orders/orders.js'
import UsersRouter from './users/users.js'
import BannersRouter from './landing/banners/banners.js'

import express from 'express'
const router = express.Router()

router.use("/users", UsersRouter)
router.use("/orders", OrdersRouter)
router.use("/landing/banners", BannersRouter)

export default router