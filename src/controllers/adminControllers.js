const User = require("../models/user.model.js");
const adminModel = require("../models/admin.model.js");
const getAllClient = async (req, res) => {
  try {
    const clients = await User.find({
      SID: { $exists: true },
    }).select("SID name closed");
    // console.log(clients);
    return res.status(200).send({ clients });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: " Internal Server Error" });
  }
};
 
const getRoomHistory = async (req, res) => {
  try {
    const roomId = req.query.clientSID ;
    console.log(clientSID);
    const clientData = await User.findOne(
      { SID :clientSID},
      "messages , username"
    );
    return res.status(200).send({username : clientData.username , historyMessages : clientData.messages , role : "client"});
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

module.exports = { getAllClient, getRoomHistory , getAdmins  , getClientWithSID};