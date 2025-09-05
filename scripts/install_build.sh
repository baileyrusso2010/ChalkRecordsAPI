#!/bin/bash
cd /home/ubuntu/app

# Install dependencies
pnpm install

# Build frontend/backend (adjust if your build outputs to dist/)
pnpm build
