const mongoose= require('mongoose');

const hackathonSchema = new mongoose.Schema({
    name: {
        type:String, 
        required:true
    },
    link:{
        type:String,
        required: true
    }, //URL to hackathon registration page
    college:{
        type: String,
        enum:['Same College','Cross College'],
        required: true,
    },
    deadline:{
        type:Date,
    },
    tags:[{
        type: String,
        enum: ['Web Dev', 'AI/ML', 'Blockchain', 'IoT', 'Game Dev', 'Data Science', 'Cybersecurity', 'UI/UX Design', 'Healthcare', 'Space Tech', 'Cloud', 'Android', 'Flutter', 'React', 'Azure', '.NET']
    }],
    teamSize:{
        type:String,
        enum:['1-3', '2-4','3-4','5-6'],
    },
    createdAt:{
        type:Date,
        default:Date.now,
    }
});

const Hackathon= mongoose.model('Hackathon', hackathonSchema);
module.exports= Hackathon;