const mongoose= require('mongoose');

const teamSchema = new mongoose.Schema({
    hackathonName:{
        type:String,
        required: true,
    },
    hackathonType:{
        type:String,
        enum:['Same College','Cross College'],
        required: true
    }, //from collegeType of hackathon schema
    creatorEmail:{
        type:String,
        required: true //Links to User.email
    },
    createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
    },
    description:{
        type: String
    },
    skills: [{
        type:String
    }],
    members:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    }], //array of user IDs.
    requests:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    }], //pending join requests

    isTeamFull: {
        type: Boolean,
        default: false
    },
    maxMembers: {
        type: Number,
        default: 5, // Optional: set a default team size limit
        min: 2,
        max: 10
    },

    createdAt:{
        type:Date,
        default:Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }
});

teamSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Create indexes for frequently queried fields
teamSchema.index({ creatorEmail: 1 }); // For team filtering by creator
teamSchema.index({ members: 1 }); // For finding user's teams
teamSchema.index({ hackathonName: 1 }); // For hackathon-based filtering
teamSchema.index({ hackathonType: 1 });
teamSchema.index({ isTeamFull: 1 }); // For finding available teams
teamSchema.index({ createdAt: -1 }); // For sorting by creation date
teamSchema.index({ createdBy: 1 });
const Team= mongoose.model('Team', teamSchema);
module.exports= Team;