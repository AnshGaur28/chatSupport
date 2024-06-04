const mongoose = require("mongoose");

// const contactSchema = new mongoose.Schema({
//     country_code: {
//       type: String,
//       default: null,
//     },
//     phone_number: {
//       type: String,
//       default: null,
//     },
//   });

const userSchema = new mongoose.Schema({
    // authId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "auths"
    // },

    name: {
        type: String,
        default: null
    },
    // lastName: {
    //     type: String,
    //     default: null
    // },
    email: {
        type: String,
        default: null
    },
    contact: {
        type: mongoose.Schema.Types.Mixed,
      },
    // phoneNumber:{
    //     type:String,
    //     default:null
    // },
    // role: {
    //     type: String,
    //     default: 'basic',
    //     enum: ["basic", "supervisor", "admin"]
    // },
    is_active: {
        type: Boolean,
        default: true
    },
    is_existing:{
        type:Boolean,
        default:false
    },
    SID : {
        type : String ,
    },
    closed : {
        type : Boolean ,
        default : false ,
    }
    // orderList: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "orders"
    // }]
});

module.exports = mongoose.model("users", userSchema);