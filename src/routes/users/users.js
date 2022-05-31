const { GetAll, Login, GenerateToken, GetAllAdmins, GetOne, GetUserOrders } = require("../../controllers/web/users/users")
const protect = require("../../middlewares/auth/protect")

const UsersRouter = require("express").Router()

UsersRouter.post("/login", Login, GenerateToken)
UsersRouter.get("/", protect, GetAll)
UsersRouter.get("/:id", protect, GetOne)
UsersRouter.get("/:id/orders", protect, GetUserOrders)
UsersRouter.get("/admins", protect, GetAllAdmins)

module.exports = UsersRouter