import express from "express"
import "dotenv/config"
import ApiRoutes from "./routers/api.js"
import fileUpload from "express-fileupload"
import helmet from "helmet"
import cors from "cors"
import { rateLimiter } from "./utils/ratelimiter.js"
import "./utils/index.js"
const app= express()

const PORT= process.env.PORT || 8000

app.use(express.json())
app.use(fileUpload())
app.use(express.static("public"))
app.use(helmet())
app.use(cors())
app.use(rateLimiter)

app.get("/",(req,res)=>{
    return res.json({message:"Server is running"})
})

app.use("/api",ApiRoutes)

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})