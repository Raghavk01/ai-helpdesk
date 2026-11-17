import React, { useState } from 'react';
import { CAMPUS_BUILDINGS, ALL_BLOCKS } from '../data/mockData';
import { CampusBuilding } from '../types';
import { MapPin, Navigation, Compass, Layers } from 'lucide-react';

export const CampusMap: React.FC = () => {
  const [selectedBuilding, setSelectedBuilding] = useState<CampusBuilding>(CAMPUS_BUILDINGS[0]);
  const [filterBlock, setFilterBlock] = useState<string>('all');
  const [showDirections, setShowDirections] = useState(false);

  const filteredBuildings = CAMPUS_BUILDINGS.filter(
    (b) => filterBlock === 'all' || b.blockLetter === filterBlock
  );

  return (
    <div className="w-full">
      {/* Editorial Hero */}
      <div className="py-16 sm:py-20 px-6 sm:px-10 text-center border-b border-[rgba(26,26,26,0.08)] bg-[#fdfcf9]">
        <span className="font-mono-space text-[#c43a3a] tracking-[0.16em] block mb-2 font-bold text-xs">
          Manav Rachna University · Sector 43, Aravalli Hills
        </span>
        <h1 className="font-serif-cormorant text-4xl sm:text-6xl md:text-[4.5rem] font-light tracking-tight text-[#1a1a1a] leading-tight my-4 italic">
          Campus Blocks Map (Blocks A to S)
        </h1>
        <p className="text-sm sm:text-lg text-[rgba(26,26,26,0.6)] max-w-2xl mx-auto leading-relaxed">
          Interactive master plan for all 19 infrastructure blocks, engineering workshops, sports arenas, moot court, and academic departments.
        </p>
      </div>

      <div className="max-w-[1360px] mx-auto px-6 sm:px-10 py-12 sm:py-16 space-y-10">
        {/* Quick Block Filter Bar */}
        <div className="space-y-3 pb-3 border-b border-[rgba(26,26,26,0.08)]">
          <div className="flex items-center justify-between">
            <span className="font-mono-space text-[0.65rem] text-[rgba(26,26,26,0.5)] uppercase tracking-wider">
              Jump to Specific Block:
            </span>
            <span className="font-mono-space text-[0.65rem] text-[#c43a3a] font-bold">
              {filterBlock === 'all' ? 'Displaying All Blocks' : `Focusing on ${filterBlock}`}
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
            <button
              onClick={() => setFilterBlock('all')}
              className={`px-3.5 py-1 text-xs font-mono-space transition-colors whitespace-nowrap cursor-pointer border ${
                filterBlock === 'all'
                  ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                  : 'bg-white text-[rgba(26,26,26,0.6)] border-[rgba(26,26,26,0.12)] hover:border-[#1a1a1a]'
              }`}
            >
              All (A-S)
            </button>
            {ALL_BLOCKS.map((blk) => (
              <button
                key={blk}
                onClick={() => {
                  setFilterBlock(blk);
                  const found = CAMPUS_BUILDINGS.find((b) => b.blockLetter === blk);
                  if (found) setSelectedBuilding(found);
                }}
                className={`px-2.5 py-1 text-xs font-mono-space transition-colors whitespace-nowrap cursor-pointer border ${
                  filterBlock === blk
                    ? 'bg-[#c43a3a] text-white border-[#c43a3a] font-bold'
                    : 'bg-white text-[rgba(26,26,26,0.6)] border-[rgba(26,26,26,0.12)] hover:border-[#1a1a1a]'
                }`}
              >
                {blk.replace('Block ', '')}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column: Map Canvas + Building Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-12 sm:gap-16">
          <div className="space-y-6">
            {/* Map Frame */}
            <div className="relative bg-[#1a1a1a] aspect-[16/10] overflow-hidden border border-[#1a1a1a]">
              <img
                src="/assets/aistudio/WhatsApp_Image_2026-10-28_at_12.56.37_PM_f8e302a1.jpeg"
                alt="Manav Rachna University Quad View"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

              <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-[#1a1a1a]/90 px-3 py-1.5 text-white font-mono-space border border-white/20 text-xs">
                <Compass className="w-3.5 h-3.5 text-[#c43a3a]" />
                <span>Manav Rachna University Campus · Blocks A-S</span>
              </div>

              {/* Building Pins */}
              {filteredBuildings.map((bldg) => {
                const isSelected = selectedBuilding.id === bldg.id;
                return (
                  <button
                    key={bldg.id}
                    onClick={() => {
                      setSelectedBuilding(bldg);
                      setShowDirections(false);
                    }}
                    style={{
                      left: `${bldg.coordinates.x}%`,
                      top: `${bldg.coordinates.y}%`,
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer focus:outline-none"
                  >
                    <div
                      className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono-space transition-all ${
                        isSelected
                          ? 'bg-[#c43a3a] text-white ring-2 ring-white scale-110 font-bold'
                          : 'bg-white text-[#1a1a1a] hover:bg-[#fdfcf9]'
                      }`}
                    >
                      <MapPin className="w-3 h-3" />
                      <span>{bldg.code}</span>
                    </div>
                  </button>
                );
              })}

              <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-between items-center text-[10px] text-white/80 font-mono-space bg-black/60 px-3 py-1.5 border border-white/10">
                <span>Selected: {selectedBuilding.name}</span>
                <span>Click pins to view facilities</span>
              </div>
            </div>

            {/* Selector Grid for All 19 Blocks */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-[360px] overflow-y-auto p-1">
              {CAMPUS_BUILDINGS.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setSelectedBuilding(b);
                    setShowDirections(false);
                  }}
                  className={`p-3 text-left border transition-all text-xs cursor-pointer ${
                    selectedBuilding.id === b.id
                      ? 'bg-white border-[#c43a3a] ring-1 ring-[#c43a3a] shadow-xs'
                      : 'bg-white border-[rgba(26,26,26,0.1)] text-[#666] hover:border-[#1a1a1a]'
                  }`}
                >
                  <span className="font-mono-space text-[#c43a3a] font-bold block">{b.blockLetter}</span>
                  <div className="font-serif-cormorant text-sm font-semibold text-[#1a1a1a] line-clamp-1 mt-0.5">
                    {b.name.split(':')[1]?.trim() || b.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Inspector Card */}
          <div className="border border-[rgba(26,26,26,0.12)] bg-white p-6 space-y-6">
            <div className="relative h-44 bg-[#f8f8f5] overflow-hidden border border-[rgba(26,26,26,0.08)]">
              <img
                src={
                  selectedBuilding.image ||
                  '/assets/aistudio/WhatsApp_Image_2026-10-28_at_12.56.36_PM_b7e6edc6.jpeg'
                }
                alt={selectedBuilding.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 bg-[#1a1a1a] text-white font-mono-space px-2.5 py-0.5 text-xs font-bold">
                {selectedBuilding.blockLetter}
              </span>
            </div>

            <div>
              <span className="font-mono-space text-[#c43a3a] block mb-1">
                {selectedBuilding.category} Facility
              </span>
              <h3 className="font-serif-cormorant text-2xl font-semibold text-[#1a1a1a] leading-tight">
                {selectedBuilding.name}
              </h3>
              <p className="text-xs text-[rgba(26,26,26,0.6)] mt-2 leading-relaxed">
                {selectedBuilding.description}
              </p>
            </div>

            <div className="py-3 border-y border-[rgba(26,26,26,0.08)] text-xs font-mono-space text-[#555]">
              <span className="font-bold text-[#1a1a1a] block mb-1">Access Hours:</span>
              <span>{selectedBuilding.hours}</span>
            </div>

            {/* Floor Directory */}
            <div className="space-y-3">
              <span className="font-mono-space text-[0.65rem] text-[rgba(26,26,26,0.5)] uppercase tracking-wider block">
                Floor Directory
              </span>
              <div className="space-y-2">
                {selectedBuilding.floors.map((fl, fIdx) => (
                  <div key={fIdx} className="p-3 bg-[#fdfcf9] border border-[rgba(26,26,26,0.06)] text-xs">
                    <div className="font-mono-space font-bold text-[#1a1a1a] mb-1">{fl.floor}</div>
                    <div className="text-[rgba(26,26,26,0.6)] space-y-0.5">
                      {fl.departments.map((dept, dIdx) => (
                        <div key={dIdx}>· {dept}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <button
                onClick={() => setShowDirections(!showDirections)}
                className="w-full py-2.5 bg-[#1a1a1a] text-white font-mono-space uppercase tracking-wider text-xs hover:bg-black transition-colors cursor-pointer"
              >
                {showDirections ? 'Hide Walking Route' : `Navigate to ${selectedBuilding.blockLetter}`}
              </button>

              {showDirections && (
                <div className="mt-3 p-3.5 border border-[#c43a3a]/30 bg-[#fffdfd] text-xs text-[#1a1a1a] leading-relaxed">
                  <span className="font-mono-space text-[#c43a3a] font-bold block mb-1">Directions:</span>
                  Located along the main central concourse connected via paved pedestrian boulevards from the Main Campus Gate & Transit Plaza (Sector 43, Faridabad).
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
