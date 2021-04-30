const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const http = require('http');
// const socket = require('socket.io');
const createSocket = require('./core/socket');
const createRoutes = require('./routes/createRoutes');

const app = express();

const server = http.createServer(app);
const io = createSocket(server);

// createRoutes(app, io);

// const dialogRoutes = require('./routes/dialog.routes')(io);

const PORT = config.get('port') || 5005;
const mongoURL = config.get('mongoURL');

app.set('socketIO', io);

app.use(express.json({extended: true}));

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/dialog', require('./routes/dialog.routes'));

async function start() {
	try {
		await mongoose.connect(mongoURL, {
			useCreateIndex: true,
			useUnifiedTopology: true,
			useNewUrlParser: true,
			useFindAndModify: false
		});

		server.listen(PORT, () => console.log(`App has been started on ${PORT}`));
	} catch (e) {
		console.log(e.message);

		process.exit(1);
	}
}

start();

