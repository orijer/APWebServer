const jwt = require("jsonwebtoken");

const User = require("../models/user");

const login = async (userName, password) => {
    const user = await User.findOne({ userName, password });

    if (!user) {
        return null;
    }

    const token = jwt.sign({ userName: user.userName }, 'your_secret_key', { expiresIn: '1h' });
    
    return token;
}

module.exports = { login };