const FilesRouter = require('./files/files')
const OrdersRouter = require('./orders/orders')
const UsersRouter = require('./users/users')

const router = require('express').Router()

router.use("/users", UsersRouter)
router.use("/orders", OrdersRouter)
// router.use("/resources", FilesRouter)

module.exports = router