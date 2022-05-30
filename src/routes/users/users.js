const { GetAll } = require("../../controllers/web/users/users")

const UsersRouter = require("express").Router()

UsersRouter.get("/", GetAll)

module.exports = UsersRouter