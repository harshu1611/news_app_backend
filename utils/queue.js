import { Queue, Worker } from "bullmq";
import prisma from "../DB/db.config.js";

export const createNewsQueueName= "createNewsQueue";
export const createNewsQueue= new Queue(createNewsQueueName,{
    connection:{
        host:"localhost",
        port:6379
    },
});

export const queueHandler= new Worker(createNewsQueueName, async(job)=>{
    try {
        const news = await prisma.news.create({
            data: job.data,
          });

          return news;
    } catch (error) {
        return error;
    }
}, {
    connection:{
        host:"localhost",
        port:6379
    },
}
)

queueHandler.on("completed", (job, result) => { 
    console.log(`Job completed with result ${result}`);
  });