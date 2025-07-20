import brcrypt from 'bcrypt';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import {inngest } from '../innegest/client.js'

export const signup= async (req, res)=>{
    const {email, password,skills=[]} = req.body;
    try {
        const hashed = brcrypt.hash(password, 10)
        const user = await User.create({email, password:hashed,skills})
        //fire inngest event
        await inngest.send({
            name: 'user/signup',
            data: {
                
                email
                
            }
            
        })
        const token = jwt.sign(
            {_id: user._id, role:user.role},
            process.env.JWT_SECRET)
        res.json({user, token});
    } catch (error) {
        res.status(500).json({error:"Signup failed",details: error.message});
    }

}
export const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email})
        if(!user){
            return res.status(401).json({error:"User not found"});
        }
         const isMatch=brcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({error:"Invalid credentials"});
        }
        const token= jwt.sign(
            {_id: user._id, role:user.role},
            process.env.JWT_SECRET
        );
        res.json({user, token});

    }catch(error){
        res.status(500).json({error:"Login failed",details: error.message});
    }

}
export const logout= async (req, res) => {
    try {
       const token=  req.headers.authorization.split(' ')[1]
       if(!token) return res.status(401).json({error:"Unauthorized"});
       jwt.verify(token, process.env.JWT_SECRET,(err, decoded)=>{
            if(err) return res.status(401).json({error:"Unauthorized"});
       })
       res.json({message: "Logout successfully"})
    } catch (error) {
        res.status(500).json({error:"Logout failed",details: error.message});
    }
}
export const updateUser = async (req, res) => {
    const {email,skills=[], role} = req.body;
    try {
        if(!req.user?.role !== 'admin'){
            return res.status(403).json({error:"Forbidden"});

        }
        const user= await User.findByIdAndUpdate({email});
        if(!user){
            return res.status(404).json({error:"User not found"});
        }
        await user.updateOne(
            {email},
            {skills: skills.length ? skills : user.skills, role},
         //  {new: true} // Return the updated user document
        );
        return res.json({message:"User updated successfully"});
    } catch (error) {
        res.status(500).json({error:"Update failed",details: error.message});
        
    }
}

export const getUser = async (req, res) => {
    try {
        if(!req.user.role !== 'admin'){
            return res.status(403).json({error:"Forbidden"});
        }
        const users = await User.find().select('-password');
        if(!users || users.length === 0){
            return res.status(404).json({error:"No users found"});
        }
        return res.json(users);
        
    } catch (error) {
        res.status(500).json({error:"Failed to get user",details: error.message});
        
    }
}

