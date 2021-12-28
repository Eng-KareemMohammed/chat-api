const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    mode: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Group = mongoose.model('group', groupSchema);
module.exports = Group;