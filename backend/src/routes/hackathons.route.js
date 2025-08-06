const express = require('express');
const router = express.Router();

const {
    getHackathons,
    getHackathonDetails,
    getTags
} = require('../controllers/hackathon.controller');


const { verifyFirebaseToken } = require('../middleware/auth.middleware');

// Protected hackathon routes (authentication required for all)
router.get('/', verifyFirebaseToken, getHackathons);                    // GET /api/hackathons - Get all hackathons with filters
router.get('/tags', verifyFirebaseToken, getTags);                      // GET /api/hackathons/tags - Get available tags
router.get('/:id', verifyFirebaseToken, getHackathonDetails);           // GET /api/hackathons/:id - Get single hackathon details

module.exports = router;