import React, { useState } from 'react';
import { CAMPUS_BUILDINGS } from '../data/mockData';
import { CampusBuilding } from '../types';
import { MapPin, Navigation, Compass, Layers } from 'lucide-react';

export const CampusMap: React.FC = () => {
  const [selectedBuilding, setSelectedBuilding] = useState<CampusBuilding>(CAMPUS_BUILDINGS[0]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showDirections, setShowDirections] = useState(false);

  const filteredBuildings = CAMPUS_BUILDINGS.filter(
    (b) => filterCategory === 'all' || b.category.toLowerCase() === filterCategory.toLowerCase()
  );

  return (
    <div className="w-full">
      {/* Editorial Hero */}
      <div className="py-16 sm:py-20 px-6 sm:px-10 text-center border-b border-[rgba(26,26,26,0.08)] bg-[#fdfdfc]">
        <span className="font-mono-space text-[#a37d58] tracking-[0.14em] block mb-2 font-semibold">
          Architectural Layout & Facilities
        </span>
        <h1 className="font-serif-cormorant text-4xl sm:text-6xl md:text-[4.5rem] font-light tracking-tight text-[#1a1a1a] leading-tight my-4">
          Campus Map & Directory
        </h1>
        <p className="text-sm sm:text-lg text-[#666] max-w-2xl mx-auto leading-relaxed">
          Interactive quadrangle mapping, department room locations, operating hours, and walking pathways.
        </p>
      </div>

      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 py-12 sm:py-16 space-y-10">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[rgba(26,26,26,0.08)]">
          {[
            { id: 'all', label: 'All Buildings' },
            { id: 'academic', label: 'Academic & Labs' },
            { id: 'administrative', label: 'Administration' },
            { id: 'library', label: 'Library & Tech' },
            { id: 'residential', label: 'Residential Quad' },
            { id: 'health', label: 'Health & Wellness' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterCategory(tab.id)}
              className={`px-4 py-1.5 text-[0.75rem] rounded-full border transition-colors cursor-pointer whitespace-nowrap ${
                filterCategory === tab.id
                  ? 'bg-[#1a1a1a] text-[#fdfdfc] border-[#1a1a1a]'
                  : 'bg-transparent text-[#666] border-[rgba(26,26,26,0.12)] hover:border-[#1a1a1a]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 2-Column: Map Canvas + Building Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-12 sm:gap-16">
          <div className="space-y-6">
            {/* Map Frame */}
            <div className="relative bg-[#1a1a1a] aspect-[16/10] overflow-hidden border border-[#1a1a1a]">
              <img
                src="/src/assets/images/campus_hero_quad_1791960437818.jpg"
                alt="Southfield College Quad Aerial View"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

              <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-[#1a1a1a]/90 px-3 py-1.5 text-white font-mono-space border border-white/20">
                <Compass className="w-3 h-3 text-[#a37d58]" />
                <span>Southfield Central Quad</span>
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
                          ? 'bg-[#a37d58] text-white ring-2 ring-white scale-110'
                          : 'bg-white text-[#1a1a1a] hover:bg-[#fdfdfc]'
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
                <span>Click markers to inspect floor plans</span>
              </div>
            </div>

            {/* Selector Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredBuildings.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setSelectedBuilding(b);
                    setShowDirections(false);
                  }}
                  className={`p-3 text-left border transition-all text-xs cursor-pointer ${
                    selectedBuilding.id === b.id
                      ? 'bg-white border-[#1a1a1a] ring-1 ring-[#1a1a1a]'
                      : 'bg-white border-[rgba(26,26,26,0.1)] text-[#666] hover:border-[#1a1a1a]'
                  }`}
                >
                  <span className="font-mono-space text-[#a37d58] block">{b.code}</span>
                  <div className="font-serif-cormorant text-base font-semibold text-[#1a1a1a] line-clamp-1 mt-0.5">
                    {b.name}
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
                  '/src/assets/images/campus_student_desk_1791960438341.jpg'
                }
                alt={selectedBuilding.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 bg-[#1a1a1a] text-white font-mono-space px-2 py-0.5 text-[10px]">
                {selectedBuilding.code}
              </span>
            </div>

            <div>
              <span className="font-mono-space text-[#a37d58] block mb-1">
                {selectedBuilding.category} Facility
              </span>
              <h3 className="font-serif-cormorant text-2xl font-semibold text-[#1a1a1a]">
                {selectedBuilding.name}
              </h3>
              <p className="text-xs text-[#666] mt-2 leading-relaxed">
                {selectedBuilding.description}
              </p>
            </div>

            <div className="py-3 border-y border-[rgba(26,26,26,0.08)] text-xs font-mono-space text-[#555]">
              <span className="font-bold text-[#1a1a1a] block mb-1">Access Hours:</span>
              <span>{selectedBuilding.hours}</span>
            </div>

            {/* Floor Directory */}
            <div className="space-y-3">
              <span className="font-mono-space text-[#888] block">Floor Directory</span>
              <div className="space-y-2">
                {selectedBuilding.floors.map((fl, fIdx) => (
                  <div key={fIdx} className="p-3 bg-[#f8f8f5] text-xs">
                    <div className="font-mono-space font-bold text-[#1a1a1a] mb-1">{fl.floor}</div>
                    <div className="text-[#666] space-y-0.5">
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
                className="w-full py-2.5 bg-[#1a1a1a] text-white font-mono-space uppercase tracking-wider hover:bg-black transition-colors cursor-pointer"
              >
                {showDirections ? 'Hide Walking Route' : 'Get Walking Directions'}
              </button>

              {showDirections && (
                <div className="mt-3 p-3 border border-[#a37d58]/40 bg-[#fffdf9] text-xs text-[#1a1a1a] leading-relaxed">
                  <span className="font-mono-space text-[#a37d58] font-bold block mb-1">Wayfinding:</span>
                  Walk North along the Memorial Oak pathway for ~4 minutes (280m). Main entrance is ramp-equipped on the West portico.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
