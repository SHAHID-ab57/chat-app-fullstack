const UserModel = require("../Models/UserModel")
const bcryptjs = require("bcryptjs")

async function registerUser(req,res){

    try {
        const {name,email,password,profile_picture} = req.body

        const checkEmail = await UserModel.findOne({email})

        if (checkEmail){
            return res.status(400).json({
                message:"Email already Exist",
                error: true            
            })
        }

        // password in to hashPassword format 
       let hashedPassword = undefined
       if (password){
        const salt = await bcryptjs.genSalt(10)
         hashedPassword = await bcryptjs.hash(password, salt)
       }
        const payload = {
            name,
            email,
            profile_picture,
            password: hashedPassword
        }

        const newUser = new UserModel(payload)
        const  userSave = await newUser.save()

       return res.status(201).json({
            message: "User Register Successfully",
            data: userSave,
            success: true,
            status:201
        })

    } catch (error) {
        return res.status(404).json({
            message: error.message||error,
            error: true ,
            status: 404
        })
    }
}

module.exports = registerUser;