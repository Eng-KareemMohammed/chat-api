let app = require('express')();
var cors = require('cors')
const { exec } = require("child_process");
let http = require('http').createServer(app);
const { spawn } = require("child_process");
const { execSync } = require("child_process");

let io = require('socket.io')(http, {
    cors: {
        origin: "*",
        credentials: true,
        methods: ["GET", "POST"],
    },

});



const corsOptions = {
    origin: '*',
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration

io.on("connection", function(socket) {
    console.log('socket connected');
    socket.on("disconnect", () => {
        io.emit("users-changed", { user: socket.nickname, event: "left" })
    })

    socket.on('set-nickname', (nickname) => {
        socket.nickname = nickname;
        io.emit('users-changed', { user: nickname, event: 'joined' });
    });

    socket.on('add-message', (message) => {
        console.log(message.text);
        exec(message.text, (error, stdout, stderr) => {
            if (error) {
                // res.send(`error: ${error.message}`);
                io.emit('message', { text: error.message, from: socket.nickname, created: new Date() });
                return;
            }
            if (stderr) {
                // res.send(`stderr: ${stderr}`);
                io.emit('message', { text: stderr, from: socket.nickname, created: new Date() });
                return;
            }

            // res.send(`stdout: ${stdout}`);
            io.emit('message', { text: stdout, from: socket.nickname, created: new Date() });
            // io.emit('message', stdout)
        });
    });


})



app.get("/", (req, res, next) => {
    res.send('test')
})





http.listen(3001, () => {
    console.log('server is listen ');
});

// exec("ipconfig", (error, stdout, stderr) => {
//     if (error) {
//         res.send(`error: ${error.message}`);
//         return;
//     }
//     if (stderr) {
//         res.send(`stderr: ${stderr}`);
//         return;
//     }
//     res.send(`stdout: ${stdout}`);
// });


// var child = spawn('ls', ['-l']);

// child.stdout.on('data',
//     function(data) {
//         console.log('ls command output: ' + data);
//     });
// child.stderr.on('data', function(data) {
//     //throw errors
//     console.log('stderr: ' + data);
// });

// child.on('close', function(code) {
//     console.log('child process exited with code ' + code);
// });