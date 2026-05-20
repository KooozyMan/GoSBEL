@echo off
echo Building Spring Boot JAR...
call mvnw clean package -DskipTests
echo.
echo Build complete. The JAR is in the /target folder.
pause