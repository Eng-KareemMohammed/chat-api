const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const commandSchema = new Schema({
    command: {
        type: String,
        required: true
    }
})

const Command = mongoose.model('command', commandSchema);
module.exports = Command;