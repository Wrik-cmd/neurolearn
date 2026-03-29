const axios = require("axios");

exports.askAssistant = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: "Message is required." });
        }

        const API_KEY = process.env.GEMINI_API_KEY;
        if (!API_KEY) {
            return res.status(500).json({ error: "Key Missing. Add GEMINI_API_KEY to .env" });
        }

        // DIRECT FETCH BYPASSING SDK
        // This is more reliable if the SDK encounters model discovery issues
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
        
        const payload = {
            contents: [{ parts: [{ text: `You are 'Neural Assistant', a cutting-edge AI mentor for the NeuroLearn platform. 
User Query: ${message}` }] }]
        };

        const response = await axios.post(url, payload);
        
        if (response.data && response.data.candidates && response.data.candidates[0].content) {
            const text = response.data.candidates[0].content.parts[0].text;
            res.json({ reply: text });
        } else {
            throw new Error("Invalid response structure from Gemini API");
        }

    } catch (error) {
        console.error("Gemini Direct API Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Neural link failed. The AI core is temporarily offline." });
    }
};
