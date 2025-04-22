# JavaScript Code Execution Sandbox - Security Comparison

This repository demonstrates two different approaches to creating a secure JavaScript code execution environment:

1. **VM-based sandbox**: Uses the [vm](https://nodejs.org/api/vm.html) module to create a JavaScript sandbox
2. **Docker-based sandbox**: Uses Docker containers for stronger isolation

Both implementations provide a web interface where users can enter JavaScript code, execute it, and see the results.

## Why Two Implementations?

This project serves as an educational demonstration of the security trade-offs between different sandboxing approaches:

- **VM** is lightweight and easy to deploy but vulnerable to certain sandbox escape techniques
- **Docker** provides stronger isolation but requires more resources and setup

By exploring both approaches, you can understand the security benefits and limitations of each method.

## Key Security Features

### VM Sandbox
- JavaScript-level isolation
- Memory and execution time limits
- Protection against common sandbox escape patterns

### Docker Sandbox
- Process-level isolation
- Resource limits (CPU, memory, processes)
- Network isolation
- Seccomp profiles to restrict system calls
- Complete filesystem isolation

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer)
- [npm](https://www.npmjs.com/get-npm)
- [Docker](https://www.docker.com/get-started) (for Docker-based sandbox)

### Installation

Clone the repository and run the following command:
```bash
# Install dependencies for both implementations
npm run install-all
```

### Running the Applications

You can run either implementation separately:

```bash
# Run VM sandbox (http://localhost:3000)
npm run start-vm

# Run Docker sandbox (http://localhost:3001)
npm run start-docker
```

## Security Testing

This repository includes several test scripts placed in the `security-tests` directory that demonstrate security vulnerabilities:

- Memory exhaustion attacks
- Sandbox escape attempts
- Container escape techniques
- Information disclosure attacks

To test against these vulnerabilities, place the script source code to the web interface provided by the application and press the "Execute" button.

## Security Considerations

This project is for **educational purposes only**. If you plan to adapt either solution for a production environment:

1. Never expose these services directly to the internet
2. Consider adding authentication and rate limiting
3. Regularly update dependencies to patch security vulnerabilities
4. Add additional security layers beyond what's demonstrated here

## Repository Structure

- `vm-sandbox/`: VM-based implementation
- `docker-sandbox/`: Docker-based implementation
- `security-tests/`: Scripts to test security vulnerabilities
