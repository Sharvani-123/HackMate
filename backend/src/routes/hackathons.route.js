const express = require('express');
const router = express.Router();

const {
    getHackathons,
    getHackathonDetails,
    getTags
} = require('../controllers/hackathon.controller');

const cache = require('../middleware/cache.middleware');

// Protected hackathon routes (authentication required for all)
router.get('/', cache, getHackathons);                    // GET /api/hackathons - Get all hackathons with filters
router.get('/tags', cache, getTags);                      // GET /api/hackathons/tags - Get available tags
router.get('/:id', cache, getHackathonDetails);           // GET /api/hackathons/:id - Get single hackathon details

module.exports = router;