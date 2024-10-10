const getUserDetailsFromToken = require("../Helper/getUserDetailsFromToken");

async function userDeatils(req, res) {
  try {
    // Get token from request headers (commonly named 'x-access-token' or 'Authorization')
    const token = req.headers['x-access-token'] ;

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
        success: false,
        status: 401
      });
    }

    const user = await getUserDetailsFromToken(token);
    return res.status(200).json({
      message: "Successfully getting user Details",
      data: user,
      success: true,
      status: 200
    });
  } catch (error) {
    return res.status(404).json({
      message: error.message || error,
      error: true,
      status: 404
    });
  }
}

module.exports = userDeatils;
