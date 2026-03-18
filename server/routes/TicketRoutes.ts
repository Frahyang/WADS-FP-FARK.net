import express from 'express'
import type { RequestHandler } from 'express'
import { createTicket, deleteTicket, getTickets, getTicketsByOwnerID, updateStatus, sendTicketResponse } from '../controllers/TicketController.ts';

const router = express.Router();

// Cast the handlers to RequestHandler type
const handlers = {
  createTicket: createTicket as unknown as RequestHandler,
  getTickets: getTickets as unknown as RequestHandler,
  getTicketsByOwnerID: getTicketsByOwnerID as unknown as RequestHandler,
  updateStatus: updateStatus as unknown as RequestHandler,
  deleteTicket: deleteTicket as unknown as RequestHandler,
  sendTicketResponse: sendTicketResponse as unknown as RequestHandler
};

router.post('/create_ticket/:owner_id', handlers.createTicket);
router.get('/get_tickets_all', handlers.getTickets);
router.get('/get_tickets_byOwnerId/:owner_id', handlers.getTicketsByOwnerID);
router.patch('/update_status/:ticket_id', handlers.updateStatus);
router.delete('/delete_ticket/:ticket_id', handlers.deleteTicket);
router.post('/send_response/:ticket_id', handlers.sendTicketResponse);

export default router
