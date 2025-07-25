import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './routes/user.js';
import ticketRoutes from './routes/ticket.js';
import {serve} from 'inngest/express';
import {inngest} from './innegest/client.js';
import {onUserSignup} from './innegest/function/on-signup.js';
import {onTicketCreated} from './innegest/function/on-ticket.js';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth",userRoutes);
app.use("/api/tickets", ticketRoutes);

app.use("/api/innegest",serve({
    client: inngest,
    functions: [onUserSignup, onTicketCreated],
}))

mongoose.connect(process.env.MONGO_URI)
 .then(()=>{
    console.log("MongoDB connected ");
    app.listen(PORT,()=>console.log("server is  at http://localhost:3000"));
})
 .catch((err)=>console.log("MongoDB  error:", err));
 
