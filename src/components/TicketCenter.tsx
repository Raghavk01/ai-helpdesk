import React, { useState } from 'react';
import { 
  Ticket, TicketCategory, TicketPriority, TicketStatus, TicketUpdate 
} from '../types';
import { X, Send, Sparkles } from 'lucide-react';

interface TicketCenterProps {
  tickets: Ticket[];
  onAddTicket: (ticket: Ticket) => void;
  onUpdateTicketStatus: (ticketId: string, status: TicketStatus, note?: string) => void;
  onAddTicketUpdate: (ticketId: string, update: Omit<TicketUpdate, 'id'>) => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  openEmergencyModal: () => void;
  prefillDescription?: string;
  setPrefillDescription?: (text: string) => void;
}

const CATEGORIES: TicketCategory[] = [
  'Academic',
  'Finance',
  'Housing & Mess',
  'IT Services',
  'Library',
  'Health & Counseling',
];

export const TicketCenter: React.FC<TicketCenterProps> = ({
  tickets,
  onAddTicket,
  onUpdateTicketStatus,
  onAddTicketUpdate,
  isCreateModalOpen,
  setIsCreateModalOpen,
  openEmergencyModal,
  prefillDescription = '',
  setPrefillDescription,
}) => {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Reply state
  const [replyText, setReplyText] = useState('');
  const [replyAsOfficer, setReplyAsOfficer] = useState(false);

  // New ticket state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<TicketCategory>('Academic');
  const [newPriority, setNewPriority] = useState<TicketPriority>('Medium');
  const [newStudentName, setNewStudentName] = useState('Alex Rivera');
  const [newStudentId, setNewStudentId] = useState('SF-2024-8831');
  const [newStudentEmail, setNewStudentEmail] = useState('arivera@southfield.edu');
  const [newDescription, setNewDescription] = useState(prefillDescription);
  const [isTriageLoading, setIsTriageLoading] = useState(false);
  const [triageResult, setTriageResult] = useState<{
    suggestedCategory?: string;
    suggestedPriority?: string;
    summary?: string;
    recommendedAction?: string;
  } | null>(null);

  React.useEffect(() => {
    if (prefillDescription) {
      setNewDescription(prefillDescription);
      if (!newTitle) {
        setNewTitle(prefillDescription.slice(0, 60) + '...');
      }
    }
  }, [prefillDescription]);

  const handleAITriage = async () => {
    if (!newDescription.trim() && !newTitle.trim()) return;
    setIsTriageLoading(true);
    try {
      const res = await fetch('/api/triage-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
        }),
      });
      const data = await res.json();
      setTriageResult(data);
      if (data.suggestedCategory && CATEGORIES.includes(data.suggestedCategory as TicketCategory)) {
        setNewCategory(data.suggestedCategory as TicketCategory);
      }
      if (data.suggestedPriority) {
        setNewPriority(data.suggestedPriority as TicketPriority);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsTriageLoading(false);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    let department = 'Office of the Registrar';
    if (newCategory === 'Finance') department = 'Office of the Bursar';
    if (newCategory === 'Housing & Mess') department = 'Facilities & Residential Life';
    if (newCategory === 'IT Services') department = 'Campus IT Helpdesk';
    if (newCategory === 'Library') department = 'Centennial Memorial Library';
    if (newCategory === 'Health & Counseling') department = 'Student Wellness Center';

    const newTicket: Ticket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newTitle.trim(),
      description: newDescription.trim(),
      category: newCategory,
      priority: newPriority,
      status: 'Open',
      studentName: newStudentName.trim() || 'Student',
      studentId: newStudentId.trim() || 'SF-2026-0000',
      studentEmail: newStudentEmail.trim() || 'student@southfield.edu',
      departmentAssigned: department,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updates: [
        {
          id: `u-${Date.now()}`,
          author: newStudentName.trim() || 'Student',
          text: newDescription.trim(),
          timestamp: new Date().toISOString(),
        },
      ],
    };

    onAddTicket(newTicket);
    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewDescription('');
    setTriageResult(null);
    if (setPrefillDescription) setPrefillDescription('');
    setSelectedTicket(newTicket);
  };

  const handleSendReply = () => {
    if (!selectedTicket || !replyText.trim()) return;

    onAddTicketUpdate(selectedTicket.id, {
      author: replyAsOfficer
        ? `${selectedTicket.departmentAssigned} Officer`
        : selectedTicket.studentName,
      text: replyText.trim(),
      timestamp: new Date().toISOString(),
      isOfficial: replyAsOfficer,
    });

    setReplyText('');
    const updated = tickets.find((t) => t.id === selectedTicket.id);
    if (updated) setSelectedTicket(updated);
  };

  const filteredTickets = tickets.filter((t) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      t.id.toLowerCase().includes(q) ||
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.studentName.toLowerCase().includes(q)
    );
  });

  const totalCount = tickets.length;
  const activeCount = tickets.filter((t) => t.status === 'Open' || t.status === 'In Progress').length;
  const urgentCount = tickets.filter((t) => t.priority === 'High' || t.priority === 'Urgent').length;
  const resolvedCount = tickets.filter((t) => t.status === 'Resolved' || t.status === 'Closed').length;

  return (
    <div className="w-full flex-1 flex flex-col">
      {/* Variation 3 Main Split Container */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] border-b border-[rgba(26,26,26,0.08)]">
        {/* Left Scroll Panel */}
        <section className="py-12 sm:py-16 px-6 sm:px-12 overflow-y-auto border-b lg:border-b-0 lg:border-r border-[rgba(26,26,26,0.08)] bg-[#fdfcf9]">
          <span className="font-mono-space text-[0.65rem] uppercase tracking-[0.2em] text-[rgba(26,26,26,0.5)] block mb-4">
            The Student Portal
          </span>
          <h1 className="font-serif-cormorant text-5xl sm:text-[4rem] font-medium leading-[0.95] mb-6 italic text-[#1a1a1a]">
            Inquiries & Resolutions
          </h1>
          <p className="text-[1.1rem] text-[rgba(26,26,26,0.5)] leading-[1.6] mb-12 max-w-[500px]">
            A formal venue for grievance tracking and departmental resolution. Documenting your academic journey with precision and care.
          </p>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by case number or keyword..."
            className="w-full bg-transparent border-b border-[#1a1a1a] py-3 text-[1.2rem] font-serif-cormorant text-[#1a1a1a] placeholder:text-[rgba(26,26,26,0.4)] focus:outline-none mb-10"
          />

          {/* Case Entries List */}
          <div className="divide-y divide-[rgba(26,26,26,0.08)]">
            {filteredTickets.map((ticket) => {
              const isResolved = ticket.status === 'Resolved' || ticket.status === 'Closed';
              const cleanId = ticket.id.replace('TKT-2026-', 'TKT-');

              return (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className="py-8 grid grid-cols-1 sm:grid-cols-[100px_1fr_auto] gap-6 items-start cursor-pointer hover:bg-[rgba(26,26,26,0.02)] transition-colors px-2 -mx-2"
                >
                  <div className="font-mono-space text-[0.7rem] text-[rgba(26,26,26,0.5)] mt-1">
                    {cleanId}
                  </div>
                  <div>
                    <h3 className="font-serif-cormorant text-[1.4rem] font-semibold text-[#1a1a1a] mb-2 leading-snug">
                      {ticket.title}
                    </h3>
                    <p className="text-[0.9rem] text-[rgba(26,26,26,0.5)] leading-[1.4] line-clamp-2">
                      {ticket.description}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`font-mono-space text-[0.65rem] font-semibold px-3 py-1 rounded-full border border-[#1a1a1a] whitespace-nowrap block text-center ${
                        isResolved ? 'opacity-30' : ''
                      }`}
                    >
                      {ticket.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right Panel (Ledger + SOS Support + Action) */}
        <section className="py-12 sm:py-16 px-8 sm:px-16 sm:px-20 bg-white flex flex-col justify-between space-y-12">
          <div>
            <span className="font-mono-space text-[0.65rem] uppercase tracking-[0.2em] text-[rgba(26,26,26,0.5)] block mb-6">
              Current Ledger
            </span>

            {/* 2x2 Stats Grid */}
            <div className="grid grid-cols-2 gap-8 sm:gap-10 mb-12 sm:mb-16">
              <div className="stat-item">
                <span className="font-serif-cormorant text-5xl sm:text-[3.5rem] leading-none text-[#1a1a1a] block mb-1">
                  {totalCount < 10 ? `0${totalCount}` : totalCount}
                </span>
                <span className="font-mono-space text-[0.65rem] uppercase text-[rgba(26,26,26,0.5)]">
                  Total Filings
                </span>
              </div>

              <div className="stat-item">
                <span className="font-serif-cormorant text-5xl sm:text-[3.5rem] leading-none text-[#c43a3a] block mb-1">
                  {activeCount < 10 ? `0${activeCount}` : activeCount}
                </span>
                <span className="font-mono-space text-[0.65rem] uppercase text-[rgba(26,26,26,0.5)]">
                  Active Inquiries
                </span>
              </div>

              <div className="stat-item">
                <span className="font-serif-cormorant text-5xl sm:text-[3.5rem] leading-none text-[#1a1a1a] block mb-1">
                  {urgentCount < 10 ? `0${urgentCount}` : urgentCount}
                </span>
                <span className="font-mono-space text-[0.65rem] uppercase text-[rgba(26,26,26,0.5)]">
                  Urgent Priority
                </span>
              </div>

              <div className="stat-item">
                <span className="font-serif-cormorant text-5xl sm:text-[3.5rem] leading-none text-[#1a1a1a] block mb-1">
                  {resolvedCount < 10 ? `0${resolvedCount}` : resolvedCount}
                </span>
                <span className="font-mono-space text-[0.65rem] uppercase text-[rgba(26,26,26,0.5)]">
                  Resolved
                </span>
              </div>
            </div>

            {/* Emergency SOS Block */}
            <div
              onClick={openEmergencyModal}
              className="bg-[#c43a3a] text-white p-8 cursor-pointer hover:bg-[#b03232] transition-colors"
            >
              <h2 className="font-serif-cormorant text-[1.8rem] mb-3 font-semibold leading-tight">
                24/7 SOS Support
              </h2>
              <p className="text-[0.85rem] leading-[1.4] opacity-90">
                Immediate connection to Southfield Campus Police and Crisis counseling services. Always available.
              </p>
            </div>

            {/* Black Action Button */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-[#1a1a1a] text-[#fdfcf9] border-none py-4 px-8 text-[0.8rem] font-semibold cursor-pointer w-full mt-6 hover:bg-black transition-colors uppercase tracking-[0.05em]"
            >
              File a New Grievance
            </button>
          </div>

          <div className="text-[0.8rem] text-[rgba(26,26,26,0.5)] leading-[1.6]">
            The Registrar walk-in office is located at Admin Hall 101. Office hours are observed strictly during the Add/Drop window.
          </div>
        </section>
      </div>

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-[#1a1a1a]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fdfcf9] border border-[rgba(26,26,26,0.15)] max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-[rgba(26,26,26,0.08)] flex items-start justify-between gap-4 bg-white">
              <div>
                <span className="font-mono-space text-[#c43a3a] text-[0.7rem] block mb-1">
                  {selectedTicket.id} · {selectedTicket.category} · Priority: {selectedTicket.priority}
                </span>
                <h2 className="font-serif-cormorant text-2xl sm:text-3xl font-semibold text-[#1a1a1a] leading-tight">
                  {selectedTicket.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1 text-[rgba(26,26,26,0.5)] hover:text-[#1a1a1a] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-3 gap-4 p-4 border border-[rgba(26,26,26,0.08)] bg-white text-xs font-mono-space">
                <div>
                  <span className="text-[rgba(26,26,26,0.4)] block text-[10px]">Student</span>
                  <span className="text-[#1a1a1a] mt-0.5 block font-bold">{selectedTicket.studentName}</span>
                  <span className="text-[rgba(26,26,26,0.5)]">{selectedTicket.studentId}</span>
                </div>
                <div>
                  <span className="text-[rgba(26,26,26,0.4)] block text-[10px]">Division</span>
                  <span className="text-[#1a1a1a] mt-0.5 block">{selectedTicket.departmentAssigned}</span>
                </div>
                <div>
                  <span className="text-[rgba(26,26,26,0.4)] block text-[10px]">Status</span>
                  <span className="text-[#1a1a1a] mt-0.5 block font-bold">{selectedTicket.status}</span>
                </div>
              </div>

              <div>
                <span className="font-mono-space text-[0.65rem] uppercase text-[rgba(26,26,26,0.5)] block mb-2">
                  Case Details
                </span>
                <div className="p-4 bg-white border border-[rgba(26,26,26,0.08)] text-sm text-[#1a1a1a] leading-relaxed whitespace-pre-wrap font-serif-cormorant text-[1.1rem]">
                  {selectedTicket.description}
                </div>
              </div>

              {/* Administrative Status Actions */}
              <div className="p-4 border border-[#c43a3a]/30 bg-[#fffdfd] flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="font-mono-space text-[#c43a3a] font-bold">Administrative Actions:</span>
                <div className="flex items-center gap-2">
                  {selectedTicket.status !== 'In Progress' && (
                    <button
                      onClick={() => onUpdateTicketStatus(selectedTicket.id, 'In Progress')}
                      className="px-3 py-1.5 border border-[#1a1a1a] bg-white text-[#1a1a1a] font-mono-space text-[0.65rem] hover:bg-[#1a1a1a] hover:text-white cursor-pointer"
                    >
                      In Progress
                    </button>
                  )}
                  {selectedTicket.status !== 'Resolved' && (
                    <button
                      onClick={() => onUpdateTicketStatus(selectedTicket.id, 'Resolved')}
                      className="px-3 py-1.5 border border-[#1a1a1a] bg-[#1a1a1a] text-white font-mono-space text-[0.65rem] hover:bg-black cursor-pointer"
                    >
                      Mark Resolved
                    </button>
                  )}
                  {selectedTicket.status !== 'Escalated' && selectedTicket.status !== 'Resolved' && (
                    <button
                      onClick={() => onUpdateTicketStatus(selectedTicket.id, 'Escalated')}
                      className="px-3 py-1.5 border border-[#c43a3a] bg-transparent text-[#c43a3a] font-mono-space text-[0.65rem] hover:bg-[#c43a3a] hover:text-white cursor-pointer"
                    >
                      Escalate
                    </button>
                  )}
                </div>
              </div>

              {/* Case History */}
              <div>
                <span className="font-mono-space text-[0.65rem] uppercase text-[rgba(26,26,26,0.5)] block mb-3">
                  Resolution History
                </span>
                <div className="space-y-3">
                  {selectedTicket.updates.map((upd) => (
                    <div
                      key={upd.id}
                      className={`p-4 border text-xs leading-relaxed ${
                        upd.isOfficial
                          ? 'bg-[#1a1a1a] text-[#fdfcf9] border-[#1a1a1a]'
                          : 'bg-white border-[rgba(26,26,26,0.08)] text-[#1a1a1a]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold">{upd.author}</span>
                        <span className="font-mono-space opacity-70 text-[0.65rem]">
                          {new Date(upd.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap">{upd.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reply */}
              <div className="space-y-3 pt-3 border-t border-[rgba(26,26,26,0.08)]">
                <div className="flex items-center justify-between text-xs font-mono-space text-[0.65rem]">
                  <span className="text-[rgba(26,26,26,0.5)]">Add Update:</span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={replyAsOfficer}
                      onChange={(e) => setReplyAsOfficer(e.target.checked)}
                      className="accent-[#1a1a1a]"
                    />
                    <span>Post as Department Officer</span>
                  </label>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Enter case documentation note..."
                    className="flex-1 px-3 py-2 text-xs bg-white border border-[rgba(26,26,26,0.15)] focus:outline-none focus:border-[#1a1a1a]"
                  />
                  <button
                    onClick={handleSendReply}
                    disabled={!replyText.trim()}
                    className="px-4 py-2 bg-[#1a1a1a] text-white hover:bg-black font-mono-space text-[0.65rem] disabled:opacity-40 cursor-pointer"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Grievance Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1a1a1a]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fdfcf9] border border-[rgba(26,26,26,0.15)] max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in">
            <div className="p-6 border-b border-[rgba(26,26,26,0.08)] flex items-center justify-between bg-white">
              <div>
                <span className="font-mono-space text-[0.65rem] text-[#c43a3a] block mb-1">Official Filing</span>
                <h2 className="font-serif-cormorant text-2xl font-semibold text-[#1a1a1a]">
                  File a New Grievance
                </h2>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-[rgba(26,26,26,0.5)] hover:text-[#1a1a1a] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div className="p-3.5 border border-[#c43a3a]/40 bg-[#fffdfd]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono-space text-[#c43a3a] font-bold text-[0.7rem]">AI Triage Assistant</span>
                  <button
                    type="button"
                    onClick={handleAITriage}
                    disabled={isTriageLoading || (!newTitle && !newDescription)}
                    className="px-2.5 py-1 bg-[#c43a3a] text-white font-mono-space text-[0.65rem] hover:bg-[#a52828] disabled:opacity-40 cursor-pointer"
                  >
                    {isTriageLoading ? 'Triaging...' : 'Analyze with AI'}
                  </button>
                </div>
                <p className="text-[11px] text-[rgba(26,26,26,0.6)]">
                  Evaluates department routing and recommended handling tier automatically.
                </p>
                {triageResult && (
                  <div className="mt-2 pt-2 border-t border-[#c43a3a]/20 text-[11px] text-[#1a1a1a]">
                    <strong>Suggested:</strong> {triageResult.suggestedCategory} · {triageResult.suggestedPriority}
                  </div>
                )}
              </div>

              <div>
                <label className="font-mono-space text-[0.65rem] text-[rgba(26,26,26,0.6)] block mb-1">Case Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Course Prerequisite Override for CS-440"
                  className="w-full px-3 py-2 bg-white border border-[rgba(26,26,26,0.15)] text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-mono-space text-[0.65rem] text-[rgba(26,26,26,0.6)] block mb-1">Department *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as TicketCategory)}
                    className="w-full px-3 py-2 bg-white border border-[rgba(26,26,26,0.15)] text-[#1a1a1a]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-mono-space text-[0.65rem] text-[rgba(26,26,26,0.6)] block mb-1">Priority *</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as TicketPriority)}
                    className="w-full px-3 py-2 bg-white border border-[rgba(26,26,26,0.15)] text-[#1a1a1a]"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-mono-space text-[0.65rem] text-[rgba(26,26,26,0.6)] block mb-1">Student</label>
                  <input
                    type="text"
                    required
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[rgba(26,26,26,0.15)]"
                  />
                </div>
                <div>
                  <label className="font-mono-space text-[0.65rem] text-[rgba(26,26,26,0.6)] block mb-1">ID</label>
                  <input
                    type="text"
                    required
                    value={newStudentId}
                    onChange={(e) => setNewStudentId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[rgba(26,26,26,0.15)] font-mono-space text-[0.65rem]"
                  />
                </div>
                <div>
                  <label className="font-mono-space text-[0.65rem] text-[rgba(26,26,26,0.6)] block mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={newStudentEmail}
                    onChange={(e) => setNewStudentEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[rgba(26,26,26,0.15)]"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono-space text-[0.65rem] text-[rgba(26,26,26,0.6)] block mb-1">Case Description *</label>
                <textarea
                  required
                  rows={4}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Provide precise details, including course IDs, hall room numbers, or fee receipts..."
                  className="w-full px-3 py-2 bg-white border border-[rgba(26,26,26,0.15)] text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a]"
                />
              </div>

              <div className="pt-4 border-t border-[rgba(26,26,26,0.08)] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-[rgba(26,26,26,0.5)] hover:text-[#1a1a1a] font-mono-space text-[0.7rem] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1a1a1a] text-white hover:bg-black font-semibold uppercase tracking-[0.05em] cursor-pointer"
                >
                  File Grievance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
