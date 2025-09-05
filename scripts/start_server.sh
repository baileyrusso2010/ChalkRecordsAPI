#!/bin/bash
cd /home/ubuntu/app

# Stop old PM2 process if running
pm2 stop all || true

# Start the server
pm2 start dist/index.js --name myapp
