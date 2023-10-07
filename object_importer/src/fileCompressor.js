const compress_images = require("compress-images");
const fs = require('fs');
const log = require('./logger').log;


exports.compressFiles = function(gameDate, fileType){
	return new Promise((resolve) => {
		let engine_setup = {};

		var src_path;
		var dest_path = `./completed/${gameDate}/`;
		var target_dir = `./original_pictures/${gameDate}`;

		if(fileType == 0){
			engine_setup.jpg = "webp";
			engine_setup.png = null;
			src_path = `${target_dir}/local/*.jpg`;
		}
		else{
			engine_setup.jpg = "webp";
			engine_setup.png = null;
			src_path = `${target_dir}/task/*.jpg`;
		}

		fs.readFile(`./original_pictures/${gameDate}/data.json`, 'UTF-8', (err, text_data)=>{
			if(err){
				console.log(err);
			}
			else{
				var data = JSON.parse(text_data);
				var fileNamesFromJson = [];

				data.objects.forEach((item, index)=>{
					if(item.files.ats){
						fileNamesFromJson.push(item.files.ats.replace('.jpg', ''));
					}

					if(item.files.uzd){
						fileNamesFromJson.push(item.files.uzd.replace('.jpg', ''));
					}

					if(index == data.objects.length - 1){
						
						fs.readdir(target_dir, {withFileTypes: true}, (err, files)=>{
							if(err){
								console.log(err);
							}
							else{
								
							}
						});
					}
				})
			}
		})

		log('INF', `Starting compression of files in "${src_path}"...`);
	
		compress_images(
			src_path,
			dest_path,
			{ compress_force: false, statistic: true, autoupdate: true },
			false,
			{ jpg: { engine: engine_setup.jpg, command: false } },
			{ png: { engine: engine_setup.png, command: false } },
			{ svg: { engine: false, command: false } },
			{ gif: { engine: false, command: false } },
			function(err, com){
				if(err){
					console.log(err);
					log('ERR', `${err}`);
				}
				if(com){
					log('INF', `Compression of files in "${src_path}" completed`);

					fs.readFile(`${target_dir}/data.json`, 'UTF-8', (err, file_data)=>{
						if(err){
							console.log(err);
							log('ERR', `${err}`);
						}
						else{
							var data = JSON.parse(file_data);
							data.objects.forEach((item)=>{
								if(item.files.ats) item.files.ats = item.files.ats.replace('jpg', 'webp');
								if(item.files.uzd) item.files.uzd = item.files.uzd.replace('jpg', 'webp');
							})
							fs.writeFileSync(`${dest_path}data.json`, JSON.stringify(data));
						}
					})
					resolve();
				}
			}
		);
	})
	
}