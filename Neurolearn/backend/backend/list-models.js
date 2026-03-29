const axios = require('axios');
require('dotenv').config();

async function test() {
    const API_KEY = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
    
    try {
        const response = await axios.get(url);
        console.log("AVAILABLE MODELS:", JSON.stringify(response.data, null, 2));
    } catch (err) {
        console.error("LIST FAILED Status:", err.response?.status);
        console.error("LIST FAILED Data:", JSON.stringify(err.response?.data, null, 2));
    }
}

test();
