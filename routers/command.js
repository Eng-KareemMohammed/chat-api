const router = require("express").Router();
const createError = require("http-errors");
const Command = require('../models/command');
const { exec } = require("child_process");

router.route('/')
    .post(async(req, res, next) => {
        try {
            const newData = new Command(req.body);
            exec(newData.command, (error, stdout, stderr) => {
                if (error) {
                    res.send(error.message);
                    return;
                }
                if (stderr) {
                    res.send(stderr)
                    return;
                }

                res.send(stdout);
            });
            // res.send(newData);
        } catch (error) {
            next(error)
        }
    });


module.exports = router;