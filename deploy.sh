#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

# Print debugging information
echo "Current directory: $(pwd)"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Install dependencies
echo "Installing dependencies..."
npm ci

# Build the application
echo "Building the application..."
npm run build

echo "Build completed successfully!"
