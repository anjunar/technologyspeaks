import webpack from 'webpack';
import path from 'path';
import nodeExternals from 'webpack-node-externals';

export default {
    entry: './index.ts',
    mode: "development",
    devtool: "source-map",
    output: {
        filename: 'index.js',
        path: path.resolve('build'),
        clean : true,
        library: {
            type: "module"
        },
        globalObject: "this"
    },
    experiments: {
        outputModule: true,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2|.d\.ts)$/i,
                type: "asset",
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    externals: [nodeExternals({
        modulesDir: path.resolve("../../node_modules"),
        importType : "module"
    })]
}
