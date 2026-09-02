@echo off
setlocal

echo ========================================================
echo   JobFlow Spring Boot Java Backend Launcher
echo ========================================================

:: Check for Java
where java >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    if exist "C:\Program Files\Android\Android Studio\jbr\bin\java.exe" (
        echo [INFO] Found OpenJDK in Android Studio JBR.
        set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
        set "PATH=%JAVA_HOME%\bin;%PATH%"
    ) else (
        echo [ERROR] Java not found. Please install JDK 17+ or set JAVA_HOME.
        pause
        exit /b 1
    )
)

echo [INFO] Java Version:
java -version
echo.

:: Check for Maven
where mvn >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Starting Spring Boot application with Maven...
    mvn spring-boot:run
) else (
    echo [INFO] Maven not detected in PATH.
    echo [INFO] You can run with your installed Maven via: mvn spring-boot:run
    echo [INFO] Or use Docker: docker compose up backend
    pause
)

endlocal
