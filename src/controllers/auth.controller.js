const User = require('../model/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookies = require('cookies')
const ultis = require('../lip/ultis.lip');

const authController = {
    login: async (req, res) => {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                return res.status(400).json({ message: 'username and password are required' });
            }

            const user = await User.findOne({ username, isDeleted: false });
            if (!user) {
                return res.status(401).json({ message: 'username not exists' });
            }

            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (!isPasswordCorrect) {
                return res.status(401).json({ message: 'Invalid password' });
            }

            ultis.generateToken(user._id, res);

            res.status(200).json({
                message: 'Login successful',
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                }
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    signup: async (req, res) => {
        const { username, email, phonenumber, password, Re_password } = req.body;
        try {
            if (!username || !email || !password || !Re_password) {
                return res.status(400).json({ message: "fill in all information" });
            }
            const userOld = await User.findOne({ username, isDeleted: true })
            if (userOld) {
                userOld.isDeleted = false;
                res.status(201).json({
                    message: "Create user successful",
                    user: {
                        _id: userOld._id,
                        username: userOld.username,
                        email: userOld.email,
                        phoneNumber,
                    }
                });
            }

            if (await User.findOne({ username, isDeleted: false })) {
                return res.status(401).json({ message: "Username has existed" });
            }

            if (password.length < 6) {
                return res.status(401).json({ message: "Password must be at least 6 characters long" });
            }

            if (password !== Re_password) {
                return res.status(401).json({ message: "Password does not match" });
            }

            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            const phoneNumber = phonenumber || "";

            const newuser = new User({
                username,
                email,
                phoneNumber,
                password: hashPassword,
                isAdmin: false,
                isDeleted: false
            });

            await newuser.save();
            ultis.generateToken(newuser._id, res);

            res.status(201).json({
                message: "Create user successful",
                user: {
                    _id: newuser._id,
                    username: newuser.username,
                    email: newuser.email,
                    phoneNumber: newuser.phoneNumber,
                }
            });

        } catch (error) {
            console.log('signup error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    signupAdmin: async (req, res) => {
        const { username, email, phonenumber, password, Re_password } = req.body;
        try {
            if (!username || !email || !password || !Re_password) {
                return res.status(400).json({ message: "fill in all information" });
            }

            const userOld = await User.findOne({ username, isDeleted: true })
            if (userOld) {
                userOld.isDeleted = false;
                res.status(201).json({
                    message: "Create user successful",
                    user: {
                        _id: userOld._id,
                        username: userOld.username,
                        email: userOld.email,
                        phoneNumber,
                    }
                });
            }

            if (await User.findOne({ username, isDeleted: false })) {
                return res.status(401).json({ message: "Username has existed" });
            }

            if (password.length < 6) {
                return res.status(401).json({ message: "Password must be at least 6 characters long" });
            }

            if (password !== Re_password) {
                return res.status(401).json({ message: "Password does not match" });
            }

            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            const phoneNumber = phonenumber || "";

            const newuser = new User({
                username,
                email,
                phoneNumber,
                password: hashPassword,
                isAdmin: true
            });

            await newuser.save();
            ultis.generateToken(newuser._id, res);

            res.status(201).json({
                message: "Create admin successful",
                user: {
                    _id: newuser._id,
                    username: newuser.username,
                    email: newuser.email,
                }
            });

        } catch (error) {
            console.log('signup error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    updateUser: async (req, res) => {
        const { oldPassword, newPassword } = req.body;

        try {
            const userId = req.user._id;

            const user = await User.findById(userId);
            if (!user || user.isDeleted) {
                return res.status(404).json({ message: "User not found" });
            }

            if (oldPassword && newPassword) {
                const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
                if (!isPasswordCorrect) {
                    return res.status(401).json({ message: "Old password is incorrect" });
                }

                if (newPassword.length < 6) {
                    return res.status(400).json({ message: "New password must be at least 6 characters long" });
                }

                const salt = await bcrypt.genSalt(10);
                const hashNewPassword = await bcrypt.hash(newPassword, salt);
                user.password = hashNewPassword;
            }

            await user.save();

            res.status(200).json({
                message: "User updated successfully",
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    phoneNumber: user.phoneNumber
                }
            });

        } catch (error) {
            console.log("Update error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },


    logout: async (req, res) => {
        try {
            res.cookie("token", "", { maxAge: 0 });
            res.status(200).json({ message: "Logged out successfully" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    deleteUser: async (req, res) => {
        try {
            const idUser = req.params.id;
            if (!idUser) return res.status(400).json({ message: "id is not exits" });
            const user = await User.findById(idUser);
            if (!user) return res.status(400).json({ message: "user is not exits" });
            user.isDeleted = true;
            await user.save();
            res.status(200).json({
                message: "User delete successfully",
                user: {
                    _id: user._id,
                    email: user.email,
                    isDeleted: user.isDeleted
                }
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
};

module.exports = authController;
