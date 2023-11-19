const http = require('http');

const numRequests = 16;
const targetUrl = 'http://localhost:8000/api'; // Change to the correct URL if necessary

function sendRequest(requestNumber) {
  http.get(targetUrl, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log(`Request ${requestNumber}: ${data}`);
      if (requestNumber < numRequests) {
        // Send the next request
        sendRequest(requestNumber + 1);
      }
    });
  });
}

// Start sending requests
sendRequest(1);
