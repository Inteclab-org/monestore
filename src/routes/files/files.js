 
 

const { GetFile } = require("../../controllers/web/orders/orders")
const protect = require("../../middlewares/auth/protect")

const FilesRouter = require("express").Router()

FilesRouter.use(protect)

// FilesRouter.get("/:file_id", GetFile)

module.exports = FilesRouter