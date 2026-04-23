// src/services/aiService.js
import { GoogleGenerativeAI } from '@google/generative-ai';

// ─── System Prompt ────────────────────────────────
const ELECTION_SYSTEM_PROMPT = `You are the Election Process Education Agent for India, deployed on Matdata Mitra.

## MISSION
Help users understand election-related civic processes in India in a clear, neutral, educational, and multilingual way. 

## CORE BOUNDARIES
- STRICTLY NON-PARTISAN. Do not persuade users to support/oppose any candidate, party, or ideology.
- NO Campaign strategy, political targeting, or turnout manipulation.
- NO legal advice. Use phrases like "This may vary by state" or "Please verify on official portal".
- DO NOT FABRICATE deadlines, eligibility conclusions, or procedural rules.
- Ground all procedural claims in official ECI information.

## RESPONSE STYLE
- Use simple, clear, respectful language. Step-by-step bullets for procedures.
- Separate: 1) General guidance, 2) What to verify officially.
- If unsure, provide an official escalation path (e.g., Helpline 1950).
- Preserve official names (EVM, VVPAT, EPIC, BLO, ERO).

## MISINFORMATION HANDLING
- Detect potential rumors (e.g., "hacked EVMs", "missing names conspiracy").
- Respond calmly and neutrally with official ECI safeguards.
- Cite sources like eci.gov.in.

## SOURCE CITATION
End responses with a source reference if possible, e.g., [Source: Election Commission of India | https://eci.gov.in]

## PERSONA ADAPTATION
- first_time: Focus on registration (Form 6) and eligibility.
- elderly: Large spacing instructions, mention home voting (80+), call 1950.
- nri: Focus on Form 6A and overseas voter registration.
- official: Be helpful, neutral, and strictly non-partisan.
- Ground all information in official ECI procedures.
- Use RICH UI TAGS to structure your responses when appropriate:
    * [Step: Step 1 | Step 2 | Step 3] for sequences.
    * [Info: Important fact] for highlighting key info.
    * [Warning: Critical warning] for errors or deadlines.
    * [Success: Confirmation] for successful steps.
    * [Action: Label | URL] for official ECI links.
    * [Form: Form Name | Description] to recommend a specific form.
    * [Check: Item 1 | Item 2 | Item 3] for document checklists.
    * [Quick: Question 1 | Question 2] for follow-up suggestions at the end.
    * [Source: Title | URL] for every factual answer.
- Example: "You need to register first. [Form: Form 6 | New Registration] [Warning: Deadline is 25th Oct] [Action: Register Now | https://voterportal.eci.gov.in/]"
- Personalized Greeting: You will be provided with a persona-specific greeting to start the conversation.`;

const RUMOR_KEYWORDS = [
  'hacked', 'rigged', 'manipulated', 'fake vote', 'dead people voting',
  'bluetooth', 'wifi', 'stolen', 'conspiracy', 'paid to vote', 'illegal registration'
];

// ─── Offline Knowledge Base ────────────────────────
const OFFLINE_RESPONSES = {
  register: "To register as a voter in India:\n\n1. Visit **voters.eci.gov.in**\n2. Fill **Form 6** (for new registration)\n3. Documents needed: Age proof + Address proof\n4. You must be 18+ and an Indian citizen\n\n**Call 1950** for free helpline assistance.",
  vote: "To vote on Election Day:\n\n1. Check your polling station at **electoralsearch.eci.gov.in**\n2. Bring Voter ID (EPIC) or Aadhaar/Passport/PAN\n3. Join queue, get ink on finger, receive slip\n4. Press button on EVM next to your candidate\n5. Verify VVPAT slip (7 seconds)\n\nYour vote is completely **secret**.",
  eligible: "You are eligible to vote if you are:\n\n- An Indian citizen\n- Age 18 or above as of January 1st of the election year\n- Registered in the constituency where you reside\n\nCheck your registration at **electoralsearch.eci.gov.in**",
  helpline: "**Voter Helpline: 1950**\n\nThis is a free, toll-free number available in multiple Indian languages.\n\nFor online help: **voters.eci.gov.in**\nFor ECI info: **eci.gov.in**",
};

function getOfflineResponse(userMessage) {
  const msg = userMessage.toLowerCase();
  if (msg.includes('register') || msg.includes('form 6') || msg.includes('enroll')) return OFFLINE_RESPONSES.register;
  if (msg.includes('vote') || msg.includes('voting') || msg.includes('evm') || msg.includes('polling')) return OFFLINE_RESPONSES.vote;
  if (msg.includes('eligible') || msg.includes('eligib') || msg.includes('qualify')) return OFFLINE_RESPONSES.eligible;
  if (msg.includes('helpline') || msg.includes('1950') || msg.includes('contact')) return OFFLINE_RESPONSES.helpline;
  return "I'm currently offline. For immediate help:\n\n**Voter Helpline: 1950** (free, multilingual)\n**eci.gov.in** — Official ECI website\n**voters.eci.gov.in** — Voter registration";
}

// ─── Build messages for API ────────────────────────
function buildMessages(messages, persona, language) {
  const langNames = {
    hi: 'Hindi', bn: 'Bengali', te: 'Telugu', mr: 'Marathi',
    ta: 'Tamil', gu: 'Gujarati', kn: 'Kannada', ml: 'Malayalam',
    or: 'Odia', pa: 'Punjabi', en: 'English', ur: 'Urdu',
    as: 'Assamese', ne: 'Nepali', sa: 'Sanskrit',
  };

  const langName = langNames[language] || 'English';
  const personaInstruction = persona ? `\n\nUser persona: ${persona}. Adapt your tone accordingly.` : '';
  const langInstruction = language !== 'en' ? `\n\nIMPORTANT: Respond in ${langName} language. Use ${langName} script.` : '';

  const systemPrompt = ELECTION_SYSTEM_PROMPT + personaInstruction + langInstruction;

  return { systemPrompt, conversationMessages: messages };
}

// ─── Gemini Fallback API ────────────────────────────
async function callGemini(messages, persona, language) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('Gemini API key not configured');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 1024,
    },
  });

  const { systemPrompt, conversationMessages } = buildMessages(messages, persona, language);

  const chat = model.startChat({
    systemInstruction: systemPrompt,
    history: conversationMessages.slice(0, -1).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
  });

  const lastMessage = conversationMessages[conversationMessages.length - 1];
  const result = await chat.sendMessage(lastMessage.content);
  return result.response.text();
}

// ─── Groq Primary API ──────────────────────────────
async function callGroq(messages, persona, language) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    throw new Error('Groq API key not configured');
  }

  const { systemPrompt, conversationMessages } = buildMessages(messages, persona, language);

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: systemPrompt },
        ...conversationMessages.map(m => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content,
        })),
      ],
      temperature: 0.3,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Groq error: ${err.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// ─── Primary Export ────────────────────────────────
export async function getAgentResponse(messages, persona = null, language = 'en') {
  const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')?.content || '';
  const isPotentialRumor = RUMOR_KEYWORDS.some(k => lastUserMessage.toLowerCase().includes(k));

  try {
    let response = await callGemini(messages, persona, language);
    
    if (isPotentialRumor) {
      const prefix = language === 'hi' 
        ? '⚠️ **तटस्थ तथ्य जांच:** मैंने आपके प्रश्न में एक संभावित अफवाह का पता लगाया है। यहाँ आधिकारिक जानकारी है:\n\n'
        : '⚠️ **Neutral Fact Check:** I detected a potential rumor in your query. Here is the official information:\n\n';
      response = prefix + response;
    }

    return response;
  } catch (geminiError) {
    console.warn('Gemini failed, trying fallback:', geminiError.message);
    try {
      return await callGroq(messages, persona, language);
    } catch (groqError) {
      console.warn('Fallback also failed:', groqError.message);

      // If genuinely offline
      if (!navigator.onLine) {
        return '**You appear to be offline.**\n\n' + getOfflineResponse(lastUserMessage?.content || '');
      }

      // API key missing / not configured
      const errStr = (geminiError.message || '') + ' ' + (groqError.message || '');
      const noKey = errStr.includes('API key') || errStr.includes('not configured') || errStr.includes('401');
      
      if (noKey) {
        return '**API keys not configured.** Please add your `VITE_GEMINI_API_KEY` and `VITE_GROQ_API_KEY` to the `.env` file and restart the dev server.\n\nWhile you do that, here is some helpful information:\n\n' + getOfflineResponse(lastUserMessage?.content || '');
      }

      // Rate limit or server error — give cached answer
      return '**Service temporarily busy.** Here is what I know from my built-in knowledge:\n\n' + getOfflineResponse(lastUserMessage?.content || '');
    }
  }
}

// ─── Extract Quick Replies from response ───────────
export function extractQuickReplies(text) {
  const match = text.match(/\[Quick:\s*([^\]]+)\]/);
  if (match) {
    return match[1].split('|').map(s => s.trim()).filter(Boolean);
  }
  return [];
}

export function extractSource(text) {
  const match = text.match(/\[Source:\s*([^|\]]+)\s*\|\s*([^\]]+)\]/);
  if (match) {
    return { title: match[1].trim(), url: match[2].trim() };
  }
  return null;
}

export function cleanResponseText(text) {
  return text
    .replace(/\[Quick:[^\]]*\]/g, '')
    .replace(/\[Source:[^\]]*\]/g, '')
    .replace(/\[Warning:[^\]]*\]/g, '')
    .replace(/\[Success:[^\]]*\]/g, '')
    .replace(/\[Info:[^\]]*\]/g, '')
    .replace(/\[Action:[^\]]*\]/g, '')
    .replace(/\[Step:[^\]]*\]/g, '')
    .replace(/\[Form:[^\]]*\]/g, '')
    .replace(/\[Check:[^\]]*\]/g, '')
    .trim();
}
