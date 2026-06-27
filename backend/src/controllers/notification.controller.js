const Notification = require('../models/Notification');
const User = require('../models/User');

const createNotification = async(opener, {userId, notificationType, message})=>{
    try {
        const notification= await Notification.create({
            userId,
            notificationType,
            message
        });

        //push to user in real time if they are onlitn
        if(io){
            io.to(userId.toString()).emit('new_notification',notification);
        }

        return notification;
    } catch (error) {
        console.error("Failed to create notification: ", error.message);
    }
};

// GET /api/notifications — fetch all notifications for logged in user
const getNotifications= async (req,res) => {
    try {
        const user = await User.findOne({email:req.user.email});
        if(!user) return res.status(400).json({
            success:false,
            message: "User not found"
        });

        const notifications = await Notification.find({userId:user._id})
            .sort({createdAt:-1})
            .limit(20);
        res.json({
            success:true,
            data:notifications
        });
    } catch (error) {
        res.status(500).sjon({
            success:false,
            message:error.message
        });
    }
};

// GET /api/notifications/unread-count
const getUnreadCount = async (req,res)=>{
    try {
        const user = await User.findOne({ email: req.user.email });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const count = await Notification.countDocuments({
            userId: user._id,
            isRead: false
        });

        res.json({success: true, count});
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// PATCH /api/notifications/:id/read — mark one as read
const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        res.json({ success: true, data: notification });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// PATCH /api/notifications/mark-all-read — mark all as read
const markAllAsRead = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        await Notification.updateMany(
            { userId: user._id, isRead: false },
            { isRead: true }
        );

        res.json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createNotification,
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead
};