import webpack from 'webpack';
import path from "path";

import TerserPlugin from "terser-webpack-plugin";

console.log();
console.log('... BUNDLING ...');
console.log();

const config = {

    target: "node",
    mode: 'production',
    entry: './index.js',

    output: {
        filename: 'dist/app.js',
        path: path.resolve(process.env.PWD),
        publicPath: '/',
    },

    node: {
        __dirname: false,
        __filename: false
    },

    experiments: {
        topLevelAwait: true,
    },

    plugins: [
        {
            apply: (compiler) => {
                compiler.hooks.afterEmit.tap('Complete', (compilation) => {
                    console.log('>>> BUNDLING COMPLETE');
                });
            }
        }
    ],

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                    }
                }
            }
        ]
    }
};

const bundler = webpack(config, (err, stats) => {
    if (err || stats.hasErrors()) {
        console.log('>>> ERROR: ', err, stats);
    }
});
