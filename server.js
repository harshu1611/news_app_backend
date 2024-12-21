import express from "express"
import "dotenv/config"
import ApiRoutes from "./routers/api.js"
const app= express()

const PORT= process.env.PORT || 8000

app.use(express.json())
app.get("/",(req,res)=>{
    return res.json({message:"Server is running"})
})

app.use("/api",ApiRoutes)

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})