const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appSchema = new Schema({
    status: {
        type: Number,
        required: true
    },
    appName: {
        type: String,
        required: true
    }
})

const AppOperations = mongoose.model("appOperations", appSchema);
module.exports = AppOperations


/*
status == 0 => pm2 stop appName
status == 1 => pm2 start appName
status == 2 => pm2 restart appName
status == 0 => pm2 describe appName
*/