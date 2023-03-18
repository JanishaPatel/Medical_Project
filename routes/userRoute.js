const express = require("express");
const router = express.Router();
const authenticate = require("./../middleware/authenticate");

const userController = require("./../controllers/userController");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/getAllUser", authenticate, userController.getAllUser);
router.get("/logOut", userController.logOut);
router.get("/logOutAll",userController.logOutAll);

module.exports = router;
