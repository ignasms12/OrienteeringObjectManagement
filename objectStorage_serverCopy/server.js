const express = require('express');
const morgan = require('morgan');
const Writable = require("stream").Writable;
const logger = require('./database/db.js').Logs;

class DatabaseStream extends Writable {
	write(line){
		logger.Log(line, 'HTTP request log', (res)=>{
			// console.log(res);
		})
	}
}

var writer = new DatabaseStream();

const app = express();

app.use(express.json());
app.use(morgan(':remote-addr - [:method] :status - :url', {stream: writer}));
app.use('/Administration', express.static(__dirname + '/Administration'));

require('./routes.js')(app);

app.listen(4123, ()=>{	
	console.log('Listening on port 4123');
})
