const express = require('express');
const router = express.Router();
const createError = require('http-errors')
const User = require("../models/user")
const moment = require('moment-timezone');


router.route('/')
    .get( async (req, res, next) => {
        try {
            const data = await User.find(req.query);
            res.json(data)
        } catch (error) {
            next(error)
        }
    });

router.route('/:id')
    .put(async (req, res, next) => {
        try {
            const updatedData = await User.findByIdAndUpdate(req.params.id,req.body,{new:true})
            res.json(updatedData)
        } catch (error) {
            next(error)
        }
    })

router.post('/register', async(req, res, next) => {
    try {
        const { phone } = req.body
        const doesExits = await User.findOne({ phone })
        if (doesExits) throw createError.Conflict("This phone already exits")
        const user = new User({
            ...req.body,
            expireDate: moment().tz('Asia/Baghdad').add(1, 'month').valueOf()
        });
        const savedUser = await user.save()
        res.json(savedUser)
    } catch (error) {
        next(error)
    }
})

router.post('/login', async(req, res, next) => {
    try {
        const { phone, password } = req.body;
        const user = await User.findOne({ phone })
        if (!user) throw createError.NotFound('phone or Password not correct');
        const isMatch = await user.isValidPassword(password);
        if (!isMatch) throw createError.NotFound('phone or Password not correct');
        res.send(user)
    } catch (error) {
        next(error)
    }
})

module.exports = router