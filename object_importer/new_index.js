const utilities = require('./src/utilities');
const fileUtilities = require('./src/fileUtilities');
const fileCompressor = require('./src/fileCompressor');
const fs = require('fs');
const readline = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
});
const log = require('./src/logger').log;
const FormData = require('form-data');

main = async function(){

	var target_dir = '/original_pictures/';

	log('INF', `Application starting...`);

	var gameDate = await new Promise(resolve => {
		readline.question("Please enter the game date: (in the following format - 'YYYY.MM.DD')\n", resolve);
	});

	target_dir += gameDate;


	var json_path = `.${target_dir}/data.json`;
	var stopFlag = false;

	await fileUtilities.checkJsonAgainstFiles(`.${target_dir}`, json_path)
	.catch((err)=>{
		console.log('\x1b[31m%s\x1b[0m',err);
		log('ERR', `${err}`);
		console.log();
		stopFlag = true;
		return;
	});

	if(stopFlag){
		log('WRN', `Files have already been renamed`);
	}
	else{
		await fileUtilities.renameFiles(`.${target_dir}`);
	}

	var json_text = fs.readFileSync(json_path);

	var json_data = await JSON.parse(json_text);

	log('INF', `Checking the converted files...`);

	var count = await utilities.checkConvertedFiles(target_dir, json_data);

	if(count > 0){
		log('INF', `The number of files, that were not converted - ${count}`);
	}

	log('INF', `Start reading coordinates...`);
	
	var count = 0;
	var expCount = 0;

	for(let i = 0; i < json_data.objects.length; i++){
		let item = json_data.objects[i];

		if(item.coordinates == null || item.coordinates == undefined || item.locationInfoPresent == 'N'){
			let picture_path = `.${target_dir}/local/${item.files.ats}`;
			expCount++;
			utilities.extractGpsData(picture_path)
			.then((val)=>{
				json_data.objects[i].coordinates = val;
				count++;

				if(expCount == count){
					fs.writeFileSync(json_path, JSON.stringify(json_data));
				}
			});
		}

		
		
	}
	let anyTasksToUpload = false;
	let anyAnswersToUpload = false;

	json_data.objects.forEach((item) => {
		console.log(item.files);
		if (item.files.uzd){
			anyTasksToUpload = true;
		}
		if (item.files.ats){
			anyAnswersToUpload = true;
		}
	});

	if (anyTasksToUpload) {
		await fileCompressor.compressFiles(gameDate, 1);
	}
	if (anyAnswersToUpload) {
		await fileCompressor.compressFiles(gameDate, 0);
		await new Promise(resolve => {
			readline.question("Tikrai all good, seni?\n", resolve);
		});
	}

	
	

	let form = new FormData();

	form.append('json', 'cia bus jsonas');


	const path = `./completed/${gameDate}`;

	const dir = fs.opendirSync(path);
	let dirent;
	while ((dirent = dir.readSync()) !== null) {
		console.log("Attaching", dirent.name);
		form.append('files', fs.createReadStream(path + "/" + dirent.name));
	}
	dir.closeSync();

	// console.log(form)

	form.submit('http://45.93.136.66:4123/importObjects', function(err, res) {
		// res – response object (http.IncomingMessage)  //
		console.log("Files have been sent.");
		res.resume();
	});


}

main();