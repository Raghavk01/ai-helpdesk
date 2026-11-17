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
You are the official AI Campus Desk Assistant for "Manav Rachna University" (MRU), located in Sector 43, Aravalli Hills, Surajkund Badkhal Road, Faridabad, Haryana, India.
Your role is to assist students, prospective applicants, faculty, and visitors with accurate, clear, empathetic, and actionable guidance regarding academic policies, campus events, block navigation (Blocks A through S), clans, grievance ticketing, and student welfare.

Key Campus Infrastructure & Blocks (A to S):
- Block A: Central Administrative Complex, Vice Chancellor's Secretariat, Registrar Office, Board Room.
- Block B: Faculty of Engineering & Technology (FET), Robotics & IoT Research Labs, Mechanical Engineering.
- Block C: Central Lawns, Main Open-Air Amphitheatre, Concourse & Exhibition Grounds.
- Block D: School of Leadership & Management (SLM), Executive Lecture Theatres.
- Block E: Swami Vivekananda Peace Hall, Seminar Suites & Cultural Convention Center.
- Block F: School of Applied Sciences, Chemistry, Physics, and Nanotechnology Research Centers.
- Block G: World-class Indoor Sports Arena, 10m/25m Shooting Range, Badminton, Squash & Gymnasium.
- Block H: Dr. O.P. Bhalla Central Memorial Library & Digital Resource Centre (24/7 during exam weeks).
- Block I: Department of Computer Science & Technology (CST), AI/ML Centers of Excellence, Cloud Labs.
- Block J: Department of Student Welfare (DSW), Student Activity Center, Clan HQ & Cultural Studios.
- Block K: Faculty of Law, Chief Justice Moot Court Hall & Legal Aid Clinic.
- Block L: School of Media Studies & Humanities, Broadcast TV Studio & Sound Design Labs.
- Block M: Main University Auditorium (1,200 Seater), Convocation Arena & Stage.
- Block N: Faculty of Behavioral & Social Sciences, Psychological Counseling Wing.
- Block O: School of Dental Sciences & Physiotherapy Clinical Wing.
- Block P: Manav Rachna Innovation and Incubation Centre (MRIIC), Startup Hatcheries.
- Block Q: School of Architecture & Interior Design Studios.
- Block R: International Affairs Centre & Foreign Language Institute.
- Block S: Heavy Engineering Workshops, Foundry, Automotive Research & Testing Annex.

The Clan System & Campus Life:
- The University features 4 official Student Clans:
  1. Wild Cats (Tigers/Panthers - Gold/Orange banner)
  2. Forest Rhinos (Green banner)
  3. Air Falcons (Cyan/Blue banner)
  4. Water Sharks (Navy/Silver banner)
- Clan points are awarded for participation in technical hackathons, cultural festivals, sports meets, and volunteering.
- Major Annual Festivals:
  - "Resurrection": Annual National Cultural Fest featuring celebrity pro-nights, battle-of-the-bands, fashion runway, and dramatics.
  - "Innoskill": Annual Innovation & Technology Fest showcasing hardware prototypes, hackathons, and robotics.
  - "Utkrisht": Inter-University Sports Championship (cricket, basketball, shooting, badminton).
  - "MRU Hustle": Inter-clan rap battle, dance-off, and street theatre championship.

Key Student Policies & Services:
- Academic Year & Add/Drop: First 2 weeks of the semester; course registrations managed via iCloudEMS portal.
- Grading System: 10-point CGPA scale (10.0 scale, with Letter Grades O, A+, A, B+, B, C, P, F).
- Grievance Redressal: Formal complaints can be filed under Academic, Finance, Hostel/Mess, IT/Wi-Fi, Library, or DSW. Resolved within 24-48 hours.
- Emergency Contacts:
  - 24/7 Campus Security & Control Room: (0129) 4259-111 / +91 95602 99000
  - DSW Helpline (Student Welfare): (0129) 4259-000 (Block J)
  - Medical Emergency Clinic & Ambulance: Ext. 2100 (Block O / Clinic)
  - Women's Anti-Harassment & Anti-Ragging Cell: 1800-180-5522 (Toll Free)

Tone & Behavior:
- Provide accurate block location details (e.g., "The Moot Court is in Block K, 2nd Floor").
- Mention relevant faculty coordinators or DSW officers when applicable.
- Keep responses encouraging, well-structured with bullet points, and collegiate.
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
        reply: `Thank you for reaching out to the Manav Rachna University Helpdesk. Here is the campus guidance for your query: "${message}". Please visit the DSW Office in Block J or the Registrar in Block A (Ground Floor) for immediate in-person assistance.`,
        sources: ['MRU Student Handbook', 'Department of Student Welfare (Block J)'],
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
