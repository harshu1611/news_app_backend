import { Router } from "express";
import { login, register } from "../controllers/AuthController.js";
import { authMiddleware } from "../middlewares/AuthMiddleware.js";
import { getUser, updateProfile } from "../controllers/ProfileController.js";

const router= Router();

router.post("/auth/register", register)
router.post("/auth/login", login)

router.get("/profile",authMiddleware,getUser)
router.put("/profile/:id",authMiddleware,updateProfile)


export default router;