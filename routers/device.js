const router = require('express').Router();
const Device = require('../models/devices');



router.route('/')
    .get(async(req, res, next) => {
        try {
            if (req.query.searchText) {
                req.query.name = {
                    $regex: new RegExp(req.query.searchText, 'i')
                }
                delete req.query.searchText;
            }

            let date = {}
            if(req.query.from && req.query.to) {
                date.$and = [
                    {createdAt : {$gte : new Date(req.query.from)}},
                    {createdAt : {$lt : new Date(req.query.to)}}
                ]
            }

            const data = await Device.find({
                ...req.query,
                ...date
            })
                .sort({ createdAt: -1 })

            res.json(data)
        } catch (error) {
            next(error)
        }
    })

.post(async(req, res, next) => {
    try {
        const newData = new Device(req.body);
        const saved = await newData.save();
        res.json(saved)
    } catch (error) {
        next(error)
    }
});

router.route("/:id")
    .put(async(req, res, next) => {
        try {
            const updatedData = await Device.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.json(updatedData)
        } catch (error) {
            next(error)
        }
    })
    .delete(async(req, res, next) => {
        try {
            const deletedData = await Device.findByIdAndDelete(req.params.id)
            res.json({
                message: deletedData ? 'deleted successfully' : "id not fount"
            })
        } catch (error) {
            next(error)
        }
    });


module.exports = router;