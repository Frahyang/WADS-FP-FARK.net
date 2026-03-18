import React, { useState } from 'react';
import { X, Calendar, AlertCircle, User, FileText, Settings, Mail } from 'lucide-react';
import type { PriorityType, StatusType } from '../../types/types';
import { ticketService } from '../api/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  ticket: {
    id: string;
    ownerId: string;
    title: string;
    description: string;
    assignee: string;
    type: string;
    dateCreated: string;
    priority: PriorityType;
    status: StatusType;
  };
  onUpdate?: (ticketId: string, updates: { status?: StatusType; priority?: PriorityType; assignee?: string }) => Promise<void>;
  onDelete?: (ticketId: string) => Promise<void>;
}

const AdminTicketPopUp: React.FC<Props> = ({ isOpen, onClose, ticket, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedStatus, setEditedStatus] = useState<StatusType>(ticket.status);
  const [editedPriority, setEditedPriority] = useState<PriorityType>(ticket.priority);
  const [editedAssignee, setEditedAssignee] = useState<string>(ticket.assignee);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [emailResponse, setEmailResponse] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');

  React.useEffect(() => {
    setEditedStatus(ticket.status);
    setEditedPriority(ticket.priority);
    setEditedAssignee(ticket.assignee);
  }, [ticket]);

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      const updates: { status?: StatusType; priority?: PriorityType; assignee?: string } = {
        status: editedStatus,
        priority: editedPriority,
        assignee: editedAssignee,
      };

      if (onUpdate) {
        await onUpdate(ticket.id, updates);
      } else {
        await ticketService.updateTicket(ticket.id, updates);
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update ticket:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) {
      return;
    }

    setIsDeleting(true);
    try {
      if (onDelete) {
        await onDelete(ticket.id);
      } else {
        await ticketService.deleteTicket(ticket.id);
      }
      onClose();
    } catch (error) {
      console.error('Failed to delete ticket:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSendEmail = async () => {
    if (!emailResponse.trim()) {
      setEmailError('Please enter a response message');
      return;
    }

    setIsSending(true);
    setEmailError('');
    setEmailSuccess('');

    try {
      await ticketService.sendTicketResponse(ticket.id, emailResponse);
      setEmailSuccess('Response sent successfully');
      setEmailResponse('');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send response. Please try again.';
      setEmailError(errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  const getPriorityColor = (priority: PriorityType) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: StatusType) => {
    switch (status.toLowerCase()) {
      case 'in progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'unseen': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }} onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          <h2 className="text-xl font-semibold">Ticket Details</h2>
          <p className="text-blue-100 text-sm mt-1">Support Request Information</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[calc(90vh-180px)] overflow-y-auto">
          {/* Date Section */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-600 mb-3 flex items-center gap-2">
              <Calendar size={16} />
              Date Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wide">Created At</span>
                <p className="text-gray-900 font-medium">{ticket.dateCreated}</p>
              </div>
              {/* Assuming viewDate is not in the current ticket data, keeping Created At for now */}
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wide">View Date</span>
                <p className="text-gray-900 font-medium">{ticket.dateCreated}</p>
              </div>
            </div>
          </div>

          {/* Status & Priority */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-600 mb-3 flex items-center gap-2">
              <AlertCircle size={16} />
              Condition
            </h3>
            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <select
                    value={editedPriority}
                    onChange={(e) => setEditedPriority(e.target.value as PriorityType)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(editedPriority)}`}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                  <select
                    value={editedStatus}
                    onChange={(e) => setEditedStatus(e.target.value as StatusType)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(editedStatus)}`}
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Unseen">Unseen</option>
                  </select>
                </>
              ) : (
                <>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                    Priority: {ticket.priority}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                    Status: {ticket.status}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Ticket Details */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-600 mb-4 flex items-center gap-2">
              <FileText size={16} />
              Ticket Details
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wide flex items-center gap-1">
                    <Settings size={12} />
                    Ticket ID
                  </span>
                  <p className="text-gray-900 font-medium">{ticket.id}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wide flex items-center gap-1">
                    <User size={12} />
                    Owner ID
                  </span>
                  <p className="text-gray-900 font-medium">{ticket.ownerId}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wide flex items-center gap-1">
                    <FileText size={12} />
                    Type
                  </span>
                  <p className="text-gray-900 font-medium">{ticket.type}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wide flex items-center gap-1">
                    <User size={12} />
                    Assignee
                  </span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedAssignee}
                      onChange={(e) => setEditedAssignee(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-gray-900 font-medium text-sm"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{ticket.assignee}</p>
                  )}
                </div>
              </div>

              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wide block mb-2">Description</span>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-700 leading-relaxed">{ticket.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Add Email Response Section */}
          <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Mail size={20} />
              Send Email Response
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Response Message
                </label>
                <textarea
                  value={emailResponse}
                  onChange={(e) => setEmailResponse(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  rows={4}
                  placeholder="Enter your response to the ticket..."
                />
              </div>

              {emailError && (
                <div className="text-red-600 text-sm">{emailError}</div>
              )}

              {emailSuccess && (
                <div className="text-green-600 text-sm">{emailSuccess}</div>
              )}

              <button
                onClick={handleSendEmail}
                disabled={isSending}
                className={`w-full py-2 px-4 rounded-lg text-white font-medium ${isSending
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-violet-600 hover:bg-violet-700'
                  }`}
              >
                {isSending ? 'Sending...' : 'Send Response'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                disabled={isUpdating}
              >
                Cancel Edit
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm disabled:opacity-50"
                disabled={isUpdating}
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
            >
              Edit
            </button>
          )}
          <button
            onClick={handleDelete}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm disabled:opacity-50"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminTicketPopUp;
