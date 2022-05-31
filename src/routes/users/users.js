const { GetAll, Login, GenerateToken, GetAllAdmins } = require("../../controllers/web/users/users")
const protect = require("../../middlewares/auth/protect")

const UsersRouter = require("express").Router()

UsersRouter.post("/login", Login, GenerateToken)
UsersRouter.get("/", protect, GetAll)
UsersRouter.get("/admins", protect, GetAllAdmins)

module.exports = UsersRouter