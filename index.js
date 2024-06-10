const express = require("express");
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { createServer } = require('node:http');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const { Server } = require('socket.io');
const userModel = require("./src/models/user.model");
const sessionModel = require("./src/models/session.model");
const adminRouter = require('./src/routes/adminRouter.js');
const adminModel = require("./src/models/admin.model.js");



const server = createServer(app);

app.get('/' , async(req, res)=>{
    return res.status(200).send({"Horrah" : "Working!!!!"})
});

app.use('/admin' , adminRouter) ;
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

async function connectToMongoDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit the process if MongoDB connection fails
    }
}
connectToMongoDB();


io.on("connection", (socket) => {
    console.log(`User ${socket.id}  Connected`);

    socket.on("createRoom", async () => {
        try {
            const roomId = `room_${socket.id}`; // Generate a unique room ID, e.g., room_<userId>
            socket.join(roomId);
            console.log(`User ${socket.id} joined room ${roomId}`);
        } catch (error) {
            console.error('Error creating room:', error);
        }
    });
    socket.on("adminJoin" , async(data)=>{
        const {clientSID} = data ;
        const adminSID =  socket.id ;
        console.log(data);
        socket.join(`room_${clientSID}`);
        await adminModel.findOneAndUpdate({SID : adminSID} , {$set : {closed : true}});
        await userModel.findOneAndUpdate({SID : clientSID} , {$set : {closed : true}});
        console.log("Working !!!!")
    });


    socket.on("clientMessage" , async (data)=>{``
        const role = "client"
        const {userData, message , time} = data ;
        const userId = userData.userId;
        const email = userData.email;
        const sessionId = userData.sessionId;
        const messageObj =  {userId : userId, email : email , role : role , message: data.message , time : time} ;
        console.log(messageObj , sessionId);
        io.to(`room_${socket.id}`).emit("message" , messageObj );
        await sessionModel.findOneAndUpdate(
            { _id : sessionId },
            { 
                $push: { "client_chat_history": { message: message, role: role, time: time } }
            },
            { new: true }
        );
        console.log("Inserted Message");
        await userModel.findOneAndUpdate({email : email} , {$set:  {SID : socket.id , activeSession : sessionId }} ,{ new: true, useFindAndModify: false });
    });

    socket.on('disconnect', async () => {
        console.log("Disconnecting")
        // io.to(`room_${socket.id}`).emit('message', `${socket.id.substring(0, 5)} disconnected`);
        console.log("user disconnected")
        await userModel.findOneAndUpdate({ SID: socket.id }, { $set : {closed : false} ,  $unset: { SID: 1}});
    });
    socket.on("clientLeave" , async()=>{
        await userModel.findOneAndUpdate({SID : socket.id} , {$unset:{SID : 1} , $set :{closed : false}} , { new: true, useFindAndModify: false });
        console.log("Client has left the session");
    });

    socket.on("adminLeave" , async(data)=>{
        const {clientSID} = data ;
        await adminModel.findOneAndUpdate({SID : socket.id} , {$set : {closed : false} } , { new: true, useFindAndModify: false });
        await userModel.findOneAndUpdate({SID : clientSID} , {$set : {closed : false}} , { new: true, useFindAndModify: false });
        console.log("Admin has left the session");
    });

    socket.on("adminMessage" , async (data)=>{
        const {message , time , userSID } = data ;
        const user = await userModel.findOne({SID : userSID}).select('activeSession');
        const role = "admin" ;
        console.log("admin Message "  ,data);
        const messageObj = {message : message , time: time , role : role};
        const sessionId = user.activeSession ;
        console.log(user.activeSession);
        io.to(`room_${userSID}`).emit("message" , messageObj );
        await sessionModel.findOneAndUpdate({_id: sessionId }, 
            { 
                $push: { "client_chat_history": { message: message, role: role, time: time } }
            },
            { new: true }
        );
    });

    socket.on("updateAdmin" , async(data)=>{
        const {truiam_id} = data ;
        console.log("Inside Update Admin", truiam_id);
        await adminModel.findOneAndUpdate({truiam_id} , {$set : {SID : socket.id}});
    });

    socket.on("transferRequest" , async(data)=>{
        const {clientSID , adminSID} = data ;
        io.to(adminSID).emit("transferRequest" , clientSID);
    })
    socket.on('disconnect' , async()=>{
        console.log("Disconnecting.....")
        await userModel.findOneAndUpdate({SID : socket.id} , {$unset : {SID : 1}});
        await adminModel.findOneAndUpdate({SID : socket.id} , {$unset : {SID : 1}});
    })
});


server.listen(3001, async () => {
    console.log(`Server running on port ${3001}`);
});