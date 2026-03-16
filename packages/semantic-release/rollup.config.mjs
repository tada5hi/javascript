import fs from 'node:fs';

import { createConfig } from '../../rollup.config.mjs';

export default createConfig({
    pkg: JSON.parse(fs.readFileSync(new URL('./package.json', import.meta.url), {encoding: 'utf-8'}))
});
