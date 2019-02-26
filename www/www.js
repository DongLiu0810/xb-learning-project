var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var opn = require('opn');
var getPort = require('get-port');
var chalk = require("chalk");
var session = require('express-session')
var config = require('./route.config.local');
var loginRoute = require('./login.route');

console.info(`bind root path on '${config.root}'`);

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(config.root, {
    dotfiles: 'ignore',
    etag: true,
    index: config.index || 'index.html',
    lastModified: false,
    setHeaders: function (res, path, stat) {

    }
}));

app.use(session({
	name: 'xb.internship.session.id',
	secret: 'shixi',
	resave: true,
	saveUninitialized: false,
	cookie: {
		maxAge: 1000 * 60 * 30
	}
}));

app.all('*', loginRoute);

app.all('/api/*', config.route);

getPort({port: 3000}).then(port => {
	let server = app.listen(port, '127.0.0.1', function (err) {
		if (err) {
			console.log(chalk.red(err));
			return;
		}
		
		let add = server.address();
		let uri = `http://${add.address}:${add.port}`;
		// let uri = `http://localhost:${port}`;
        console.info(`start at ${chalk.blueBright(uri)}`);
		opn(uri);
	});
});