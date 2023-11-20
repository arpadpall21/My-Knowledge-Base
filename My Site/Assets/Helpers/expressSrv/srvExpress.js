const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

app.use(
    express.static('../../')
)

app.listen('localhost', 1000, ()=>console.log('Express is listening on localhost:1000'));
