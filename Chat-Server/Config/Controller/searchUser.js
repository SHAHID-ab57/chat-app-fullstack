const UserModel = require("../Models/UserModel")
async function searchUser(req, res){
    try {
        const {search} = req.body
        const query = new RegExp(search,"i","g") 
        const user = await UserModel.find({
            $or: [
                { name: query },
                { email: query }
            ]
        }).select("-password") 
        
        return res.json({
            message: "All User found",
            data:user,
            success: true,
            status: 200
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error searching users",
            success: false,
            status:500
        });
    }
}

module.exports = searchUser;