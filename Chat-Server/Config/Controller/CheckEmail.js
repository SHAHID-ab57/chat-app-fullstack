const UserModel = require("../Models/UserModel");

async function checkEmail(req,res){
 try {
    const {email} = req.body;
    const CheckingEmail = await UserModel.findOne({email: email}).select("-password")

    if(!CheckingEmail){
        return res.status(400).json({
            message: "User does not exist",
            error: true,
            status: 400
        });
    }

    return res.status(200).json({
        message:"Email is valid",
        success: true,
        data: CheckingEmail,
        status: 200
    })
    
 } catch (error) {
    return res.status(500).json({
        message: error.message || error,
        error: true,
        status:500
    });
 }
}

module.exports = checkEmail;