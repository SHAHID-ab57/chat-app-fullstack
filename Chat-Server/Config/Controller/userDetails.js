const getUserDetailsFromToken = require("../Helper/getUserDetailsFromToken")

async function userDeatils(req,res){
try {
    
    const token = req.cookies.token || ""

    const user = await getUserDetailsFromToken(token)
    return res.status(200).json({
        message:"Successfully getting user Details" ,
        data: user,
      success:true ,
      status:200
     })
} catch (error) {
    return res.status(404).json({
        message:error.message || error,
        error: true,
        status:404
    })
}
}

module.exports = userDeatils;