#!/bin/bash
# Move to the directory where the script is located
cd "$(dirname "$0")"

echo "--- Spring Boot Build (Linux) ---"

# Ensure the wrapper is executable
chmod +x mvnw

# Run the build
./mvnw clean package -DskipTests

if [ $? -eq 0 ]; then
    echo -e "\nSUCCESS: Jar is in /target"
else
    echo -e "\nERROR: Build failed"
fi

# Keeps the window open
read -p "Press [Enter] to exit..."