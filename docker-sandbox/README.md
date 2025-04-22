# Docker-based JavaScript Code Executor

A highly secure Node.js application that executes JavaScript code in isolated Docker containers. This approach provides strong security guarantees by isolating each code execution in its own container with strict resource limitations.

## Security Features

- **Container Isolation**: Each code execution happens in its own Docker container
- **Memory Limits**: Containers are limited to 100MB of memory
- **CPU Limits**: Containers are limited to 0.5 CPU cores
- **Process Limits**: Restricted number of processes (50) and file handles (64)
- **Network Isolation**: Containers have no network access
- **Short Timeout**: 5-second execution timeout
- **Ephemeral**: Containers are automatically destroyed after execution
- **Filesystem Isolation**: Code runs in a temporary directory that's removed after execution

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Docker](https://www.docker.com/get-started)

## Installation

1. Clone this repository or copy the files to your local machine
2. Install dependencies:

```bash
npm install
```

3. Make sure Docker is running on your system
4. Start the application:

```bash
npm start
```

5. Open your browser and navigate to `http://localhost:3000`

## How It Works

1. User submits JavaScript code through the web interface
2. The server creates a unique directory for this execution
3. The code is written to a file in this directory
4. A Docker container is created with resource limits and the directory mounted
5. The code is executed inside the container
6. Results or errors are captured and returned to the user
7. The container is destroyed and temporary files are cleaned up

## Resource Limits

The Docker containers are configured with the following resource limits:

- Memory: 100MB
- Swap: Disabled
- CPU: 0.5 cores
- Process IDs: 50
- File descriptors: 64
- Network: None
- Execution time: 5 seconds

## Warning

Even with container-based isolation, running arbitrary code always carries some risk. This application is intended for educational or development purposes in controlled environments. Do not expose it to the public internet without additional security measures.

## Project Structure

- `app.js` - Main application file
- `package.json` - Project configuration and dependencies
- `public/index.html` - Web interface
- `executions/` - Temporary directory for code files (created at runtime)
