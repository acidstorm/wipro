var webpack  = require("webpack")
module.exports = {
    entry  : './index.js',
    output : {
        path     : './dist/',
        filename : 'bundle.js'
    },
    module : {
        loaders: [ { 
                test   : /\.js$/,
                exclude: 'node_modules',
                loader : 'babel-loader?cacheDirectory,presets[]=react,presets[]=es2015'
            },
             { 
                test   : /\.scss$/,
                exclude: 'node_modules',
                loader : 'style-loader!css-loader!sass-loader'
            },
        ]
    },
};