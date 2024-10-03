const UserModel = require("../Models/UserModel");

async function verifyEmail(req, res) {
    try {
        const { email } = req.body;
        
        // Check if the email exists in the database
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "User with this email does not exist",
                error: true,
                status: 400,
            });
        }

        return res.status(200).json({
            message: "Email verified successfully",
            success: true,
            status: 200,
            userId: user._id, // Pass the user ID to the frontend for step 2
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Server error",
            error: true,
            status: 500,
        });
    }
}

module.exports = verifyEmail;
