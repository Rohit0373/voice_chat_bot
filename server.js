// server.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const AbortController = require('abort-controller'); // ⬅️ NEW LINE

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Store active AbortControllers for each client
const activeControllers = new Map();

async function getGeminiResponse(userText, lang, abortSignal) {
  try {
    const systemInstruction = `
      You are Rev, an AI assistant for Revolt Motors.
      You must only talk about Revolt Motors' products, services, electric bikes, and company-related topics.
      If the user asks anything unrelated to Revolt Motors, politely refuse and say:
      "I can only answer questions related to Revolt Motors."
    `;

    const prompt =
      lang === 'hi'
        ? `${systemInstruction} Please respond in Hindi. User: ${userText}`
        : `${systemInstruction} Please respond in English. User: ${userText}`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(prompt, { signal: abortSignal });
    return result.response.text();
  } catch (err) {
    if (err.name === 'AbortError') {
      console.log('Request aborted by user');
      return '(Stopped)';
    }
    console.error('Gemini API Error:', err);
    return 'Sorry, something went wrong while generating a response.';
  }
}

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', async (message) => {
    try {
      const parsed = JSON.parse(message.toString());

      // Stop request
      if (parsed.type === 'stop') {
        const controller = activeControllers.get(ws);
        if (controller) {
          controller.abort();
          activeControllers.delete(ws);
        }
        return;
      }

      const userText = parsed.text || '';
      const lang = parsed.lang || 'en';

      if (!userText.trim()) {
        ws.send('Sorry, I could not understand.');
        return;
      }

      // Create new AbortController for this request
      const controller = new AbortController();
      activeControllers.set(ws, controller);

      const reply = await getGeminiResponse(userText, lang, controller.signal);
      ws.send(reply);

      // Remove controller after response
      activeControllers.delete(ws);
    } catch (err) {
      console.error('Error processing message:', err);
      ws.send('Sorry, something went wrong.');
    }
  });

  ws.on('close', () => {
    activeControllers.delete(ws);
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

