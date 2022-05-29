const { GetAll } = require("../../controllers/web/users/users")

const UsersRouter = require("express").Router()

UsersRouter.use("/", GetAll)

module.exports = UsersRouter