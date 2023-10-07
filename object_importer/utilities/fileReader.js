const fs = require('fs');

readFileNames = function(target_dir){
	var fileNames = fs.readdirSync(__dirname + '/' + target_dir);
	console.log(fileNames);
}

readFileNames(process.argv[2]);