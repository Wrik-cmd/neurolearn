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
        console.log("Attempting to list models...");
        // This is the common way to check if the key is valid and what's accessible
        // Use gemini-pro if flash fails
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Hi");
        console.log("Success with gemini-pro:", result.response.text());
    } catch (err) {
        console.error("FAILED with gemini-pro:", err.message);
    }
}

test();
