const http = require('http');

const data = JSON.stringify({
  email: "nk1573@srmist.edu.in",
  name: "Niyati",
  mobileNo: "8287258428",
  githubUsername: "niyatikumra",
  rollNo: "RA2311056030119",
  accessCode: "QkbpxH"
});

const options = {
  hostname: '20.207.122.201',
  port: 80,
  path: '/evaluation-service/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => console.log('RESPONSE:', body));
});

req.on('error', (e) => console.error('ERROR:', e));
req.write(data);
req.end();