const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const otpSchema = new Schema({
    active:{
        type:Boolean,
        required:true
    }
});

const OTP = mongoose.model('otp;', otpSchema);
module.exports = OTP;