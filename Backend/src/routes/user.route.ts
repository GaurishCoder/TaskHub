import express from "express";
const router = express.Router();

import userController from "../controllers/user.controller";


router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/logout", userController.logoutUser);
router.get("/verify", userController.verifyToken);

export default router;
