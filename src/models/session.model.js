// const { array } = require("joi");
const mongoose = require("mongoose");
// const user_persona = require("./user_persona");

const sessionSchema = new mongoose.Schema({

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user_id"
    },
    flag: String,
    limit:Number,
    chatName:String,

    chat_history: [{
        type: mongoose.Schema.Types.Mixed,
    
    }],

    // client_chat_history : [{
    //     message : { 
    //         type : String ,
    //     },
    //     role : {
    //         type : String ,
    //     },
    //     timeStamp : {
    //         type : String,
    //     }

    // }],

    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("chat_session_history", sessionSchema);