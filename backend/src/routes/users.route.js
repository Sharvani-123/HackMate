const express= require('express');
const router= express.Router();

//importing the User Controller Functions
const  {
    createProfile,
    getUserProfile,
    updateProfile,
    getUsersByCollege
} = require('../controllers/user.controller');

//importing auth middleware
const {verifyFirebaseToken} = require('../middleware/auth.middleware');

//Routes
// POST /api/users/profile - Create new user profile (requires auth)
router.post('/profile', verifyFirebaseToken, createProfile);
//GET /api/users/profile - Get current user's profile (requires auth)
router.get('/profile', verifyFirebaseToken, getUserProfile);
//PATCH /api/users/profile - Update current user's profile (requires auth)
router.patch('/profile', verifyFirebaseToken, updateProfile);
//GET /api/users/college/:university - Get users from specific college (public)
router.get('/college/:university',getUsersByCollege);

module.exports= router;