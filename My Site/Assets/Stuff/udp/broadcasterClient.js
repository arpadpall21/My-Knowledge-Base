const dgram = require('node:dgram');

const client = dgram.createSocket('udp4');
const host = '255.255.255.255';
const port = 3001;
const intervalSec = 8;

client.bind(host, () => {         // port not need to be specified
  console.log(`Socket bound to ${host}`);
  client.setBroadcast(true);
  
  setInterval(() => {
    client.send('Hello World!', port, host, err => {
      if (err) {
        console.error(err);
        return
      }
      
      console.log('Message sent!');
    });
  }, intervalSec * 1000);
});
