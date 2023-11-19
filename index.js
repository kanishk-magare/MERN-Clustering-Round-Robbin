const http = require('http');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const { MongoClient } = require('mongodb');
const flatted = require('flatted');

// Define your MongoDB connection URL and database name
const dbUrl = 'mongodb://127.0.0.1:27017/';
const dbName = 'users';

if (cluster.isMaster) {
  // Master process - create worker processes
  console.log(`Master ${process.pid} is running`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  const workers = Object.keys(cluster.workers);
  let currentWorkerIndex = 0;
  let requestsHandled = Array(numCPUs).fill(0);

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    // Restart the worker process if it dies
    cluster.fork();
  });

  http.createServer((req, res) => {
    const workerID = currentWorkerIndex;
    currentWorkerIndex = (currentWorkerIndex + 1) % numCPUs;
    requestsHandled[workerID]++;
    // Send the URL of the request to the worker using flatted serialization
    const requestURL = req.url;
    const serializedRequest = flatted.stringify({ requestURL });
    cluster.workers[workers[workerID]].send(serializedRequest);
    
    // Simulate sending the response from the load balancer
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Request handled by Worker ${cluster.workers[workers[workerID]].process.pid}\n`);
  }).listen(8000, () => {
    console.log('Load balancer running on port 8000');
  });

  process.on('SIGINT', () => {
    // Display the number of requests handled by each worker
    requestsHandled.forEach((count, index) => {
      console.log(`Worker ${workers[index]} handled ${count} requests.`);
    });
    process.exit();
  });
} else {
  // Worker process - create an HTTP server
  process.on('message', async (message) => {
    // Deserialize the message using flatted
    const deserializedMessage = flatted.parse(message);
    const { requestURL } = deserializedMessage;

    // Create a MongoDB client and connect to the database
    const client = new MongoClient(dbUrl, { useNewUrlParser: true });

    try {
      await client.connect();
      const db = client.db(dbName);

      // Simulate handling a GET API request with database query
      if (requestURL === '/api') {
        const collection = db.collection('users');
        const data = await collection.find({}).toArray();
        
        // Log the fetched data to the terminal (optional)
        console.log(`Worker ${process.pid} handled request. Fetched data:`, data);
      }
    } catch (error) {
      console.error(`Worker ${process.pid} encountered an error:`, error);
    } finally {
      // Close the database connection
      client.close();
    }
  });

  // Create an HTTP server to listen for incoming requests (optional)
  const server = http.createServer((req, res) => {
    // Your HTTP server logic, if needed
  });

  server.listen(8001, () => {
    console.log(`Worker ${process.pid} is running an HTTP server on port 8001`);
  });
}
