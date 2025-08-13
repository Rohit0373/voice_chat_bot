# Revolt Voice Bot 🎙️

A real-time conversational **voice chatbot** built using **Node.js**, **Express**, and the **Gemini Live API**.  
This bot can listen to user voice commands, reply in natural speech, and is **focused only on Revolt Motors-related queries**.

---

## 🚀 Features
- 🎤 **Real-time Voice Recognition** (Web Speech API)
- 🔊 **AI Voice Response** using Gemini Live API
- 🏍️ Answers **only** Revolt Motors-related questions
- ⛔ Politely refuses unrelated topics
- 🖥️ Simple and responsive web interface
- 🛑 Start / Stop conversation control

---

## 🛠️ Tech Stack
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express
- **API:** Google Gemini Live API
- **Others:** dotenv, abort-controller

---

## 📂 Project Structure
revolt-voice-bot/
│── server.js # Node.js server
│── public/
│ ├── index.html # Main UI
│ ├── style.css # Styling
│ └── script.js # Frontend logic
│── .env # API keys & env variables
│── package.json
└── README.md

---

## ⚙️ Installation & Setup
1. **Clone the repository**
```bash
git clone https://github.com/your-username/revolt-voice-bot.git
cd revolt-voice-bot

2 Install dependencies
npm install

3 Add your .env file
GEMINI_API_KEY=your_api_key_here
PORT=3001

4 Start the server
node server.js

5 Open your browser:
http://localhost:3001
 



