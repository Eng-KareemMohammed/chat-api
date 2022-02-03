const router = require('express').Router();
const EarthLink = require('../models/earth-link');


router.route('/')
    .get(async (req, res, next) => {
        try {
            const data = await EarthLink.find(req.query);
            res.json(data)
        } catch (error) {
            next(error)
        }
    })
    .post(async (req, res, next) => {
        try {
            const data =  await EarthLink.find();
            if(data.length) throw res.json({message:"You can not add More active Status"})
            const uploadedData = new EarthLink(req.body);
            const saved = await uploadedData.save();
            res.json(saved)
        } catch (error) {
            next(error)
        }
    });

router.route('/:id')
    .put(async (req,res,next) => {
        try {
            const updatedData = await EarthLink.findByIdAndUpdate(req.params.id,req.body,{new:true});
            res.json(updatedData)
        } catch (error) {
            next(error)
        }
    })    
    .delete(async (req,res,next) => {
        try {
            const deletedData = await EarthLink.findByIdAndDelete(req.params.id)
            res.json({
                message: deletedData ? 'deleted successfully' : "id not fount"
            })
        } catch (error) {
            next(error)
        }
    })


module.exports = router;