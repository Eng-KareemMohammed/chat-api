const app = require('./Terminal_api')
// require('dotenv').config()
require("./Terminal_api/helpers/init_mongodb")


// const PORT = process.env.PORT || 3000

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
});
