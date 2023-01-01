 
 

import BannersController from "../../../controllers/web/banners/banners.js"
const { Create, Update, GetAll  } = BannersController
import protect from "../../../middlewares/auth/protect.js"

import express from "express"
const BannersRouter = express.Router()

BannersRouter.get("/", GetAll)
BannersRouter.post("/", protect, Create)
BannersRouter.put("/:id", protect, Update)

export default BannersRouter