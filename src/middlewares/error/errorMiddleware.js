 
 
import ErrorResponse from "../../modules/error/errorResponse.js"

export const errorMiddleware = (req, res, next) => {
    res.error = ErrorResponse
    next()
}