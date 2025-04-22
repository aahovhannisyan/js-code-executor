# JavaScript Code Executor - Native VM Module

A Node.js application that allows executing JavaScript code snippets using Node's native `vm` module.

## ⚠️ Security Warning

This implementation uses Node.js's built-in `vm` module which provides only **basic sandboxing**. It is vulnerable to various sandbox escape techniques and should **not** be used to execute untrusted code. This application is provided for educational purposes only.

## Features

- Web interface for entering and executing JavaScript code
- Basic timeout protection (10 seconds)
- Error handling and formatted output
- Captures console.log output
- Example code snippets

## Installation

1. Clone this repository or copy the files to your local machine
2. Install dependencies:

```bash
npm install
```

3. Start the application:

```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Enter JavaScript code in the text area
2. Click "Execute" to run the code
3. View the results in the output area
4. Check the console output section for any logged messages
5. Try the example snippets by clicking on them

## How It Works

This application uses Node.js's built-in `vm` module to create a sandboxed environment for JavaScript code execution:

1. The server sets up a limited context object for the code to run in
2. When code is submitted, it's executed in this context with a timeout
3. The result and any console output are captured and returned
4. The web interface displays the result and console output

## Limitations of the vm Module

Node's native `vm` module has several security limitations:

1. It's relatively easy to escape the sandbox
2. It doesn't provide proper isolation from the host environment
3. It can't restrict memory usage effectively
4. It doesn't prevent infinite loops beyond a simple timeout

## Security Risks

Some specific security risks with this implementation:

1. **Sandbox Escape**: Malicious code could potentially access the Node.js runtime
2. **Resource Exhaustion**: Without proper memory limits, the application could crash
3. **Host System Access**: If the sandbox is escaped, code could access the filesystem, network, etc.
4. **Denial of Service**: Long-running operations can make the server unresponsive

## Dependencies

- Express.js - Web server framework
- body-parser - Request body parsing middleware

## Project Structure

- `app.js` - Main application file
- `package.json` - Project configuration and dependencies
- `public/index.html` - Web interface
