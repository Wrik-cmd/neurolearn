const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function test() {
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
        console.error("API KEY MISSING");
        return;
    }
    const genAI = new GoogleGenerativeAI(API_KEY);
    try {
        // Try listing models first to see what is available
        console.log("Testing with gemini-1.5-flash...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hi");
        console.log("Success:", result.response.text());
    } catch (err) {
        console.error("FAILED:", err.message);
    }
}

test();
