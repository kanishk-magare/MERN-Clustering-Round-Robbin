# Clustering App with Round-Robin Load Balancing

Welcome to the Clustering App where incoming API requests are load-balanced using the round-robin method! 🌐

## Overview

This application is designed to handle high traffic loads by utilizing a clustering approach with round-robin load balancing. This ensures efficient distribution of incoming API requests across multiple server instances, improving performance and scalability.

## Features

🔄 **Round-Robin Load Balancing:** Distribute incoming API requests evenly among multiple server instances.

🚀 **Scalability:** Easily scale your application horizontally by adding more server instances.

📊 **Monitoring:** Monitor the health and performance of each server instance in real-time.

## Tech Stack

- **Node.js:** For the backend server and clustering.
- **Express.js:** Handling API requests.
- **Loadash:** Implementing the round-robin algorithm.

## Getting Started

Follow these steps to set up and run the clustered application:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/clustering-app.git
   cd clustering-app
2. Install dependencies:
    npm install
3. Run the application:
    npm start
4. Open your browser:
    Open http://localhost:3000 to interact with the clustered application.

##Configuration
  Adjust the configuration files to customize the clustering settings and behavior.

config/serverConfig.js: Configure the server settings, such as the port and clustering parameters.

##Health Check Endpoint: http://localhost:3000/health

##Contributing 🤝
  Contributions are welcome! Feel free to open issues or pull requests.

##License 📄
  This project is licensed under the MIT License - see the LICENSE file for details.

##Acknowledgments 🙌
  Special thanks to the clustering and load balancing communities for their valuable insights!
