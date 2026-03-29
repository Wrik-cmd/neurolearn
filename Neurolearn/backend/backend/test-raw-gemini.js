const axios = require('axios');
require('dotenv').config();

async function test() {
    const API_KEY = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    
    try {
        const response = await axios.post(url, {
            contents: [{ parts: [{ text: "hi" }] }]
        });
        console.log("RAW SUCCESS:", JSON.stringify(response.data, null, 2));
    } catch (err) {
        console.error("RAW FAILED Status:", err.response?.status);
        console.error("RAW FAILED Data:", JSON.stringify(err.response?.data, null, 2));
    }
}

test();
