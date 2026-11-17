import React, { useState } from 'react';
import { CampusEvent, CampusBlockLetter, EventCategory } from '../types';
import { ALL_BLOCKS } from '../data/mockData';
import { 
  Calendar, Clock, MapPin, Users, User, Trophy, Search, Plus, 
  Ticket as TicketIcon, Check, X, Printer, Shield, ArrowUpRight, Sparkles 
} from 'lucide-react';

interface EventsSectionProps {
  events: CampusEvent[];
  onAddEvent: (event: CampusEvent) => void;
}

const CATEGORIES: ('All' | EventCategory)[] = [
  'All',
  'Cultural & Arts',
  'Technical & Hackathon',
  'Clan Competition',
  'Sports & Athletics',
  'Academic & Symposium',
  'Workshop & Masterclass',
];

export const EventsSection: React.FC<EventsSectionProps> = ({ events, onAddEvent }) => {
  const [selectedBlock, setSelectedBlock] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // RSVP Ticket Modal
  const [activeRsvpEvent, setActiveRsvpEvent] = useState<CampusEvent | null>(null);
  const [rsvpStudentName, setRsvpStudentName] = useState('Alex Rivera');
  const [rsvpStudentId, setRsvpStudentId] = useState('2024MRUCS0881');
  const [rsvpClan, setRsvpClan] = useState('Wild Cats');
  const [generatedPassCode, setGeneratedPassCode] = useState<string | null>(null);

  // New Event Proposal Modal
  const [isProposeModalOpen, setIsProposeModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newCategory, setNewCategory] = useState<EventCategory>('Cultural & Arts');
  const [newDate, setNewDate] = useState('2026-11-10');
  const [newTime, setNewTime] = useState('11:00 AM - 04:00 PM');
  const [newBlock, setNewBlock] = useState<CampusBlockLetter>('Block J');
  const [newVenueDetails, setNewVenueDetails] = useState('Block J · Student Activity Center Hall');
  const [newOrganizer, setNewOrganizer] = useState('Department of Student Welfare (DSW)');
  const [newFacultyName, setNewFacultyName] = useState('Prof. (Dr.) Gurjeet Kaur Chawla');
  const [newFacultyDesig, setNewFacultyDesig] = useState('Dean, DSW');
  const [newFacultyContact, setNewFacultyContact] = useState('dsw@mru.edu.in');
  const [newStudentName, setNewStudentName] = useState('Aarav Malhotra');
  const [newStudentClan, setNewStudentClan] = useState('Clan Wild Cats');
  const [newStudentContact, setNewStudentContact] = useState('+91 98101 22340');
  const [newDesc, setNewDesc] = useState('');

  // Filtering
  const filteredEvents = events.filter((evt) => {
    const matchesBlock = selectedBlock === 'All' || evt.block === selectedBlock;
    const matchesCat = selectedCategory === 'All' || evt.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      evt.title.toLowerCase().includes(q) ||
      evt.subtitle.toLowerCase().includes(q) ||
      evt.block.toLowerCase().includes(q) ||
      evt.venueDetails.toLowerCase().includes(q) ||
      evt.organizer.toLowerCase().includes(q) ||
      evt.facultyCoordinator.name.toLowerCase().includes(q) ||
      evt.studentCoordinator.name.toLowerCase().includes(q);

    return matchesBlock && matchesCat && matchesSearch;
  });

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pass = `MRU-PASS-${Math.floor(100000 + Math.random() * 900000)}`;
    setGeneratedPassCode(pass);
  };

  const handleProposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: CampusEvent = {
      id: `EVT-MRU-${Date.now().toString().slice(-4)}`,
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || 'Campus Student Community Event',
      category: newCategory,
      date: newDate,
      time: newTime,
      block: newBlock,
      venueDetails: newVenueDetails.trim() || `${newBlock} · Main Hall`,
      organizer: newOrganizer.trim(),
      facultyCoordinator: {
        name: newFacultyName.trim() || 'Faculty Advisor',
        designation: newFacultyDesig.trim() || 'Department Coordinator',
        contact: newFacultyContact.trim() || 'coordinator@mru.edu.in',
      },
      studentCoordinator: {
        name: newStudentName.trim() || 'Student Lead',
        clanOrBranch: newStudentClan.trim() || 'Clan Representative',
        contact: newStudentContact.trim() || '+91 99000 00000',
      },
      description: newDesc.trim() || 'An official event approved on the Manav Rachna University academic & cultural calendar.',
      highlights: ['Official University Attendance Recorded', 'Clan Points Credited upon Scanning'],
      registrationStatus: 'Open',
      capacity: 200,
      registeredCount: 1,
      clanPointsAwarded: 250,
      entryFee: 'Free (Student ID Required)',
    };

    onAddEvent(created);
    setIsProposeModalOpen(false);
    // Reset form
    setNewTitle('');
    setNewSubtitle('');
    setNewDesc('');
  };

  return (
    <div className="w-full flex-1 flex flex-col">
      {/* Editorial Header Banner */}
      <div className="py-14 sm:py-18 px-6 sm:px-10 text-center border-b border-[rgba(26,26,26,0.08)] bg-[#fdfcf9]">
        <span className="font-mono-space text-[#c43a3a] tracking-[0.18em] block mb-2 font-bold text-[0.7rem]">
          Manav Rachna University · Campus Festivities & Conclaves
        </span>
        <h1 className="font-serif-cormorant text-4xl sm:text-6xl md:text-[4.2rem] font-medium tracking-tight text-[#1a1a1a] leading-tight my-3 italic">
          Live Events & Block Directory
        </h1>
        <p className="text-sm sm:text-lg text-[rgba(26,26,26,0.55)] max-w-2xl mx-auto leading-relaxed">
          Explore upcoming cultural fests, hackathons, sports clashes, and academic conferences taking place across <strong className="text-[#1a1a1a]">Blocks A through S</strong>.
        </p>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1360px] mx-auto px-6 sm:px-10 py-10 sm:py-14 w-full space-y-10">
        
        {/* Controls & Filter Bar */}
        <div className="space-y-6 pb-6 border-b border-[rgba(26,26,26,0.08)]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Box */}
            <div className="relative flex-1 max-w-lg">
              <Search className="w-4 h-4 text-[rgba(26,26,26,0.4)] absolute left-0 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events, blocks (e.g. Block M, Block I), coordinators, or societies..."
                className="w-full pl-7 pr-4 py-2 bg-transparent border-b border-[#1a1a1a] font-serif-cormorant text-[1.15rem] text-[#1a1a1a] placeholder:text-[rgba(26,26,26,0.4)] focus:outline-none"
              />
            </div>

            {/* Propose Event CTA */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsProposeModalOpen(true)}
                className="py-2.5 px-5 bg-[#1a1a1a] text-[#fdfcf9] hover:bg-black font-semibold text-xs tracking-[0.06em] uppercase transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Schedule / Propose Event</span>
              </button>
            </div>
          </div>

          {/* Block Selector Strip (Blocks A to S) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono-space text-[0.65rem] text-[rgba(26,26,26,0.5)] uppercase tracking-wider">
                Filter by Campus Block (Blocks A through S):
              </span>
              <span className="font-mono-space text-[0.65rem] text-[#c43a3a] font-bold">
                {selectedBlock === 'All' ? 'Showing All 19 Blocks' : `Selected: ${selectedBlock}`}
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
              <button
                onClick={() => setSelectedBlock('All')}
                className={`px-3 py-1 text-xs font-mono-space transition-colors whitespace-nowrap cursor-pointer border ${
                  selectedBlock === 'All'
                    ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                    : 'bg-white text-[rgba(26,26,26,0.6)] border-[rgba(26,26,26,0.12)] hover:border-[#1a1a1a]'
                }`}
              >
                All Blocks
              </button>

              {ALL_BLOCKS.map((blk) => (
                <button
                  key={blk}
                  onClick={() => setSelectedBlock(blk)}
                  className={`px-2.5 py-1 text-xs font-mono-space transition-colors whitespace-nowrap cursor-pointer border ${
                    selectedBlock === blk
                      ? 'bg-[#c43a3a] text-white border-[#c43a3a] font-bold'
                      : 'bg-white text-[rgba(26,26,26,0.6)] border-[rgba(26,26,26,0.12)] hover:border-[#1a1a1a]'
                  }`}
                >
                  {blk.replace('Block ', '')}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs rounded-full border transition-colors cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#1a1a1a] text-white border-[#1a1a1a] font-medium'
                    : 'bg-transparent text-[rgba(26,26,26,0.6)] border-[rgba(26,26,26,0.12)] hover:border-[#1a1a1a]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Live Events Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <span className="font-mono-space text-[0.7rem] uppercase text-[rgba(26,26,26,0.5)]">
              {filteredEvents.length} Active Events Scheduled
            </span>
            <span className="font-mono-space text-[0.7rem] text-[#c43a3a]">
              Official MRU Academic Calendar · 2026-2027
            </span>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="py-20 text-center bg-white border border-[rgba(26,26,26,0.08)] p-8">
              <Calendar className="w-8 h-8 text-[rgba(26,26,26,0.3)] mx-auto mb-2" />
              <h3 className="font-serif-cormorant text-2xl font-semibold text-[#1a1a1a]">
                No scheduled events found for this filter
              </h3>
              <p className="text-xs text-[rgba(26,26,26,0.5)] mt-1">
                Try selecting "All Blocks" or clear your search term.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {filteredEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="border border-[rgba(26,26,26,0.12)] bg-white p-6 sm:p-7 flex flex-col justify-between space-y-6 hover:border-[#1a1a1a] transition-all relative overflow-hidden group shadow-2xs"
                >
                  {/* Clan Points Badge if applicable */}
                  {evt.clanPointsAwarded && (
                    <div className="absolute top-0 right-0 bg-[#c43a3a] text-white text-[10px] font-mono-space px-3 py-1 font-bold tracking-wider">
                      +{evt.clanPointsAwarded} Clan Pts
                    </div>
                  )}

                  {/* Top Meta info */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-mono-space text-[rgba(26,26,26,0.5)]">
                      <span className="text-[#c43a3a] font-bold">{evt.category}</span>
                      <span>·</span>
                      <span>{evt.id}</span>
                      <span>·</span>
                      <span className="border border-[rgba(26,26,26,0.15)] px-2 py-0.5 text-[#1a1a1a] font-bold">
                        {evt.registrationStatus}
                      </span>
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="font-serif-cormorant text-2xl sm:text-[1.75rem] font-semibold text-[#1a1a1a] leading-tight group-hover:text-[#c43a3a] transition-colors">
                        {evt.title}
                      </h3>
                      <p className="text-xs text-[rgba(26,26,26,0.6)] mt-1 italic font-serif-cormorant text-[1.05rem]">
                        {evt.subtitle}
                      </p>
                    </div>

                    {/* Essential Time & Block Location Box */}
                    <div className="p-4 bg-[#fdfcf9] border border-[rgba(26,26,26,0.08)] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {/* Date & Time */}
                      <div className="space-y-1">
                        <span className="font-mono-space text-[10px] text-[rgba(26,26,26,0.4)] block">Date & Time</span>
                        <div className="flex items-center gap-1.5 text-[#1a1a1a] font-medium">
                          <Calendar className="w-3.5 h-3.5 text-[#c43a3a] shrink-0" />
                          <span>{new Date(evt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[rgba(26,26,26,0.6)] font-mono-space text-[11px]">
                          <Clock className="w-3 h-3 text-[rgba(26,26,26,0.4)] shrink-0" />
                          <span>{evt.time}</span>
                        </div>
                      </div>

                      {/* Campus Block & Venue */}
                      <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-[rgba(26,26,26,0.08)] sm:pl-3 pt-2 sm:pt-0">
                        <span className="font-mono-space text-[10px] text-[rgba(26,26,26,0.4)] block">Campus Location</span>
                        <div className="flex items-center gap-1.5 font-bold text-[#1a1a1a]">
                          <MapPin className="w-3.5 h-3.5 text-[#c43a3a] shrink-0" />
                          <span className="bg-[#1a1a1a] text-white px-2 py-0.5 text-[11px] font-mono-space">
                            {evt.block}
                          </span>
                        </div>
                        <div className="text-[11px] text-[rgba(26,26,26,0.6)] line-clamp-1">
                          {evt.venueDetails}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-[rgba(26,26,26,0.65)] leading-relaxed">
                      {evt.description}
                    </p>

                    {/* Organizer & Coordinators Section */}
                    <div className="pt-3 border-t border-[rgba(26,26,26,0.06)] space-y-2 text-xs">
                      {/* Organizer */}
                      <div className="flex items-start gap-2">
                        <span className="font-mono-space text-[10px] text-[rgba(26,26,26,0.45)] w-24 shrink-0 uppercase">
                          Organizer:
                        </span>
                        <span className="font-medium text-[#1a1a1a]">
                          {evt.organizer}
                        </span>
                      </div>

                      {/* Faculty Coordinator */}
                      <div className="flex items-start gap-2">
                        <span className="font-mono-space text-[10px] text-[rgba(26,26,26,0.45)] w-24 shrink-0 uppercase">
                          Faculty Lead:
                        </span>
                        <div className="text-[#1a1a1a]">
                          <span className="font-semibold">{evt.facultyCoordinator.name}</span>{' '}
                          <span className="text-[rgba(26,26,26,0.5)]">({evt.facultyCoordinator.designation})</span>
                          <span className="block font-mono-space text-[10px] text-[rgba(26,26,26,0.5)] mt-0.5">
                            {evt.facultyCoordinator.contact}
                          </span>
                        </div>
                      </div>

                      {/* Student Coordinator */}
                      <div className="flex items-start gap-2">
                        <span className="font-mono-space text-[10px] text-[rgba(26,26,26,0.45)] w-24 shrink-0 uppercase">
                          Student Lead:
                        </span>
                        <div className="text-[#1a1a1a]">
                          <span className="font-semibold">{evt.studentCoordinator.name}</span>{' '}
                          <span className="text-[rgba(26,26,26,0.5)]">({evt.studentCoordinator.clanOrBranch})</span>
                          <span className="block font-mono-space text-[10px] text-[rgba(26,26,26,0.5)] mt-0.5">
                            {evt.studentCoordinator.contact}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action strip */}
                  <div className="pt-4 border-t border-[rgba(26,26,26,0.08)] flex items-center justify-between gap-3">
                    <div className="text-xs text-[rgba(26,26,26,0.5)] font-mono-space">
                      <span>Capacity: {evt.registeredCount}/{evt.capacity}</span>
                    </div>

                    <button
                      onClick={() => {
                        setActiveRsvpEvent(evt);
                        setGeneratedPassCode(null);
                      }}
                      className="px-4 py-2 bg-[#1a1a1a] text-white hover:bg-black font-mono-space text-[0.7rem] uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <TicketIcon className="w-3.5 h-3.5 text-[#c43a3a]" />
                      <span>Get Event Pass</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RSVP / Event Pass Modal */}
      {activeRsvpEvent && (
        <div className="fixed inset-0 z-50 bg-[#1a1a1a]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fdfcf9] border border-[rgba(26,26,26,0.15)] max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in">
            {/* Header */}
            <div className="p-6 border-b border-[rgba(26,26,26,0.08)] flex items-center justify-between bg-white">
              <div>
                <span className="font-mono-space text-[0.65rem] text-[#c43a3a] block mb-0.5">
                  Official Campus Access Pass
                </span>
                <h3 className="font-serif-cormorant text-2xl font-semibold text-[#1a1a1a] leading-tight">
                  {activeRsvpEvent.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveRsvpEvent(null)}
                className="p-1 text-[rgba(26,26,26,0.5)] hover:text-[#1a1a1a] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {generatedPassCode ? (
                /* Generated E-Pass */
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-[#1a1a1a] p-6 bg-white space-y-4 text-center">
                    <div className="font-serif-cormorant text-xl font-bold uppercase tracking-widest text-[#1a1a1a]">
                      Manav Rachna University
                    </div>
                    <div className="font-mono-space text-[10px] text-[#c43a3a] font-bold uppercase tracking-wider">
                      Verified Electronic Entry Pass · {generatedPassCode}
                    </div>

                    <div className="py-3 border-y border-[rgba(26,26,26,0.08)] space-y-2 text-left text-xs font-mono-space">
                      <div className="flex justify-between">
                        <span className="text-[rgba(26,26,26,0.5)]">Student Name:</span>
                        <span className="font-bold text-[#1a1a1a]">{rsvpStudentName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[rgba(26,26,26,0.5)]">Roll Number:</span>
                        <span className="font-bold text-[#1a1a1a]">{rsvpStudentId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[rgba(26,26,26,0.5)]">Affiliated Clan:</span>
                        <span className="font-bold text-[#c43a3a]">{rsvpClan}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[rgba(26,26,26,0.5)]">Assigned Block:</span>
                        <span className="font-bold text-white bg-[#1a1a1a] px-1.5 py-0.5">
                          {activeRsvpEvent.block}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[rgba(26,26,26,0.5)]">Specific Venue:</span>
                        <span className="font-bold text-[#1a1a1a]">{activeRsvpEvent.venueDetails}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[rgba(26,26,26,0.5)]">Date & Time:</span>
                        <span className="font-bold text-[#1a1a1a]">{activeRsvpEvent.date} · {activeRsvpEvent.time}</span>
                      </div>
                    </div>

                    {/* Barcode representation */}
                    <div className="pt-2">
                      <div className="h-10 bg-slate-900 mx-auto flex items-center justify-center text-white font-mono-space text-[10px] tracking-[0.3em]">
                        ||| | |||| | |||||| | ||| ||||
                      </div>
                      <span className="text-[9px] font-mono-space text-[rgba(26,26,26,0.4)] mt-1 block">
                        Present this pass or your physical Student ID at the {activeRsvpEvent.block} entrance turnstiles.
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => window.print()}
                      className="flex-1 py-3 bg-[#1a1a1a] text-white hover:bg-black font-mono-space text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Print Pass</span>
                    </button>
                    <button
                      onClick={() => setActiveRsvpEvent(null)}
                      className="px-5 py-3 border border-[#1a1a1a] font-mono-space text-xs uppercase cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                /* RSVP Form */
                <form onSubmit={handleRsvpSubmit} className="space-y-4 text-xs">
                  <div className="p-3 bg-[#fdfcf9] border border-[rgba(26,26,26,0.08)] space-y-1">
                    <div className="font-bold text-[#1a1a1a]">Venue Location:</div>
                    <div className="text-[rgba(26,26,26,0.6)]">
                      {activeRsvpEvent.venueDetails} ({activeRsvpEvent.block})
                    </div>
                    <div className="font-mono-space text-[11px] text-[#c43a3a]">
                      Coordinators: {activeRsvpEvent.facultyCoordinator.name} & {activeRsvpEvent.studentCoordinator.name}
                    </div>
                  </div>

                  <div>
                    <label className="font-mono-space text-[0.65rem] text-[rgba(26,26,26,0.6)] block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={rsvpStudentName}
                      onChange={(e) => setRsvpStudentName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[rgba(26,26,26,0.15)] text-[#1a1a1a]"
                    />
                  </div>

                  <div>
                    <label className="font-mono-space text-[0.65rem] text-[rgba(26,26,26,0.6)] block mb-1">
                      University Roll Number / Student ID *
                    </label>
                    <input
                      type="text"
                      required
                      value={rsvpStudentId}
                      onChange={(e) => setRsvpStudentId(e.target.value)}
                      placeholder="e.g. 2024MRUCS0881"
                      className="w-full px-3 py-2 bg-white border border-[rgba(26,26,26,0.15)] text-[#1a1a1a] font-mono-space"
                    />
                  </div>

                  <div>
                    <label className="font-mono-space text-[0.65rem] text-[rgba(26,26,26,0.6)] block mb-1">
                      Select Your Clan (For points tally) *
                    </label>
                    <select
                      value={rsvpClan}
                      onChange={(e) => setRsvpClan(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[rgba(26,26,26,0.15)] text-[#1a1a1a]"
                    >
                      <option value="Wild Cats">Wild Cats (Clan of Agility)</option>
                      <option value="Forest Rhinos">Forest Rhinos (Clan of Resilience)</option>
                      <option value="Air Falcons">Air Falcons (Clan of Vision)</option>
                      <option value="Water Sharks">Water Sharks (Clan of Mastery)</option>
                    </select>
                  </div>

                  <div className="pt-4 border-t border-[rgba(26,26,26,0.08)] flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveRsvpEvent(null)}
                      className="px-4 py-2 font-mono-space text-[rgba(26,26,26,0.5)] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#1a1a1a] text-white hover:bg-black font-semibold uppercase tracking-wider font-mono-space text-xs cursor-pointer"
                    >
                      Generate My Event Pass
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Schedule / Propose New Event Modal */}
      {isProposeModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1a1a1a]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fdfcf9] border border-[rgba(26,26,26,0.15)] max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in">
            <div className="p-6 border-b border-[rgba(26,26,26,0.08)] flex items-center justify-between bg-white">
              <div>
                <span className="font-mono-space text-[0.65rem] text-[#c43a3a] block mb-0.5">
                  DSW Event Scheduling Desk
                </span>
                <h3 className="font-serif-cormorant text-2xl font-semibold text-[#1a1a1a]">
                  Propose Campus Event (Blocks A - S)
                </h3>
              </div>
              <button
                onClick={() => setIsProposeModalOpen(false)}
                className="p-1 text-[rgba(26,26,26,0.5)] hover:text-[#1a1a1a] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProposeSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div>
                <label className="font-mono-space text-[0.65rem] text-[rgba(26,26,26,0.6)] block mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Annual Robotics Rover Challenge 2026"
                  className="w-full px-3 py-2 bg-white border border-[rgba(26,26,26,0.15)] text-[#1a1a1a]"
                />
              </div>

              <div>
                <label className="font-mono-space text-[0.65rem] text-[rgba(26,26,26,0.6)] block mb-1">
                  Subtitle / Theme
                </label>
                <input
                  type="text"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  placeholder="e.g., Autonomous navigation on Martian terrain mockup"
                  className="w-full px-3 py-2 bg-white border border-[rgba(26,26,26,0.15)] text-[#1a1a1a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-mono-space text-[0.65rem] text-[rgba(26,26,26,0.6)] block mb-1">
                    Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as EventCategory)}
                    className="w-full px-3 py-2 bg-white border border-[rgba(26,26,26,0.15)] text-[#1a1a1a]"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-mono-space text-[0.65rem] text-[#c43a3a] font-bold block mb-1">
                    Select Block (A through S) *
                  </label>
                  <select
                    value={newBlock}
                    onChange={(e) => {
                      const blk = e.target.value as CampusBlockLetter;
                      setNewBlock(blk);
                      setNewVenueDetails(`${blk} · Seminar Room 101`);
                    }}
                    className="w-full px-3 py-2 bg-white border-2 border-[#1a1a1a] text-[#1a1a1a] font-bold font-mono-space"
                  >
                    {ALL_BLOCKS.map((blk) => (
                      <option key={blk} value={blk}>{blk}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-mono-space text-[0.65rem] text-[rgba(26,26,26,0.6)] block mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[rgba(26,26,26,0.15)] text-[#1a1a1a] font-mono-space"
                  />
                </div>
                <div>
                  <label className="font-mono-space text-[0.65rem] text-[rgba(26,26,26,0.6)] block mb-1">
                    Time Window *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="e.g., 10:00 AM - 04:00 PM"
                    className="w-full px-3 py-2 bg-white border border-[rgba(26,26,26,0.15)] text-[#1a1a1a] font-mono-space"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono-space text-[0.65rem] text-[rgba(26,26,26,0.6)] block mb-1">
                  Specific Venue Details inside {newBlock} *
                </label>
                <input
                  type="text"
                  required
                  value={newVenueDetails}
                  onChange={(e) => setNewVenueDetails(e.target.value)}
                  placeholder="e.g. Block I · Room I-302 AI Lab"
                  className="w-full px-3 py-2 bg-white border border-[rgba(26,26,26,0.15)] text-[#1a1a1a]"
                />
              </div>

              <div>
                <label className="font-mono-space text-[0.65rem] text-[rgba(26,26,26,0.6)] block mb-1">
                  Organizing Society / Department *
                </label>
                <input
                  type="text"
                  required
                  value={newOrganizer}
                  onChange={(e) => setNewOrganizer(e.target.value)}
                  placeholder="e.g., DSW, Mridaksh Dance Society, or Clan Wild Cats"
                  className="w-full px-3 py-2 bg-white border border-[rgba(26,26,26,0.15)] text-[#1a1a1a]"
                />
              </div>

              {/* Coordinators */}
              <div className="p-3 bg-white border border-[rgba(26,26,26,0.1)] space-y-3">
                <span className="font-mono-space text-[0.65rem] text-[#1a1a1a] font-bold block">
                  Designated Event Coordinators
                </span>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="font-mono-space text-[9px] text-[rgba(26,26,26,0.5)] block">Faculty Name</label>
                    <input
                      type="text"
                      required
                      value={newFacultyName}
                      onChange={(e) => setNewFacultyName(e.target.value)}
                      className="w-full p-1.5 border border-[rgba(26,26,26,0.15)] text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="font-mono-space text-[9px] text-[rgba(26,26,26,0.5)] block">Designation</label>
                    <input
                      type="text"
                      required
                      value={newFacultyDesig}
                      onChange={(e) => setNewFacultyDesig(e.target.value)}
                      className="w-full p-1.5 border border-[rgba(26,26,26,0.15)] text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="font-mono-space text-[9px] text-[rgba(26,26,26,0.5)] block">Contact</label>
                    <input
                      type="text"
                      required
                      value={newFacultyContact}
                      onChange={(e) => setNewFacultyContact(e.target.value)}
                      className="w-full p-1.5 border border-[rgba(26,26,26,0.15)] text-[11px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[rgba(26,26,26,0.06)]">
                  <div>
                    <label className="font-mono-space text-[9px] text-[rgba(26,26,26,0.5)] block">Student Lead</label>
                    <input
                      type="text"
                      required
                      value={newStudentName}
                      onChange={(e) => setNewStudentName(e.target.value)}
                      className="w-full p-1.5 border border-[rgba(26,26,26,0.15)] text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="font-mono-space text-[9px] text-[rgba(26,26,26,0.5)] block">Clan / Branch</label>
                    <input
                      type="text"
                      required
                      value={newStudentClan}
                      onChange={(e) => setNewStudentClan(e.target.value)}
                      className="w-full p-1.5 border border-[rgba(26,26,26,0.15)] text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="font-mono-space text-[9px] text-[rgba(26,26,26,0.5)] block">Phone / Email</label>
                    <input
                      type="text"
                      required
                      value={newStudentContact}
                      onChange={(e) => setNewStudentContact(e.target.value)}
                      className="w-full p-1.5 border border-[rgba(26,26,26,0.15)] text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="font-mono-space text-[0.65rem] text-[rgba(26,26,26,0.6)] block mb-1">
                  Event Overview & Rules
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Outline the schedule, rounds, eligibility, and materials needed..."
                  className="w-full px-3 py-2 bg-white border border-[rgba(26,26,26,0.15)] text-[#1a1a1a]"
                />
              </div>

              <div className="pt-4 border-t border-[rgba(26,26,26,0.08)] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProposeModalOpen(false)}
                  className="px-4 py-2 font-mono-space text-[rgba(26,26,26,0.5)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1a1a1a] text-white hover:bg-black font-semibold uppercase tracking-wider font-mono-space text-xs cursor-pointer"
                >
                  Publish to Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
