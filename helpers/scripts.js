const fs = require('fs')
const { exec } = require("child_process");
const ini = require('ini');

exports.getRandomWithExclude = (min, max, excludeArray) => {
    const randomNumber = Math.floor(Math.random() * (max - min + 1 - excludeArray.length)) + min;
    return randomNumber + excludeArray.sort((a, b) => a - b).reduce((acc, element) => { return randomNumber >= element - acc ? acc + 1 : acc }, 0);
}


exports.editFile = async(fileName, serverPort, http, password) => {
    var config = ini.parse(fs.readFileSync(`./${fileName}.ini`, 'utf-8'))
    config.common.bind_port = serverPort
    config.common.vhost_http_port = http
    config.common.token = password
    fs.writeFileSync(`./${fileName}.ini`, ini.stringify(config))
}

exports.command = (command) => {
    exec(command, (error, stdout, stderr) => {
        console.log(stdout);
        if (stdout) return stdout;
        return error
    });
}