import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default {
    input: 'src/cli/index.ts',
    output: {
        file: 'dist/cli.js',
        format: 'cjs'
    },
    plugins: [
        resolve(),
        typescript({
            typescript: require('typescript')
        })
    ]
};
