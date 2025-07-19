import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './routes/user.js';




const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth",userRoutes);
mongoose.connect(process.env.MONGO_URI)
 .then(()=>{

 
    console.log("MongoDB connected ");
    app.listen(PORT,()=>console
    .log("server is  at http://localhost:3000"));
    
    
})
 .catch((err)=>console.log("MongoDB  error:", err));
 
