const dgram = require('node:dgram');

const server = dgram.createSocket('udp4');
const host = '0.0.0.0';
const port = 3001;


server.bind(port, host, () => {
  console.log(`server is bound to ${host}:${port}`);
});

server.on('message', (msg, remoteInfo) => {
  console.log('remote info: ', remoteInfo);
  console.log('message:', msg.toString());
});
