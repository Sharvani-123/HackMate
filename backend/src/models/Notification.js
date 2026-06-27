const mongoose= require('mongoose');

const notificationSchema= new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    notificationType:{
        type:String,
        enum: ['team_request', 'request_approved', 'request_declined', 'hackathon_updated'],
        required: true
    },
    message:{
        type:String,
        required: true,
    },
    isRead:{
        type:Boolean,
        default: false,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    }
});


//indexing for unread count
notificationSchema.index({userId:1, isRead:1});
//indexing for latest notification
notificationSchema.index({userId:1, createdAt:-1});

module.exports= mongoose.model('Notification', notificationSchema);