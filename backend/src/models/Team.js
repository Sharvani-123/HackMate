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

const Team= mongoose.model('Team', teamSchema);
module.exports= Team;