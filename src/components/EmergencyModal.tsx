import React, { useState } from 'react';
import { ShieldAlert, Phone, Copy, Check, X, AlertOctagon } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const [alertDispatched, setAlertDispatched] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const handleDispatchAlert = () => {
    setAlertDispatched(true);
    setTimeout(() => setAlertDispatched(false), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1a1a1a]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#fdfdfc] border border-[rgba(26,26,26,0.15)] max-w-lg w-full p-6 sm:p-8 shadow-2xl animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[rgba(26,26,26,0.08)]">
          <div>
            <span className="font-mono-space text-[#991b1b] font-bold block mb-1">
              Priority Security Dispatch
            </span>
            <h3 className="font-serif-cormorant text-2xl sm:text-3xl font-semibold text-[#1a1a1a]">
              24/7 Campus Emergency Desk
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#666] hover:text-[#1a1a1a] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hotlines */}
        <div className="py-6 space-y-4 text-xs">
          {/* Campus Police */}
          <div className="p-4 border border-[#991b1b]/30 bg-[#fdf2f2] flex items-center justify-between gap-4">
            <div>
              <div className="font-serif-cormorant text-xl font-bold text-[#1a1a1a]">
                Campus Police & Patrol
              </div>
              <div className="text-[#666] text-[11px] mt-0.5">
                Immediate incident response, physical security, escorts
              </div>
              <div className="font-mono-space text-[#991b1b] font-bold text-sm mt-1">
                (555) 019-9111 · Ext. 9111
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleCopy('(555) 019-9111')}
                className="p-2 border border-[#991b1b]/30 bg-white hover:bg-slate-50 cursor-pointer"
                title="Copy phone"
              >
                {copiedNumber === '(555) 019-9111' ? (
                  <Check className="w-3.5 h-3.5 text-[#065f46]" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-[#1a1a1a]" />
                )}
              </button>
              <a
                href="tel:5550199111"
                className="px-3 py-2 bg-[#991b1b] text-white font-mono-space hover:bg-[#7f1d1d] uppercase transition-colors"
              >
                Call
              </a>
            </div>
          </div>

          {/* Mental Health Crisis */}
          <div className="p-4 border border-[#a37d58]/40 bg-[#fffdf9] flex items-center justify-between gap-4">
            <div>
              <div className="font-serif-cormorant text-xl font-bold text-[#1a1a1a]">
                24/7 Mental Health Crisis
              </div>
              <div className="text-[#666] text-[11px] mt-0.5">
                Confidential licensed psychological intervention
              </div>
              <div className="font-mono-space text-[#a37d58] font-bold text-sm mt-1">
                (555) 019-CARE (2273)
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleCopy('(555) 019-CARE')}
                className="p-2 border border-[#a37d58]/40 bg-white hover:bg-slate-50 cursor-pointer"
              >
                {copiedNumber === '(555) 019-CARE' ? (
                  <Check className="w-3.5 h-3.5 text-[#065f46]" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-[#1a1a1a]" />
                )}
              </button>
              <a
                href="tel:5550192273"
                className="px-3 py-2 bg-[#1a1a1a] text-white font-mono-space hover:bg-black uppercase transition-colors"
              >
                Call
              </a>
            </div>
          </div>

          {/* Anti-Ragging Cell */}
          <div className="p-4 border border-[rgba(26,26,26,0.12)] bg-white flex items-center justify-between gap-4">
            <div>
              <div className="font-serif-cormorant text-xl font-bold text-[#1a1a1a]">
                Anti-Harassment Ombudsman
              </div>
              <div className="text-[#666] text-[11px] mt-0.5">
                Anonymous grievance & student welfare protection
              </div>
              <div className="font-mono-space text-[#1a1a1a] font-bold text-sm mt-1">
                (555) 019-SAFE (7233)
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleCopy('(555) 019-SAFE')}
                className="p-2 border border-[rgba(26,26,26,0.12)] bg-white hover:bg-slate-50 cursor-pointer"
              >
                {copiedNumber === '(555) 019-SAFE' ? (
                  <Check className="w-3.5 h-3.5 text-[#065f46]" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-[#1a1a1a]" />
                )}
              </button>
              <a
                href="tel:5550197233"
                className="px-3 py-2 bg-[#1a1a1a] text-white font-mono-space hover:bg-black uppercase transition-colors"
              >
                Call
              </a>
            </div>
          </div>
        </div>

        {/* SOS Location Dispatch Action */}
        <div className="pt-4 border-t border-[rgba(26,26,26,0.08)]">
          {alertDispatched ? (
            <div className="p-3 bg-[#fdf2f2] border border-[#991b1b]/40 font-mono-space text-xs text-[#991b1b] text-center">
              ✓ Alert Logged: Coordinates relayed to Campus Police Dispatch.
            </div>
          ) : (
            <button
              onClick={handleDispatchAlert}
              className="w-full py-3 bg-[#991b1b] hover:bg-[#7f1d1d] text-white font-mono-space uppercase tracking-wider text-xs transition-colors cursor-pointer"
            >
              Dispatch Silent Location Alert to Patrol
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
