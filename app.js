const express = require('express');
const createError = require('http-errors')
const cors = require('cors');
require("./helpers/init_mongodb");
require('dotenv').config()
    // cors options
const corsOptions = {
    origin: '*',
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}


// Import Routers
const clientRouter = require('./routers/client')
const groupRouter = require('./routers/group')
const deviceRouter = require('./routers/device')
const userRouter = require('./routers/user')
const billRouter = require('./routers/bill')
const earthLinkRouter = require('./routers/earth-link')
const otpRouter = require('./routers/otp')
const app = express();

const check = require('./helpers/scripts')
    // init static
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(express.static('./public/uploads'))


// Use Router
app.use('/client', clientRouter)
app.use('/group', groupRouter)
app.use('/device', deviceRouter)
app.use('/user',userRouter)
app.use('/bill',billRouter)
app.use('/earthLink',earthLinkRouter)
app.use('/otp',otpRouter)
 

// handle ERRORS
app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
});


app.use(async(err, req, res, next) => {
    console.log(err);
    next(createError.NotFound())
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);

});