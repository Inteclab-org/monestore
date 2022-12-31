const {createRequire} = require("module")
const require = createRequire(import.meta.url);

const FilesRouter = require('./files/files')
const OrdersRouter = require('./orders/orders')
const UsersRouter = require('./users/users')
const BannersRouter = require('./landing/banners/banners')

const router = require('express').Router()

router.use("/users", UsersRouter)
router.use("/orders", OrdersRouter)
router.use("/landing/banners", BannersRouter)

module.exports = router