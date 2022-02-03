const router = require("express").Router();
const createError = require('http-errors');
const mongoose = require('mongoose')
const Client = require('../models/client');
const Bill = require('../models/bill')
var moment = require('moment-timezone');
const scripts = require('../helpers/scripts');

router.route('/')
    .get(async(req, res, next) => {
        try {


            // const skip = +req.query.skip * 20;
            // delete req.query.skip;
            // const bills  = await Bill.find

            if (req.query.searchText) {
                req.query.clientName = {
                    $regex: new RegExp(req.query.searchText, 'i')
                }
                delete req.query.searchText;
                console.log(req.query);
            }

            const data = await Client.find({
                    ...req.query,
                    expireDate: {
                        $gte: moment().startOf('day').valueOf()
                    }
                })
                // .skip(skip)
                // .limit(20)
                .sort({ createdAt: -1 })
                .populate('groupId')

            res.json(data)

        } catch (error) {
            next(error)
        }
    })
    .post(async(req, res, next) => {
        try {
            const newData = new Client({
                ...req.body,
                expireDate: moment().tz('Asia/Baghdad').add(1, 'month').valueOf()
            });

            const saved = await newData.save();
            const billData =  new Bill({
                userId:saved._id,
                groupId:saved?.groupId,
                expireDate: moment().tz('Asia/Baghdad').add(1, 'month').valueOf(),
                note:" تم الاضافة مع العميل"
            })
            await billData.save()
            res.json(saved)
        } catch (error) {
            console.log(error);
            next(error)
        }
    });

router
    .delete('/delete-all', async(req, res, next) => {
        try {
            const drop = await mongoose.connection.collection('clients').drop();
            res.json(drop)
        } catch (error) {
            next(error)
            console.log(error);
        }
    });

router.route("/:id")
    .put(async(req, res, next) => {
        try {
            const lastData = await Client.findById(req.params.id);
            if (req.body.password) {
                if (lastData.password != req.body.password) {
                    scripts.editFile(lastData.appName, lastData.port.serverPort, lastData.port.http, req.body.password)
                }
            }
            const updatedData = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.json(updatedData)
        } catch (error) {
            next(error)
        }
    })
    .delete(async(req, res, next) => {
        try {
            const deletedData = await Client.findByIdAndDelete(req.params.id)
            res.json({
                message: deletedData ? 'deleted successfully' : "id not fount"
            })
        } catch (error) {
            next(error)
        }
    });


router.route('/appName')
    .get(async(req, res, next) => {
        try {
            const data = await Client.find({ appName: req.query.appName });
            data.length ? res.json({ isUsed: true }) : res.json({ isUsed: false })
        } catch (error) {
            next(error)
        }
    });

router.route('/updateStatus')
    .post(async(req, res, next) => {
        try {
            const updateData = await Client.updateMany({ status: { $ne: req.body.status }, ...req.query }, { $set: { status: req.body.status } }, {})
            res.json(updateData.matchedCount)
        } catch (error) {
            next(error)
        }
    })

module.exports = router