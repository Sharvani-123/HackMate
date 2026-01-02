const mongoose= require('mongoose');

const userSchema = new mongoose.Schema({
    firebaseUid: {
        type:String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    isProfileComplete :{
        type: Boolean,
        default: false
    },
    profile:{
        name:{
            type:String,
            required: true
        },
        university:{
            type:String,
            required:true
        },
        customUniversity:{
            type: String,
        },
        branch:{
            type: String,
            required:true,
            enum:['Computer Science','Electronics', 'Mechanical', 'Civil', 'Electrical', 'Chemical', 'Other']
        },
        year:{
            type:String,
            required: true,
            enum:['1st Year', '2nd Year','3rd Year','4th Year','Other']
        },
        skills:[{
            type:String,
            required: true,
        }],
        interests:[{
            type: String,
            enum: ['Web Development','Mobile Apps','AI/ML','Blockchain','IoT','Game Development','Data Science','Cybersecurity','UI/UX Design']
        }],
        teamingUp:{
            type: Boolean,
            default:true,
        },
        linkedinURL: {
            type: String,
        },
        githubURL:{
            type:String,
        },
        discordURL:{
            type:String
        },
        photoURL:{
            type:String,
        },
    },
    createdAt:{
        type:Date,
        default: Date.now
    }
});

// Create indexes for frequently queried fields
userSchema.index({ firebaseUid: 1 });
userSchema.index({ email: 1 });
userSchema.index({ 'profile.university': 1 }); // For getUsersByCollege
userSchema.index({ 'profile.teamingUp': 1 });

const User= mongoose.model('User',userSchema);
module.exports= User;