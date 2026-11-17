import React, { useState } from 'react';
import { CAMPUS_PHOTOS, CAMPUS_CLANS, INITIAL_EVENTS, ALL_BLOCKS } from '../data/mockData';
import { CampusPhoto, PhotoCategory, CampusBlockLetter } from '../types';
import { 
  Compass, Calendar, MessageSquareText, ShieldAlert, Award, 
  BookOpen, Bus, Clock, MapPin, CheckCircle2, AlertTriangle, 
  ExternalLink, ChevronRight, X, ZoomIn, ArrowRight, Sparkles,
  Users, Building2, Flame
} from 'lucide-react';

interface HomePageProps {
  onNavigateTab: (tab: 'events' | 'ai-desk' | 'tickets' | 'kb' | 'gpa' | 'map' | 'directory') => void;
  onSelectBlockInMap?: (block: string) => void;
  openEmergencyModal: () => void;
}

const PHOTO_CATEGORIES: PhotoCategory[] = [
  'All',
  'Academic Blocks',
  'Library & Study',
  'Auditoriums & Halls',
  'Sports & Outdoors',
  'Student Hangouts'
];

export const HomePage: React.FC<HomePageProps> = ({
  onNavigateTab,
  onSelectBlockInMap,
  openEmergencyModal,
}) => {
  // Attendance Forecaster State
  const [totalClasses, setTotalClasses] = useState<number>(45);
  const [attendedClasses, setAttendedClasses] = useState<number>(33);

  // Gallery Filter State
  const [activeCategory, setActiveCategory] = useState<PhotoCategory>('All');
  const [selectedPhoto, setSelectedPhoto] = useState<CampusPhoto | null>(null);

  // Calculation for 75% attendance rule
  const attendanceRate = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;
  
  // Forecast: how many more classes needed to reach 75%
  // (attended + x) / (total + x) >= 0.75  =>  attended + x >= 0.75*total + 0.75*x  =>  0.25*x >= 0.75*total - attended
  // x >= (3*total - 4*attended)
  const classesNeededFor75 = Math.max(0, Math.ceil(3 * totalClasses - 4 * attendedClasses));
  
  // How many classes can be safely missed:
  // attended / (total + y) >= 0.75 => attended >= 0.75 * total + 0.75 * y => 0.75 * y <= attended - 0.75 * total
  // y <= (4 * attended - 3 * total) / 3
  const safeClassesToMiss = Math.max(0, Math.floor((4 * attendedClasses - 3 * totalClasses) / 3));

  const filteredPhotos = CAMPUS_PHOTOS.filter(
    (photo) => activeCategory === 'All' || photo.category === activeCategory
  );

  const handleOpenPhotoInMap = (blockName?: string) => {
    if (blockName) {
      if (onSelectBlockInMap) {
        onSelectBlockInMap(blockName);
      }
      onNavigateTab('map');
    }
  };

  const handleOpenPhotoEvents = (_blockName?: string) => {
    onNavigateTab('events');
  };

  return (
    <div className="w-full bg-[#fdfcf9] text-[#1a1a1a]">
      {/* Editorial Hero Banner */}
      <section className="relative border-b border-[rgba(26,26,26,0.08)] bg-[#fdfcf9] overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-[1360px] mx-auto px-6 sm:px-10 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 text-[0.65rem] font-mono-space tracking-[0.18em] uppercase bg-[#111111] text-white">
              <Sparkles className="w-3 h-3 text-[#c43a3a]" />
              <span>Manav Rachna University • Sector 43, Faridabad</span>
            </div>

            <h1 className="font-serif-cormorant text-4xl sm:text-6xl lg:text-[4.2rem] font-light tracking-tight text-[#1a1a1a] leading-[1.05]">
              Empowering Student Life Across <span className="italic font-normal underline decoration-[#c43a3a] decoration-1 underline-offset-8">Blocks A to S</span>
            </h1>

            <p className="text-sm sm:text-base text-[rgba(26,26,26,0.65)] leading-relaxed max-w-xl font-normal">
              Rooted in the eternal Vedic philosophy of <em>Vidyanatariksham</em> (Wisdom Beyond Horizons), 
              Manav Rachna University’s lush 60-acre Aravalli campus unites 19 interconnected blocks. 
              This unified digital portal is engineered to streamline collegiate life—from real-time attendance calculations and 4-clan championships to 24/7 library spaces and campus event passes.
            </p>

            {/* Quick Action Matrix */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigateTab('events')}
                className="px-5 py-2.5 bg-[#c43a3a] text-white text-xs font-mono-space tracking-wider uppercase hover:bg-[#a62b2b] transition-colors cursor-pointer flex items-center gap-2"
              >
                <span>Campus Events (A-S)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onNavigateTab('ai-desk')}
                className="px-5 py-2.5 bg-[#1a1a1a] text-white text-xs font-mono-space tracking-wider uppercase hover:bg-black transition-colors cursor-pointer flex items-center gap-2"
              >
                <MessageSquareText className="w-3.5 h-3.5 text-[#e5e5e5]" />
                <span>AI Student Desk</span>
              </button>

              <button
                onClick={() => onNavigateTab('map')}
                className="px-5 py-2.5 border border-[#1a1a1a] text-[#1a1a1a] text-xs font-mono-space tracking-wider uppercase hover:bg-[#1a1a1a] hover:text-white transition-colors cursor-pointer flex items-center gap-2"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Explore 19 Blocks</span>
              </button>
            </div>

            {/* Quick Stat Strip */}
            <div className="pt-6 border-t border-[rgba(26,26,26,0.08)] grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="font-serif-cormorant text-3xl font-semibold text-[#1a1a1a]">19</span>
                <span className="block font-mono-space text-[0.65rem] text-[rgba(26,26,26,0.55)] uppercase">Connected Blocks</span>
              </div>
              <div>
                <span className="font-serif-cormorant text-3xl font-semibold text-[#c43a3a]">4</span>
                <span className="block font-mono-space text-[0.65rem] text-[rgba(26,26,26,0.55)] uppercase">Student Clans</span>
              </div>
              <div>
                <span className="font-serif-cormorant text-3xl font-semibold text-[#1a1a1a]">75%</span>
                <span className="block font-mono-space text-[0.65rem] text-[rgba(26,26,26,0.55)] uppercase">Exam Attendance Rule</span>
              </div>
              <div>
                <span className="font-serif-cormorant text-3xl font-semibold text-[#1a1a1a]">24/7</span>
                <span className="block font-mono-space text-[0.65rem] text-[rgba(26,26,26,0.55)] uppercase">Block H Library</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Collage featuring real user photos */}
          <div className="relative">
            <div className="border border-[#1a1a1a] bg-white p-3 shadow-sm relative z-10">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#111]">
                <img
                  src="/assets/aistudio/WhatsApp_Image_2026-10-28_at_12.56.36_PM_b7e6edc6.jpeg"
                  alt="Block K Amphitheatre Steps at Manav Rachna University"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#111]/85 text-white font-mono-space text-[0.65rem] px-2.5 py-1 tracking-wider uppercase border border-white/20">
                  Block K · Central Steps & Amphitheatre
                </div>
                <div className="absolute bottom-3 left-3 right-3 bg-black/75 text-white text-xs p-2.5 backdrop-blur-xs font-mono-space text-[11px] flex items-center justify-between">
                  <span>Student Gathering & Clan Amphitheatre Lawn</span>
                  <button 
                    onClick={() => setSelectedPhoto(CAMPUS_PHOTOS[0])}
                    className="text-[#c43a3a] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>Expand</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Inset Secondary Photo */}
            <div className="hidden sm:block absolute -bottom-8 -left-8 w-56 border border-[#1a1a1a] bg-white p-2 shadow-lg z-20">
              <div className="aspect-[4/3] overflow-hidden bg-black">
                <img
                  src="/assets/aistudio/WhatsApp_Image_2026-10-28_at_12.56.36_PM__1__b41f8ef1.jpeg"
                  alt="Dr. O.P. Bhalla Central Library Eco Reading Lounge"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="pt-1.5 text-[10px] font-mono-space text-[#1a1a1a] font-semibold truncate">
                Block H · Central Library
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* "Making Student Lives Better" - 4 Pillars */}
      <section className="py-16 sm:py-20 px-6 sm:px-10 border-b border-[rgba(26,26,26,0.08)] bg-white">
        <div className="max-w-[1360px] mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="font-mono-space text-xs text-[#c43a3a] uppercase tracking-[0.2em] font-semibold">
              Collegiate Welfare & Purpose
            </span>
            <h2 className="font-serif-cormorant text-3xl sm:text-5xl font-light text-[#1a1a1a]">
              Dedicated to Making Student Lives Better
            </h2>
            <p className="text-xs sm:text-sm text-[rgba(26,26,26,0.6)] leading-relaxed">
              We eliminate administrative ambiguity and foster vibrant student culture through transparent tools, automated resolution, and authentic campus spaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Pillar 1 */}
            <div className="border border-[rgba(26,26,26,0.12)] p-6 bg-[#fdfcf9] space-y-4 hover:border-[#1a1a1a] transition-all">
              <div className="w-10 h-10 bg-[#1a1a1a] text-white flex items-center justify-center font-mono-space text-sm">
                01
              </div>
              <h3 className="font-serif-cormorant text-xl font-bold text-[#1a1a1a]">
                Attendance & Exam Assurance
              </h3>
              <p className="text-xs text-[rgba(26,26,26,0.65)] leading-relaxed">
                Manav Rachna strictly monitors the 75% attendance threshold. Our live calculator lets you project every lecture so you never face debarment risks or last-minute panic.
              </p>
              <div className="pt-2">
                <a 
                  href="#attendance-tool"
                  className="text-xs font-mono-space text-[#c43a3a] hover:underline font-bold inline-flex items-center gap-1"
                >
                  <span>Forecast Attendance</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="border border-[rgba(26,26,26,0.12)] p-6 bg-[#fdfcf9] space-y-4 hover:border-[#1a1a1a] transition-all">
              <div className="w-10 h-10 bg-[#c43a3a] text-white flex items-center justify-center font-mono-space text-sm">
                02
              </div>
              <h3 className="font-serif-cormorant text-xl font-bold text-[#1a1a1a]">
                4-Clan Championship Culture
              </h3>
              <p className="text-xs text-[rgba(26,26,26,0.65)] leading-relaxed">
                Connect beyond departments in <em>Air Falcons, Wild Cats, Forest Rhinos,</em> or <em>Water Sharks</em>. Earn recognized Life-Skill credit points across sports, cultural battles, and fests.
              </p>
              <div className="pt-2">
                <a 
                  href="#clan-section"
                  className="text-xs font-mono-space text-[#c43a3a] hover:underline font-bold inline-flex items-center gap-1"
                >
                  <span>View Clan Standings</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="border border-[rgba(26,26,26,0.12)] p-6 bg-[#fdfcf9] space-y-4 hover:border-[#1a1a1a] transition-all">
              <div className="w-10 h-10 bg-[#1a1a1a] text-white flex items-center justify-center font-mono-space text-sm">
                03
              </div>
              <h3 className="font-serif-cormorant text-xl font-bold text-[#1a1a1a]">
                Effortless 19-Block Wayfinding
              </h3>
              <p className="text-xs text-[rgba(26,26,26,0.65)] leading-relaxed">
                Never miss a classroom or lab. Complete floor plans, facility directories, and verified coordinates for all blocks from Block A to Block S.
              </p>
              <div className="pt-2">
                <button 
                  onClick={() => onNavigateTab('map')}
                  className="text-xs font-mono-space text-[#c43a3a] hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Interactive Map</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="border border-[rgba(26,26,26,0.12)] p-6 bg-[#fdfcf9] space-y-4 hover:border-[#1a1a1a] transition-all">
              <div className="w-10 h-10 bg-[#1a1a1a] text-white flex items-center justify-center font-mono-space text-sm">
                04
              </div>
              <h3 className="font-serif-cormorant text-xl font-bold text-[#1a1a1a]">
                Transparent Redressal & Safety
              </h3>
              <p className="text-xs text-[rgba(26,26,26,0.65)] leading-relaxed">
                Direct tickets routed to DSW (Block J), 24/7 security control at Gate 1, instant anti-ragging support, and anonymous counseling services in Block N.
              </p>
              <div className="pt-2">
                <button 
                  onClick={openEmergencyModal}
                  className="text-xs font-mono-space text-[#c43a3a] hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>24/7 Emergency Contacts</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Feature: Attendance 75% Rule Planner Widget */}
      <section id="attendance-tool" className="py-16 sm:py-20 px-6 sm:px-10 border-b border-[rgba(26,26,26,0.08)] bg-[#fdfdfc]">
        <div className="max-w-[1100px] mx-auto border border-[#1a1a1a] p-8 sm:p-12 bg-white space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[rgba(26,26,26,0.08)]">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono-space uppercase tracking-wider text-[#c43a3a] font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>MRU Regulation Compliance Tool</span>
              </div>
              <h3 className="font-serif-cormorant text-3xl sm:text-4xl font-semibold text-[#1a1a1a] mt-1">
                Attendance 75% Rule Planner
              </h3>
            </div>
            <div className="text-xs font-mono-space text-[rgba(26,26,26,0.6)]">
              UGC & MRU End-Term Eligibility Criteria
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Input Controls */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-mono-space mb-1.5">
                  <span className="font-semibold text-[#1a1a1a]">Total Lectures Conducted:</span>
                  <span className="font-bold text-[#c43a3a]">{totalClasses}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="120"
                  value={totalClasses}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setTotalClasses(val);
                    if (attendedClasses > val) setAttendedClasses(val);
                  }}
                  className="w-full accent-[#c43a3a] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono-space mb-1.5">
                  <span className="font-semibold text-[#1a1a1a]">Lectures You Have Attended:</span>
                  <span className="font-bold text-[#c43a3a]">{attendedClasses}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={totalClasses}
                  value={attendedClasses}
                  onChange={(e) => setAttendedClasses(Number(e.target.value))}
                  className="w-full accent-[#c43a3a] cursor-pointer"
                />
              </div>

              <div className="flex gap-2">
                {[
                  { label: '40 / 30', t: 40, a: 30 },
                  { label: '50 / 35', t: 50, a: 35 },
                  { label: '60 / 48', t: 60, a: 48 },
                  { label: '80 / 60', t: 80, a: 60 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      setTotalClasses(preset.t);
                      setAttendedClasses(preset.a);
                    }}
                    className="px-2.5 py-1 text-[11px] font-mono-space border border-[rgba(26,26,26,0.2)] hover:border-[#1a1a1a] cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Display */}
            <div className="p-6 border border-[rgba(26,26,26,0.12)] bg-[#fdfcf9] space-y-4">
              <div className="flex items-end justify-between">
                <span className="font-mono-space text-xs text-[rgba(26,26,26,0.6)] uppercase">
                  Current Percentage
                </span>
                <span
                  className={`font-serif-cormorant text-5xl font-bold tabular-nums ${
                    attendanceRate >= 75 ? 'text-[#16a34a]' : 'text-[#c43a3a]'
                  }`}
                >
                  {attendanceRate.toFixed(1)}%
                </span>
              </div>

              <div className="w-full bg-[rgba(26,26,26,0.08)] h-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    attendanceRate >= 75 ? 'bg-[#16a34a]' : 'bg-[#c43a3a]'
                  }`}
                  style={{ width: `${Math.min(100, attendanceRate)}%` }}
                />
              </div>

              {/* Status Message */}
              <div className="pt-2 text-xs font-mono-space leading-relaxed">
                {attendanceRate >= 75 ? (
                  <div className="flex items-start gap-2 text-[#15803d]">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block">Eligible for End-Term Exams!</strong>
                      <span>
                        You have attended enough lectures. You can safely miss up to{' '}
                        <strong>{safeClassesToMiss} upcoming classes</strong> and still maintain the 75% threshold.
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 text-[#b91c1c]">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block">Attendance Shortfall (Below 75%)</strong>
                      <span>
                        You need to attend your next{' '}
                        <strong>{classesNeededFor75} consecutive lectures</strong> without absence to restore your standing.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[rgba(26,26,26,0.08)] flex justify-between items-center text-[11px] font-mono-space text-[rgba(26,26,26,0.55)]">
                <span>Sync with iCloudEMS portal</span>
                <button
                  onClick={() => onNavigateTab('tickets')}
                  className="text-[#1a1a1a] hover:underline font-semibold cursor-pointer"
                >
                  Medical Leave Appeal →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Daily Student Essentials Pulse */}
      <section className="py-14 sm:py-16 px-6 sm:px-10 border-b border-[rgba(26,26,26,0.08)] bg-white">
        <div className="max-w-[1360px] mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(26,26,26,0.08)]">
            <div>
              <span className="font-mono-space text-xs text-[#c43a3a] uppercase tracking-wider font-semibold">
                Daily Transit & Amenities
              </span>
              <h3 className="font-serif-cormorant text-2xl sm:text-3xl font-semibold text-[#1a1a1a] mt-1">
                Student Campus Pulse
              </h3>
            </div>
            <div className="text-xs font-mono-space text-[rgba(26,26,26,0.5)]">
              Real-time daily schedule indicators
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Metro Shuttles */}
            <div className="p-5 border border-[rgba(26,26,26,0.1)] bg-[#fdfcf9] space-y-3">
              <div className="flex items-center gap-2 font-mono-space text-xs font-bold text-[#1a1a1a]">
                <Bus className="w-4 h-4 text-[#c43a3a]" />
                <span>Metro & Highway Shuttles</span>
              </div>
              <p className="text-xs text-[rgba(26,26,26,0.65)] leading-relaxed">
                Free feeder buses connect Sector 43 campus with Badkhal Mor Metro Station (Violet Line).
              </p>
              <div className="pt-2 text-xs font-mono-space space-y-1 text-[#555]">
                <div className="flex justify-between">
                  <span>Badkhal Mor Metro Feeder:</span>
                  <span className="font-bold text-[#1a1a1a]">Every 15 mins (07:30 - 18:30)</span>
                </div>
                <div className="flex justify-between">
                  <span>Tuglakabad & South Delhi:</span>
                  <span className="font-bold text-[#1a1a1a]">Departures 17:15 & 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Gurgaon IFFCO Chowk:</span>
                  <span className="font-bold text-[#1a1a1a]">Morning 07:15 / Eve 17:30</span>
                </div>
              </div>
            </div>

            {/* Central Library Status */}
            <div className="p-5 border border-[rgba(26,26,26,0.1)] bg-[#fdfcf9] space-y-3">
              <div className="flex items-center gap-2 font-mono-space text-xs font-bold text-[#1a1a1a]">
                <BookOpen className="w-4 h-4 text-[#c43a3a]" />
                <span>Dr. O.P. Bhalla Central Library</span>
              </div>
              <p className="text-xs text-[rgba(26,26,26,0.65)] leading-relaxed">
                Block H · 4 floors with eco-bamboo sanctuary, Wi-Fi collaborative pods, and silent thesis rooms.
              </p>
              <div className="pt-2 text-xs font-mono-space space-y-1 text-[#555]">
                <div className="flex justify-between">
                  <span>Circulation Desk:</span>
                  <span className="font-bold text-[#1a1a1a]">08:00 AM - 10:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Eco-Turf Bamboo Floor:</span>
                  <span className="font-bold text-[#16a34a]">Open for Study</span>
                </div>
                <div className="flex justify-between">
                  <span>Exam Season Access:</span>
                  <span className="font-bold text-[#c43a3a]">24 Hours Overnight</span>
                </div>
              </div>
            </div>

            {/* Campus Hangouts & Food */}
            <div className="p-5 border border-[rgba(26,26,26,0.1)] bg-[#fdfcf9] space-y-3">
              <div className="flex items-center gap-2 font-mono-space text-xs font-bold text-[#1a1a1a]">
                <Building2 className="w-4 h-4 text-[#c43a3a]" />
                <span>Food & Student Courtyards</span>
              </div>
              <p className="text-xs text-[rgba(26,26,26,0.65)] leading-relaxed">
                Outdoor seating plazas between Blocks B, C & D with multi-cuisine student dining outlets.
              </p>
              <div className="pt-2 text-xs font-mono-space space-y-1 text-[#555]">
                <div className="flex justify-between">
                  <span>Bunkyard Bistro & Subway:</span>
                  <span className="font-bold text-[#1a1a1a]">08:30 AM - 08:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Chaigaram & Nescafe Hub:</span>
                  <span className="font-bold text-[#1a1a1a]">Open near Block C Lawn</span>
                </div>
                <div className="flex justify-between">
                  <span>Hostel Dining Halls:</span>
                  <span className="font-bold text-[#1a1a1a]">Breakfast, Lunch, Dinner</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Visual Archive & Real Photo Gallery */}
      <section className="py-16 sm:py-24 px-6 sm:px-10 border-b border-[rgba(26,26,26,0.08)] bg-[#fdfcf9]">
        <div className="max-w-[1360px] mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[rgba(26,26,26,0.08)]">
            <div className="space-y-2">
              <span className="font-mono-space text-xs text-[#c43a3a] uppercase tracking-[0.2em] font-semibold">
                Authentic Campus Documentation
              </span>
              <h2 className="font-serif-cormorant text-3xl sm:text-5xl font-light text-[#1a1a1a]">
                Campus Visual Archive & Block Tour
              </h2>
              <p className="text-xs sm:text-sm text-[rgba(26,26,26,0.6)] max-w-xl">
                Explore real photographs of our campus architecture, the iconic Block K steps, central amphitheatres, eco-bamboo library, and Aravalli sports fields.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {PHOTO_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-mono-space whitespace-nowrap border transition-colors cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                      : 'bg-white text-[rgba(26,26,26,0.6)] border-[rgba(26,26,26,0.12)] hover:border-[#1a1a1a]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className="group border border-[rgba(26,26,26,0.12)] bg-white overflow-hidden cursor-pointer hover:border-[#1a1a1a] transition-all hover:shadow-md flex flex-col"
              >
                {/* Image Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#111]">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />

                  {/* Top Block Badge */}
                  {photo.block && (
                    <span className="absolute top-3 left-3 bg-[#1a1a1a]/90 text-white font-mono-space text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider border border-white/20">
                      {photo.block}
                    </span>
                  )}

                  {/* Expand Overlay */}
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 text-white p-1.5 rounded-xs">
                    <ZoomIn className="w-4 h-4" />
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="font-mono-space text-[10px] text-[#c43a3a] block uppercase font-semibold">
                      {photo.location}
                    </span>
                    <h4 className="font-serif-cormorant text-xl font-bold text-[#1a1a1a] group-hover:text-[#c43a3a] transition-colors mt-0.5">
                      {photo.title}
                    </h4>
                    <p className="text-xs text-[rgba(26,26,26,0.6)] mt-2 line-clamp-2 leading-relaxed">
                      {photo.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[rgba(26,26,26,0.06)] flex items-center justify-between text-[11px] font-mono-space text-[rgba(26,26,26,0.5)]">
                    <span>{photo.category}</span>
                    <span className="text-[#1a1a1a] font-semibold group-hover:underline flex items-center gap-1">
                      <span>View Details</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4-Clan Championship System */}
      <section id="clan-section" className="py-16 sm:py-24 px-6 sm:px-10 border-b border-[rgba(26,26,26,0.08)] bg-white">
        <div className="max-w-[1360px] mx-auto space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-[rgba(26,26,26,0.08)]">
            <div className="space-y-2">
              <span className="font-mono-space text-xs text-[#c43a3a] uppercase tracking-[0.2em] font-semibold">
                University Life-Skills Programme
              </span>
              <h2 className="font-serif-cormorant text-3xl sm:text-5xl font-light text-[#1a1a1a]">
                The 4-Clan Championship Ecosystem
              </h2>
              <p className="text-xs sm:text-sm text-[rgba(26,26,26,0.6)] max-w-xl">
                Every Manav Rachna student is inducted into one of four vibrant clans. Points earned in technical hackathons, athletic tournaments, and cultural battles compete for the annual University Clan Trophy.
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('events')}
              className="px-4 py-2 border border-[#1a1a1a] text-xs font-mono-space uppercase tracking-wider hover:bg-[#1a1a1a] hover:text-white transition-colors cursor-pointer shrink-0"
            >
              Browse Clan-Qualifying Events →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CAMPUS_CLANS.map((clan) => (
              <div
                key={clan.id}
                className="border p-6 flex flex-col justify-between space-y-6 transition-all hover:shadow-md"
                style={{ 
                  backgroundColor: clan.bgLight, 
                  borderColor: clan.borderColor 
                }}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{clan.mascot}</span>
                    <span 
                      className="font-mono-space text-xs font-bold px-2.5 py-0.5 border"
                      style={{ color: clan.textColor, borderColor: clan.borderColor, backgroundColor: '#ffffff' }}
                    >
                      {clan.points.toLocaleString()} PTS
                    </span>
                  </div>

                  <div>
                    <span 
                      className="font-mono-space text-[10px] uppercase tracking-wider block font-bold"
                      style={{ color: clan.textColor }}
                    >
                      Element of {clan.element}
                    </span>
                    <h3 className="font-serif-cormorant text-2xl font-bold text-[#1a1a1a] mt-0.5">
                      {clan.name}
                    </h3>
                  </div>

                  <p className="text-xs text-[rgba(26,26,26,0.7)] leading-relaxed">
                    {clan.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[rgba(26,26,26,0.08)] space-y-1.5 text-[11px] font-mono-space">
                  <div className="text-[rgba(26,26,26,0.6)] italic">"{clan.motto}"</div>
                  <div className="text-[rgba(26,26,26,0.7)]">
                    <span className="font-semibold text-[#1a1a1a]">Lead: </span>{clan.leader}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Upcoming Events Preview */}
      <section className="py-16 sm:py-20 px-6 sm:px-10 bg-[#fdfdfc] border-b border-[rgba(26,26,26,0.08)]">
        <div className="max-w-[1360px] mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(26,26,26,0.08)]">
            <div>
              <span className="font-mono-space text-xs text-[#c43a3a] uppercase tracking-wider font-semibold">
                Live On Campus
              </span>
              <h3 className="font-serif-cormorant text-2xl sm:text-4xl font-semibold text-[#1a1a1a] mt-1">
                Upcoming Events Across Blocks A to S
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('events')}
              className="text-xs font-mono-space text-[#c43a3a] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Explore All {INITIAL_EVENTS.length} Campus Events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {INITIAL_EVENTS.slice(0, 3).map((evt) => (
              <div
                key={evt.id}
                className="border border-[rgba(26,26,26,0.12)] p-6 bg-white space-y-4 hover:border-[#1a1a1a] transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-[#1a1a1a] text-white font-mono-space text-[10px] px-2 py-0.5 font-bold">
                      {evt.block}
                    </span>
                    <span className="font-mono-space text-[10px] text-[#c43a3a] font-bold">
                      {evt.registrationStatus}
                    </span>
                  </div>

                  <h4 className="font-serif-cormorant text-xl font-bold text-[#1a1a1a]">
                    {evt.title}
                  </h4>

                  <p className="text-xs text-[rgba(26,26,26,0.6)] line-clamp-2 leading-relaxed">
                    {evt.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[rgba(26,26,26,0.08)] space-y-2 text-xs font-mono-space">
                  <div className="flex items-center gap-2 text-[#555]">
                    <Calendar className="w-3.5 h-3.5 text-[#c43a3a]" />
                    <span>{evt.date} · {evt.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#555]">
                    <MapPin className="w-3.5 h-3.5 text-[#c43a3a]" />
                    <span className="truncate">{evt.venueDetails}</span>
                  </div>
                  <button
                    onClick={() => onNavigateTab('events')}
                    className="w-full mt-2 py-2 bg-[#fdfcf9] hover:bg-[#1a1a1a] hover:text-white border border-[#1a1a1a] text-center text-[11px] font-mono-space uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Get Admission Pass →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 sm:p-8 backdrop-blur-xs">
          <div className="relative max-w-4xl w-full bg-white border border-[#1a1a1a] overflow-hidden flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[rgba(26,26,26,0.1)] flex items-center justify-between bg-[#fdfcf9]">
              <div className="flex items-center gap-2">
                <span className="font-mono-space text-xs font-bold bg-[#c43a3a] text-white px-2 py-0.5">
                  {selectedPhoto.block || 'Campus View'}
                </span>
                <span className="font-mono-space text-xs text-[rgba(26,26,26,0.6)]">
                  {selectedPhoto.category}
                </span>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-1 text-[#666] hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto flex-1 p-6 space-y-5">
              <div className="w-full max-h-[55vh] bg-[#111] overflow-hidden flex items-center justify-center">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.title}
                  className="w-full h-auto max-h-[55vh] object-contain"
                />
              </div>

              <div>
                <span className="font-mono-space text-xs text-[#c43a3a] block uppercase font-semibold">
                  Location: {selectedPhoto.location}
                </span>
                <h3 className="font-serif-cormorant text-2xl sm:text-3xl font-semibold text-[#1a1a1a] mt-1">
                  {selectedPhoto.title}
                </h3>
                <p className="text-xs sm:text-sm text-[rgba(26,26,26,0.7)] leading-relaxed mt-2">
                  {selectedPhoto.description}
                </p>
              </div>

              {/* Navigation Actions */}
              <div className="pt-4 border-t border-[rgba(26,26,26,0.1)] flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs font-mono-space text-[rgba(26,26,26,0.5)]">
                  Manav Rachna University Authentic Architectural Archive
                </div>
                <div className="flex items-center gap-3">
                  {selectedPhoto.block && (
                    <button
                      onClick={() => {
                        const blk = selectedPhoto.block;
                        setSelectedPhoto(null);
                        handleOpenPhotoInMap(blk);
                      }}
                      className="px-4 py-2 border border-[#1a1a1a] text-xs font-mono-space uppercase tracking-wider hover:bg-[#1a1a1a] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#c43a3a]" />
                      <span>Inspect {selectedPhoto.block} in Map</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedPhoto(null);
                      handleOpenPhotoEvents(selectedPhoto.block);
                    }}
                    className="px-4 py-2 bg-[#c43a3a] text-white text-xs font-mono-space uppercase tracking-wider hover:bg-[#a62b2b] transition-colors cursor-pointer"
                  >
                    View Events Here →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
