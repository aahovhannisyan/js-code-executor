// app.js - Main application file using Node.js native vm module
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const vm = require('vm');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/execute', (req, res) => {
  const code = req.body.code;
  let result, error;
  let logs = [];
  let errors = [];

  try {
    // Create a sandbox context
    const sandbox = {
      console: {
        log: (...args) => {
          // Capture console.log output
          logs.push(args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
          ).join(' '));
        },
        error: (...args) => {
          // Capture console.error output
          errors.push(args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
          ).join(' '));
        }
      },
      require: require,
      process: process,
    };

    // Create a VM context
    const context = vm.createContext(sandbox);

    // Set timeout options
    const script = new vm.Script(code);

    // Execute with timeout
    const timeout = 10000; // 10 second timeout
    result = script.runInContext(context, { 
      timeout: timeout,
      displayErrors: true
    });

    // Handle non-primitive result types
    if (typeof result === 'object' && result !== null) {
      try {
        result = JSON.stringify(result, null, 2);
      } catch (err) {
        result = "Result is an object that couldn't be fully serialized.";
      }
    }

  } catch (err) {
    error = err.message;
  }

  // Send response
  res.json({
    success: !error,
    result: result,
    error: error,
    logs: logs,
    errors: errors
  });
});

// Start server
app.listen(port, () => {
  console.log(`Code execution server running at http://localhost:${port}`);
  console.log(`WARNING: Native VM module provides limited sandboxing security.`);
});
