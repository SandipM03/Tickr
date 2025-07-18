import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';




const app = express();
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
 .then(()=>{

 
    console.log("MongoDB connected ");
    app.listen(PORT,()=>console
    .log("server is  at http://localhost:3000"));
    
    
})
 .catch((err)=>console.log("MongoDB  error:", err));
 
