const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const earthLinkSchema = new Schema({
    active:{
        type:Boolean,
        required:true
    }
});

const EarthLink = mongoose.model('earthLink;', earthLinkSchema);
module.exports = EarthLink;