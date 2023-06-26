import path from 'path';
import { fileURLToPath } from 'url';

export const dirname = url => fileURLToPath(path.dirname(url));

export const generateScopedName = (localName, resourcePath) => {
  const filename = path.basename(resourcePath).replace(/\.module.*/, '');
  return `${filename}__${localName}`;
};
