const jwt = require('jsonwebtoken');
const User = require('../model/user.model')
// const cookie = require('cookie-parser');

const authMiddleware = {
    protectRoute: async (req, res, next) => {
        try {
            const token = req.cookies.token;
            if (!token) return res.status(401).json({message: "token not exist"});

            const decode = jwt.verify(token, process.env.JWT_SECRET);
            if (!decode) return res.status(401).json({message: "Unauthorized - invaild Token"});

            const user = await User.findById(decode.id).select("-password");
            if (!user || user.isDeleted) return res.status(401).json({message: "user not found"});
            
            req.user = user;
            next();
        } catch (error) {
            console.log(error);
            res.status(500).json({message: "server error"});
        }
    },
    authAdmin: async (req, res, next) => {
        try {
            const token = req.cookies.token;
            if (!token) return res.status(401).json({message: "token not exist"});

            const decode = jwt.verify(token, process.env.JWT_SECRET);
            if (!decode) return res.status(401).json({message: "Unauthorized - invaild Token"});
            
            const user = await User.findById(decode.id).select("-password");
            if (!user || user.isDeleted) return res.status(401).json({message: "user not found"});

            if(!user.isAdmin) return res.status(401).json({message: "error authenticate"});

            req.user = user;
            next();
        } catch (error) {
            console.log(error);
            res.status(500).json({message: "server error"});
        }
    }
}

module.exports = authMiddleware