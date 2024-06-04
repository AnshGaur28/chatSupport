const mongoose = require("mongoose");

// const adminSchema = mongoose.Schema( {
//     sourceType:String,// 'file' or 'link'
//     sourceId: String,
//     sourceLink: String,
//     linksFound:Number,
//     linksProcessed:Number,
//   //   adminInfoId: {
//   //     type: mongoose.Schema.Types.ObjectId,
//   //     ref: 'adminInfo'
//   // }
//   //   sourceData: [{
//   //     type: mongoose.Schema.Types.Mixed,

//   // }],
//     // email:String,
//     // password:String,
//     // truiam_id:String
    
//   });
    // authId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "auths"
    // },
const adminInfo = mongoose.Schema({
  email:String,
  password:String,
  truiam_id:String,
  onboarding_status:{
    type:Boolean,
    default:false 
  },
  closed : {
    type : String ,
    default : false ,
  },
  SID : {
    type : String ,
  },
});    



// module.exports = mongoose.model("adminWebsiteScrapper", adminSchema);
module.exports = mongoose.model("adminInfo", adminInfo);