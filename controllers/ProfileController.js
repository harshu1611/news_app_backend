import { generateUUID } from "../utils/generateUid.js";
import prisma from "../DB/db.config.js";

export const getUser=async(req,res)=>{
    const user= req.user;   
    return res.status(200).json({user:user});
}

export const updateProfile=async(req,res)=>{
    try {
        const {id}= req.params
        const user= req.user;

    if(!req.files){
        return res.status(400).json({message:"No file uploaded"})  
    }
    if(!req.files.profile){
        return res.status(400).json({message:"Profile image is required"})
    }
    const profileImage=req.files.profile;

    const imgExtension= profileImage.name.split(".")[1];
    const imageName= generateUUID()+"."+imgExtension;
    const imagePath=`${process.cwd()}/public/images/${imageName}`;

    profileImage.mv(imagePath,async(err)=>{
        if(err){
            console.log(err)
            return res.status(500).json({message:"Failed to upload image"})
        }

       const data= await prisma.users.update({
            where:{
                id:Number(id)
            },
            data:{
                profile:imageName
            }
        })
        return res.status(200).json({
            message:"Profile image updated successfully",
            data
        })
    })
   
   
    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }
    
}