const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
    clientName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    note: {
        type: String,
        default: ''
    },
    status: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    expireDate: {
        type: Number,
        default:0
    },
    group: {
        type: Schema.Types.ObjectId,
        ref: 'group'
    },
    restPrice:{
        type:Number,
        default:0
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
}, { timestamps: true })

clientSchema.index({ createdAt: -1 })

const Client = mongoose.model("client", clientSchema);
module.exports = Client