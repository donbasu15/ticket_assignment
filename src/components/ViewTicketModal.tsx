import React from 'react';
import {parseISO, format } from 'date-fns';
import { X } from 'lucide-react';
import type { Ticket } from '../types/database';

interface ViewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket;
}

const ViewTicketModal: React.FC<ViewTicketModalProps> = ({ isOpen, onClose, ticket }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">View Ticket</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{ticket.title}</h3>
              <p className="mt-1 text-sm text-gray-500">
                Created on {ticket.createdAt ? 
                                            format(
                                              ticket.createdAt instanceof Date ? 
                                                ticket.createdAt : 
                                                typeof ticket.createdAt === 'string' ?
                                                  parseISO(ticket.createdAt) :
                                                  ticket.createdAt.toDate(),
                                              'MM/dd/yyyy'
                                            ) : 
                                            'No Date'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Priority</label>
                <p className="mt-1 text-sm text-gray-900">{ticket.priority}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <p className="mt-1 text-sm text-gray-900">{ticket.status}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{ticket.description}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <p className="mt-1 text-sm text-gray-900">{ticket.category}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                <p className="mt-1 text-sm text-gray-900">{ticket.contactEmail}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
                <p className="mt-1 text-sm text-gray-900">{ticket.contactPhone || 'Not provided'}</p>
              </div>
            </div>

            {ticket.attachmentUrl && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Attachment</label>
                <a
                  href={ticket.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                >
                  View Attachment
                </a>
              </div>
            )}

            <div className="pt-4">
              <button
                type="button"
                onClick={onClose}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTicketModal;