const http = require('http');
const { Log } = require('./logging_middleware/logger.js');

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJuazE1NzNAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMTQzMywiaWF0IjoxNzc3NzAwNTMzLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZTI2MmE3MmItMTlkYS00NzFiLTg1NTAtZGY3MjdmZjUwMGZkIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoibml5YXRpIiwic3ViIjoiMDBkYzVhNDctODljMy00ZGI2LTk2MDctYzFiNjY0Yjk2MzE0In0sImVtYWlsIjoibmsxNTczQHNybWlzdC5lZHUuaW4iLCJuYW1lIjoibml5YXRpIiwicm9sbE5vIjoicmEyMzExMDU2MDMwMTE5IiwiYWNjZXNzQ29kZSI6IlFrYnB4SCIsImNsaWVudElEIjoiMDBkYzVhNDctODljMy00ZGI2LTk2MDctYzFiNjY0Yjk2MzE0IiwiY2xpZW50U2VjcmV0Ijoid2ZCUVJGakNGVnJBenh0RCJ9.mbARmyyEGgGYHC6M-5zb7DBX12lTnnVKueUV4vxnsqk";

const PRIORITY = { Placement: 3, Result: 2, Event: 1 };

const getTopNotifications = (notifications, n = 10) => {
  Log('frontend', 'info', 'utils', 'Sorting notifications by priority and recency');
  return [...notifications]
    .sort((a, b) => {
      if (PRIORITY[b.Type] !== PRIORITY[a.Type]) {
        return PRIORITY[b.Type] - PRIORITY[a.Type];
      }
      return new Date(b.Timestamp) - new Date(a.Timestamp);
    })
    .slice(0, n);
};

const options = {
  hostname: '20.207.122.201',
  port: 80,
  path: '/evaluation-service/notifications',
  method: 'GET',
  headers: { 'Authorization': `Bearer ${TOKEN}` }
};

Log('frontend', 'info', 'api', 'Fetching notifications from server');

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    const { notifications } = JSON.parse(body);
    Log('frontend', 'info', 'api', `Fetched ${notifications.length} notifications`);
    const top10 = getTopNotifications(notifications, 10);
    console.log('\n🏆 TOP 10 PRIORITY NOTIFICATIONS:\n');
    top10.forEach((n, i) => {
      console.log(`${i + 1}. [${n.Type}] ${n.Message} - ${n.Timestamp}`);
    });
    Log('frontend', 'info', 'utils', 'Top 10 notifications displayed successfully');
  });
});

req.on('error', (e) => {
  Log('frontend', 'error', 'api', `Failed to fetch notifications: ${e.message}`);
});
req.end();