const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const billSchema = new Schema({
    userId: {
        type:String,
        required: true
    },
    note:{
        type:String,
        default:"",
    },
    totalPrice:{
        type:Number,
        default:0
    },
    paidPrice:{
        type:Number,
        default:0
    },
    restPrice:{
        type:Number,
        default:0
    },
    paidStatus:{
        type:Number,
        default:0
    },
    cashingPrice:{
        type:Number,
        default:0,
    },
    dinarPrice:{
        type:Number,
        default:0,
    },
    dollarPrice:{
        type:Number,
        default:0,
    },
    profit:{
        type:Number,
        default:0,
    },
    status:{
        type:Number,
        default:0
    }

}, { timestamps: true });
billSchema.index({ createdAt: -1 });

billSchema.pre('save', function(next) {
    console.log(this.restPrice,this.totalPrice , this.paidPrice);
    this.dinarPrice = this.dollarPrice * this.cashingPrice;
    this.profit = this.totalPrice - this.dinarPrice; 
    this.restPrice = this.totalPrice - this.paidPrice;
    next()
});
const Bill = mongoose.model('bill', billSchema);
module.exports = Bill