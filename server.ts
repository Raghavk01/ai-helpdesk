import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const CAMPUS_SYSTEM_INSTRUCTION = `
You are the official AI Campus Desk Assistant for "Southfield College", an esteemed institution of higher learning.
Your role is to assist students, prospective applicants, faculty, and visitors with accurate, clear, empathetic, and actionable guidance.

Key Campus Information & Policies:
1. Academic Divisions: School of Engineering & Applied Sciences, School of Arts & Humanities, School of Business & Management, School of Natural Sciences, School of Health & Medicine.
2. Degree Requirements: 120 credit hours for Bachelor degrees; minimum cumulative GPA of 2.0 to graduate (3.5 for Dean's List, 3.8 for Magna Cum Laude, 3.9 for Summa Cum Laude).
3. Important Deadlines (Current Academic Year 2026-2027):
   - Fall Semester Add/Drop Deadline: 2nd Friday after classes start (September 12).
   - Mid-term Examination Week: October 19 - October 24.
   - Last Day for Course Withdrawal with 'W': November 6.
   - Final Examinations: December 14 - December 19.
   - Spring Semester Registration opens: November 2.
4. Tuition & Financial Aid:
   - Full-time Undergraduate Tuition: $14,200 per semester (in-state/domestic) / $21,500 (out-of-state/international).
   - Deferred Payment Plan: 3 installments (40% at registration, 30% by Oct 1, 30% by Nov 1) with a $35 setup fee.
   - Scholarships: President's Merit Fellowship (up to 100% tuition for GPA > 3.85), STEM Excellence Grant, Southfield Need-Based Grant (requires FAFSA/institutional aid form by March 15).
5. Student Housing & Dining:
   - Residence Halls: Southfield East (Freshman), Southfield West (Upperclassmen), Centennial Apartments (Graduates).
   - Quiet Hours: 10:00 PM - 8:00 AM on weekdays; 12:00 AM - 9:00 AM on weekends.
   - Room Swaps: Applications open during Week 3 at Housing Portal.
6. Central Centennial Library:
   - Hours: Monday - Thursday (7:30 AM - 1:00 AM), Friday (7:30 AM - 9:00 PM), Saturday (9:00 AM - 8:00 PM), Sunday (10:00 AM - 1:00 AM). 24/7 study commons accessible via Student ID.
   - Book Loan Period: 28 days for undergraduates (up to 15 books), renewed online twice.
7. Grievance & Helpdesk Ticketing:
   - Students can file formal grievances for Academic, Finance, Hostel, IT, or Welfare issues through this portal.
   - Standard resolution turnaround: 24 to 48 business hours. Escalated tickets are reviewed by the Dean of Student Affairs within 12 hours.
8. IT & Services:
   - Wi-Fi: Connect to 'Southfield-Secure' or 'eduroam' using your campus ID (e.g. s12345@southfield.edu) and campus password.
   - ID Card Replacement: Student Services Desk ($20 fee for lost physical card; digital pass is free in the mobile wallet).
9. Emergency Contacts:
   - 24/7 Campus Police & Emergency: (555) 019-9111 or ext. 9111 from any campus phone.
   - Campus Health & Urgent Care: (555) 019-4325 (Building C, Room 102).
   - Student Counseling & Crisis Helpline: (555) 019-CARE (24/7 confidential).

Style & Guidelines:
- Format your answers with clear structure, bold highlights, bullet points, and actionable next steps.
- If a question involves a formal dispute, missing grades, or financial holds, provide the relevant policy and advise submitting a support ticket in the "Tickets" tab with ticket category.
- Keep tone collegiate, warm, respectful, and encouraging.
`;

// AI Campus Chat Endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Fallback response if API key is not configured in environment
      return res.json({
        reply: `Thank you for reaching out to the Southfield College Helpdesk. Here is the campus guidance for your query: "${message}". Please note that full AI synthesis requires GEMINI_API_KEY in the environment. You can submit a formal ticket in the Tickets tab or contact Student Services at (555) 019-4325.`,
        sources: ['Southfield Student Handbook', 'Office of Student Services'],
      });
    }

    // Build chat contents including recent history
    const contents: any[] = [];
    
    // Add up to 6 previous history turns
    if (Array.isArray(conversationHistory)) {
      const recentHistory = conversationHistory.slice(-6);
      for (const turn of recentHistory) {
        if (turn.role === 'user' || turn.role === 'model') {
          contents.push({
            role: turn.role,
            parts: [{ text: turn.text || turn.content || '' }],
          });
        }
      }
    }

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        systemInstruction: CAMPUS_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'I apologize, but I could not formulate a response. Please check with the Student Services Desk.';
    
    // Identify relevant campus departments based on query keywords
    const lower = message.toLowerCase();
    const sources: string[] = [];
    if (lower.includes('fee') || lower.includes('tuition') || lower.includes('scholarship') || lower.includes('aid')) {
      sources.push('Bursar & Financial Aid Office');
    }
    if (lower.includes('grade') || lower.includes('course') || lower.includes('transcript') || lower.includes('withdraw') || lower.includes('exam')) {
      sources.push('Office of the Registrar');
    }
    if (lower.includes('dorm') || lower.includes('hostel') || lower.includes('room') || lower.includes('housing') || lower.includes('mess')) {
      sources.push('Office of Residential Life');
    }
    if (lower.includes('book') || lower.includes('library') || lower.includes('journal') || lower.includes('study room')) {
      sources.push('Centennial Memorial Library');
    }
    if (lower.includes('wifi') || lower.includes('email') || lower.includes('login') || lower.includes('password') || lower.includes('lms')) {
      sources.push('Campus IT Services');
    }
    if (sources.length === 0) {
      sources.push('Southfield Student Services Center');
    }

    return res.json({
      reply,
      sources,
    });
  } catch (error: any) {
    console.error('Error handling /api/chat:', error);
    return res.status(500).json({
      error: 'Failed to generate campus AI response.',
      details: error?.message || 'Internal error',
      reply: 'We encountered an error connecting to the campus assistant. Please submit a direct ticket or visit the Registrar in person in Administration Hall Room 101.',
      sources: ['Southfield Helpdesk System'],
    });
  }
});

// AI Ticket Categorizer & Summarizer Endpoint
app.post('/api/triage-ticket', async (req: Request, res: Response) => {
  const { title = '', description = '' } = req.body || {};
  try {
    if (!title && !description) {
      return res.status(400).json({ error: 'Title or description required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        suggestedCategory: 'Academic',
        suggestedPriority: 'Medium',
        summary: title || 'Student inquiry',
        recommendedNextStep: 'Submit ticket for departmental review.',
      });
    }

    const prompt = `Analyze this college student grievance/inquiry:
Title: ${title}
Details: ${description}

Respond in strict JSON with:
{
  "suggestedCategory": "Academic" | "Finance" | "Housing & Mess" | "IT Services" | "Library" | "Health & Counseling",
  "suggestedPriority": "Low" | "Medium" | "High" | "Urgent",
  "summary": "1-sentence concise summary of the core issue",
  "recommendedAction": "Actionable initial step or document the student should prepare"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error triaging ticket:', err);
    return res.json({
      suggestedCategory: 'Academic',
      suggestedPriority: 'Medium',
      summary: title || 'Student submission',
      recommendedAction: 'Assigned to General Student Services.',
    });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
