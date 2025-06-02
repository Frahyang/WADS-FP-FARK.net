import { Ticket } from "../models/TicketModel";
import { User } from "../models/UserModel";
// import { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid'
import { sendTicketResponseEmail } from './EmailAuthController';

const createTicket = async (req:any, res:any) => {
    try {
        const { owner_id } = req.params;
        const { title, description, assignee, type, date_created, priority, status } = req.body;
        
        if (!title || !description || !assignee || !type || !date_created || !priority || !status) {
            return res.status(400).json({ message: "Please input all required ticket data" });
        }
        
        if (!owner_id) {
            return res.status(400).json({ message: "Owner ID is required" });
        }

        const newTicket = await Ticket.create({
            ticket_id: uuidv4(),
            owner_id,
            title,
            description,
            assignee,
            type,
            date_created: new Date(date_created),
            priority,
            status
        });

        return res.status(201).json({ message: "Ticket created successfully", ticket: newTicket });
    } catch (err: any) {
        console.error('Error creating ticket:', err);
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

const getTickets = async (_req: any, res: any) => {
    try {
        const tickets = await Ticket.find().sort({ date_created: -1 });
        return res.status(200).json(tickets);
    } catch (err: any) {
        console.error('Error fetching tickets:', err);
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

const getTicketsByOwnerID = async (req: any, res: any) => {
    try {
        const { owner_id } = req.params;
        if (!owner_id) {
            return res.status(400).json({ message: "Owner ID is required" });
        }

        const tickets = await Ticket.find({ owner_id }).sort({ date_created: -1 });
        return res.status(200).json(tickets);
    } catch (err: any) {
        console.error('Error fetching tickets by owner:', err);
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

const updateStatus = async (req: any, res: any) => {
    try {
        const { ticket_id } = req.params;
        const updates = req.body; // Get all updates from the body

        if (!ticket_id) {
            return res.status(400).json({ message: "Ticket ID is required" });
        }

        // Optionally add validation here to ensure only allowed fields are updated

        const updated = await Ticket.findOneAndUpdate(
            { ticket_id },
            updates, // Pass the updates object directly
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        return res.status(200).json({ message: "Ticket updated successfully", ticket: updated });
    } catch (err: any) {
        console.error('Error updating ticket:', err); // Updated log message
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

const deleteTicket = async (req: any, res: any) => {
    try {
        const { ticket_id } = req.params;

        if (!ticket_id) {
            return res.status(400).json({ message: "Ticket ID is required" });
        }

        const deleted = await Ticket.findOneAndDelete({ ticket_id });

        if (!deleted) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        return res.status(200).json({ message: "Ticket deleted successfully" });
    } catch (err: any) {
        console.error('Error deleting ticket:', err);
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

const sendTicketResponse = async (req: any, res: any) => {
    try {
        const { ticket_id } = req.params;
        const { response } = req.body;

        if (!ticket_id || !response) {
            return res.status(400).json({ message: "Ticket ID and response are required" });
        }

        const ticket = await Ticket.findOne({ ticket_id });
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        const user = await User.findById(ticket.owner_id);
        if (!user) {
            return res.status(404).json({ message: "Ticket owner not found" });
        }

        await sendTicketResponseEmail(user.email, ticket.ticket_id, ticket.title, ticket.description, response);

        return res.status(200).json({ message: "Response sent successfully" });
    } catch (err: any) {
        console.error('Error sending ticket response:', err);
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

export { createTicket, getTickets, getTicketsByOwnerID, updateStatus, deleteTicket, sendTicketResponse };