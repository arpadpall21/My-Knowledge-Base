const express = require('express');

const app = express();
// const host = '0.0.0.0';
// const host = '192.168.1.6';
const host = '192.168.1.255';
const port = 3000;

app.get('/', (req, res) => {
  console.log('remote IP', req.ip);
  
  res.send('Hello World!');
});

app.listen(port, host, ()=>console.log(`Express is listening on ${host}:${port}`));
