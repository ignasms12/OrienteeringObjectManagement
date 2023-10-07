const ExifImage = require('exif').ExifImage;
const fileUtilities = require('./fileUtilities.js');
const log = require('./logger').log;


exports.checkRegex = function(input){
	let regex = /([0-9]+(\.[0-9]+)+)_[0-9]+_[a-zA-Z]+\.[a-zA-Z]+/i;
	return regex.test(input);
}

exports.checkConvertedFiles = function(dir_path, json_data){
	return new Promise((resolve)=>{
		fileUtilities.readFileNames(`.${dir_path}`, (files)=>{

			log('INF', `Checking the converted files...`);

			var filesFromJson = [];

			json_data.objects.forEach(item => {
				if(item.files.ats) filesFromJson.push(item.files.ats.replace('.jpg',''));
				if(item.files.uzd) filesFromJson.push(item.files.uzd.replace('.jpg',''));

			});

			var ats_files;
			var uzd_files;

			var files1length = 0;
			var files0length = 0;

			if(files[0] && files[0].files){
				ats_files = files[0].files;
				files0length = files[0].files.length;
			}

			if(files[1] && files[1].files){
				uzd_files = files[1].files;
				files1length = files[1].files.length;
			}
			

			var intersection = ats_files.filter(element => {
				return filesFromJson.includes(element.replace('.jpg', ''));
			});

			
			if(uzd_files){
				var interPart2 = uzd_files.filter(element => {
					return filesFromJson.includes(element.replace('.jpg', ''));
				});
			}
			
			if(interPart2){
				intersection = intersection.concat(interPart2);
			}
			
			var missingElementCount = (files0length + files1length) - intersection.length;
			resolve(missingElementCount);
		});
	})
}

convertCoordinates = function(deg, min, sec, dir){
	let decimal = deg + (min / 60) + (sec / 3600);
	if (dir.toUpperCase() === 'S' || dir.toUpperCase() === 'W') decimal *= -1;
	return decimal;
}

exports.extractGpsData = function(target_path){
	return new Promise((resolve)=>{
		var coordinates;
		new ExifImage({image: target_path}, (err, exifData) => {
			if(err){
				console.log(err);
				log('ERR', `${err}`);
			}
			else{
				if(exifData.gps.GPSLatitude){
					coordinates = `${convertCoordinates(exifData.gps.GPSLatitude[0], exifData.gps.GPSLatitude[1], exifData.gps.GPSLatitude[2], exifData.gps.GPSLatitudeRef)}, ${convertCoordinates(exifData.gps.GPSLongitude[0], exifData.gps.GPSLongitude[1], exifData.gps.GPSLongitude[2], exifData.gps.GPSLongitudeRef)}`;
				}
				else{
					coordinates = null;
				}

				resolve(coordinates);
			}
		});
	})
	
}