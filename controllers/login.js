const loginService = require("../services/login");

const login = async (req, res) => {
    const result = await loginService.login(req.body.userName, req.body.password);
    if (result == null)
        return res.status(404).json({ message: 'Invalid username or password' });
    
    res.json({ token: result });
};

module.exports = { login };