 
 

import UsersController from "../../controllers/web/users/users.js"
const { GetAll, Login, GenerateToken, GetAllAdmins, GetOne, GetUserOrders, Profile } = UsersController
import protect from "../../middlewares/auth/protect.js"

import express from "express"
const UsersRouter = express.Router()

UsersRouter.post("/login", Login, GenerateToken)
UsersRouter.get("/", protect, GetAll)
UsersRouter.get("/admins", protect, GetAllAdmins)
UsersRouter.get("/profile", protect, Profile)
UsersRouter.get("/:id", protect, GetOne)
UsersRouter.get("/:id/orders", protect, GetUserOrders)

export default UsersRouter