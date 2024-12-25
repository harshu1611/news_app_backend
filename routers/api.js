import { Router } from "express";
import { login, register } from "../controllers/AuthController.js";
import { authMiddleware } from "../middlewares/AuthMiddleware.js";
import { getUser, updateProfile } from "../controllers/ProfileController.js";
import { createNews, getNews, getNewsById } from "../controllers/NewsController.js";
import { redisCache } from "../DB/redis.config.js";

const router= Router();

router.post("/auth/register", register)
router.post("/auth/login", login)

router.get("/profile",authMiddleware,getUser)
router.put("/profile/:id",authMiddleware,updateProfile)

router.get("/news", redisCache.route({expire:60*30}), getNews)
router.get("/news/:id",getNewsById)

router.post("/news",authMiddleware,createNews)


export default router;