const { spawn } = require('child_process');
const fs = require('fs');

const cp = spawn('npx.cmd', ['ctx7', 'setup'], { shell: true });

cp.stdout.on('data', d => {
  const str = d.toString();
  fs.appendFileSync('ctx7_out.txt', str);
  
  if (str.includes('How should your agent access')) {
     setTimeout(() => cp.stdin.write('\n'), 500);
  }
  if (str.includes('Which agents do you want to')) {
     setTimeout(() => cp.stdin.write('a\n'), 500);
  }
});

cp.stderr.on('data', d => {
  fs.appendFileSync('ctx7_err.txt', d.toString());
});
