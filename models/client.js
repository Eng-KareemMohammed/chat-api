const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
    clientName: {
        type: String,
        required: true
    },

    port: {
        ssh: Number,
        http: Number,
        serverPort: Number
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
    appName: {
        type: String,
        required: true
    },
    expireDate: {
        type: Number,
        require: true
    }

}, { timestamps: true })

clientSchema.index({ createdAt: -1 })

const Client = mongoose.model("client", clientSchema);
module.exports = Client