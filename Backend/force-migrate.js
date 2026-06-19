const { spawn } = require('child_process');

const child = spawn('npx', ['prisma', 'migrate', 'dev', '--name', 'update_models'], {
    shell: true,
    stdio: ['pipe', 'pipe', 'pipe']
});

child.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(output);
    if (output.includes('Are you sure you want create this migration?')) {
        child.stdin.write('y\n');
    }
});

child.stderr.on('data', (data) => {
    console.error(data.toString());
});

child.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});
