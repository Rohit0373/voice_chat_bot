const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const apiKey = "AIzaSyBtfeAINRlsAJGHTboxvtupC4bHMIXW41w"; // ← Yaha apni API key daal
const model = "gemini-2.5-flash";     // ← Supported model choose karo

async function testGemini() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const body = {
    contents: [
      { parts: [{ text: "Hello Gemini, mera test prompt ho raha hai" }] }
    ]
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}

testGemini();

