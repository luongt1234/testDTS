const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/signup-admin", authController.signupAdmin);
router.put("/updateUser", authMiddleware.protectRoute, authController.updateUser);
router.post("/deleteUser/:id", authMiddleware.authAdmin, authController.deleteUser);

module.exports = router;