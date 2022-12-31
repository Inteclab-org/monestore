import { createRequire } from "module";
const require = createRequire(import.meta.url);

const { GetAll, Login, GenerateToken, GetAllAdmins, GetOne, GetUserOrders, Profile } = require("../../controllers/web/users/users")
const protect = require("../../middlewares/auth/protect")

const UsersRouter = require("express").Router()

UsersRouter.post("/login", Login, GenerateToken)
UsersRouter.get("/", protect, GetAll)
UsersRouter.get("/admins", protect, GetAllAdmins)
UsersRouter.get("/profile", protect, Profile)
UsersRouter.get("/:id", protect, GetOne)
UsersRouter.get("/:id/orders", protect, GetUserOrders)

module.exports = UsersRouter