/* Usage:
node nodeSrv [-p PORT]
*/

const http = require('http');

let port = 3000;
const hostname = 'localhost';

for (let i = 0; i < process.argv.length; i++) {
  if (process.argv[i] === '-p' || process.argv[i] === '--port') {
    port = process.argv[i+1];
  }
}

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  console.log(`Server http://${hostname}:${port} responded`)
  res.end(`Hello World\nfrom ${hostname}:${port}`);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
