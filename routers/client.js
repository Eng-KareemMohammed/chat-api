const router = require("express").Router();
const createError = require('http-errors');
const mongoose = require('mongoose')
const Client = require('../models/client');
var moment = require('moment-timezone');
const scripts = require('../helpers/scripts');
const { deleteMany } = require("../models/client");

router.route('/')
    .get(async (req, res, next) => {
        try {
            const skip = +req.query.skip * 20;
            delete req.query.skip;

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
                .skip(skip)
                .limit(20)
                .sort({ createdAt: -1 })
            res.json(data)

        } catch (error) {
            next(error)
        }
    })
    .post(async (req, res, next) => {
        try {
            const data = await Client.aggregate([{
                $project: {
                    _id: 0,
                    ports: [
                        "$port.ssh",
                        "$port.http",
                        "$port.serverPort"
                    ]
                }
            }]);
            let ports = [];
            data.map(el => {
                ports.push(...el.ports)
            })

            const ssh = scripts.getRandomWithExclude(1024, 49151, ports)
            ports.push(ssh)
            const http = scripts.getRandomWithExclude(1024, 49151, ports)
            ports.push(http)
            const serverPort = scripts.getRandomWithExclude(1024, 49151, ports)


            const newData = new Client({
                ...req.body,
                port: {
                    ssh,
                    http,
                    serverPort
                },
                expireDate: moment().tz('Asia/Baghdad').add(1, 'year').valueOf()
            });

            const saved = await newData.save();
            res.json(saved)
        } catch (error) {
            console.log(error);
            next(error)
        }
    });

router
    .delete('/delete-all', async (req, res, next) => {
        try {
            const drop = await mongoose.connection.collection('clients').drop();
            res.json(drop)
        } catch (error) {
            next(error)
            console.log(error);
        }
    });

router.route("/:id")
    .put(async (req, res, next) => {
        try {
            const updatedData = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.json(updatedData)
        } catch (error) {
            next(error)
        }
    })
    .delete(async (req, res, next) => {
        try {
            const deletedData = await Client.findByIdAndDelete(req.params.id)
            res.json({
                message: deletedData ? 'deleted successfully' : "id not fount"
            })
        } catch (error) {
            next(error)
        }
    });





module.exports = router