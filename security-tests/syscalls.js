const { spawnSync } = require('child_process');

// Attempt to get system information using uname
const result = spawnSync('uname', ['-a'], { encoding: 'utf8' });

if (result.error) {
  console.log('Error executing uname:', result.error.message);
} else {
  console.log('System information retrieved successfully:');
  console.log(result.stdout);
}

// Let's also try a second syscall that might be blocked
try {
  // ptrace is often blocked by security-conscious configurations
  const ptrace = spawnSync('strace', ['-c', 'echo', 'test'], { encoding: 'utf8' });
  console.log('ptrace/strace executed:');
  console.log(ptrace.stderr || ptrace.stdout); // strace output goes to stderr
} catch (e) {
  console.log('Failed to execute strace:', e.message);
}
