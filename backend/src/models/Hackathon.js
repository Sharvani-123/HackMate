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
// Create indexes for frequently queried fields
hackathonSchema.index({ tags: 1 }); // For tag-based filtering
hackathonSchema.index({ college: 1 }); // For college filtering
hackathonSchema.index({ deadline: 1 }); // For date-based filtering and expiry
hackathonSchema.index({ name: 'text' }); // Text index for search functionality
hackathonSchema.index({ createdAt: -1 }); // For sorting by creation date
const Hackathon= mongoose.model('Hackathon', hackathonSchema);
module.exports= Hackathon;