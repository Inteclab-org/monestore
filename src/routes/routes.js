const UsersRouter = require('./users/users')

const router = require('express').Router()

router.use("/users", UsersRouter)

module.exports = router