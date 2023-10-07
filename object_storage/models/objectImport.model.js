const { json } = require('express');
const fs = require('fs');
const path = require('path');

const ObjectImporter = {};

copyFile = function(src, dest){
	var destFile = dest;

	// If target is a directory, a new file with the same name will be created
	// if ( fs.existsSync( dest ) ) {
	// 	if ( fs.lstatSync( dest ).isDirectory() ) {
	// 		// destFile = dest + '/';
	// 	}
	// }

	destFile = path.join( dest, path.basename( src ) );

	if (destFile.includes('/tmp')) {
		console.log("destFile includes tmp");
		destFile = destFile.replace('/tmp', '');
	}

	console.log("destFile2 - ", destFile);
	fs.writeFileSync(destFile, fs.readFileSync(src));
}

copyFolder = function(src, dest){
	var files = [];

	var targetFolder = dest;
	
    // Check if folder needs to be created or integrated
    if ( !fs.existsSync( targetFolder ) ) {
		fs.mkdirSync( targetFolder );
    }
	
	targetFolder = path.join( dest, path.basename( src ) );
    // Copy
    if ( fs.lstatSync( src ).isDirectory() ) {
        files = fs.readdirSync( src );
        files.forEach( function ( file ) {
            var curSource = path.join( src, file );
            if ( fs.lstatSync( curSource ).isDirectory() ) {
                copyFolderRecursiveSync( curSource, targetFolder );
            } else {
				console.log('curSource - ', curSource);
				console.log("targetFolder - ", targetFolder);
                copyFile( curSource, targetFolder );
            }
        } );
    }
}

ObjectImporter.ImportObject = () => {
	// perskaityti jsona
	// pasiimti game date
	// sukurti nauja folderi
	// pamovinti visus failus
	// pradeti importa i db

	let resp = {};
	resp.status = 0;
	resp.message = null;

	const source_path = "/server/object_storage/tmp";


	let json_data = fs.readFileSync(source_path + '/data.json', 'utf-8');

	let gameDate = JSON.parse(json_data).gameDate;

	let path = '/server/object_storage/Administration/pictures/' + gameDate;

	copyFolder(source_path, path);

	fs.readdir(source_path, (err, files)=>{
		files.forEach((item)=>{
			fs.rmSync(source_path+'/'+item);
		})
	})
	// fs.rmSync('.');

	// callback(resp);

	
	
}

module.exports = ObjectImporter;