const UserModel = require("../Models/UserModel");
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")

async function CheckPassword(req,res){

    try {
        const { password,userId } = req.body;
        
        const user  = await UserModel.findById(userId);
 const VerifyPassword = await bcryptjs.compare(password,user.password)

 if(!VerifyPassword){
     return res.status(400).json({
        message:"Invalid Password",
        error: true,
        status: 400
    });
 }

const tokenData = {
    id: user._id,
    email: user.email
}
// console.log("JWT_SECRET_KEY:", process.env.JWT_SECRET_KEY)
const token = jwt.sign(tokenData,process.env.JWT_SECRET_KEY )
const cookieOptions = {
    http : true,
    secure : true
}

 return res.status(200).json({
       message:"Login Successfully",
       data: user ,
       token: token,
       success: true,
       status: 200
 })

    } catch (error) {
         return res.status(500).json({
            message:error.message || error,
            error: true,
            status: 500
        });
    }
}

module.exports = CheckPassword;