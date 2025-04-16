#!/bin/bash
# Print current directory for debugging
echo "Current directory: $(pwd)"
echo "Listing files in current directory:"
ls -la

# Check if package.json exists in the current directory
if [ -f "package.json" ]; then
  echo "Found package.json in current directory"
  # Start the application
  echo "Starting the application..."
  npm start
else
  echo "package.json not found in current directory"
  echo "Searching for package.json..."
  PACKAGE_JSON_PATH=$(find / -name "package.json" -type f 2>/dev/null | head -n 1)
  
  if [ -n "$PACKAGE_JSON_PATH" ]; then
    echo "Found package.json at: $PACKAGE_JSON_PATH"
    PACKAGE_DIR=$(dirname "$PACKAGE_JSON_PATH")
    echo "Changing to directory: $PACKAGE_DIR"
    cd "$PACKAGE_DIR"
    
    echo "Starting the application..."
    npm start
  else
    echo "ERROR: Could not find package.json anywhere"
    exit 1
  fi
fi
