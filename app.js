const express = require('express');
const createError = require('http-errors')
const cors = require('cors');

// cors options
const corsOptions = {
    origin: '*',
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}


// Import Routers
const clientRouter = require('./routers/client')
const commandRouter = require('./routers/command')

const app = express();


// init static
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(express.static('api/public/uploads'))


// Use Router

app.use('/client', clientRouter)
app.use('/command', commandRouter)


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


app.use(async (err, req, res, next) => {
    console.log(err);
    next(createError.NotFound())
})


module.exports = app