const path = require('path');

let res = {
    devtool: 'inline-source-map',
    entry: {
        main: ['./b.js','./router.css']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader'
            }, {
				test: /\.html$/,
				loader: 'html-loader'
			}, {
			 	test: /\.css$/,
			 	loader: 'style-loader!css-loader'
			 }
        ]
    }
};

module.exports = res;