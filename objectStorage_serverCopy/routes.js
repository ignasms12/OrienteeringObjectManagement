module.exports = app => {
	const Auth = require('./controllers/authorize.controller.js');
	const Objects = require('./controllers/objects.controller.js');

	app.post('/authorize', Auth.Authorize);

	app.post('/createUser', Auth.CreateUser);

	app.get('/checkSession', Auth.CheckSession);
	
	app.get('/getObjectById', Objects.GetObjectById);

	app.get('/getObjectsAll', Objects.GetObjectsAll);

	app.get('/getTags', Objects.GetTags);

	// app.post('/createObject');

	// app.post('/uploadPicture');

	// app.get('/getObjectsByLocation')
	
}