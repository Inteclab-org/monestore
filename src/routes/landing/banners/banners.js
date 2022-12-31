 
 

const { Create, Update, GetAll } = require("../../../controllers/web/banners/banners")
const protect = require("../../../middlewares/auth/protect")

const BannersRouter = require("express").Router()

BannersRouter.get("/", GetAll)
BannersRouter.post("/", protect, Create)
BannersRouter.put("/:id", protect, Update)

module.exports = BannersRouter