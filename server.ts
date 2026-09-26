import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// Multi-Key Rotation & Resiliency Manager
// ============================================================================
class GeminiKeyRotator {
  private keys: string[] = [];
  private currentIndex = 0;
  private cooldowns: Map<string, number> = new Map();

  constructor() {
    this.refreshKeys();
  }

  public refreshKeys() {
    const rawKeys: string[] = [];

    // Check GEMINI_API_KEYS (comma/semicolon separated)
    if (process.env.GEMINI_API_KEYS) {
      const split = process.env.GEMINI_API_KEYS.split(/[,;\n]+/).map(k => k.trim()).filter(Boolean);
      rawKeys.push(...split);
    }

    // Check individual numbered envs GEMINI_API_KEY_1..5
    for (let i = 1; i <= 10; i++) {
      const k = process.env[`GEMINI_API_KEY_${i}`];
      if (k && k.trim()) rawKeys.push(k.trim());
    }

    // Check standard GEMINI_API_KEY
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()) {
      if (!rawKeys.includes(process.env.GEMINI_API_KEY.trim())) {
        rawKeys.unshift(process.env.GEMINI_API_KEY.trim());
      }
    }

    // Deduplicate
    this.keys = Array.from(new Set(rawKeys.filter(k => k && k !== 'MY_GEMINI_API_KEY')));
  }

  public getKeyCount(): number {
    return this.keys.length;
  }

  public getMaskedKeyPool(): { index: number; masked: string; isCoolingDown: boolean }[] {
    const now = Date.now();
    return this.keys.map((k, idx) => {
      const cooldownUntil = this.cooldowns.get(k) || 0;
      const masked = k.length > 8 ? `${k.slice(0, 4)}...${k.slice(-4)}` : '••••••••';
      return {
        index: idx + 1,
        masked,
        isCoolingDown: cooldownUntil > now,
      };
    });
  }

  public getActiveKey(): { key: string | null; index: number } {
    if (this.keys.length === 0) return { key: null, index: -1 };

    const now = Date.now();
    // Find first key not cooling down starting from currentIndex
    for (let i = 0; i < this.keys.length; i++) {
      const idx = (this.currentIndex + i) % this.keys.length;
      const key = this.keys[idx];
      const cooldownUntil = this.cooldowns.get(key) || 0;
      if (cooldownUntil <= now) {
        this.currentIndex = (idx + 1) % this.keys.length; // Rotate for next round-robin
        return { key, index: idx + 1 };
      }
    }

    // If all are cooling down, return the current one anyway as best effort
    const fallback = this.keys[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.keys.length;
    return { key: fallback, index: this.currentIndex + 1 };
  }

  public markCooldown(key: string, durationMs = 60000) {
    this.cooldowns.set(key, Date.now() + durationMs);
  }
}

const keyRotator = new GeminiKeyRotator();

// ============================================================================
// Fallback & Safety Net Extraction (Regex from C# LeadExtractor)
// ============================================================================
const PHONE_REGEX = /(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

function extractContactRegex(text: string) {
  const phoneMatch = text.match(PHONE_REGEX);
  const emailMatch = text.match(EMAIL_REGEX);
  return {
    phone: phoneMatch ? phoneMatch[0] : null,
    email: emailMatch ? emailMatch[0] : null,
  };
}

// Emergency keywords check for instant triage
const EMERGENCY_KEYWORDS = [
  'burst', 'flooding', 'flood', 'gas leak', 'smell gas', 'fire', 'smoke',
  'no heat', 'freezing', 'pipe broken', 'sparks', 'electrical fire',
  'overflowing', 'ceiling leak', 'carbon monoxide', 'urgent', 'emergency'
];

function isEmergencyText(text: string): boolean {
  const lower = text.toLowerCase();
  return EMERGENCY_KEYWORDS.some(k => lower.includes(k));
}

// Fallback smart responder if Gemini API key isn't provided or quota is fully exceeded
function generateFallbackReply(
  message: string,
  businessName: string,
  industry: string,
  knowledgeBase: { question: string; answer: string }[],
  visitorName?: string,
  visitorPhone?: string
): string {
  const lower = message.toLowerCase();
  const isEmerg = isEmergencyText(message);

  // Check KB matches
  for (const kb of knowledgeBase) {
    const qWords = kb.question.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const match = qWords.some(w => lower.includes(w));
    if (match) {
      return `${kb.answer} Would you like me to book a time or take your phone number so our team can follow up directly?`;
    }
  }

  if (isEmerg) {
    return `We treat urgent ${industry} issues with immediate priority. Please share your phone number and address right now so our on-call technician can reach out to you within minutes.`;
  }

  if (lower.includes('price') || lower.includes('cost') || lower.includes('quote') || lower.includes('estimate')) {
    return `Every project is unique! At ${businessName}, we provide clear, upfront estimates. Could you share your name, phone number, and a brief detail of what you need? We'll have a specialist follow up right away.`;
  }

  if (lower.includes('hours') || lower.includes('open') || lower.includes('when')) {
    return `We're available Monday through Friday 8am to 6pm, with emergency on-call support for critical issues. What specific service are you looking for today?`;
  }

  if (visitorPhone || extractContactRegex(message).phone) {
    return `Thank you! I have recorded your contact details. A team member from ${businessName} will reach out to you shortly. Is there anything else you'd like us to know in advance?`;
  }

  return `Thanks for reaching out to ${businessName}! We specialize in professional ${industry || 'customer'} services. Could you tell me a little more about what you need assistance with, and share your name or phone number so we can best help you?`;
}

// ============================================================================
// Express Application
// ============================================================================
async function startServer() {
  const app = express();
  app.use(express.json());

  // CORS for widget embed testing
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Tenant-Key, X-Admin-Key');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Health endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      keysConfigured: keyRotator.getKeyCount(),
    });
  });

  // Key pool diagnostic status endpoint
  app.get('/api/key-pool', (req: Request, res: Response) => {
    keyRotator.refreshKeys();
    const count = keyRotator.getKeyCount();
    const pool = keyRotator.getMaskedKeyPool();
    res.json({
      totalKeys: count,
      hasKey: count > 0,
      activePool: pool,
      cyclingSupported: true,
      hint: count === 0
        ? 'No Gemini API key found. AI Studio automatically injects GEMINI_API_KEY from Settings > Secrets panel. The widget is using smart local fallback.'
        : `Key cycling active with ${count} key(s) in pool. High-load requests automatically failover.`,
    });
  });

  // Chat API endpoint
  app.post('/api/chat', async (req: Request, res: Response) => {
    try {
      const {
        message,
        history = [],
        tenantConfig = {},
      } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required.' });
      }

      const businessName = tenantConfig.businessName || 'Our Business';
      const industry = tenantConfig.industry || 'Professional Services';
      const knowledgeBase: { question: string; answer: string }[] = tenantConfig.knowledgeBase || [];
      const receptionistName = tenantConfig.receptionistName || 'Receptionist';

      // Instant regex extraction check
      const regexContact = extractContactRegex(message);
      const isEmergency = isEmergencyText(message);

      // System prompt matching C# PromptBuilder
      const kbText = knowledgeBase.length > 0
        ? knowledgeBase.map((k) => `- Q: ${k.question}\n  A: ${k.answer}`).join('\n')
        : 'No specific knowledge base entries yet - answer generally, warmly, and professionally.';

      const systemPrompt = `You are a friendly, professional AI receptionist named ${receptionistName} for "${businessName}", a ${industry} company.

Your primary responsibilities:
1. Answer visitor questions clearly and concisely using the provided knowledge base.
2. If the visitor describes an urgent or hazardous issue relevant to ${industry} (e.g. leaks, electrical hazards, no heat/AC in extremes, emergency repairs), treat it with high priority and reassure them prompt help is on the way.
3. Naturally guide the conversation to collect:
   - Visitor Name
   - Phone Number
   - Email address (optional)
   - Specific description of what they need
4. Keep answers short, conversational, and punchy (2-4 sentences max) — this is a modern live chat widget, not an email.
5. If you do not know a specific detail from the knowledge base, never hallucinate pricing or guarantees. Offer to take their details so a team member can verify and follow up promptly.

KNOWLEDGE BASE:
${kbText}
`;

      let aiReply = '';
      let usedKeyIndex = -1;
      let rotated = false;

      // Attempt with Gemini rotating keys
      const totalKeys = keyRotator.getKeyCount();
      let attempts = 0;
      const maxAttempts = Math.max(1, totalKeys);

      while (attempts < maxAttempts) {
        attempts++;
        const { key, index } = keyRotator.getActiveKey();

        if (!key) break;

        try {
          const ai = new GoogleGenAI({
            apiKey: key,
            httpOptions: {
              headers: {
                'User-Agent': 'aistudio-build',
              },
            },
          });

          // Convert history format
          const formattedContents = history.map((m: { role: string; content: string }) => ({
            role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
            parts: [{ text: m.content }],
          }));
          formattedContents.push({
            role: 'user',
            parts: [{ text: message }],
          });

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: formattedContents,
            config: {
              systemInstruction: systemPrompt,
              temperature: 0.7,
              topP: 0.9,
            },
          });

          aiReply = response.text || '';
          usedKeyIndex = index;
          if (attempts > 1) rotated = true;
          break;
        } catch (err: any) {
          const errStr = String(err?.message || err);
          console.warn(`[Gemini attempt ${attempts} with key #${index} failed]:`, errStr);

          // If rate limited or quota exceeded, cool down key and try next
          if (errStr.includes('429') || errStr.toLowerCase().includes('quota') || errStr.toLowerCase().includes('resource_exhausted')) {
            keyRotator.markCooldown(key, 90000); // 90s cooldown
            rotated = true;
            continue;
          } else {
            // Other error - try next key if available
            continue;
          }
        }
      }

      // If all keys failed or no keys configured, use graceful fallback
      if (!aiReply) {
        aiReply = generateFallbackReply(
          message,
          businessName,
          industry,
          knowledgeBase,
          undefined,
          regexContact.phone || undefined
        );
      }

      // Lead Info Extraction
      let extractedLead: {
        name: string | null;
        phone: string | null;
        email: string | null;
        issueSummary: string | null;
        isEmergency: boolean;
      } = {
        name: null,
        phone: regexContact.phone,
        email: regexContact.email,
        issueSummary: null,
        isEmergency,
      };

      // Try deeper Gemini lead extraction if we have an active key
      const { key: leadKey } = keyRotator.getActiveKey();
      if (leadKey) {
        try {
          const ai = new GoogleGenAI({
            apiKey: leadKey,
            httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
          });

          const transcript = [...history, { role: 'user', content: message }, { role: 'assistant', content: aiReply }]
            .map((m: any) => `${m.role === 'user' ? 'Visitor' : 'Receptionist'}: ${m.content}`)
            .join('\n');

          const extractPrompt = `Read this customer chat transcript and extract any contact details or issue summary mentioned.
Return ONLY raw JSON with this exact schema:
{"name": null, "phone": null, "email": null, "issueSummary": null, "isEmergency": false}

Rules:
- Use null if not mentioned.
- isEmergency must be true if there is an active emergency (flood, leak, fire, no heat, electrical danger, power outage).
- issueSummary is a concise summary like "AC stopped blowing cold air".

TRANSCRIPT:
${transcript}`;

          const extResp = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: extractPrompt,
            config: {
              responseMimeType: 'application/json',
            },
          });

          const jsonText = (extResp.text || '{}').trim().replace(/```json/gi, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(jsonText);
          extractedLead = {
            name: parsed.name || null,
            phone: parsed.phone || regexContact.phone,
            email: parsed.email || regexContact.email,
            issueSummary: parsed.issueSummary || null,
            isEmergency: Boolean(parsed.isEmergency || isEmergency),
          };
        } catch {
          // Keep regex extracted fields
        }
      }

      res.json({
        reply: aiReply,
        lead: extractedLead,
        keyInfo: {
          usedKeyIndex: usedKeyIndex > 0 ? usedKeyIndex : null,
          totalKeys: totalKeys,
          rotated,
          usingFallback: !usedKeyIndex || usedKeyIndex <= 0,
        },
      });
    } catch (error: any) {
      console.error('Server error handling chat:', error);
      res.status(500).json({
        error: 'Failed to process chat message',
        details: error?.message,
      });
    }
  });

  // Standalone embeddable widget.js endpoint
  app.get('/widget.js', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.sendFile(path.resolve(__dirname, 'public', 'widget.js'));
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AI Receptionist Server] listening on http://0.0.0.0:${PORT}`);
    console.log(`[Key Pool] initialized with ${keyRotator.getKeyCount()} key(s).`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
