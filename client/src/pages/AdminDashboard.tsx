import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import DashboardHeader from '../components/DashboardHeader';
import DashboardNav from '../components/DashboardNav';
import type { ITicket, StatusType, PriorityType } from '../../../server/models/TicketModel';
import { useNavigate, useParams } from 'react-router-dom';
import { ticketService } from '../api/api';
import AdminTable from '../components/AdminTable';

interface NavOption {
  option: string;
  func: () => void | Promise<void>;
  path: string;
  status: StatusType | 'all' | 'summary';
}

function AdminDashboard() {
  const navigate = useNavigate();
  const { status: statusParam } = useParams<{ status?: StatusType | 'all' }>();
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStatusFilter, setCurrentStatusFilter] = useState<StatusType | 'all'>('all');
  const [currentPriorityFilter, setCurrentPriorityFilter] = useState<PriorityType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ticketService.getAllTickets();
      console.log('Fetched tickets:', data);
      setTickets(data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch tickets');
      setLoading(false);
      console.error('Error fetching tickets:', error);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  useEffect(() => {
    if (statusParam) {
      if (statusParam === 'all') {
        setCurrentStatusFilter('all');
      } else {
        setCurrentStatusFilter(statusParam as StatusType);
      }
    }
  }, [statusParam]);

  const navOptions: NavOption[] = [
    {
      option: "Summary",
      func: () => { navigate('/admin/summary'); },
      path: '/admin/summary',
      status: 'summary'
    },
    {
      option: "All Tickets",
      func: () => { navigate('/admin/all'); },
      path: '/admin/all',
      status: 'all'
    },
    {
      option: "Unseen",
      func: () => { navigate('/admin/Unseen'); },
      path: '/admin/Unseen',
      status: 'Unseen'
    },
    {
      option: "In Progress",
      func: () => { navigate('/admin/In Progress'); },
      path: '/admin/In Progress',
      status: 'In Progress'
    },
    {
      option: "Completed",
      func: () => { navigate('/admin/Completed'); },
      path: '/admin/Completed',
      status: 'Completed'
    },
  ];

  const filteredTickets = useMemo(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    
    return tickets.filter(ticket => {
      const matchesSearch = (ticket.title.toLowerCase().includes(lowerCaseQuery) ||
                             ticket.description.toLowerCase().includes(lowerCaseQuery));
      
      const matchesPriority = currentPriorityFilter === 'all' || ticket.priority === currentPriorityFilter;
      const matchesStatus = currentStatusFilter === 'all' || ticket.status === currentStatusFilter;

      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [tickets, searchQuery, currentPriorityFilter, currentStatusFilter]);

  const styles = {
    container: 'w-full border-b bg-white',
    main: 'min-h-screen bg-gray-50',

    searchAndFilter: 'flex flex-col sm:flex-row items-stretch sm:items-center text-base sm:text-lg px-3 sm:px-5 py-3 sm:py-0 border-b-2 border-neutral-200 w-full gap-2 sm:gap-3 bg-white',
    
    search_btn: 'hidden sm:flex hover:scale-110 hover:bg-neutral-200 transition-all h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full shrink-0',
    
    search_bar: 'flex-grow h-10 sm:h-12 px-3 outline-none border border-neutral-300 sm:border-none rounded-lg sm:rounded-none focus:border-blue-500 sm:focus:border-none text-sm sm:text-base',
    
    filter_dropdown: 'bg-neutral-100 hover:bg-neutral-200 px-3 py-2 sm:py-2 rounded-lg text-sm sm:text-base whitespace-nowrap shrink-0 transition-colors cursor-pointer',
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  return (
    <>
      <main className={styles.main}>
        <DashboardHeader />
        <div className="absolute top-4 right-4 md:static md:top-auto md:right-auto">
          <DashboardNav navs={navOptions} currentFilter={statusParam || 'all'} />
        </div>

        <section className={styles.searchAndFilter}>
          <div className="sm:hidden w-full">
            <div className="flex flex-row items-center gap-2 mb-2">
              <div className="flex items-center flex-grow relative">
                <FontAwesomeIcon 
                  icon={faMagnifyingGlass} 
                  className="absolute left-3 text-neutral-500 text-sm"
                />
                <input 
                  className="w-full h-10 pl-10 pr-3 outline-none border border-neutral-300 rounded-lg focus:border-blue-500 text-sm" 
                  type="text" 
                  placeholder="Search tickets.." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                value={currentPriorityFilter || 'all'}
                onChange={(e) => setCurrentPriorityFilter(e.target.value as PriorityType | 'all')}
                className={styles.filter_dropdown}
              >
                <option value="all">All Priorities</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>
          </div>

          <div className="hidden sm:flex sm:flex-row sm:items-center sm:w-full sm:gap-3">
            <button className={styles.search_btn}>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
            <input 
              className={styles.search_bar} 
              type="text" 
              placeholder="Search tickets.." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              value={currentPriorityFilter || 'all'}
              onChange={(e) => setCurrentPriorityFilter(e.target.value as PriorityType | 'all')}
              className={styles.filter_dropdown}
            >
              <option value="all">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>
        </section>
        
        <div className="overflow-x-auto">
          <AdminTable data={filteredTickets} onRefresh={fetchTickets} />
        </div>
      </main>
    </>
  );
}

export default AdminDashboard;