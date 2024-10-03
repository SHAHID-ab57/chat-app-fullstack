const UserModel = require("../Models/UserModel");
const bcryptjs = require("bcryptjs");

async function resetPassword(req, res) {
    try {
        const { userId, password, confirmPassword } = req.body;

        // Check if both password and confirmPassword are provided
        if (!password || !confirmPassword) {
            return res.status(400).json({
                message: "Both password and confirm password are required",
                error: true,
                status: 400,
            });
        }

        // Check if password and confirmPassword match
        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match",
                error: true,
                status: 400,
            });
        }

        // Hash the new password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Update the user's password in the database
        await UserModel.findByIdAndUpdate(userId, {
            password: hashedPassword,
        });

        return res.status(200).json({
            message: "Password reset successfully",
            success: true,
            status: 200,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Server error",
            error: true,
            status: 500,
        });
    }
}

module.exports = resetPassword;
