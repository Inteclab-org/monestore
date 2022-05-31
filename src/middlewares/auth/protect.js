const {
    verify
  } = require("jsonwebtoken")

  const config = require("../../config")
  const ErrorResponse = require("../../modules/error/errorResponse");
  
  const { Op } = require("sequelize");
  
  const {
    models: {
      users
    }
  } = require("../../db/db");
  
  const protect = async (req, res, next) => {
    try {
      let authToken = ""
  
      const authorization = req.headers.authorization
  
      if (authorization && authorization.startsWith("Bearer ")) {
        authToken = authorization.split(" ")[1];
      }
      if (!authToken) throw new res.error(401, "Please login in to get access")
  
      const decodedToken = verify(authToken, config.JWT_KEY);
  
      if(!decodedToken) throw new res.error(400, "Unauthorized!")
      
      const user = await users.findByPk(decodedToken.user_id, {
        attributes: ["telegram_id", "full_name", "language_code", "phone_number", "role"],
        raw: true
      })
  
      if (!user) throw new res.error(401, "User does not exist")

      req.user = user; 
      req.decodedToken = decodedToken;
  
      next()
  
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Unathorized!"
      })
      return
    }
  }
  
  module.exports = protect