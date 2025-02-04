import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Ticket } from '../types/database';
import { Eye, Edit, Trash2, Plus, LogOut } from 'lucide-react';
import CreateTicketModal from '../components/CreateTicketModal';
import ViewTicketModal from '../components/ViewTicketModal';
import EditTicketModal from '../components/EditTicketModal';
import { format } from 'date-fns';


const Dashboard = () => {
  const { profile, signOut } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (!profile) return;

    const ticketsRef = collection(db, 'tickets');
    const q = profile.role === 'agent'
      ? query(ticketsRef)
      : query(ticketsRef, where('createdBy', '==', profile.id));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ticketData: Ticket[] = [];
      snapshot.forEach((doc) => {
        ticketData.push({ id: doc.id, ...doc.data() } as Ticket);
      });
      setTickets(ticketData);
    });

    return () => unsubscribe();
  }, [profile]);

  const handleDelete = async (ticketId: string) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      await deleteDoc(doc(db, 'tickets', ticketId));
    }
  };

  const handleStatusUpdate = async (ticketId: string, newStatus: string) => {
    await updateDoc(doc(db, 'tickets', ticketId), {
      status: newStatus,
      updatedAt: new Date()
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Support Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              {profile?.role === 'customer' && (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Ticket
                </button>
              )}
              <button
                onClick={() => signOut()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priority
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tickets.map((ticket) => (
                     
                      <tr key={ticket.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{ticket.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${ticket.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                              ticket.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'}`}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={ticket.status}
                            onChange={(e) => handleStatusUpdate(ticket.id, e.target.value)}
                            disabled={profile?.role !== 'agent'}
                            className="text-sm text-gray-900 border-gray-300 rounded-md"
                          >
                            <option value="new">New</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              
                               {ticket.createdAt ? format(new Date(ticket.createdAt), 'MM/dd/yyyy') : 'No Date'}

                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedTicket(ticket);
                                setIsViewModalOpen(true);
                              }}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                            {profile?.role === 'agent' && (
                              <button
                                onClick={() => {
                                  setSelectedTicket(ticket);
                                  setIsEditModalOpen(true);
                                }}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                            )}
                            {profile?.role === 'customer' && ticket.createdBy === profile.id && (
                              <button
                                onClick={() => handleDelete(ticket.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      {isCreateModalOpen && (
        <CreateTicketModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}

      {isViewModalOpen && selectedTicket && (
        <ViewTicketModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedTicket(null);
          }}
          ticket={selectedTicket}
        />
      )}

      {isEditModalOpen && selectedTicket && (
        <EditTicketModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTicket(null);
          }}
          ticket={selectedTicket}
        />
      )}
    </div>
  );
};

export default Dashboard;