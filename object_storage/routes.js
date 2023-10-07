module.exports = app => {
	const Auth = require('./controllers/authorize.controller.js');
	const Objects = require('./controllers/objects.controller.js');
	const ObjectImporter = require('./controllers/objectImport.controller.js');

	const multer = require('multer');
	const storageEngine = multer.diskStorage({
		destination: 'tmp/',
		filename: (req, file, cb) => {
			cb(null, file.originalname);
		}
	});

	const upload = multer({storage: storageEngine});

	app.post('/authorize', Auth.Authorize);

	app.post('/createUser', Auth.CreateUser);

	app.get('/checkSession', Auth.CheckSession);
	
	app.get('/getObjectById', Objects.GetObjectById);

	app.get('/getObjectsAll', Objects.GetObjectsAll);

	app.get('/getTags', Objects.GetTags);

	app.post('/importObjects', upload.array('files'), ObjectImporter.ImportObjects);

	// app.post('/createObject');

	// app.post('/uploadPicture');

	// app.get('/getObjectsByLocation')
	
}