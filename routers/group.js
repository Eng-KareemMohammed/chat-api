const router = require('express').Router();
const Group = require('../models/group');

router.route('/')
    .get(async(req, res, next) => {
        try {
            const data = await Group.find(req.query);
            res.json(data)
        } catch (error) {
            next(error)
        }
    })
    .post(async(req, res, next) => {
        try {
            const newData = new Group(req.body);
            const saved = await newData.save();
            res.json(saved)
        } catch (error) {
            next(error)
        }
    });

router.route('/:id')
    .put(async(req, res, next) => {
        try {
            const updatedData = await Group.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.json(updatedData)
        } catch (error) {
            next(error)
        }
    })
    .delete(async(req, res, next) => {
        try {
            const deletedData = await Group.findByIdAndDelete(req.params.id)
            res.json({
                message: deletedData ? 'deleted successfully' : "id not fount"
            })
        } catch (error) {
            next(error)
        }
    })


module.exports = router;