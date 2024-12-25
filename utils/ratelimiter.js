import ratelimit from "express-rate-limit"

export const rateLimiter=ratelimit({
    windowMs: 60*60*100,
    limit:100,
    message:"You are sending too many requests. Please try again later.",
    standardHeaders:'draft-7',
    legacyHeaders:false
})