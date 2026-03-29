const axios = require('axios');

exports.searchVideos = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ error: "Search query is required." });
        }
        
        const API_KEY = process.env.YOUTUBE_API_KEY;
        if (!API_KEY) {
            return res.status(500).json({ error: "YouTube API Key is missing on the server. Please add YOUTUBE_API_KEY to backend/.env" });
        }

        // 1. Search for videos to get IDs
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&type=video&q=${encodeURIComponent(query)}&key=${API_KEY}`;
        const searchResponse = await axios.get(searchUrl);
        const searchItems = searchResponse.data.items;

        if (!searchItems || searchItems.length === 0) {
            return res.json([]);
        }

        // 2. Extract IDs for statistics call
        const videoIds = searchItems.map(item => item.id.videoId).join(',');

        // 3. Fetch statistics (likes, views, etc.)
        const statsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIds}&key=${API_KEY}`;
        const statsResponse = await axios.get(statsUrl);
        const videoDetails = statsResponse.data.items;

        // 4. Map and Sort by Likes
        const rankedVideos = videoDetails.map(video => ({
            id: { videoId: video.id },
            snippet: video.snippet,
            statistics: video.statistics,
            likeCount: parseInt(video.statistics.likeCount || 0)
        })).sort((a, b) => b.likeCount - a.likeCount);

        res.json(rankedVideos);
    } catch (error) {
        console.error("YouTube Search Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch and rank videos from YouTube. Check your API limit or key validity." });
    }
};
