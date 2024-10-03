async function logout(req,res){
    try {

        const cookieOptions = {
            http : true,
            secure : true
        }
        return res.cookie("token","",cookieOptions).status(200).json({
            message: 'Logged out successfully',
            success: true,
            status:200
        });
        
    } catch (error) {
        return res.status(500).json({

            message: error.message || error,
            error:true,
            status:500
        })
    }
}

module.exports = logout;