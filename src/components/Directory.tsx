import React, { useState } from 'react';
import { CAMPUS_DEPARTMENTS } from '../data/mockData';
import { DepartmentContact } from '../types';
import { Building, Phone, Mail, Clock, Calendar, Check, X } from 'lucide-react';

export const Directory: React.FC = () => {
  const [search, setSearch] = useState('');
  const [bookingDept, setBookingDept] = useState<DepartmentContact | null>(null);
  const [bookingDate, setBookingDate] = useState('2026-10-16');
  const [bookingTime, setBookingTime] = useState('10:30 AM');
  const [bookingReason, setBookingReason] = useState('Academic Degree Audit & Course Planning');
  const [bookedConfirmation, setBookedConfirmation] = useState<string | null>(null);

  const filteredDepts = CAMPUS_DEPARTMENTS.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.services.some((s) => s.toLowerCase().includes(search.toLowerCase())) ||
      d.building.toLowerCase().includes(search.toLowerCase())
  );

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const code = `APT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setBookedConfirmation(code);
    setTimeout(() => {
      setBookingDept(null);
      setBookedConfirmation(null);
    }, 3500);
  };

  return (
    <div className="w-full">
      {/* Editorial Hero */}
      <div className="py-16 sm:py-20 px-6 sm:px-10 text-center border-b border-[rgba(26,26,26,0.08)] bg-[#fdfcf9]">
        <span className="font-mono-space text-[#c43a3a] tracking-[0.14em] block mb-2 font-semibold">
          Manav Rachna University · Sector 43, Faridabad
        </span>
        <h1 className="font-serif-cormorant text-4xl sm:text-6xl md:text-[4.5rem] font-light tracking-tight text-[#1a1a1a] leading-tight my-4 italic">
          Department Directory & Offices
        </h1>
        <p className="text-sm sm:text-lg text-[rgba(26,26,26,0.6)] max-w-2xl mx-auto leading-relaxed">
          Official departmental contacts, dean secretariats, block room numbers, office hours, and online appointment scheduling.
        </p>
      </div>

      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 py-12 sm:py-16 space-y-10">
        {/* Search header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(26,26,26,0.08)]">
          <span className="font-mono-space text-[#888]">
            Showing {filteredDepts.length} Divisions
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by department or service..."
            className="bg-transparent border-b border-[#1a1a1a] py-1 px-0 text-[0.8rem] text-[#1a1a1a] placeholder:text-[#999] focus:outline-none w-64"
          />
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDepts.map((dept) => (
            <div
              key={dept.id}
              className="border border-[rgba(26,26,26,0.12)] bg-white p-6 flex flex-col justify-between space-y-6 hover:border-[#1a1a1a] transition-colors"
            >
              <div className="space-y-4">
                <div>
                  <span className="font-mono-space text-[#a37d58] block mb-1">
                    {dept.building}
                  </span>
                  <h3 className="font-serif-cormorant text-2xl font-semibold text-[#1a1a1a]">
                    {dept.name}
                  </h3>
                </div>

                <div className="space-y-2 text-xs text-[#555] font-mono-space pt-2 border-t border-[rgba(26,26,26,0.06)]">
                  <div>Room: {dept.room}</div>
                  <div>Hours: {dept.hours}</div>
                  <div>
                    Tel:{' '}
                    <a href={`tel:${dept.phone}`} className="text-[#1a1a1a] font-bold hover:underline">
                      {dept.phone}
                    </a>
                  </div>
                  <div>
                    Email:{' '}
                    <a href={`mailto:${dept.email}`} className="text-[#1a1a1a] hover:underline">
                      {dept.email}
                    </a>
                  </div>
                </div>

                {/* Services */}
                <div className="pt-2">
                  <span className="font-mono-space text-[#888] block mb-1.5 text-[10px]">
                    Handled Operations:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {dept.services.map((svc, sIdx) => (
                      <span
                        key={sIdx}
                        className="font-mono-space text-[#1a1a1a] text-[10px] bg-[#f8f8f5] px-2 py-0.5 border border-[rgba(26,26,26,0.08)]"
                      >
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[rgba(26,26,26,0.08)]">
                <button
                  onClick={() => setBookingDept(dept)}
                  className="w-full py-2 bg-transparent text-[#1a1a1a] border border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white font-mono-space uppercase tracking-wider transition-colors cursor-pointer text-xs"
                >
                  Schedule Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Appointment Modal */}
      {bookingDept && (
        <div className="fixed inset-0 z-50 bg-[#1a1a1a]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fdfdfc] border border-[rgba(26,26,26,0.15)] max-w-md w-full p-6 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-[rgba(26,26,26,0.08)] mb-4">
              <div>
                <span className="font-mono-space text-[#a37d58] block">Academic Advising</span>
                <h3 className="font-serif-cormorant text-2xl font-semibold text-[#1a1a1a]">
                  {bookingDept.name}
                </h3>
              </div>
              <button
                onClick={() => setBookingDept(null)}
                className="p-1 text-[#666] hover:text-[#1a1a1a] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookedConfirmation ? (
              <div className="py-6 text-center space-y-3">
                <span className="font-mono-space text-[#065f46] font-bold block text-sm">
                  ✓ Booking Confirmed
                </span>
                <div className="font-serif-cormorant text-2xl font-semibold text-[#1a1a1a]">
                  Ref: {bookedConfirmation}
                </div>
                <p className="text-xs text-[#666]">
                  A calendar invite and preparation checklist has been logged for your student ID.
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="space-y-4 text-xs">
                <div>
                  <label className="font-mono-space text-[#666] block mb-1">Select Date</label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full p-2 border border-[rgba(26,26,26,0.15)] font-mono-space text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="font-mono-space text-[#666] block mb-1">Preferred Time Window</label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full p-2 border border-[rgba(26,26,26,0.15)] font-mono-space text-xs bg-white"
                  >
                    <option value="09:00 AM">09:00 AM (Early Window)</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="01:30 PM">01:30 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="04:15 PM">04:15 PM (Late Window)</option>
                  </select>
                </div>

                <div>
                  <label className="font-mono-space text-[#666] block mb-1">Consultation Purpose</label>
                  <textarea
                    rows={3}
                    required
                    value={bookingReason}
                    onChange={(e) => setBookingReason(e.target.value)}
                    className="w-full p-2 border border-[rgba(26,26,26,0.15)] text-xs bg-white"
                  />
                </div>

                <div className="pt-3 border-t border-[rgba(26,26,26,0.08)] flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setBookingDept(null)}
                    className="px-3 py-2 font-mono-space text-[#666] hover:text-[#1a1a1a] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#1a1a1a] text-white font-mono-space uppercase tracking-wider hover:bg-black cursor-pointer"
                  >
                    Confirm Slot
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
