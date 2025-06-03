import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Search, Filter, User, Calendar, ArrowLeft, Plus, Menu, X } from 'lucide-react';
import DashboardHeader from '../components/DashboardHeader';
import { ticketService } from '../api/api';
import { useNavigate } from "react-router-dom";

interface Ticket {
  id: string;
  title: string;
  type: string;
  status: string;
  priority: string;
  createdAt: string; // Assuming the date is received as a formatted string
  description: string;
}

interface BackendTicket {
  _id: string; // Backend internal ID
  ticket_id: string; // The public ticket ID
  owner_id: string; // Assuming it's a string ObjectId
  title: string;
  description: string;
  assignee: string;
  type: string;
  date_created: string; // Assuming ISO string from backend
  priority: string;
  status: string;
  createdAt: string; // Mongoose timestamps
  updatedAt: string; // Mongoose timestamps
}

const CustomerDashboard = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeTab, setActiveTab] = useState('All Tickets');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileTicketDetails, setShowMobileTicketDetails] = useState(false);
  const [showPriorityFilterDropdown, setShowPriorityFilterDropdown] = useState(false);
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string | null>(null);
  const [showCreateTicketModal, setShowCreateTicketModal] = useState(false);

  const navigate = useNavigate();

  const tabs = ['All Tickets', 'Unseen', 'In Progress', 'Completed'];

  const fetchTickets = useCallback(async () => {
    try {
      // Get the token from localStorage or sessionStorage
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      // Decode the JWT token to get user information
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const { id: ownerId } = JSON.parse(jsonPayload);
      
      const data = await ticketService.getTicketsByOwnerId(ownerId);
      // Map backend data to frontend Ticket interface if necessary
      const formattedData: Ticket[] = data.map((ticket: BackendTicket) => ({
        id: ticket.ticket_id,
        title: ticket.title,
        type: ticket.type,
        status: ticket.status,
        priority: ticket.priority,
        createdAt: new Date(ticket.date_created).toLocaleDateString(), // Format date
        description: ticket.description,
      }));
      setTickets(formattedData);
      if (formattedData.length > 0) {
        setSelectedTicket(formattedData[0]); // Select the first ticket by default
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      // Handle error, e.g., show an error message to the user
    }
  }, []); // Add dependencies here if fetchTickets relies on anything outside its scope

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]); // Effect now depends on fetchTickets

  const filteredTickets = useMemo(() => {
    let filtered = tickets;
    
    if (activeTab !== 'All Tickets') {
      filtered = tickets.filter(ticket => {
        if (activeTab === 'Unseen') {
          return ticket.status === 'Unseen'; 
        } else {
          return ticket.status === activeTab;
        }
      });
    }
    
    if (selectedPriorityFilter) {
      filtered = filtered.filter(ticket => ticket.priority === selectedPriorityFilter);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(ticket =>
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [tickets, activeTab, searchQuery, selectedPriorityFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'In Progress':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleMobileTicketSelect = (ticket) => {
    setSelectedTicket(ticket);
    setShowMobileTicketDetails(true);
  };

  const handleBackToList = () => {
    setShowMobileTicketDetails(false);
  };

  const handleCreateTicket = () => {
    // TODO: Implement create ticket functionality
    setShowCreateTicketModal(true);
    navigate("/createticket");

  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <DashboardHeader />
   
      {/* Mobile Ticket Details Full Screen */}
      {showMobileTicketDetails && selectedTicket && (
        <div className="lg:hidden">
          {/* Mobile Back Button */}
          <div className="sticky top-0 z-10 bg-gray-50 p-4 border-b border-gray-200 flex justify-end">
            <button
              onClick={handleBackToList}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to tickets</span>
            </button>
          </div>
          
          <div className="p-4 space-y-6">
            {/* Ticket ID Card */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedTicket.id}</h2>
                <p className="text-sm text-gray-500 flex items-center justify-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Created: {selectedTicket.createdAt}
                </p>
              </div>
            </div>

            {/* Status & Priority */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <label className="block text-sm font-medium text-gray-600 mb-2">Priority</label>
                <div className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium border w-full justify-center ${getPriorityColor(selectedTicket.priority)}`}>
                  {selectedTicket.priority}
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <label className="block text-sm font-medium text-gray-600 mb-2">Status</label>
                <div className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium border w-full justify-center ${getStatusColor(selectedTicket.status)}`}>
                  {selectedTicket.status}
                </div>
              </div>
            </div>

            {/* Ticket Info */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Information</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center mb-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    <span className="text-sm font-medium text-gray-600">Title</span>
                  </div>
                  <p className="text-sm text-gray-900 ml-4">{selectedTicket.title}</p>
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    <span className="text-sm font-medium text-gray-600">Type</span>
                  </div>
                  <p className="text-sm text-gray-900 ml-4">{selectedTicket.type}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{selectedTicket.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Layout & Mobile List View */}
      <div className={`flex ${showMobileTicketDetails ? 'hidden lg:flex' : 'flex'}`}>
        {/* Left Panel - Ticket List */}
        <div className="w-full lg:w-1/2 bg-white lg:border-r border-gray-200">
          {/* Desktop Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Search and Filter */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search tickets.."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                />
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowPriorityFilterDropdown(!showPriorityFilterDropdown)}
                  className="flex items-center space-x-2 px-3 py-2 lg:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700 hidden sm:inline">Filter</span>
                </button>
                {showPriorityFilterDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20" role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
                    <div className="py-1" role="none">
                      <button
                        onClick={() => { setSelectedPriorityFilter(null); setShowPriorityFilterDropdown(false); }}
                        className="text-gray-700 block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
                        role="menuitem"
                      >All Priorities</button>
                      <button
                        onClick={() => { setSelectedPriorityFilter('High'); setShowPriorityFilterDropdown(false); }}
                        className="text-red-600 block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
                        role="menuitem"
                      >High</button>
                      <button
                        onClick={() => { setSelectedPriorityFilter('Medium'); setShowPriorityFilterDropdown(false); }}
                        className="text-yellow-600 block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
                        role="menuitem"
                      >Medium</button>
                      <button
                        onClick={() => { setSelectedPriorityFilter('Low'); setShowPriorityFilterDropdown(false); }}
                        className="text-green-600 block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
                        role="menuitem"
                      >Low</button>
                    </div>
                  </div>
                )}
              </div>
              {/* Desktop Create Ticket Button */}
              <button
                onClick={handleCreateTicket}
                className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Ticket</span>
              </button>
            </div>
          </div>

          {/* Mobile Active Tab Indicator */}
          <div className="lg:hidden px-4 py-2 bg-gray-50 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700">{activeTab}</span>
          </div>

          {/* Ticket List */}
          <div className="overflow-y-auto" style={{ height: 'calc(100vh - 200px)' }}>
            {/* Desktop Table Header */}
            <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
              <div className="col-span-2">Ticket ID</div>
              <div className="col-span-4">Title</div>
              <div className="col-span-3">Type</div>
              <div className="col-span-3">Status</div>
            </div>

            {/* Ticket Items */}
            {filteredTickets.map((ticket) => (
              <div key={ticket.id}>
                {/* Desktop Row */}
                <div
                  onClick={() => setSelectedTicket(ticket)}
                  className={`hidden lg:grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedTicket?.id === ticket.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="col-span-2 text-sm font-medium text-gray-900">
                    {ticket.id}
                  </div>
                  <div className="col-span-4 text-sm text-gray-900 truncate">
                    {ticket.title}
                  </div>
                  <div className="col-span-3 text-sm text-gray-600">
                    {ticket.type}
                  </div>
                  <div className="col-span-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </div>
                </div>

                {/* Mobile Card */}
                <div
                  onClick={() => handleMobileTicketSelect(ticket)}
                  className="lg:hidden p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors active:bg-gray-100"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">{ticket.id}</h3>
                      <p className="text-sm text-gray-700 line-clamp-2">{ticket.title}</p>
                    </div>
                    <span className={`ml-3 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{ticket.type}</span>
                    <span className={`px-2 py-1 rounded-full ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Ticket Details (Desktop Only) */}
        <div className="hidden lg:block w-1/2 bg-white p-6">
          {selectedTicket ? (
            <div className="space-y-6">
              {/* Created Date */}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Created at: {selectedTicket.createdAt}</span>
              </div>

              {/* Priority and Status */}
              <div className="flex space-x-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority Level
                  </label>
                  <div className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium border ${getPriorityColor(selectedTicket.priority)}`}>
                    {selectedTicket.priority}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium border ${getStatusColor(selectedTicket.status)}`}>
                    {selectedTicket.status}
                  </div>
                </div>
              </div>

              {/* Ticket Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Ticket Details</h3>
                
                <div className="space-y-3">
                  <div>
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    <span className="text-sm font-medium text-gray-600">Ticket ID</span>
                    <div className="ml-4 text-sm font-medium text-gray-900">{selectedTicket.id}</div>
                  </div>
                  
                  <div>
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    <span className="text-sm font-medium text-gray-600">Title</span>
                    <div className="ml-4 text-sm font-medium text-gray-900">{selectedTicket.title}</div>
                  </div>
                  
                  <div>
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    <span className="text-sm font-medium text-gray-600">Type</span>
                    <div className="ml-4 text-sm text-gray-900">{selectedTicket.type}</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {selectedTicket.description}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Select a ticket to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Create Ticket FAB */}
      <button
        onClick={handleCreateTicket}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center z-50"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};

export default CustomerDashboard;