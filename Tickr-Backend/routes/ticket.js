import express from 'express';
import { 
    createTicket, 
    getTickets, 
    getTicket,
    getAllTicketsAdmin,
    getTicketsByStatus,
    assignTicket,
    updateTicketStatus
} from '../controllers/ticket.js';
import { authenticate } from '../middlewares/auth.js';
import { requireAdmin, requireAdminOrModerator } from '../middlewares/adminAuth.js';

const router = express.Router();

// User routes
router.post('/create', authenticate, createTicket);
router.get('/user/tickets', authenticate, getTickets);
router.get('/user/ticket/:id', authenticate, getTicket);

// Admin routes
router.get('/admin/all', requireAdmin, getAllTicketsAdmin);
router.get('/admin/status/:status', requireAdmin, getTicketsByStatus);
router.patch('/admin/:ticketId/assign', requireAdmin, assignTicket);
router.patch('/admin/:ticketId/status', requireAdminOrModerator, updateTicketStatus);

// Legacy routes (maintain backward compatibility)
router.get('/', authenticate, getTickets);
router.get('/:id', authenticate, getTicket);
router.post('/', authenticate, createTicket);

export default router;