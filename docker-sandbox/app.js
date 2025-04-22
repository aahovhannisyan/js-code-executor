// app.js - Main application file
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { execSync, spawn } = require('child_process');
const fs = require('fs');
const app = express();
const port = 3001;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ensure the execution directory exists
const EXECUTION_DIR = path.join(__dirname, 'executions');
if (!fs.existsSync(EXECUTION_DIR)) {
  fs.mkdirSync(EXECUTION_DIR);
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/execute', async (req, res) => {
  const code = req.body.code;
  const executionId = uuidv4();
  const executionDir = path.join(EXECUTION_DIR, executionId);
  
  try {
    // Create a directory for this execution
    fs.mkdirSync(executionDir);
    
    // Write code to a file
    const codeFile = path.join(executionDir, 'code.js');
    fs.writeFileSync(codeFile, code);
    
    // Run code in Docker container with strict resource limits
    const containerName = `js-executor-${executionId}`;
    
    // Create a promise to handle the async Docker run
    const runCodeInContainer = () => {
      return new Promise((resolve, reject) => {
        // Command to run the code in a Docker container
        const dockerProcess = spawn('docker', [
          'run',
          '--name', containerName,
          // Set resource limits
          '--memory', '100m',          // 100MB memory limit
          '--memory-swap', '100m',     // Disable swap
          '--cpus', '0.5',             // Limit to 0.5 CPU cores
          '--pids-limit', '50',        // Limit number of processes
          '--network', 'none',         // No network access
          '--ulimit', 'nofile=64:64',  // Limit file descriptors
          '--ulimit', 'nproc=10:10',   // Limit number of processes
          // Set timeout (kill container after 5 seconds)
          '--rm',                      // Remove container after execution
          // '--security-opt', 'seccomp=./seccomp-profile.json',
          '-v', `${executionDir}:/code`,  // Mount code directory
          'node:18-alpine',            // Use lightweight Node image
          'sh', '-c', 'cd /code && node -e "try { const result = eval(require(\'fs\').readFileSync(\'code.js\', \'utf8\')); console.log(JSON.stringify({ result })); } catch (error) { console.error(JSON.stringify({ error: error.message || String(error) })); process.exit(1); }"'
        ]);

        let stdoutData = '';
        let stderrData = '';
        
        // Collect stdout data
        dockerProcess.stdout.on('data', (data) => {
          stdoutData += data.toString();
        });
        
        // Collect stderr data
        dockerProcess.stderr.on('data', (data) => {
          stderrData += data.toString();
        });
        
        // Handle process completion
        dockerProcess.on('close', (code) => {
          if (code === 0) {
            try {
              // Try to parse the JSON output
              const output = JSON.parse(stdoutData);
              resolve(output);
            } catch (e) {
              // If not valid JSON, return the raw output
              resolve({ result: stdoutData });
            }
          } else {
            try {
              // Try to parse error as JSON
              const error = JSON.parse(stderrData);
              reject(error);
            } catch (e) {
              // If not valid JSON, return the raw stderr
              reject({ error: stderrData || 'Execution failed' });
            }
          }
        });
        
        // Set our own timeout as an extra precaution
        setTimeout(() => {
          try {
            // Try to kill the container if it's still running
            execSync(`docker kill ${containerName}`);
            reject({ error: 'Execution timed out' });
          } catch (error) {
            // Container might already be stopped
          }
        }, 6000);
      });
    };
    
    // Execute the code
    const result = await runCodeInContainer();
    res.json({ success: true, ...result });
    
  } catch (error) {
    console.error('Execution error:', error);
    res.json({ 
      success: false, 
      error: error.error || error.message || 'Execution failed' 
    });
  } finally {
    // Clean up
    try {
      // Make sure container is stopped and removed
      try {
        execSync(`docker kill ${containerName}`);
      } catch (e) {
        // Container might already be stopped
      }
      
      // Remove execution directory
      fs.rmdirSync(executionDir, { recursive: true });
    } catch (cleanupError) {
      console.error('Cleanup error:', cleanupError);
    }
  }
});

// Start server
app.listen(port, () => {
  console.log(`Code execution server running at http://localhost:${port}`);
  console.log(`Make sure Docker is running on your system!`);
});
