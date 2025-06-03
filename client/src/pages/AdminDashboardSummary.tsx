import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle, CheckCircle, Clock, Users, TrendingUp, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/DashboardHeader';
import DashboardNav from '../components/DashboardNav';
import { ticketService } from '../api/api';
import type { ITicket, StatusType } from '../../../server/models/TicketModel';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    color: string;
  }>;
  label?: string;
}

// Define a type for nav options to match DashboardNav props
interface SummaryNavOption {
  option: string;
  func: () => void | Promise<void>;
  status?: StatusType | 'all' | null | 'summary';
}

const AdminDashboardSummary = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await ticketService.getAllTickets();
        setTickets(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch tickets');
        setLoading(false);
        console.error('Error fetching tickets:', error);
      }
    };

    fetchTickets();
  }, []);

  // Process ticket data for charts
  const ticketStatusData = React.useMemo(() => {
    const statusCounts = tickets.reduce((acc, ticket) => {
      acc[ticket.status] = (acc[ticket.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { name: 'Completed', value: statusCounts['Completed'] || 0, color: '#10b981' },
      { name: 'In Progress', value: statusCounts['In Progress'] || 0, color: '#f59e0b' },
      { name: 'Unseen', value: statusCounts['Unseen'] || 0, color: '#3b82f6' },
    ];
  }, [tickets]);

  const priorityData = React.useMemo(() => {
    const priorityCounts = tickets.reduce((acc, ticket) => {
      acc[ticket.priority] = (acc[ticket.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { name: 'Low', count: priorityCounts['Low'] || 0, color: '#10b981' },
      { name: 'Medium', count: priorityCounts['Medium'] || 0, color: '#f59e0b' },
      { name: 'High', count: priorityCounts['High'] || 0, color: '#ef4444' },
    ];
  }, [tickets]);

  const categoryData = React.useMemo(() => {
    const categoryCounts = tickets.reduce((acc, ticket) => {
      acc[ticket.type] = (acc[ticket.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count: count as number
    }));
  }, [tickets]);

  const totalTickets = tickets.length;
  const completedTickets = tickets.filter(ticket => ticket.status === 'Completed').length;
  const completionRate = totalTickets > 0 ? Math.round((completedTickets / totalTickets) * 100) : 0;

  const navOptions: SummaryNavOption[] = [
    {
      option: "Summary",
      func: () => { navigate('/admin/summary'); },
      status: 'summary',
    },
    {
      option: "All Tickets",
      func: () => navigate('/admin/all'),
      status: 'all',
    },
    {
      option: "In Progress",
      func: () => navigate('/admin/In Progress'),
      status: 'In Progress',
    },
    {
      option: "Completed",
      func: () => navigate('/admin/Completed'),
      status: 'Completed',
    },
    {
      option: "Ticket History",
      func: () => navigate('/admin/Unseen'),
      status: 'Unseen',
    },
  ];

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }) => {
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      red: 'bg-red-50 text-red-600 border-red-200',
      gray: 'bg-gray-50 text-gray-600 border-gray-200'
    };

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            <Icon size={24} />
          </div>
        </div>
      </div>
    );
  };

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  return (
    <div>
      <DashboardHeader />
      <DashboardNav navs={navOptions} currentFilter={'summary'} />
      <div className="max-w-7xl mx-auto p-4 pt-0 sm:p-6 min-h-screen">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Monitor your helpdesk performance and ticket metrics</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <StatCard
            icon={Calendar}
            title="Total Tickets"
            value={totalTickets}
            subtitle="This month"
            color="blue"
          />
          <StatCard
            icon={CheckCircle}
            title="Completed"
            value={completedTickets}
            subtitle={`${completionRate}% completion rate`}
            color="green"
          />
          <StatCard
            icon={Clock}
            title="In Progress"
            value={tickets.filter(ticket => ticket.status === 'In Progress').length}
            subtitle="Active tickets"
            color="yellow"
          />
          <StatCard
            icon={AlertCircle}
            title="High Priority"
            value={tickets.filter(ticket => ticket.priority === 'High').length}
            subtitle="Needs attention"
            color="red"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Ticket Status Pie Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="mr-2" size={20} />
              Ticket Status Distribution
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ticketStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {ticketStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Priority Distribution Bar Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="mr-2" size={20} />
              Priority Levels
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Category Analysis */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="mr-2" size={20} />
            Categories
          </h2>
          <div className="space-y-4">
            {categoryData.map((category, index) => {
              const percentage = Math.round((category.count / totalTickets) * 100);
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">{category.category}</span>
                      <span className="text-sm text-gray-500">{category.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardSummary; 