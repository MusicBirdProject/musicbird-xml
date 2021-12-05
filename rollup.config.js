import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import uglify from "@lopatnov/rollup-plugin-uglify";

export default {
    input: 'src/main.ts',
    output: {
        file: 'dist/main.js',
        format: 'cjs',
        compact: true
    },
    plugins: [
        resolve(),
        typescript({
            typescript: require('typescript')
        }),
        uglify({
            format: {
                comments: false
            }
        })
    ]
};
