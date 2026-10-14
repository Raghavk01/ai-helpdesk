import React, { useState } from 'react';
import { FAQ_DATA } from '../data/mockData';
import { FaqItem, TicketCategory } from '../types';
import { 
  Search, ChevronDown, ChevronUp, FileText, Download, Printer, 
  CheckCircle, X 
} from 'lucide-react';

interface KnowledgeBaseProps {
  onAskAIAboutFaq: (question: string) => void;
}

const CATEGORIES: ('All' | TicketCategory)[] = [
  'All',
  'Academic',
  'Finance',
  'Housing & Mess',
  'IT Services',
  'Library',
  'Health & Counseling',
];

interface FormTemplate {
  id: string;
  title: string;
  code: string;
  department: string;
  description: string;
  sections: string[];
}

const CAMPUS_FORMS: FormTemplate[] = [
  {
    id: 'form-1',
    title: 'Official Academic Transcript & Archival Clearance Petition',
    code: 'REG-TR-01',
    department: 'Office of the Registrar',
    description: 'Required for certified electronic delivery or embossed hardcopy transcripts sent to external graduate programs or employers.',
    sections: [
      'Part I: Student Identification & Degree Program',
      'Part II: Delivery Method & Recipient University Code',
      'Part III: Bursar Office No-Dues Hold Sign-Off',
      'Part IV: FERPA Privacy Disclosure Authorization',
    ],
  },
  {
    id: 'form-2',
    title: 'Deferred Tuition Fee Installment Contract',
    code: 'BUR-DF-03',
    department: 'Office of the Bursar',
    description: 'Contract for dividing current semester charges into 3 payments (40% / 30% / 30%) with explicit grace period terms.',
    sections: [
      'Part I: Total Semester Tuition Assessment & Financial Aid Credits',
      'Part II: Authorized Installment Payment Schedule & Due Dates',
      'Part III: Late Surcharge Terms & Direct Debit Agreement',
      'Part IV: Student / Guarantor Signature',
    ],
  },
  {
    id: 'form-3',
    title: 'Mutual Residential Room Swap & Condition Clearance',
    code: 'RL-SW-08',
    department: 'Office of Residential Life',
    description: 'Mandatory verification form executed between two current campus dormitory residents before key exchange.',
    sections: [
      'Part I: Current Occupant Details (Hall & Room Numbers)',
      'Part II: Resident Advisor (RA) Pre-Transfer Safety Inspection',
      'Part III: Keycard Access Re-provisioning Requisition',
      'Part IV: Housing Coordinator Final Approval',
    ],
  },
  {
    id: 'form-4',
    title: 'Academic Prerequisite & Credit Overload Waiver',
    code: 'AC-WAV-12',
    department: 'Academic Advising & Department Chairs',
    description: 'Allows students to register for advanced courses by demonstrating equivalent coursework or GPA qualification > 3.50.',
    sections: [
      'Part I: Course Requested & Prerequisite In Question',
      'Part II: Justification / Equivalency Syllabus Attached',
      'Part III: Faculty Instructor Recommendation',
      'Part IV: Division Dean Executive Approval',
    ],
  },
];

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ onAskAIAboutFaq }) => {
  const [activeCategory, setActiveCategory] = useState<'All' | TicketCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('faq-1');
  const [selectedForm, setSelectedForm] = useState<FormTemplate | null>(null);

  const filteredFaqs = FAQ_DATA.filter((faq) => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      faq.question.toLowerCase().includes(q) ||
      faq.answer.toLowerCase().includes(q) ||
      faq.department.toLowerCase().includes(q) ||
      faq.category.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full">
      {/* Editorial Hero */}
      <div className="py-16 sm:py-20 px-6 sm:px-10 text-center border-b border-[rgba(26,26,26,0.08)] bg-[#fdfdfc]">
        <span className="font-mono-space text-[#a37d58] tracking-[0.14em] block mb-2 font-semibold">
          University Codified Guidelines
        </span>
        <h1 className="font-serif-cormorant text-4xl sm:text-6xl md:text-[4.5rem] font-light tracking-tight text-[#1a1a1a] leading-tight my-4">
          Knowledge Base & Forms
        </h1>
        <p className="text-sm sm:text-lg text-[#666] max-w-2xl mx-auto leading-relaxed">
          Official regulations, step-by-step administrative procedures, required documentation, and institutional forms for download.
        </p>
      </div>

      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 py-12 sm:py-16 space-y-10">
        {/* Search & Category Pills */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(26,26,26,0.08)]">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 text-[0.75rem] rounded-full border transition-colors cursor-pointer whitespace-nowrap ${
                    activeCategory === cat
                      ? 'bg-[#1a1a1a] text-[#fdfdfc] border-[#1a1a1a]'
                      : 'bg-transparent text-[#666] border-[rgba(26,26,26,0.12)] hover:border-[#1a1a1a]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search regulations & forms..."
                className="bg-transparent border-b border-[#1a1a1a] py-1.5 px-0 text-[0.8rem] text-[#1a1a1a] placeholder:text-[#999] focus:outline-none w-56"
              />
            </div>
          </div>
        </div>

        {/* 2-Column Content: Guidelines + Forms */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12 sm:gap-16">
          {/* FAQ Accordion */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[rgba(26,26,26,0.08)]">
              <span className="font-mono-space text-[#888]">
                {filteredFaqs.length} Codified Policies
              </span>
              <span className="font-mono-space text-[#888]">
                Academic Year 2026-2027
              </span>
            </div>

            <div className="divide-y divide-[rgba(26,26,26,0.08)]">
              {filteredFaqs.map((faq) => {
                const isExpanded = expandedId === faq.id;
                return (
                  <div key={faq.id} className="py-6">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                      className="w-full text-left flex items-start justify-between gap-4 cursor-pointer"
                    >
                      <div>
                        <span className="font-mono-space text-[#a37d58] block mb-1">
                          {faq.category} · {faq.department}
                        </span>
                        <h3 className="font-serif-cormorant text-xl sm:text-2xl font-semibold text-[#1a1a1a] leading-snug">
                          {faq.question}
                        </h3>
                      </div>
                      <span className="font-mono-space text-lg text-[#666] mt-1 shrink-0">
                        {isExpanded ? '—' : '+'}
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-[rgba(26,26,26,0.06)] space-y-4 text-xs sm:text-sm text-[#1a1a1a] leading-relaxed animate-in fade-in">
                        <p className="text-[#444]">{faq.answer}</p>

                        {faq.steps && faq.steps.length > 0 && (
                          <div className="p-4 bg-[#f8f8f5] border border-[rgba(26,26,26,0.08)]">
                            <span className="font-mono-space text-[#1a1a1a] font-bold block mb-2">
                              Procedural Steps:
                            </span>
                            <ol className="space-y-1.5 text-xs text-[#555] list-decimal list-inside">
                              {faq.steps.map((st, sIdx) => (
                                <li key={sIdx}>{st}</li>
                              ))}
                            </ol>
                          </div>
                        )}

                        {faq.documentsRequired && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            <span className="font-mono-space text-[#888] self-center mr-2">Required:</span>
                            {faq.documentsRequired.map((doc, dIdx) => (
                              <span
                                key={dIdx}
                                className="font-mono-space text-[#1a1a1a] border border-[rgba(26,26,26,0.15)] bg-white px-2 py-0.5"
                              >
                                {doc}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="pt-3 border-t border-[rgba(26,26,26,0.06)] flex flex-wrap items-center justify-between gap-3 text-xs text-[#666]">
                          <span className="font-mono-space">
                            Officer: {faq.officerInCharge} ({faq.officeHours})
                          </span>
                          <button
                            onClick={() => onAskAIAboutFaq(faq.question)}
                            className="font-mono-space text-[#1a1a1a] border border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white px-2 py-1 transition-colors cursor-pointer"
                          >
                            Ask AI Follow-Up
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Downloadable Institutional Forms */}
          <div className="space-y-6">
            <div className="pb-2 border-b border-[rgba(26,26,26,0.08)]">
              <span className="font-mono-space text-[#888]">Institutional Forms</span>
            </div>

            <div className="space-y-4">
              {CAMPUS_FORMS.map((form) => (
                <div
                  key={form.id}
                  className="p-5 border border-[rgba(26,26,26,0.12)] bg-white space-y-2.5 hover:border-[#1a1a1a] transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono-space text-[#a37d58] block">{form.code}</span>
                    <FileText className="w-4 h-4 text-[#888]" />
                  </div>
                  <h4 className="font-serif-cormorant text-xl font-semibold text-[#1a1a1a] leading-tight">
                    {form.title}
                  </h4>
                  <p className="text-xs text-[#666] leading-relaxed">
                    {form.description}
                  </p>
                  <div className="pt-2 border-t border-[rgba(26,26,26,0.06)] flex items-center justify-between">
                    <span className="font-mono-space text-[#888]">{form.department}</span>
                    <button
                      onClick={() => setSelectedForm(form)}
                      className="font-mono-space text-[#1a1a1a] font-bold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>View & Print</span>
                      <Download className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Form Preview Modal */}
      {selectedForm && (
        <div className="fixed inset-0 z-50 bg-[#1a1a1a]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fdfdfc] border border-[rgba(26,26,26,0.15)] max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in">
            <div className="p-4 border-b border-[rgba(26,26,26,0.08)] flex items-center justify-between bg-[#f8f8f5]">
              <span className="font-mono-space text-[#1a1a1a] font-bold">
                Document Archival Preview · {selectedForm.code}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-[#1a1a1a] text-white font-mono-space hover:bg-black cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="w-3 h-3" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => setSelectedForm(null)}
                  className="p-1 text-[#666] hover:text-[#1a1a1a] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto font-serif text-[#1a1a1a] space-y-6 bg-white">
              <div className="text-center border-b border-black pb-5">
                <div className="font-serif-cormorant text-2xl font-bold uppercase tracking-widest">
                  Southfield College
                </div>
                <div className="font-mono-space text-[#666] mt-1 text-[10px]">
                  {selectedForm.department} · Office of Academic Affairs
                </div>
                <div className="font-serif-cormorant text-lg font-semibold mt-3">
                  {selectedForm.title}
                </div>
                <div className="font-mono-space text-[#888] mt-0.5">
                  Ref: {selectedForm.code}-2026-REV-B
                </div>
              </div>

              <div className="space-y-4 font-sans text-xs">
                {selectedForm.sections.map((sec, idx) => (
                  <div key={idx} className="border border-[rgba(26,26,26,0.12)] p-4">
                    <h5 className="font-mono-space font-bold text-[#1a1a1a] mb-2">{sec}</h5>
                    <div className="h-8 border-b border-dashed border-[#ccc] flex items-end pb-1 text-[#999] font-mono-space text-[10px]">
                      [Official departmental signature / seal required]
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[rgba(26,26,26,0.1)] flex justify-between font-mono-space text-[#888]">
                <span>Date: {new Date().toLocaleDateString()}</span>
                <span>Verification: Accredited HLC</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
