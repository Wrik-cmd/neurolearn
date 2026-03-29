const axios = require('axios');

async function test() {
    try {
        const response = await axios.post('http://localhost:5000/api/chat/ask', {
            message: "hi"
        });
        console.log("Success:", response.data);
    } catch (err) {
        console.error("Error from Server:", err.response?.data || err.message);
    }
}

test();
