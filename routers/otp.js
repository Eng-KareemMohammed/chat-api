const router = require('express').Router();
const OTP = require('../models/otp');


router.route('/')
    .get(async (req, res, next) => {
        try {
            const data = await OTP.find(req.query);
            res.json(data)
        } catch (error) {
            next(error)
        }
    })
    .post(async (req, res, next) => {
        try {
            const data =  await OTP.find();
            if(data.length) throw res.json({message:"You can not add More active Status"})
            const uploadedData = new OTP(req.body);
            const saved = await uploadedData.save();
            res.json(saved)
        } catch (error) {
            next(error)
        }
    });

router.route('/:id')
    .put(async (req,res,next) => {
        try {
            console.log(req.params.id,req.body);
            const updatedData = await OTP.findByIdAndUpdate(req.params.id,req.body,{new:true});
            res.json(updatedData)
        } catch (error) {
            next(error)
        }
    })    
    .delete(async (req,res,next) => {
        try {
            const deletedData = await OTP.findByIdAndDelete(req.params.id)
            res.json({
                message: deletedData ? 'deleted successfully' : "id not fount"
            })
        } catch (error) {
            next(error)
        }
    })


module.exports = router;