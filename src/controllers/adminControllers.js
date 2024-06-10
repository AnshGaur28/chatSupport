const User = require("../models/user.model.js");
const adminModel = require("../models/admin.model.js");
const sessionModel = require("../models/session.model.js");
const getAllClient = async (req, res) => {
  try {
    const clients = await User.find({
      SID: { $exists: true },
    }).select("SID name closed activeSession");
    // console.log(clients);
    return res.status(200).send({ clients });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: " Internal Server Error" });
  }
};
 
const getRoomHistory = async (req, res) => {
  try {
    const sessionId = req.query.sessionId ;
    console.log(sessionId);
    const clientData = await sessionModel.findOne(
      { _id : sessionId},
      "client_chat_history , username"
    );
    return res.status(200).send({username : clientData.username , historyMessages : clientData.client_chat_history , role : "client"});
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: " Internal Servver Error" });
  }
};

const getClientWithSID = async(req, res)=>{
    console.log("Inside getClientWithSID")
    try {
      const userSID = req.query.clientSID ;
      console.log(userSID);
      const user = await User.findOne({SID : userSID}).select("SID name closed");
      console.log("user" , user);
      return res.status(200).send(user);
    } catch (error) {
      return res.status(500).send({ message: " Internal Servver Error" });
    }
}
const getAdmins = async(req, res)=>{
  try {
      const admins = await adminModel.find({SID: { $exists: true }});
      res.status(200).send({admins});
  } catch (error) {
    res.status(500).send("Internal Server Error" , error.message);
  }
}

const createSession = async(req, res)=>{
  try {
      const { user_id, flag } = req.body ;
      console.log("---------payload" , req.body) ;
      const newSession = new sessionModel({
        user_id : user_id ,
        flag : flag || "",
        client_chat_history : [],
      });
      await newSession.save();
      console.log(newSession);
      return res.status(200).send(newSession);
  } catch (error) {
      console.log(error.message)
      res.status(500).send({"Error" : error.message });
  }
}
module.exports = { getAllClient, getRoomHistory , getAdmins  , getClientWithSID , createSession};