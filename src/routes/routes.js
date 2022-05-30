const OrdersRouter = require('./orders/orders')
const UsersRouter = require('./users/users')

const router = require('express').Router()

router.use("/users", UsersRouter)
router.use("/orders", OrdersRouter)

module.exports = router