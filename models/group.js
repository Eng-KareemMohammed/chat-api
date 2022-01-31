const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    earthUsername:{
        type:String,
        required:true
    },
    earthPassword:{
        type:String,
        required:true
    }
}, { timestamps: true });

const Group = mongoose.model('group', groupSchema);
module.exports = Group;