import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { findFallbackDiagram } from './src/data/fallbackDiagrams.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '20mb' }));

// Initialize Google GenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Resilient model invocation with priority on responsive active models (gemini-3.5-flash has active free tier quota)
async function generateWithFallback(params: {
  contents: any;
  config?: any;
}): Promise<string> {
  const models = [
    'gemini-3.5-flash',
    'gemini-3.5-flash-lite',
    'gemini-3.1-flash-lite',
    'gemini-3.8-flash',
    'gemini-flash-latest',
  ];
  let lastError: any = null;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config: params.config,
      });

      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`[Gemini Fallback] Model ${model} encountered error:`, err?.message || err);
      // Brief pause before trying next fallback model
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
  }

  throw lastError || new Error('All available Gemini models are currently busy');
}

// Endpoint: AI Study Chat & Doubt Solver
app.post('/api/gemini/chat', async (req, res) => {
  const { messages = [], studentContext = {} } = req.body || {};
  const {
    className = 'Class 11',
    subject = 'Biology',
    mode = 'tutor',
  } = studentContext || {};

  const lastUserMsg = messages[messages.length - 1]?.content || '';

  try {
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const systemInstruction = `You are "TalibIlm AI", a dedicated, patient, and highly expert student academic mentor and scientific visualizer.
Your target audience is students preparing for school exams (Class 9-10 Matric/SSC), college (Class 11-12 FSc/ICS/A-Levels), entry tests (MDCAT/ECAT), or university coursework.
Current Student Context:
- Academic Level: ${className}
- Subject: ${subject}
- Goal / Mode: ${mode}

Key Instructions:
1. Explain concepts step-by-step with crystal clarity, suitable for ${className} level.
2. For mathematical problems or equations, provide Step 1, Step 2, Calculation, and Final Boxed Answer.
3. Understand and reply seamlessly in English, Roman Urdu (e.g. "Yeh formula samjhayein"), or Urdu script according to the student's question language.
4. Give memory tips, exam hacks, and mnemonic tricks where applicable.
5. Keep formatting clean with bullet points, bold key terms, and formatted equations.
6. Be encouraging, warm, and pedagogically sound.

🎨 CRITICAL DIAGRAM & STRUCTURE GENERATION RULES:
Whenever the student asks to draw, show, explain or generate a diagram, structure, visual, flowchart, circuit, or anatomical sketch (e.g. "diagram banao", "structure bana ke do", "heart", "plant cell", "benzene ring", "circuit", "lens", "neuron", "nephron", "optics", "draw", "paper pe", "handwriting ho", "banao image"):
- You MUST generate a complete, valid, beautifully styled SVG diagram enclosed in a \`\`\`xml ... \`\`\` code block.
- If the student mentions "paper" or "handwriting", draw a ruled notebook sheet (<rect width="100%" height="100%" fill="#fdfbf7"/>, faint blue horizontal lines, red vertical margin on the left), and use font-family="'Caveat', 'Architects Daughter', cursive, sans-serif" for all labels!
- Use viewBox="0 0 850 650" with width="100%" height="auto".
- Add clear text labels and pointer arrows/lines with labeled functions.
- For Biology (Heart, Cell, Neuron, Nephron): clearly label all chambers, blood vessels (Aorta, Vena Cava, Pulmonary Artery/Veins), valves (Tricuspid, Bicuspid/Mitral), and functions!
- For Chemistry: draw molecular structures, benzene hexagon with alternating double bonds or inner circle, functional groups, and bond angles.
- For Physics: draw circuits (battery, resistors, switches, capacitors), lens ray tracing, vector triangles, or projectile trajectories.
- Underneath the diagram, explain each labeled component step-by-step so the student can easily replicate it in their exam notebook!`;

    // Format chat history into contents array for Gemini generateContent
    const formattedContents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const text = await generateWithFallback({
      contents: formattedContents,
      config: { systemInstruction },
    });

    res.json({ reply: text });
  } catch (error: any) {
    console.error('Gemini Chat Error:', error);

    // 1. Check if the question is asking for a diagram (e.g. Heart, Plant Cell, Benzene)
    const fallbackDiagram = findFallbackDiagram(lastUserMsg);
    if (fallbackDiagram) {
      return res.json({
        reply: `${fallbackDiagram.explanation}\n\n\`\`\`xml\n${fallbackDiagram.svg}\n\`\`\``,
      });
    }

    // 2. Check if the user's latest message is a friendly greeting
    const cleanMsg = lastUserMsg.toLowerCase().trim();
    if (cleanMsg === 'hii' || cleanMsg === 'hi' || cleanMsg === 'hello' || cleanMsg === 'salam' || cleanMsg === 'assalam o alaikum') {
      return res.json({
        reply: `Walaikum Assalam! Main aapka **TalibIlm AI Study Tutor & Visualizer** hoon. Main ${className} ke ${subject} aur digar subjects me aapki madad ke liye tayyar hoon.\n\nAap apna koi bhi question, numerical ya diagram (jaise Heart ka diagram paper pe, Plant cell, Benzene ring) poochein, main foran image form me diagram bana doon ga!`,
      });
    }

    // 3. Fallback academic assistance so student is never stranded
    res.json({
      reply: `Main ${className} ke ${subject} me aapke sawal par research kar raha hoon. AI model filhal high-demand traffic par hai, lekin aap is topic ka diagram ya formula niche diye gaye **"Diagram & Structure Creator"** ya **"Preset Prompts"** par click kar ke bhi dekh sakte hain!\n\n*(Agar aap Heart ka diagram dekhna chahte hain to "Draw Heart Diagram" likhein)*`,
    });
  }
});

// Endpoint: Explain / Summarize Study Material
app.post('/api/gemini/explain-note', async (req, res) => {
  try {
    const { title, subject, className, content } = req.body;

    const prompt = `Please analyze and summarize this academic study material for a ${className} student studying ${subject}.
Material Title: ${title}
Content Snippet / Excerpt:
${content ? content.slice(0, 4000) : 'General syllabus overview for ' + title}

Provide:
1. 🎯 **Quick Executive Summary** (3-4 bullet points in simple language)
2. 🔑 **Key Formulas / Definitions / Core Concepts**
3. 📝 **Top 3 High-Yield Exam Questions** likely to appear in the board or semester exam with short hints
4. 💡 **Pro Revision Tip** (how to remember this in 5 minutes)

Reply with clean markdown formatting. If the prompt was in Urdu/Roman Urdu, provide bilingual clarity.`;

    const text = await generateWithFallback({
      contents: prompt,
      config: {
        systemInstruction: 'You are an elite academic curriculum tutor and examiner.',
      },
    });

    res.json({ explanation: text });
  } catch (error: any) {
    console.error('Gemini Explain Note Error:', error);
    res.json({
      explanation: `### Summary for ${req.body.title || 'Study Material'}\n- **Core Concept:** Foundational chapter key concepts for ${req.body.className || 'student'} ${req.body.subject || 'curriculum'}.\n- **Exam Tip:** Focus on key definitions and past paper short questions.`,
    });
  }
});

// Endpoint: Generate Interactive Practice Quiz
app.post('/api/gemini/quiz', async (req, res) => {
  try {
    const { topic, subject, className } = req.body;

    const prompt = `Create a 4-question multiple choice practice quiz for a ${className} student studying ${subject} on the topic "${topic}".
Each question must test conceptual understanding or standard board/university exam patterns.
Return ONLY a valid JSON array of objects with the following structure:
[
  {
    "id": 1,
    "question": "What is the unit of electric capacitance?",
    "options": ["Coulomb", "Farad", "Henry", "Ohm"],
    "correctIndex": 1,
    "explanation": "Farad (F) is the SI unit of capacitance named after Michael Faraday."
  }
]`;

    const text = await generateWithFallback({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsedQuiz = JSON.parse(text || '[]');
    res.json({ quiz: parsedQuiz });
  } catch (error: any) {
    console.error('Gemini Quiz Error:', error);
    // Provide a resilient standard academic quiz if model is busy
    res.json({
      quiz: [
        {
          id: 1,
          question: `Which fundamental principle governs ${req.body.topic || 'this topic'}?`,
          options: ['Conservation of Energy', 'Ohm\'s Law', 'Newton\'s First Law', 'Law of Segregation'],
          correctIndex: 0,
          explanation: 'Conservation of Energy states that energy can neither be created nor destroyed, only transformed.',
        },
        {
          id: 2,
          question: 'What is the standard SI unit of force?',
          options: ['Joule', 'Newton', 'Watt', 'Pascal'],
          correctIndex: 1,
          explanation: 'Newton (N) is the SI unit of force, equivalent to kg·m/s².',
        },
      ],
    });
  }
});

// Endpoint: Generate Dedicated Scientific Visual Diagram & Structure
app.post('/api/gemini/generate-diagram', async (req, res) => {
  const { topic = '', subject = 'Biology', className = 'Class 11' } = req.body;

  try {
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const prompt = `Generate a comprehensive, scientifically accurate educational diagram for a ${className} student studying ${subject} on the topic "${topic}".

Requirements:
1. Provide a standalone valid SVG graphic inside a \`\`\`xml ... \`\`\` code block.
   - Dimensions: viewBox="0 0 850 650"
   - If user asks for paper/handwriting or notebook: use <rect width="100%" height="100%" fill="#fdfbf7"/> with ruled blue lines and red margin, and font-family="'Caveat', cursive, sans-serif".
   - Otherwise dark theme: <rect width="100%" height="100%" fill="#0f172a" rx="16"/>
   - Clean, distinct colors (#38bdf8, #4ade80, #f43f5e, #fbbf24, #a78bfa, #f8fafc)
   - Labeled parts using font-size="14" font-weight="600" with pointer lines and arrows.
2. Provide a breakdown of the key labeled components and their physiological/chemical functions in simple English and Roman Urdu for exam preparation.
3. Include an exam drawing tip (how to score full marks drawing this in board exams).`;

    const text = await generateWithFallback({
      contents: prompt,
      config: {
        systemInstruction: 'You are an expert scientific diagram visualizer and textbook illustrator.',
      },
    });

    const svgMatch = text.match(/```(?:xml|svg)?\s*(<svg[\s\S]*?<\/svg>)\s*```/i);
    const svg = svgMatch ? svgMatch[1] : null;

    res.json({
      topic,
      svg,
      fullExplanation: text,
    });
  } catch (error: any) {
    console.error('Gemini Diagram Error:', error);

    // Check fallback diagrams
    const fallback = findFallbackDiagram(topic);
    if (fallback) {
      return res.json({
        topic: fallback.title,
        svg: fallback.svg,
        fullExplanation: `${fallback.explanation}\n\n\`\`\`xml\n${fallback.svg}\n\`\`\``,
      });
    }

    res.status(500).json({ error: error.message || 'Failed to generate diagram' });
  }
});

// Endpoint: AI Smart Study Plan & Revision Timetable Generator
app.post('/api/gemini/exam-plan', async (req, res) => {
  try {
    const {
      className = 'Class 11',
      subject = 'Physics',
      daysUntilExam = 30,
      weakAreas = '',
      targetGrade = 'A+',
      language = 'roman',
    } = req.body || {};

    const prompt = `Create a rigorous, highly practical AI Study Timetable & Exam Revision Plan for a ${className} student preparing for their ${subject} board exam in ${daysUntilExam} days.
Target Goal: Score ${targetGrade} grade.
Student Weak Areas to focus on: ${weakAreas || 'Core derivations, complex numericals, and diagram labeling'}.

Structure the response with clean markdown:
1. 🎯 **Strategic 4-Phase Roadmap**:
   - Phase 1 (Days 1-${Math.round(daysUntilExam * 0.4)}): Core Concepts & Textbook Theory
   - Phase 2 (Days ${Math.round(daysUntilExam * 0.4) + 1}-${Math.round(daysUntilExam * 0.7)}): Numericals, Derivations & Diagrams Mastery
   - Phase 3 (Days ${Math.round(daysUntilExam * 0.7) + 1}-${daysUntilExam - 3}): 5-Year Past Papers & Full Length Mocks
   - Phase 4 (Final 3 Days): High-Yield Formula Sheet & Rapid Revision
2. ⏰ **Daily 3-Hour Time Block Routine** (Fajr/Morning slot, Afternoon slot, Night slot).
3. 📌 **Top 5 High-Yield Chapters** with guaranteed questions.
4. 💡 **Pro Exam Day Golden Rules** to avoid losing presentation marks.

Use clear formatting. Provide explanations in ${language === 'roman' ? 'clear bilingual Roman Urdu and English' : 'English'}.`;

    const text = await generateWithFallback({
      contents: prompt,
      config: {
        systemInstruction: 'You are an elite academic curriculum planner, board topper mentor, and exam strategist.',
      },
    });

    res.json({ plan: text });
  } catch (error: any) {
    console.error('Gemini Exam Plan Error:', error);
    res.json({
      plan: `### 🎯 30-Day Exam Revision Strategy for ${req.body?.className || 'Student'} (${req.body?.subject || 'Studies'})\n\n` +
        `#### Phase 1: High-Yield Chapter Coverage (Days 1-12)\n` +
        `- Focus on Chapters 1-4: Master fundamental laws, definitions, and SI units.\n` +
        `- Practice key diagrams on ruled paper daily.\n\n` +
        `#### Phase 2: Numericals & Formula Mastery (Days 13-22)\n` +
        `- Solve past 5-year numericals and derivations step-by-step.\n` +
        `- Create a 1-page formula summary sheet.\n\n` +
        `#### Phase 3: Past Papers & Mock Exams (Days 23-30)\n` +
        `- Solve 3 full-length timed model papers to master board time management.\n` +
        `- Re-read short questions and objective MCQs.`,
    });
  }
});

// Endpoint: AI Model Question Paper Generator (Board Pattern)
app.post('/api/gemini/generate-paper', async (req, res) => {
  try {
    const {
      className = 'Class 11',
      subject = 'Physics',
      topic = 'Full Book',
      targetBoard = 'Punjab Board (BISE)',
    } = req.body || {};

    const prompt = `Generate a realistic, high-standard Board Pattern Model Examination Paper for ${className} ${subject} according to ${targetBoard} examination format.
Topic / Syllabus: ${topic}

Structure the paper strictly as follows:
=============================================================
**BOARD MODEL QUESTION PAPER 2026**
**${className.toUpperCase()} - ${subject.toUpperCase()}**
**Time Allowed:** 2 Hours 45 Mins  |  **Total Marks:** 85
=============================================================

### **SECTION A (Objective - Multiple Choice Questions)**
Provide 8 realistic board-level MCQs with four distinct options (A, B, C, D) and answer key at the bottom.

### **SECTION B (Short Answer Questions - 44 Marks)**
Provide 12 short conceptual & reasoning questions (Student must attempt any 8).
Include classic board favorites (e.g. why questions, derivations, dimensional analysis, definitions).

### **SECTION C (Long / Extensive Questions - 24 Marks)**
Provide 3 long questions, each divided into:
- Part (a): Comprehensive theory derivation (5 Marks)
- Part (b): Numerical problem with values (3 Marks)
(Student must attempt any 2 questions).

### **💡 EXAMINER MARKING SCHEME & TIPS**
Give 3 specific tips on how paper checkers award marks for diagrams, headings, and final answer units.`;

    const text = await generateWithFallback({
      contents: prompt,
      config: {
        systemInstruction: 'You are an authoritative board examination paper setter and chief examiner.',
      },
    });

    res.json({ paper: text });
  } catch (error: any) {
    console.error('Gemini Paper Error:', error);
    res.json({
      paper: `### **MODEL QUESTION PAPER 2026**\n**${req.body?.className || 'Class 11'} ${req.body?.subject || 'Physics'}**\n\n` +
        `**SECTION A: MCQs (12 Marks)**\n1. What is the SI unit of power? (A) Joule (B) Watt (C) Newton (D) Pascal [Ans: B]\n2. Work done by centripetal force is: (A) Zero (B) Positive (C) Negative (D) Infinite [Ans: A]\n\n` +
        `**SECTION B: Short Questions (Attempt any 8)**\n1. State and derive the work-energy theorem.\n2. Define conservation of momentum with a real-life example.\n3. Why does a diver curl their body during diving?\n\n` +
        `**SECTION C: Long Questions**\nQ1 (a) State and prove Bernoulli's equation for ideal fluid. (5 Marks)\nQ1 (b) A car moves with 20 m/s and stops in 4 seconds. Calculate distance covered. (3 Marks)`,
    });
  }
});

// Vite Middleware for Development / Static serving for Production
if (process.env.NODE_ENV !== 'production') {
  const { createServer } = await import('vite');
  const vite = await createServer({
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

app.listen(port, '0.0.0.0', () => {
  console.log(`TalibIlm server running on http://0.0.0.0:${port}`);
});
