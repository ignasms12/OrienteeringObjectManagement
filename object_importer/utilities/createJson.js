const fs = require('fs');
const readExcel = require('read-excel-file/node');

readExcelData = function(path, excelName){
	return new Promise((resolve) => {
		var data = {};
		data.objects = [];

		readExcel(path + '/' + excelName).then((rows)=>{
			rows.forEach((item, index)=>{
				if(index > 0){
					let tempObject = {};
					let tags = [];
					tempObject.taskNum = item[0];
					tempObject.description = {};

					let newstr = item[1];

					if(item[1]){
						if(item[1].includes('[')){
							newstr = newstr.replace('[', '');
						}
						if(item[1].includes(']')){
							newstr = newstr.replace(']','');
						}
						
	
						newstr.split(',').forEach(item => {
							let text = item.trim().replace(/"/g, '');
							tags.push(text);
						});

					}
					
					tempObject.description.tags = tags;
					tempObject.coordinates = item[2];
					tempObject.files = {};
					// tempObject.files.ats = "";
					// tempObject.files.uzd = "";

					console.log(tempObject);

					data.objects.push(tempObject);
				}
			});

			resolve(data);
		});
	});
}

readFileNames = function(root_path, type){
	return new Promise((resolve)=>{
		let target_dir = root_path + '/' + type;
		fs.readdir(target_dir, {withFileTypes: true}, (err, files)=>{
			if(err){
				console.log(err);
			}
			else{
				console.log("target_dir is " + target_dir);
				console.log(`Reading file names present in "${target_dir}"...`);
				console.log();
	
				var objects = [];
				files.forEach((item, index)=>{
	
					if(item.name != '.DS_Store'){
						let ob = {};
						if(type == 'local'){
							ob.ats = item.name;
						}
						else{
							ob.uzd = item.name;
						}


						ob.taskNumber = item.name.split('-').pop().split('.')[0];

						// IN CASE SHIT GOES SOUTH!!!!!
						// ob.taskNumber = item.name.split('_')[1] 

						console.log("TaskNumber - ", ob.taskNumber);

						objects.push(ob);
		
						if(index == files.length-1){
							console.log("\x1b[32m%s\x1b[0m", "Reading completed");
							console.log();
							resolve(objects);
						}
					}
				})

				resolve([]);
			}
		});
	})
	
}


main = async function(root_path, gameDate){
	var excelData = await readExcelData(root_path, 'tags.xlsx');

	var files_ats = await readFileNames(root_path, 'local');
	var files_uzd = await readFileNames(root_path, 'task');


	files_uzd.forEach((item)=>{
		let tempItemIndex;
		// let uzd;

		console.log("item");
		console.log(item);


		let exIndex = excelData.objects.findIndex((i)=>{ return i.taskNum == item.taskNumber});

		console.log("exIndex - " + exIndex);
		if(item.ats != undefined && item.ats != null && item.ats.length > 0){
			console.log(excelData.objects);
			console.log("\nexcelData.objects[exIndex]");
			console.log(excelData.objects[exIndex]);
			excelData.objects[exIndex].files.ats = `task/${item.ats}`;
		}
		else{
			// delete excelData.objects[exIndex].files.ats;
		}

		// if(item.uzd != undefined && item.uzd != null && item.uzd.length > 0){
		// 	console.log("wasup");
		// 	console.log(item.uzd);
		// 	excelData.objects[exIndex].files.uzd = `task/${item.uzd}`;
		// }
		// else{
		// 	delete excelData.objects[exIndex].files.uzd;
		// }

	});

	files_ats.forEach((item)=>{
		let tempItemIndex;
		// let uzd;

		console.log("item");
		console.log(item);

		let exIndex = excelData.objects.findIndex((i)=>{ return i.taskNum == item.taskNumber});

		// if(item.ats != undefined && item.ats != null && item.ats.length > 0){
		// 	excelData.objects[exIndex].files.ats = `local/${item.ats}`;
		// }
		// else{
		// 	delete excelData.objects[exIndex].files.ats;
		// }

		console.log("item.ats is - ", item.ats);

		if(item.ats != undefined && item.ats != null && item.ats.length > 0){
			excelData.objects[exIndex].files.ats = `local/${item.ats}`;
		}
		else{
			// delete excelData.objects[exIndex].files.uzd;
		}

	});

	var indexesToRemove = [];

	// excelData.objects.forEach((item, index)=>{
	// 	if(item.files.ats.length == 0 && item.files.uzd.length == 0){
	// 		indexesToRemove.push(index);
	// 	}
	// })

	for(let i = indexesToRemove.length - 1; i >= 0; i--){
		excelData.objects.splice(indexesToRemove[i], 1);
	}

	excelData.gameDate = gameDate;

	console.log(`Saving json file in ${root_path+'/data.json'}...`);
	fs.writeFile(root_path + '/data.json', JSON.stringify(excelData), () => {
		console.log(`Saved json file in ${root_path+'/data.json'}`);
	});
	

}

var targetDir = '/Users/ignasmaslauskas/Desktop/projects/object_importer/original_pictures/';

var gameDate = "2022.12.16";

// new Promise(resolve => {
// 	readline.question("Please enter the game date: (in the following format - 'YYYY.MM.DD')\n", resolve);
// });

targetDir += gameDate;

main(targetDir, gameDate);