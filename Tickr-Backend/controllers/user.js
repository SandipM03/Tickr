import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import {inngest } from '../innegest/client.js'

export const signup= async (req, res)=>{
    const {email, password, skills = []} = req.body;
    try {
        // if (!email || !password) {
        //     return res.status(400).json({ error: "Email and password are required" });
        // }
        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashed, skills });
        //fire inngest event
        await inngest.send({
            name: 'user/signup',
            data: { email }
        });
        const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_SECRET
        );
        res.json({ user, token });
    } catch (error) {
        res.status(500).json({ error: "Signup failed", details: error.message });
    }

}
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // if (!email || !password) {
        //     return res.status(400).json({ error: "Email and password are required" });
        // }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_SECRET
        );
        res.json({ user, token });
    } catch (error) {
        res.status(500).json({ error: "Login failed", details: error.message });
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

// Get all users (Admin only)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 });
        
        return res.json({
            success: true,
            count: users.length,
            users
        });
        
    } catch (error) {
        res.status(500).json({
            error: "Failed to get users",
            details: error.message
        });
    }
};

// Get users by role (Admin only)
export const getUsersByRole = async (req, res) => {
    try {
        const { role } = req.params;
        
        if (!['user', 'moderator'].includes(role)) {
            return res.status(400).json({
                error: "Invalid role. Must be 'user' or 'moderator'"
            });
        }

        const users = await User.find({ role })
            .select('-password')
            .sort({ createdAt: -1 });
        
        return res.json({
            success: true,
            role,
            count: users.length,
            users
        });
        
    } catch (error) {
        res.status(500).json({
            error: "Failed to get users by role",
            details: error.message
        });
    }
};

// Promote user to moderator (Admin only)
export const promoteToModerator = async (req, res) => {
    try {
        const { userId } = req.params;
        const { skills = [] } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.role === 'admin') {
            return res.status(400).json({ 
                error: "Cannot modify admin users" 
            });
        }

        if (user.role === 'moderator') {
            return res.status(400).json({ 
                error: "User is already a moderator" 
            });
        }

        // Update user role and skills
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { 
                role: 'moderator',
                skills: skills.length > 0 ? skills : user.skills 
            },
            { new: true, select: '-password' }
        );

        return res.json({
            success: true,
            message: "User promoted to moderator successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error('Promote to moderator error:', error);
        res.status(500).json({
            error: "Failed to promote user",
            details: error.message,
            stack: error.stack
        });
    }
};

// Add/Update user skills (Admin only)
export const updateUserSkills = async (req, res) => {
    try {
        const { userId } = req.params;
        const { skills } = req.body;

        if (!skills || !Array.isArray(skills)) {
            return res.status(400).json({
                error: "Skills must be provided as an array"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.role === 'admin') {
            return res.status(400).json({ 
                error: "Cannot modify admin users" 
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { skills },
            { new: true, select: '-password' }
        );

        return res.json({
            success: true,
            message: "User skills updated successfully",
            user: updatedUser
        });

    } catch (error) {
        res.status(500).json({
            error: "Failed to update user skills",
            details: error.message
        });
    }
};
export const updateUser = async (req, res) => {
    const {email, skills = [], role} = req.body;
    try {
        // Fix: Correct admin permission check
        if(req.user?.role !== 'admin'){
            return res.status(403).json({error:"Forbidden: Only admins can update users"});
        }

        // Admin can only promote users to moderator, not to admin
        if(role === 'admin'){
            return res.status(403).json({error:"Forbidden: Cannot promote users to admin role"});
        }

        // Find user by email
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({error:"User not found"});
        }

        // Prepare update data
        const updateData = {};
        if(skills.length > 0) {
            updateData.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
        }
        if(role && ['user', 'moderator'].includes(role)) {
            updateData.role = role;
        }

        // Update user
        const updatedUser = await User.findOneAndUpdate(
            {email},
            updateData,
            {new: true, select: '-password'}
        );

        return res.json({
            message:"User updated successfully", 
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({error:"Update failed",details: error.message});
    }
}

export const getUser = async (req, res) => {
    try {
        // Fix: Correct admin permission check
        if(req.user?.role !== 'admin'){
            return res.status(403).json({error:"Forbidden: Only admins can view all users"});
        }
        
        const users = await User.find().select('-password');
        if(!users || users.length === 0){
            return res.status(404).json({error:"No users found"});
        }
        return res.json(users);
        
    } catch (error) {
        res.status(500).json({error:"Failed to get users",details: error.message});
    }
}
        


