const mongoose= require('mongoose');

const notificationSchema= new mongoose.SchemaTypes({
    userId:{
        type: mongoose.SchemaTypes.Types.ObjectId,
        ref: 'User',
        required: true
    },
    notificationType:{
        type:String,
    },
    message:{
        type:String,
        required: true,
    },
    isRead:{
        type:Boolean,
        deafult: false,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    }
});

module.exports= mongoose.models('Notification', notificationSchema);