 
import jwt from "jsonwebtoken"
const { verify } = jwt
import config from "../../config/index.js"
import sequelize from "../../db/db.js"
  
const { users } = sequelize.models
  
  const protect = async (req, res, next) => {
    try {
      let authToken = ""
  
      const authorization = req.headers.authorization
  
      if (authorization && authorization.startsWith("Bearer ")) {
        authToken = authorization.split(" ")[1];
      }
      if (!authToken) throw new res.error(401, "Please login in to get access")
  
      const decodedToken = verify(authToken, config.JWT_KEY);
  
      if(!decodedToken) {
        res.status(400).json({
          ok: false,
          message: "Unathorized!"
        })
        throw new res.error(400, "Unauthorized!")
      }
      
      const user = await users.findByPk(decodedToken.id, {
        attributes: ["id", "telegram_id", "full_name", "language_code", "phone_number", "role"],
        raw: true
      })
  
      if (!user) {
        res.status(400).json({
          ok: false,
          message: "User does not exist!"
        })
        throw new res.error(401, "User does not exist")
      }

      req.user = {
          tgid: Number(user.telegram_id),
          id: Number(user.id),
          role: Number(user.role),
      }
      req.decodedToken = decodedToken;
  
      next()
  
    } catch (error) {
      console.log(error);
      res.status(400).json({
        ok: false,
        message: "Unathorized!"
      })
      return
    }
  }
  
  export default protect