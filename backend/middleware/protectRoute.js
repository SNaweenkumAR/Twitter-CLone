import jwt from "jsonwebtoken"
import User from "../model/user.model.js";

     const protectRoute  =async(req,res,next) =>{
       try {
            const token = req.cookies.jwt;
            if(!token){
                return res.status(400).json({error : "Unauthorized : No token Provided"});
            }


        const decoded = jwt.verify(token , process.env.JWT_SECRET);   
          if(!decoded){
            return res.status(400).json({error : "Unauthorized :Invalid token"});
           }
         

          const user = await User.findOne({_id : decoded.userId}).select("-password")
          if(!user){
            return res.status(400).json({error : "User not Found"});
           }
        
          req.user=user;
          next();


       } catch (error) {
        console.log(`Error in protectRoute  :${error}`);
        res.status(400).json({error : "Internal server error"})
       }
 }

 export default protectRoute