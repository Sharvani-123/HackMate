const mongoose= require('mongoose');

const messageSchema= new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content:{
        type: String,
        required: true,
    },
    timestamp:{
        type:Date,
        default:Date.now
    },
    expireAt:{
        type:Date,
        default:()=> Date.now() + 30 * 24 * 60 * 60 * 1000 //30 days in milliseconds - message disappears
    }
});

//create Time-To-Live(TTL) index on expireAt (deletes documents after 30 days)
messageSchema.index({ expireAt:1},{expireAfterSeconds: 0});

const Message= mongoose.model('Message',messageSchema);
module.exports= Message;