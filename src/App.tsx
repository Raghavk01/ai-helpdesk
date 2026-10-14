import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { AIDesk } from './components/AIDesk';
import { TicketCenter } from './components/TicketCenter';
import { KnowledgeBase } from './components/KnowledgeBase';
import { GpaCalculator } from './components/GpaCalculator';
import { CampusMap } from './components/CampusMap';
import { Directory } from './components/Directory';
import { EmergencyModal } from './components/EmergencyModal';
import { INITIAL_TICKETS } from './data/mockData';
import { Ticket, TicketStatus, TicketUpdate } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('tickets');
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isCreateTicketModalOpen, setIsCreateTicketModalOpen] = useState(false);
  const [ticketPrefill, setTicketPrefill] = useState('');

  // Persist tickets in localStorage
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    try {
      const saved = localStorage.getItem('southfield_tickets');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading tickets from localStorage', e);
    }
    return INITIAL_TICKETS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('southfield_tickets', JSON.stringify(tickets));
    } catch (e) {
      console.error('Error saving tickets to localStorage', e);
    }
  }, [tickets]);

  const handleAddTicket = (newTicket: Ticket) => {
    setTickets((prev) => [newTicket, ...prev]);
  };

  const handleUpdateTicketStatus = (ticketId: string, status: TicketStatus, note?: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const updates = [...t.updates];
          if (note) {
            updates.push({
              id: `u-${Date.now()}`,
              author: 'Dean of Student Affairs',
              text: note,
              timestamp: new Date().toISOString(),
              isOfficial: true,
            });
          }
          return {
            ...t,
            status,
            updatedAt: new Date().toISOString(),
            updates,
          };
        }
        return t;
      })
    );
  };

  const handleAddTicketUpdate = (ticketId: string, update: Omit<TicketUpdate, 'id'>) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            updatedAt: new Date().toISOString(),
            updates: [
              ...t.updates,
              {
                id: `u-${Date.now()}`,
                ...update,
              },
            ],
          };
        }
        return t;
      })
    );
  };

  const handleConvertChatToTicket = (text: string) => {
    setTicketPrefill(text);
    setActiveTab('tickets');
    setIsCreateTicketModalOpen(true);
  };

  const handleAskAIAboutFaq = (_question: string) => {
    setActiveTab('ai-desk');
  };

  return (
    <div className="min-h-screen bg-[#fdfcf9] text-[#1a1a1a] flex flex-col font-sans selection:bg-[#1a1a1a] selection:text-[#fdfcf9]">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openEmergencyModal={() => setIsEmergencyModalOpen(true)}
        openNewTicketModal={() => {
          setTicketPrefill('');
          setIsCreateTicketModalOpen(true);
          setActiveTab('tickets');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'ai-desk' && (
          <AIDesk onConvertChatToTicket={handleConvertChatToTicket} />
        )}
        {activeTab === 'tickets' && (
          <TicketCenter
            tickets={tickets}
            onAddTicket={handleAddTicket}
            onUpdateTicketStatus={handleUpdateTicketStatus}
            onAddTicketUpdate={handleAddTicketUpdate}
            isCreateModalOpen={isCreateTicketModalOpen}
            setIsCreateModalOpen={setIsCreateTicketModalOpen}
            openEmergencyModal={() => setIsEmergencyModalOpen(true)}
            prefillDescription={ticketPrefill}
            setPrefillDescription={setTicketPrefill}
          />
        )}
        {activeTab === 'kb' && (
          <KnowledgeBase onAskAIAboutFaq={handleAskAIAboutFaq} />
        )}
        {activeTab === 'gpa' && <GpaCalculator />}
        {activeTab === 'map' && <CampusMap />}
        {activeTab === 'directory' && <Directory />}
      </main>

      {/* Variation 3 Footer */}
      <footer className="px-6 sm:px-10 py-6 border-t border-[rgba(26,26,26,0.08)] flex flex-col sm:flex-row justify-between items-center gap-4 text-[0.7rem] text-[rgba(26,26,26,0.5)] bg-[#fdfcf9] mt-auto">
        <div>© {new Date().getFullYear()} Southfield College • Student Services Unified Portal</div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('kb')}
            className="hover:text-[#1a1a1a] transition-colors cursor-pointer"
          >
            Guidelines
          </button>
          <button
            onClick={() => setActiveTab('directory')}
            className="hover:text-[#1a1a1a] transition-colors cursor-pointer"
          >
            Directory
          </button>
          <button
            onClick={() => setIsEmergencyModalOpen(true)}
            className="text-[#c43a3a] font-semibold hover:underline cursor-pointer"
          >
            Emergency Hotline
          </button>
        </div>
      </footer>

      {/* Emergency Modal */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />
    </div>
  );
}
