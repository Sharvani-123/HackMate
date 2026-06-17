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
const { isAdmin } = require('../middleware/admin.middleware');
const { verifyFirebaseToken } = require('../middleware/auth.middleware');
router.use(verifyFirebaseToken);

// Admin hackathon routes
router.post('/hackathons', isAdmin, createHackathon);
router.get('/hackathons', isAdmin, getAllHackathons);
router.get('/hackathons/:id', isAdmin, getHackathonById);
router.patch('/hackathons/:id', isAdmin, updateHackathon);
router.delete('/hackathons/:id', isAdmin, deleteHackathon);

module.exports = router;