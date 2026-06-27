require('dotenv').config();
const http= require('http');
const {Server} = require('socket.io');
const app = require('./src/app');
const connectDB = require('./src/config/db');
const logger = require('./src/utils/logger');
const { apps } = require('firebase-admin');

const PORT = process.env.PORT || 5000;

const server= http.createServer(app);

 // initializing the socket.io server with cors enabled for frontend

const io= new Server(server,{
    cors:{
        origin:process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials:true
    }
});

//Make io accessible inside controllers via req.app.get('io')
app.set('io',io);

io.on('connection',(socket)=>{
    console.log(`Socket connected: ${socket.id}`);

    socket.on('join',(userId)=>{
        socket.join(userId);
        console.log(`User ${userId} joined their room`);
    });

    socket.on('typing', ({toUserId, fromUserId})=>{
        io.to(toUserId).emit('user_typing',{fromUserId});
    });

    socket.on('stop_typing',({toUserId,fromUserId})=>{
        io.to(toUserId).emit('user_stop_typing',{fromUserId});
    });

    socket.on('disconnect',()=>{
        console.log(`Socket disconnected :${socket.id}`);
    });
});
// Connect to MongoDB
connectDB();

// Start server
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});