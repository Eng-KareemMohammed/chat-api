const router = require('express').Router();
const Bill = require('../models/bill');
var moment = require('moment-timezone');
const Client = require('../models/client')


router.route('/')
    .get(async(req, res, next) => {
        try {
            let date = {}
            if(req.query.from && req.query.to) {
                date.$and = [
                    {createdAt : {$gte : new Date(req.query.from).toISOString()}},
                    {createdAt : {$lt :new Date(req.query.to).toISOString()}}
                ]
                delete req.query.from;
                delete req.query.to
            }

            const data = await Bill.find({
                ...req.query,
                ...date
            })
                .sort({ createdAt: -1 });

            res.json(data)
        } catch (error) {
            next(error)
        }
    })

.post(async(req, res, next) => {
    try {
        req.body.restPrice = req.body.totalPrice ?? 0 - req.body.paidPrice ?? 0;
        const newData = new Bill({
            ...req.body,
        });
        const saved = await newData.save();
        res.json(saved)
    } catch (error) {
        // console.log(error);
        next(error)
    }
});

router.route("/:id")
    .put(async(req, res, next) => {
        try {
            const oldBill = await Bill.findById(req.params.id)
            // calc rest Price  
            req.body.restPrice =(req.body.totalPrice >= 0 ? req.body.totalPrice : oldBill.totalPrice) - (req.body.paidPrice >=0 ? req.body.paidPrice : oldBill.paidPrice)
            req.body.dinarPrice=(req.body.dollarPrice >= 0 ? req.body.dollarPrice : oldBill.dollarPrice)  * (req.body.cashingPrice >=0 ? req.body.cashingPrice : oldBill.cashingPrice)
            req.body.profit =(req.body.totalPrice >= 0 ? req.body.totalPrice : oldBill.totalPrice)  - (req.body.paidPrice >=0 ? req.body.paidPrice : oldBill.paidPrice)

            const updatedData = await Bill.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.json(updatedData)

        } catch (error) {
            next(error)
        }
    })
    .delete(async(req, res, next) => {
        try {
            const deletedData = await Bill.findByIdAndDelete(req.params.id)
            res.json({
                message: deletedData ? 'deleted successfully' : "id not fount"
            })
        } catch (error) {
            next(error)
        }
    });

    router.route('/report')
        .get(async (req, res, next) => {
            try {

                let match = {
                    status :0
                }

                if(req.query.from && req.query.to) {
                    match.createdAt=  {$gte: new Date(req.query.from), $lt : new Date(req.query.to)}
                }

            const data = await Bill.aggregate([
                {
                    $match:match,
                },
                {
                    $group:{
                        _id:null,
                        totalPrice:{$sum: "$totalPrice"},
                        dinarPrice:{$sum: "$dinarPrice"},
                        restPrice: {$sum: "$restPrice"},
                        profit: {$sum : "$profit"}
                    }
                }
            ])

            match.status = 1
            const status = await Bill.aggregate([
                {
                    $match:match
                },
                {
                    $group:{
                        _id:null,
                        totalPrice:{$sum: "$totalPrice"},
                    }
                }
            ])
            
            if(status[0]?.totalPrice) {
                data[0].sales = status[0].totalPrice
            }
            res.json(data)
            } catch (error) {
                console.log(error);
                next(error)
            }
        });


router.route('/client/total')
        .get(async (req, res, next) => {
            try {

                console.log(req.query.userId);
            const data = await Bill.aggregate([
                {
                    $match:{
                        status: 0,
                        userId:req.query.userId
                    },
                },
                {
                    $group:{
                        _id:null,
                        totalPrice:{$sum: "$totalPrice"},
                        dinarPrice:{$sum: "$dinarPrice"},
                        restPrice: {$sum: "$restPrice"},
                        profit: {$sum : "$profit"}
                    }
                }
            ])

            res.json(data)
            } catch (error) {
                console.log(error);
                next(error)
            }
        })
module.exports = router;