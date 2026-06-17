const User = require('../models/User');


//Create user profile
const createProfile= async (req,res) => {
    try{const firebaseUid=req.user.uid;
    const email=req.user.email;
    const {profile} = req.body;

    //validating req fields
    if(!profile || !profile.name || !profile.university || !profile.branch || !profile.year){
        return res.status(400).json({
            success: false,
            message: 'Missing required profile fields: name, university, branch, year'
        });
    }

    //checking if user already exists
    const existingUser= await User.findOne({firebaseUid});
    if(existingUser){
        return res.status(400).json({
            success:false,
            message: 'Profile already exists for this user'
        });
    }


    //creating new user if it already doesn't exixt
    const newUser= new User({
        firebaseUid,
        email,
        isProfileComplete: true,
        profile:{
            name: profile.name,
            university: profile.university,
            customUniversity:profile.customUniversity || null,
            branch:profile.branch,
            year: profile.year,
            skills: profile.skills || [],
            interests: profile.interests || [],
            teamingUp: profile.teamingUp!==undefined ? profile.teamingUp :true,
            linkedinURL: profile.linkedinURL || profile.linkedinUrl || null,
            githubURL: profile.githubURL || profile.githubUrl || null,
            discordURL: profile.discordURL || profile.discordUrl || null,
            photoURL: profile.photoURL || profile.photoUrl || null
        }
    });

    await newUser.save();

    res.status(201).json({
        success:true,
        message: 'Profile created successfully',
        data: newUser
    });

}catch(error){
    console.error('Error creating profile',error);
    res.status(500).json({
        success:false,
        message:'Server error while creating profile',
        error: error.message
    });
}
};

//Get user profile by Firebase UID
const getUserProfile = async (req,res) => {
    try{
        const firebaseUid= req.user.uid;
        
        const user= await User.findOne({firebaseUid});
        if(!user){
            return res.status(404).json({
                success: false,
                messgae:'User profile not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: user
        });
    }
    catch(error){
        console.error('Error fetching profile',error);

        res.status(500).json({
            success: false,
            messgae: 'Server error while fetching profile',
            error: error.message
        });
    }
};

//Create or update user profile
const updateProfile=async (req,res) => {
    try {
        const firebaseUid= req.user.uid;
        const {profile}= req.body;
        
        //finding the user
        const user= await User.findOne({firebaseUid});
        
        if(!user){
            return res.status(404).json({
                success: false,
                message: 'User profile not found'
            });
        }

        //Update if found
        if (profile.name) user.profile.name = profile.name;
        if (profile.university) user.profile.university = profile.university;
        if (profile.customUniversity !== undefined) user.profile.customUniversity = profile.customUniversity;
        if (profile.branch) user.profile.branch = profile.branch;
        if (profile.year) user.profile.year = profile.year;
        if (profile.skills) user.profile.skills = profile.skills;
        if (profile.interests) user.profile.interests = profile.interests;
        if (profile.teamingUp !== undefined) user.profile.teamingUp = profile.teamingUp;
        if (profile.linkedinURL !== undefined || profile.linkedinUrl !== undefined) {
            user.profile.linkedinURL = profile.linkedinURL ?? profile.linkedinUrl;
        }
        if (profile.githubURL !== undefined || profile.githubUrl !== undefined) {
            user.profile.githubURL = profile.githubURL ?? profile.githubUrl;
        }
        if (profile.discordURL !== undefined || profile.discordUrl !== undefined) {
            user.profile.discordURL = profile.discordURL ?? profile.discordUrl;
        }
        if (profile.photoURL !== undefined || profile.photoUrl !== undefined) {
            user.profile.photoURL = profile.photoURL ?? profile.photoUrl;
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: 'profile updated successfully',
            data: user
        });

    } catch (error) {
        console.error('Error updating profile: ',error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating profile',
            error: error.message
        });
    }
};

//Get users by college
const getUsersByCollege = async (req,res) => {
    try {
        const{ university}= req.params;
        const { page = 1, limit = 10 } = req.query;
        
        const skip = (page - 1) * limit;
        
        const users= await User.find({
            'profile.university': university,
            isProfileComplete: true,
            'profile.teamingUp':true
        })
        .select('profile.name profile.university profile.branch profile.year profile.skills profile.interests profile.photoURL')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

        const total = await User.countDocuments({
            'profile.university': university,
            isProfileComplete: true,
            'profile.teamingUp':true
        });

        res.status(200).json({
            success: true,
            count: users.length,
            data:users,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        });

    } catch (error) {
        console.error('Error fetching users by college: ',error),
        res.status(500).json({
            success:false,
            message: 'Server error while fetching users',
            error: error.message
        });
    }
};

module.exports={
    createProfile,
    getUserProfile,
    updateProfile,
    getUsersByCollege
};