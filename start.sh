#!/bin/bash
echo "🚀 Starting Stardew Overlay Server..."
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Current directory: $(pwd)"
echo "Files in directory:"
ls -la
echo "Starting server..."
node auth-server.js