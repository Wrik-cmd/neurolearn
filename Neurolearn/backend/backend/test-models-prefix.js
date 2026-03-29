const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function test() {
    const API_KEY = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(API_KEY);
    try {
        // Explicitly use "models/" prefix
        const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });
        const result = await model.generateContent("hi");
        console.log("SUCCESS WITH MODELS/ PREPEND:", result.response.text());
    } catch (err) {
        console.log("FAILED WITH MODELS/ PREPEND:", err.message);
    }
}

test();
