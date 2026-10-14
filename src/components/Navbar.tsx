import React from 'react';

export type NavTab = 'ai-desk' | 'tickets' | 'kb' | 'gpa' | 'map' | 'directory';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  openEmergencyModal: () => void;
  openNewTicketModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openEmergencyModal,
}) => {
  return (
    <>
      {/* Top Notice */}
      <div className="bg-[#111111] text-[#ffffff] text-[0.7rem] py-2.5 px-6 sm:px-10 text-center tracking-[0.05em]">
        Fall Semester 2026 Add/Drop Window Closes Friday at 5:00 PM • Library Study Hall Open 24/7
      </div>

      {/* Editorial Header */}
      <header className="px-6 sm:px-10 py-6 sm:py-7 flex flex-col md:flex-row md:items-end justify-between gap-5 border-b border-[rgba(26,26,26,0.08)] bg-[#fdfcf9]">
        <div
          onClick={() => setActiveTab('tickets')}
          className="font-serif-cormorant text-3xl sm:text-[2.2rem] font-semibold leading-none tracking-[-0.02em] text-[#1a1a1a] cursor-pointer"
        >
          Southfield College
        </div>

        <nav className="flex items-center gap-6 sm:gap-7 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('ai-desk')}
            className={`text-[0.8rem] font-medium transition-colors cursor-pointer whitespace-nowrap bg-transparent border-none ${
              activeTab === 'ai-desk'
                ? 'text-[#1a1a1a] font-semibold underline underline-offset-4 decoration-1'
                : 'text-[rgba(26,26,26,0.5)] hover:text-[#1a1a1a]'
            }`}
          >
            AI Assistant
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`text-[0.8rem] font-medium transition-colors cursor-pointer whitespace-nowrap bg-transparent border-none ${
              activeTab === 'tickets'
                ? 'text-[#1a1a1a] font-semibold underline underline-offset-4 decoration-1'
                : 'text-[rgba(26,26,26,0.5)] hover:text-[#1a1a1a]'
            }`}
          >
            Tickets & Grievances
          </button>
          <button
            onClick={() => setActiveTab('kb')}
            className={`text-[0.8rem] font-medium transition-colors cursor-pointer whitespace-nowrap bg-transparent border-none ${
              activeTab === 'kb'
                ? 'text-[#1a1a1a] font-semibold underline underline-offset-4 decoration-1'
                : 'text-[rgba(26,26,26,0.5)] hover:text-[#1a1a1a]'
            }`}
          >
            Knowledge
          </button>
          <button
            onClick={() => setActiveTab('gpa')}
            className={`text-[0.8rem] font-medium transition-colors cursor-pointer whitespace-nowrap bg-transparent border-none ${
              activeTab === 'gpa'
                ? 'text-[#1a1a1a] font-semibold underline underline-offset-4 decoration-1'
                : 'text-[rgba(26,26,26,0.5)] hover:text-[#1a1a1a]'
            }`}
          >
            GPA
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`text-[0.8rem] font-medium transition-colors cursor-pointer whitespace-nowrap bg-transparent border-none ${
              activeTab === 'map'
                ? 'text-[#1a1a1a] font-semibold underline underline-offset-4 decoration-1'
                : 'text-[rgba(26,26,26,0.5)] hover:text-[#1a1a1a]'
            }`}
          >
            Map
          </button>
          <button
            onClick={() => setActiveTab('directory')}
            className={`text-[0.8rem] font-medium transition-colors cursor-pointer whitespace-nowrap bg-transparent border-none ${
              activeTab === 'directory'
                ? 'text-[#1a1a1a] font-semibold underline underline-offset-4 decoration-1'
                : 'text-[rgba(26,26,26,0.5)] hover:text-[#1a1a1a]'
            }`}
          >
            Directory
          </button>
          <button
            onClick={openEmergencyModal}
            className="text-[0.8rem] font-semibold text-[#c43a3a] hover:underline cursor-pointer whitespace-nowrap ml-2"
          >
            SOS
          </button>
        </nav>
      </header>
    </>
  );
};
