const Message = require('../models/Message');
const User = require('../models/User');

//POST /api/messages
const sendMessage = async (req,res) => {
    try {
        const {receiverId, content} = req.body;

        if(!content || !content.trim()){
            return res.status(400).json({
                success: false,
                message:"Message cannot be empty"
            });
        }

        const sender= await User.findOne({email:req.user.email});
        if(!sender) return res.status(404).json({success:false, message: 'Sender not found'});

        const receiver = await User.findById(receiverId);
        if(!receiver) return res.status(404).json({
            success: false,
            message: "Receiver not found"
        });

        const message= await Message.create({
            sender: sender._id,
            receiver: receiver._id,
            content: content.trim()
        });

        const populated = await Message.findById(message._id)
            .populate('sender', 'profile.name profile.photoURL email')
            .populate('receiver', 'profile.name profile.photoURL email');

        // Real time delivery if receiver is online
        const io = req.app.get('io');
        if (io) io.to(receiver._id.toString()).emit('new_message', populated);

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// GET /api/messages/:userId — conversation with one user (paginated)
const getConversation = async (req, res) => {
    try {
        const { page = 1, limit = 30 } = req.query;

        const currentUser = await User.findOne({ email: req.user.email });
        if (!currentUser) return res.status(404).json({ success: false, message: 'User not found' });

        const otherUser = await User.findById(req.params.userId);
        if (!otherUser) return res.status(404).json({ success: false, message: 'User not found' });

        const filter = {
            $or: [
                { sender: currentUser._id, receiver: otherUser._id },
                { sender: otherUser._id, receiver: currentUser._id }
            ]
        };

        const messages = await Message.find(filter)
            .populate('sender', 'profile.name profile.photoURL email')
            .populate('receiver', 'profile.name profile.photoURL email')
            .sort({ timestamp: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Message.countDocuments(filter);

        res.json({
            success: true,
            data: messages.reverse(), // oldest first for display
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/messages/inbox — latest message per conversation
const getInbox= async(req,res)=>{
    try {
        const currentUser= await User.findOne({email:req.user.email});
        if(!currentUser) return res.status(400).json({success:false, message:"User not found"});

        const conversations= await Message.aggregate([
            {
                $match:{
                    $or: [{sender: currentUser._id}, {receiver:currentUser._id}]
                }
            },

            {$sort: {timestamp:-1}},
            {
                $group:{
                    _id:{
                        $cond: [{$eq:['$sender',currentUser._id]},"$receiver","$sender"]
                    },
                    lastMessage:{$first: "$ROOT"}
                }
            },
            {$sort: {'lastMessage.timestamp':-1}},
            {
                $lookup:{
                    from: 'users',
                    localField:'_id',
                    foreignField:'_id',
                    as:'partner'
                }
            },
            {$unwind: "$partner"},
            {
                $project:{
                    partnerId:'$_id',
                    partnerName: '$partner.profile.name',
                    partnerPhoto: '$partner.profile.photoURL',
                    partnerEmail: '$partner.email',
                    lastMessage: {
                        content: '$lastMessage.content',
                        timestamp: '$lastMessage.timestamp',
                        senderId: '$lastMessage.sender'
                    }
                }
            }
        ]);

        res.json({success:true, data:conversations});
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};


// DELETE /api/messages/:messageId
const deleteMessage = async (req, res) => {
    try {
        const currentUser = await User.findOne({ email: req.user.email });
        const message = await Message.findById(req.params.messageId);

        if (!message) return res.status(404).json({ success: false, message: 'Message not found' });

        if (message.sender.toString() !== currentUser._id.toString()) {
            return res.status(403).json({ success: false, message: 'You can only delete your own messages' });
        }

        await Message.findByIdAndDelete(req.params.messageId);
        res.json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { sendMessage, getConversation, getInbox, deleteMessage };