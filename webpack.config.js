const path = require('path')

module.exports = {
    mode: 'development',
    entry: './webpackjs.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public')
    }
};