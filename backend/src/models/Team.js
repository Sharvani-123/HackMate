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
    createdAt:{
        type:Date,
        default:Date.now
    }
});

const Team= mongoose.model('Team', teamSchema);
module.exports= Team;