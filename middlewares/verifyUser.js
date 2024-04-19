const jwt = require('jsonwebtoken');
const User = require('../models/User');
const SECRET_KEY = process.env.SECRET_KEY;

const verifyUser = async (req, res, next) => {
    //fetch jwt token from cookies
    const token = req.cookies["authToken"];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized access" });
    }

    try {
        //verify the jwt token with the secret key
        const verify = jwt.verify(token, SECRET_KEY);
        //verify if the user exists
        const user = await User.findOne({ _id: verify.userId, isVerified: true });
        if (!user) {
            return res.status(401).json({ message: "User does not exist" });
        }
        //store the user object in the request and call next()
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ name: error.name, message: error.message });
    }
}
module.exports = {
    verifyUser
}