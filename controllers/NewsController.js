import prisma from "../DB/db.config.js";
import { generateUUID } from "../utils/generateUid.js";
import path from "path";
export const createNews = async (req, res) => {
  try {
    const user = req.user;
    const body = req.body;
    const payload = {
        title: body.title,
        content: body.content,
        user_id: user.user.id,
      };
    const newsImage = req.files.image;

    const imgExt=path.extname(newsImage.name);
    const imageName = generateUUID()  + imgExt;
    const imagePath = `${process.cwd()}/public/images/${imageName}`;

    newsImage.mv(imagePath, async (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Failed to upload image" });
      }
    });
    
    console.log(imgExt)
    payload.image = imageName
    if (!body.title || !body.content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const news = await prisma.news.create({
      data: payload,
    });

    return res.status(201).json({ message: "News created", data: news });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error });
  }
};

export const getNews=async(req,res)=>{
    try {
        const page= req.query.page || 1;
        const limit= req.query.limit || 10;
    
        if(page<=0){
            page=1;
        }
    
        if(limit<=0 || limit>100){
            limit=10;
        }
    
        const skip= (page-1)*limit;
    
        const news= await prisma.news.findMany({
            skip:skip,
            take:limit,
            include:{
                user:{
                    select:{
                        name:true,
                        email:true,
                        id:true,
                        profile:true
                    }
                }
            }
        });
        news.forEach((news)=>{
            news.image=`${req.protocol + '://' + req.get('host') + req.originalUrl}/images/${news.image}`
        })
    
        const totalNews= await prisma.news.count();
        const totalPages= Math.ceil(totalNews/limit);
        return res.status(200).json({news:news,metadata:{totalNews:totalNews,totalPages:totalPages,currentPage:page,limit:limit}})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal server error", error:error})
    }
   
}

export const getNewsById=async(req,res)=>{
    try {
        const {id}= req.params;
    const news= await prisma.news.findUnique({
        where:{
            id:Number(id)
        },
        include:{
            user:{
                select:{
                    name:true,
                    email:true,
                    id:true,
                    profile:true
                }
            }
        }
    });
    news.image=`${req.protocol + '://' + req.get('host') + req.originalUrl}/images/${news.image}`
    return res.status(200).json({news:news})
    } catch (error) {
        return res.status(500).json({message:"Internal server error", error:error})
    }
    
}