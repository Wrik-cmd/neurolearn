const express = require('express');
const router = express.Router();
const youtubeController = require('../controller/youtube.controller');

// Optional auth: we can leave it open for demo accounts or apply auth if needed
router.get('/search', youtubeController.searchVideos);

module.exports = router;
