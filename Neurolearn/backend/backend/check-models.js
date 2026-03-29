const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function test() {
    const API_KEY = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(API_KEY);
    try {
        // We can't easily list models with the client SDK without a specific method, 
        // but we can try common ones.
        const list = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro", "gemini-1.0-pro"];
        for (const m of list) {
            try {
                const model = genAI.getGenerativeModel({ model: m });
                await model.generateContent("test");
                console.log(`MODEL ${m} IS WORKING!`);
                return;
            } catch (e) {
                console.log(`MODEL ${m} FAILED: ${e.message}`);
            }
        }
    } catch (err) {
        console.error("LIST FAILED:", err.message);
    }
}

test();
