const express = require('express');
const app = express();

const args = process.argv;
let port = 3000;

for (let i = 0; args.length > i; i++) {
  if (args[i] === '-p' && args[i + 1]) {
    port = Number.parseInt(args[i + 1]);
  }
}

app.use('/', (req, res) => {
  res.send(`Server localhost:${port} says: Hello World!`)
  
  requestCounter += 1;
  console.log(requestCounter);
})

app.listen(port, () => console.log(`Express is listening on localhost:${port}`));
