const ObjectImporter = require('../models/objectImport.model');

exports.ImportObjects = (req, res) => {
	if(!req.body){
		res.status(400).send({message: 'Request body cannot be empty'});
	}
	else{
		ObjectImporter.ImportObject(() => {
			// if(response.status != 0){
			// 	res.status(500).send({message: response.message});
			// }
			// else{
				// res.send({'message': response.message, 'body': response.object});
				res.send('All good');
			// }
		});
	}
}
