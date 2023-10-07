const fs = require('fs');
const path = require('path');

var log_location = path.resolve(`./logs/${getDate()}.txt`);

var fileExists = false;

function getDate() {
    const t = new Date();
	const date = ('0' + t.getDate()).slice(-2);
	const month = ('0' + (t.getMonth() + 1)).slice(-2);
	const year = t.getFullYear();
	return `${year}.${month}.${date}`;
}

init = function(){
	return new Promise((resolve)=>{
		fs.stat(log_location, function(err, stat) {
			if(err == null){
				fileExists = true;
				resolve();
			}
			else if(err.code === 'ENOENT'){
	
				fs.writeFile(log_location,'', (err)=>{
					if(err){
						console.log(err);
					}
					else{
						fileExists = true;
						resolve();
					}
				});
			}
			else{
				console.log('Some other error: ', err.code);
			}
		});
	})
	
}

log = async function(level, message){

	if(fileExists == false){
		await init();
		log(level, message);
	}
	else{
		if(message == "Application starting..."){
			fs.appendFile(log_location, "--------------------------------------------------------------------------------\n", (err)=>{
				if(err){
					console.log(err);
				}
			})
		}
		var date = new Date();
		var time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`;
		var log_message = `[${level}] - [${time}] - ${message}\n`;

		fs.appendFile(log_location, log_message, (err)=>{
			if(err){
				console.log(err);
			}
		});
	}
	
}

exports.log = log;
