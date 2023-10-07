const path = require('path');
const fs = require('fs');
const utilities = require('./utilities');
const log = require('./logger').log;


exports.copyFile = function(src, dest){
	var destFile = dest;

	// If target is a directory, a new file with the same name will be created
	if ( fs.existsSync( dest ) ) {
		if ( fs.lstatSync( dest ).isDirectory() ) {
			destFile = path.join( dest, path.basename( src ) );
		}
	}

	fs.writeFileSync(destFile, fs.readFileSync(src));
}



exports.copyFolder = function(src, dest){
	var files = [];

    // Check if folder needs to be created or integrated
    var targetFolder = path.join( dest, path.basename( src ) );
    if ( !fs.existsSync( targetFolder ) ) {
        fs.mkdirSync( targetFolder );
    }

    // Copy
    if ( fs.lstatSync( src ).isDirectory() ) {
        files = fs.readdirSync( src );
        files.forEach( function ( file ) {
            var curSource = path.join( src, file );
            if ( fs.lstatSync( curSource ).isDirectory() ) {
                copyFolderRecursiveSync( curSource, targetFolder );
            } else {
                copyFileSync( curSource, targetFolder );
            }
        } );
    }
}



exports.renameFiles = function(target_dir){

	return new Promise((resolve) => {

		console.log("target_dir "+ target_dir);
		var data = JSON.parse(fs.readFileSync(`${target_dir}/data.json`));

		log('INF', 'Renaming original files...');

		data.objects.forEach((item, index)=>{
			let fileName_ats;
			let fileName_uzd;
			
			if(item.files.ats != null && item.files.ats != undefined && item.files.ats.length > 0){
				let ar = item.files.ats.split('.');
				fileName_ats = data.gameDate + '_' + item.taskNum + '_ats.' + ar[ar.length-1];
			}
			
			if(item.files.uzd != null && item.files.uzd != undefined && item.files.uzd.length > 0){
				let ar = item.files.uzd.split('.');
				fileName_uzd = data.gameDate + '_' + item.taskNum + '_uzd.' + ar[ar.length-1];
			}

			
			if(item.files.ats.length > 0){
				fs.rename(`${target_dir}/${item.files.ats}`, `${target_dir}/local/${fileName_ats}`,(err) => { // FYI - item.files.ats not only contains the file name, but also the residing folder - "local" or "task"
					if(err){
						console.log(err);
						log('ERR', `${err}`);
					}
				});
			}
			
			if(item.files.uzd.length > 0){
				fs.rename(`${target_dir}/${item.files.uzd}`, `${target_dir}/task/${fileName_uzd}`,(err) => { // FYI - item.files.uzd not only contains the file name, but also the residing folder - "local" or "task"
					if(err){
						console.log(err);
						log('ERR', `${err}`);
					}
				});
			}

			item.files.ats = fileName_ats;

			item.files.uzd = fileName_uzd;

			if(item.description.tags == undefined){
				item.description.tags = [];
			}

			if(index == data.objects.length - 1){
				log('INF', 'Renaming completed');

				log('INF', 'Saving updated data.json...');

				fs.writeFileSync(`./${target_dir}/data.json`, JSON.stringify(data));

				log('INF', `data.json saved in "${target_dir}/data.json"`);

				resolve();
			}
		});
		
	})
}



readFileNames = function(target_dir, callback){
	fs.readdir(target_dir, {withFileTypes: true}, (err, files)=>{
		if(err){
			console.log(err);
			log('ERR', `${err}`);
		}
		else{
			log('INF', `Reading file names present in "${target_dir}"...`);

			var fileNames = [];
			files.forEach((item, index)=>{

				if(item.isDirectory()){
					
					fs.readdir(target_dir + `/${item.name}`, (err, subFiles)=>{
						if(err){
							console.log(err);
							log('ERR', `${err}`);
						}
						else{
							console.log(subFiles);
							console.log(index);
							console.log(files.length);
							let fileName = {};
							fileName.path = item.name;
							fileName.files = subFiles;
	
							fileNames.push(fileName);
	
							if(index == files.length-1 || fileNames.length == 2){
								log('INF', `Reading completed`);
								callback(fileNames);
							}
						}
					});

				}
				
			})
		}
	});
}



getJsonData = function(json_path, callback){
	var filesFromJson = [];
	fs.readFile(json_path, 'UTF-8', (err, info)=>{
		if(err){
			console.log(err);
			log('ERR', `${err}`);
		}
		else{
			log('INF', `Getting JSON data from "${json_path}"...`);
			let objects = JSON.parse(info).objects;

			objects.forEach((object, index)=>{
				let filesByTask = {};
				filesByTask.fileNames = {};

				filesByTask.taskNum = object.taskNum

				filesByTask.fileNames.ats = object.files.ats;
				filesByTask.fileNames.uzd = object.files.uzd;

				filesFromJson.push(filesByTask);
				if(index == objects.length - 1){
					log('INF', `JSON data read`);
					callback(filesFromJson, JSON.parse(info));
				}
			})

			
		}
	})
}



exports.checkJsonAgainstFiles = function(target_dir, json_path){
	return new Promise((resolve, reject) => {
		readFileNames(target_dir, (fileNames)=>{

			getJsonData(json_path, (filesFromJson, jsonData)=>{
				var regFlag = 0;
				var count = 0;

				fileNames.forEach((item)=>{
					item.files.forEach((file_name)=>{
						if(utilities.checkRegex(file_name)){
							regFlag++;
						}
						count++;
					})
				});

				filesFromJson.forEach((item)=>{
					if(utilities.checkRegex(item.fileNames.ats)){
						regFlag++;
					}
					if(utilities.checkRegex(item.fileNames.uzd)){
						regFlag++;
					}
					count++;
					if(item.fileNames.uzd){
						count++;
					}
				});

				if(regFlag >= (count-5)){
					reject();
					log('WRN', `The files and json have already been renamed`);
					return;
				}
	
				filesFromJson.forEach((json_files, index)=>{
					let index_ats = fileNames.findIndex((i)=>{return i.path == 'local'});
					let index_uzd = fileNames.findIndex((i)=>{return i.path == 'task'});

					var ats_exists = -1;
					var uzd_exists = -1;					

					if(json_files.fileNames.ats){
						ats_exists = fileNames[index_ats].files.findIndex((i)=> i.toLowerCase() == json_files.fileNames.ats.split('/')[1].toLowerCase());
					}
					if(json_files.fileNames.uzd){
						uzd_exists = fileNames[index_uzd].files.findIndex((i)=> i.toLowerCase() == json_files.fileNames.uzd.split('/')[1].toLowerCase());
					}
					
	
					var objects_index = jsonData.objects.findIndex((i)=> i.taskNum == json_files.taskNum);

					if(ats_exists >= 0){
						if(fileNames[index_ats].files[ats_exists] != json_files.fileNames.ats.split('/')[1]){
							jsonData.objects[objects_index].files.ats = fileNames[index_ats].files[ats_exists];
						}
					}
					else{
						jsonData.objects[objects_index].files.ats = "";
					}
	
					if(uzd_exists >= 0){
						if(fileNames[index_uzd].files[uzd_exists] != json_files.fileNames.uzd.split('/')[1]){
							jsonData.objects[objects_index].files.uzd = fileNames[index_uzd].files[uzd_exists];
						}
					}
					else{
						jsonData.objects[objects_index].files.uzd = "";
					}
	
					if(index == filesFromJson.length - 1){
						log('INF', `Saving updated version of JSON to "${json_path}"...`);

						fs.writeFileSync(json_path, JSON.stringify(jsonData));

						log('INF', `Data saved`);

						resolve();
					}
					
				})
			});
	
	
		});
	})
	

}

exports.readFileNames = readFileNames;