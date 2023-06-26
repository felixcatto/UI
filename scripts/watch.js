import { execSync } from 'child_process';
import chokidar from 'chokidar';

chokidar.watch('./src').on('change', path => {
  console.log(path);
  const result = execSync('yalc publish --push --changed --scripts=false');
  console.log(result.toString());
});
