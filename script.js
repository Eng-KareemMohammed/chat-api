const app = require('./chat-api/app.js')
    // require('dotenv').config()
require("./chat-api/helpers/init_mongodb")


// const PORT = process.env.PORT || 3000

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
});