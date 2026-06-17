const express= require('express');
const router= express.Router();

//importing the User Controller Functions
const  {
    createProfile,
    getUserProfile,
    updateProfile,
    getUsersByCollege
} = require('../controllers/user.controller');

const { verifyFirebaseToken } = require('../middleware/auth.middleware');
//Routes
// POST /api/users/profile - Create new user profile
router.post('/profile',verifyFirebaseToken, createProfile);
//GET /api/users/profile - Get current user's profile
router.get('/profile',verifyFirebaseToken, getUserProfile);
//PATCH /api/users/profile - Update current user's profile
router.patch('/profile',verifyFirebaseToken, updateProfile);
//GET /api/users/college/:university - Get users from specific college (public)
router.get('/college/:university',verifyFirebaseToken, getUsersByCollege);

module.exports= router;