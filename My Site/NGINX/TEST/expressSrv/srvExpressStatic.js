const express = require('express');
const app = express();

const args = process.argv;
let port = 3000;

for (let i = 0; args.length > i; i++) {
  if (args[i] === '-p' && args[i + 1]) {
    port = Number.parseInt(args[i + 1]);
  }
}

const staticDir = '/Users/apall/Documents/Personal/my_knowledge_code_base/My Site';
let requestCounter = 0;
app.use('/', (req, res, next) => {
  requestCounter += 1;
  console.log(requestCounter);
  next();
}, express.static(staticDir));


app.listen(port, () => console.log(`Express is listening on localhost:${port}`));
