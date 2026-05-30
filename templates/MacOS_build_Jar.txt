#!/bin/bash
# Move to the directory where the script is located
cd "$(dirname "$0")"

echo "--- Spring Boot Build (Mac) ---"

# Ensure the wrapper is executable
chmod +x mvnw

# Run the build
./mvnw clean package -DskipTests

echo ""
echo "Build Process Finished."
# Keeps the window open so you can see the result
echo "Press any key to close this terminal..."
read -n 1