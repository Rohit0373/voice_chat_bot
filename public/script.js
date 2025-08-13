// public/script.js

const ws = new WebSocket("ws://localhost:3001");

ws.onopen = () => {
  console.log("Connected to the server");
};

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-IN"; // Hindi ke liye "hi-IN"
  speechSynthesis.speak(utterance);
}

ws.onmessage = (event) => {
  const botReply = event.data;
  document.getElementById("response").innerText = botReply;
  speak(botReply); // Bot ka reply bolke suna dega
};


ws.onclose = () => {
  console.log("Disconnected from the server");
};

// Simple language detection (Hindi vs English)
function detectLanguage(text) {
  const hindiRegex = /[\u0900-\u097F]/;
  return hindiRegex.test(text) ? "hi" : "en";
}

// Send user text to server
function sendMessage(userText) {
  if (!userText.trim()) return;

  const lang = detectLanguage(userText);

  const data = JSON.stringify({
    type: 'message',  // ⬅️ NEW
    text: userText,
    lang: lang
  });

  ws.send(data);
}


// Voice recognition setup
const startBtn = document.getElementById("startBtn");
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "en-IN"; // Can switch dynamically if needed
recognition.interimResults = false;

startBtn.addEventListener("click", () => {
  recognition.start();
  document.getElementById("response").innerText = "Listening...";
});

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  document.getElementById("userText").innerText = `You: ${transcript}`;
  sendMessage(transcript);
};



recognition.onerror = (event) => {
  console.error("Speech recognition error:", event.error);
  if (event.error === "no-speech") {
    document.getElementById("response").innerText = "No speech detected. Please try again 🎤";
  } else if (event.error === "not-allowed") {
    document.getElementById("response").innerText = "Mic permission not allowed ❌";
  } else {
    document.getElementById("response").innerText = "Sorry, something went wrong.";
  }
};
// Stop button functionality
document.getElementById("stopBtn").addEventListener("click", () => {
  ws.send(JSON.stringify({ type: 'stop' }));
  speechSynthesis.cancel(); // Agar voice bol rahi hai to turant band karo
  document.getElementById("response").innerText = "(Stopped)";
});
