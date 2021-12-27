const router = require('express').Router();
const AppOperations = require('../models/app_operations');
const scripts = require('../helpers/scripts')
    /*
    status == 0 => pm2 stop appName
    status == 1 => pm2 start appName
    status == 2 => pm2 restart appName
    status == 4 => pm2 describe appName
    */
router.route('/')
    .post(async(req, res, next) => {
        try {
            const data = new AppOperations(req.body);
            switch (data.status) {
                case 0:
                    scripts.command(`pm2 stop ${data.appName}`);
                    break;
                case 1:
                    scripts.command(`pm2 start ${data.appName}`);
                    break;
                case 2:
                    scripts.command(`pm2 restart ${data.appName}`);
                    break;
                case 3:
                    scripts.command(`pm2 describe ${data.appName}`);
                    break;
            }

            res.send(true)
        } catch (error) {
            next(error)
        }

    })


module.exports = router;