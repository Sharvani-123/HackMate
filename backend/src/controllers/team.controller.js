const Team= require('../models/Team');
const User= require('../models/User');
const {validationResult } = require('express-validator');
const {createNotification} = require('./notification.controller');

//Get all teams with filtering and pagination
const getAllTeams = async (req,res) => {
    try {
        const {page=1, limit=10, hackathonType, hackathonName}=req.query;
        const userEmail = req.user.email;

        //get current user's uni for same college filtering
        const currentUser=await User.findOne({email: userEmail});
        if(!currentUser){
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        //filter query
        let filter= {
            isTeamFull: false  //only available teams to be shown 
        };

        if(hackathonName){
            filter.hackathonName= hackathonName;
        }

        if(hackathonType){
            filter.hackathonType=hackathonType;

            //if same college -> show only teams from user's own college
            if(hackathonType==='Same College'){
                const creatorsFromSameCollege = await User.find({
                    'profile.university': currentUser.profile.university
                }).select('email');

                const creatorEmails= creatorsFromSameCollege.map(user =>user.email);
                filter.creatorEmail= {$in: creatorEmails};
            }
        }

        const skip= (page-1)*limit;

        //get teams with populated creator data
        const teams= await Team.find(filter)
        .populate({
            path: 'members',
            select:'profile.name email profile.photoURL'
        })
        .sort({createdAt: -1})
        .skip(skip)
        .limit(parseInt(limit));

        //get creator profiles separately and format contact info
        const teamsWithCreatorData= await Promise.all(
            teams.map(async(team) =>{
                const creator= await User.findOne({email:team.creatorEmail});

                const contact=[];
                if(creator?.profile?.linkedinURL) contact.push(creator.profile.linkedinURL);
                if (creator?.profile?.githubURL) contact.push(creator.profile.githubURL);
                if (creator?.profile?.discordURL) contact.push(creator.profile.discordURL);
                if (creator?.email) contact.push(creator.email);

                return {
                    ...team.toObject(),
                    creatorProfile: {
                        name: creator?.profile.name || 'Unknown',
                        email: creator?.email || team.creatorEmail,
                        photoURL:creator?.profile?.photoURL || null,
                        university:creator?.profile?.university || null
                    },
                    contact
                };
            })
        );

        const total= await Team.countDocuments(filter);

        res.json({
            success: true,
            data: teamsWithCreatorData,
            pagination:{
                currentPage: parseInt(page),
                totalPages: Math.ceil(total/limit),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


//Create a new Team
const createTeam= async(req,res)=>{
    try{
        const { hackathonName, hackathonType, description, skills } = req.body;
        const creatorEmail = req.user.email;

        // Get creator's user ID to add to members
        const creator = await User.findOne({ email: creatorEmail });
        if (!creator) {
        return res.status(404).json({ success: false, message: 'Creator not found' });
        }

        const newTeam = new Team({
        hackathonName,
        hackathonType,
        creatorEmail,
         createdBy: creator._id, 
        description,
        skills: skills || [],
        members: [creator._id], // Add creator as first member
        requests: []
        });

        const savedTeam = await newTeam.save();
        
        // Populate and format response
        const populatedTeam = await Team.findById(savedTeam._id)
        .populate('members', 'profile.name email profile.photoURL');

        res.status(201).json({
        success: true,
        data: populatedTeam,
        message: 'Team created successfully'
        });
    } catch(error){
        res.status(500).json({
            success: false,
            message: error.message 
        });
    }
};

//Request to join a team
const requestToJoin = async (req,res) => {
    try {
        const {teamId} = req.params;
        const userEmail = req.user.email;
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({
                success: false,
                   message: 'Team not found'
            });
        }
        //Get requesting user
        const user= await User.findOne({email: userEmail});
        if(!user){
            return res.status(400).json({
                success: false,
                message: 'User not found'
            });
        }

        //checking if user is already a memeber to avoid duplicate entries
        if(team.members.includes(user._id)){
            return res.status(400).json({
                success: false,
                message: 'You are already a member'
            });
        }

        //checking if user already has a pending request
        if(team.requests.includes(user._id)){
            return res.status(400).json({
                success: false,
                message: 'Request already pending'
            });
        }

        //Add to requests
        team.requests.push(user._id);
        await team.save();

        await createNotification(req.app.get('io'), {
          userId: team.createdBy,
          notificationType: 'team_request',
          message: `${user.profile.name} requested to join your team "${team.name}"`
        });
        res.json({
        success: true,
        message: 'Join request sent successfully'
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message });
    }
};

// Approve join request (team creator only)
const approveRequest = async (req,res) => {
    try{
        const {teamId, userId} = req.params;
        const creatorEmail = req.user.email;

        const team = await Team.findById(teamId);
        if(!team){
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        // Check if current user is the team creator
        if (team.creatorEmail !== creatorEmail) {
            return res.status(403).json({ 
                success: false, 
                message: 'Only team creator can approve requests' 
            });
        }

        // Check if user has a pending request
        if (!team.requests.includes(userId)) {
            return res.status(400).json({ 
                success: false, 
                message: 'No pending request from this user' 
            });
        }

        // Move from requests to members
        team.requests = team.requests.filter(id => id.toString() !== userId);
        team.members.push(userId);

        await team.save();

        await createNotification(req.app.get('io'), {
          userId: userId,
          notificationType: 'request_approved',
          message: `Your request to join "${team.name}" was approved!`
        });

      res.json({
          success: true,
          message: 'Request approved successfully'
      });
    } catch(error){
        res.status(500).json({ 
            success: false, 
            message: error.message });
    }
}

// Get user's teams (as creator or member)
const getMyTeams = async (req, res) => {
  try {
    const userEmail = req.user.email;
    
    // Get user ID
    const user = await User.findOne({ email: userEmail });
    if (!user) {
        return res.status(404).json({ 
            success: false, 
            message: 'User not found' 
        });
    }
    // Find teams where user is creator or member
    const teams = await Team.find({
      $or: [
        { creatorEmail: userEmail },
        { members: user._id }
      ]
    })
    .populate('members', 'profile.name email profile.photoURL')
    .populate('requests', 'profile.name email profile.photoURL')
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: teams
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get team details by ID
const getTeamById = async (req, res) => {
  try {
    const { teamId } = req.params;
    
    const team = await Team.findById(teamId)
      .populate('members', 'profile.name email profile.photoURL profile.university profile.branch')
      .populate('requests', 'profile.name email profile.photoURL profile.university profile.branch');

    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }
    //  Get creator profile
    const creator = await User.findOne({ email: team.creatorEmail });
    
    const contact = [];
    if (creator?.profile?.linkedinURL) contact.push(creator.profile.linkedinURL);
    if (creator?.profile?.githubURL) contact.push(creator.profile.githubURL);
    if (creator?.profile?.discordURL) contact.push(creator.profile.discordURL);
    if (creator?.email) contact.push(creator.email);

    const teamWithCreator = {
        ...team.toObject(),
        creatorProfile: {
            name: creator?.profile?.name || 'Unknown',
            email: creator?.email || team.creatorEmail,
            photoURL: creator?.profile?.photoURL || null,
            university: creator?.profile?.university || null
        },
        contact
        };    

    res.json({
        success: true,
        data: teamWithCreator
    });
  } catch (error) {
    res.status(500).json({ 
        success: false, 
        message: error.message 
    });
  }
};

// Reject member request
const rejectRequest = async (req, res) => {
  try {
    const { teamId, userId } = req.params;
    const creatorEmail = req.user.email;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    // Check if current user is the team creator
    if (team.creatorEmail !== creatorEmail) {
        return res.status(403).json({ 
            success: false, 
            message: 'Only team creator can reject requests' 
        });
    }

    // Check if user has a pending request
    if (!team.requests.includes(userId)) {
      return res.status(400).json({ success: false, message: 'No pending request from this user' });
    }

    // Remove from requests
    team.requests = team.requests.filter(id => id.toString() !== userId);
    await team.save();
    // Notify the person who requested
    const { createNotification } = require('./notification.controller');
    await createNotification(req.app.get('io'), {
        userId: userId,
        notificationType: 'request_declined',
        message: `Your request to join "${team.name}" was declined.`
    });
    
    res.json({
      success: true,
      message: 'Request rejected successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Leave team
const leaveTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const userEmail = req.user.email;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    // Creator cannot leave team
    if (team.creatorEmail === userEmail) {
      return res.status(400).json({ 
        success: false, 
        message: 'Team creator cannot leave. Transfer ownership or delete the team.' 
      });
    }

    const user = await User.findOne({ email: userEmail });
    if (!team.members.includes(user._id)) {
      return res.status(400).json({ success: false, message: 'You are not a member of this team' });
    }

    // Remove from members
    team.members = team.members.filter(id => id.toString() !== user._id.toString());
    await team.save();

    res.json({
      success: true,
      message: 'Left team successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete team
const deleteTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const creatorEmail = req.user.email;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    // Check if current user is the team creator
    if (team.creatorEmail !== creatorEmail) {
      return res.status(403).json({ success: false, message: 'Only team creator can delete the team' });
    }

    await Team.findByIdAndDelete(teamId);

    res.json({
      success: true,
      message: 'Team deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Get pending requests
const getPendingRequests = async (req, res) => {
  try {
    const { teamId } = req.params;
    const creatorEmail = req.user.email;

    const team = await Team.findById(teamId)
      .populate('requests', 'profile.name email profile.photoURL profile.university profile.branch profile.skills');

    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    // Check if current user is the team creator
    if (team.creatorEmail !== creatorEmail) {
      return res.status(403).json({ success: false, message: 'Only team creator can view pending requests' });
    }

    res.json({
      success: true,
      data: team.requests
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle team status (full/available)
const updateTeamStatus = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { isTeamFull } = req.body;
    const creatorEmail = req.user.email;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    // Check if current user is the team creator
    if (team.creatorEmail !== creatorEmail) {
      return res.status(403).json({ success: false, message: 'Only team creator can update team status' });
    }

    team.isTeamFull = isTeamFull;
    await team.save();

    res.json({
      success: true,
      data: team,
      message: `Team marked as ${isTeamFull ? 'full' : 'available'}`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Edit team details
const updateTeam = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { teamId } = req.params;
    const { description, skills, maxMembers } = req.body;
    const creatorEmail = req.user.email;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    // Check if current user is the team creator
    if (team.creatorEmail !== creatorEmail) {
      return res.status(403).json({ success: false, message: 'Only team creator can edit the team' });
    }

    // Update fields
    if (description !== undefined) team.description = description;
    if (skills !== undefined) team.skills = skills;
    if (maxMembers !== undefined) team.maxMembers = maxMembers;

    await team.save();

    res.json({
      success: true,
      data: team,
      message: 'Team updated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
    getAllTeams,
    createTeam,
    requestToJoin,
    approveRequest,
    getMyTeams,
    getTeamById,
    rejectRequest,
    leaveTeam,
    deleteTeam,
    getPendingRequests,
    updateTeamStatus,
    updateTeam
};