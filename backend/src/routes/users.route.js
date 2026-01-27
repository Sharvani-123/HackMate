const express= require('express');
const router= express.Router();

//importing the User Controller Functions
const  {
    createProfile,
    getUserProfile,
    updateProfile,
    getUsersByCollege
} = require('../controllers/user.controller');

//Routes
// POST /api/users/profile - Create new user profile
router.post('/profile', createProfile);
//GET /api/users/profile - Get current user's profile
router.get('/profile', getUserProfile);
//PATCH /api/users/profile - Update current user's profile
router.patch('/profile', updateProfile);
//GET /api/users/college/:university - Get users from specific college (public)
router.get('/college/:university', getUsersByCollege);

module.exports= router;