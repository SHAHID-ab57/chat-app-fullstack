const getUserDetailsFromToken = require("../Helper/getUserDetailsFromToken")
const UserModel = require("../Models/UserModel")
async function updateUserDetails(req,res){
try {
    const token = req.cookies.token || ""

    const user = await getUserDetailsFromToken(token)

    const {name,password,profile_picture} =req.body
    const updateUser = await UserModel.updateOne({_id:user._id},{
        name,
        password,
        profile_picture,
    })

    const userInfo = await UserModel.findById(user._id)

    return res.status(200).json({
        success: true,
        message: "User details updated successfully",
        data: userInfo,
        status:200
    })

} catch (error) {
    return res.status(500).json({
         
        message: error.message ||error,
        success: false,
        error: error.stack,
        data: null,
        status:500

    })
}
}

module.exports = updateUserDetails;