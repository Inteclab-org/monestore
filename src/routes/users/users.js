const { GetAll } = require("../../controllers/web/users/users")
const protect = require("../../middlewares/auth/protect")

const UsersRouter = require("express").Router()

UsersRouter.use(protect)

UsersRouter.get("/", GetAll)

module.exports = UsersRouter