const express = require('express');

const app = express();

app.use(express.json());

app.use('/Administration', express.static(__dirname + '/Administration'));

require('./routes.js')(app);

app.listen(4123, ()=>{	
	console.log('Listening on port 4123');
})
