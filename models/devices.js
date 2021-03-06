const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const deviceSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    ip: {
        type: String,
        required: true
    },
    username:{
        type:String,
        default:""
    },
    password:{
        type:String,
        default:''
    }
}, { timestamps: true });

const Device = mongoose.model('device', deviceSchema);
module.exports = Device