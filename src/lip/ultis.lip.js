const jwt = require('jsonwebtoken');

const ultis = {
    generateToken: (userid, res) => {
        const token = jwt.sign({ id: userid }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: "Strict",
            maxAge: 3600000,
        });
        return token;
    },
}

module.exports = ultis;