import {inngest} from "../innegest/client.js";
import Ticket from "../models/ticket.js";
import User from "../models/user.js";

export const createTicket = async (req, res) => {
    try {
        const {title, description}= req.body;
        if(!title || !description) {
            return res
            .status(400)
            .json({message: "Title and description are required"});
        }
     const NewTicket= Ticket.create({
            title,
            description,
            createdBy: req.user._id.toString(),
        })
        await inngest.send({
            name: "ticket/created",
            data:{
                ticketId:(await NewTicket)._id.toString(),
                title,
                description,
                createdBy: req.user._id.toString(),
            }
        });
        return res.status(201).json({
            message:"Ticket created and processing Started",
            ticket: NewTicket,
        })
    } catch (error) {
        console.error("Error creating ticket:", error.message);
        return res.status(500).json({message: "Internal server error"});
    }
}

export const getTickets = async (req, res) => {
    try {
        const user= req.user;
        let tickets = [];
        if(user.role !=="user"){
         tickets = await Ticket.find({})
            .populate("assignedTo",["email","_id"])
            .sort({createdAt: -1});
         
        }else{
          tickets =  await Ticket.find({createdBy: user._id})
            .select("title description status createdAt")
            .sort({createdAt: -1})
        }
        return res.status(200)
        .json(tickets);
       
    } catch (error) {
        console.error("Error fetching tickets:", error.message);
        return res.status(500).json({message: "Internal server error"});
        
    }
}

export const getTicket = async (req, res) => {
    try {
       const user= req.user;
       let ticket;
       if(user.role !=="user"){
        ticket = await Ticket.findById(req.params.id)
            .populate("assignedTo",["email","_id"])
            .populate("createdBy",["email","_id"]);
       } 
         else{
          ticket = await Ticket.findOne({
               
                createdBy: user._id,
                _id: req.params.id
          }).select("title description status createdAt");
         }
         if(!ticket) {
            return res.status(404).json({message: "Ticket not found"});
         }
         return res.status(200).json(ticket);
    } catch (error) {
        console.error("Error fetching ticket:", error.message);
        return res.status(500).json({message: "Internal server error"});
    }
};

// Admin-specific functions
export const getAllTicketsAdmin = async (req, res) => {
    try {
        const tickets = await Ticket.find({})
            .populate("assignedTo", ["email", "_id", "skills"])
            .populate("createdBy", ["email", "_id"])
            .sort({ createdAt: -1 });

        // Add status information (active/inactive based on status)
        const ticketsWithStatus = tickets.map(ticket => ({
            ...ticket.toObject(),
            isActive: !['RESOLVED', 'CLOSED', 'CANCELLED'].includes(ticket.status)
        }));

        return res.status(200).json({
            success: true,
            count: tickets.length,
            tickets: ticketsWithStatus
        });
    } catch (error) {
        console.error("Error fetching all tickets:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getTicketsByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        const validStatuses = ['TODO', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'CANCELLED'];
        
        if (!validStatuses.includes(status.toUpperCase())) {
            return res.status(400).json({
                message: "Invalid status",
                validStatuses
            });
        }

        const tickets = await Ticket.find({ status: status.toUpperCase() })
            .populate("assignedTo", ["email", "_id", "skills"])
            .populate("createdBy", ["email", "_id"])
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            status: status.toUpperCase(),
            count: tickets.length,
            tickets
        });
    } catch (error) {
        console.error("Error fetching tickets by status:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const assignTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { moderatorId } = req.body;

        // Verify the moderator exists and has moderator role
        const moderator = await User.findById(moderatorId);
        if (!moderator) {
            return res.status(404).json({ message: "Moderator not found" });
        }

        if (moderator.role !== 'moderator') {
            return res.status(400).json({ 
                message: "User must be a moderator to be assigned tickets" 
            });
        }

        const ticket = await Ticket.findByIdAndUpdate(
            ticketId,
            { 
                assignedTo: moderatorId,
                status: 'IN_PROGRESS'
            },
            { new: true }
        )
        .populate("assignedTo", ["email", "_id", "skills"])
        .populate("createdBy", ["email", "_id"]);

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Ticket assigned successfully",
            ticket
        });
    } catch (error) {
        console.error("Error assigning ticket:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateTicketStatus = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { status } = req.body;
        
        const validStatuses = ['TODO', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'CANCELLED'];
        
        if (!validStatuses.includes(status.toUpperCase())) {
            return res.status(400).json({
                message: "Invalid status",
                validStatuses
            });
        }

        const ticket = await Ticket.findByIdAndUpdate(
            ticketId,
            { status: status.toUpperCase() },
            { new: true }
        )
        .populate("assignedTo", ["email", "_id", "skills"])
        .populate("createdBy", ["email", "_id"]);

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Ticket status updated successfully",
            ticket
        });
    } catch (error) {
        console.error("Error updating ticket status:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
