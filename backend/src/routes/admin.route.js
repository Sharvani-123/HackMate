const express = require('express');
const router= express.Router();

const {
    createHackathon,
    updateHackathon,
    deleteHackathon,
    getHackathonById,
    getAllHackathons
}= require('../controllers/admin.controller');

// Import middleware
const { verifyFirebaseToken } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/admin.middleware');

// Admin hackathon routes
router.post('/hackathons', verifyFirebaseToken, isAdmin, createHackathon);
router.get('/hackathons', verifyFirebaseToken, isAdmin, getAllHackathons);
router.get('/hackathons/:id', verifyFirebaseToken, isAdmin, getHackathonById);
router.patch('/hackathons/:id', verifyFirebaseToken, isAdmin, updateHackathon);
router.delete('/hackathons/:id', verifyFirebaseToken, isAdmin, deleteHackathon);

module.exports = router;