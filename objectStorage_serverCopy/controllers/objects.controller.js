const { Tags } = require('../database/db.js');
const Objects = require('../models/objects.model.js');

exports.GetObjectById = (req, res) => {
	if(!req.body){
		res.status(400).send({message: 'Request body cannot be empty'});
	}
	else{
		Objects.GetObjectById(req.body.object_id, (response) => {
			if(response.status != 0){
				res.status(500).send({message: response.message});
			}
			else{
				res.send({'message': response.message, 'body': response.object});
			}
		})
	}
}

exports.GetObjectsByLocation = (req, res) => {
	if(!req.body){
		res.status(400).send({message: 'Request body cannot be empty'});
	}
	else{
		Objects.GetObjectsByLocation(req.body.locationInfo, (response) => {
			if(response.status != 0){
				res.status(500).send({message: response.message});
			}
			else{
				res.send({'message': response.message, 'body': response.objects});
			}
		})
	}
}

exports.GetObjectsAll = (req, res) => {
	Objects.GetObjectsAll( (response) => {
		response.forEach(element => {
			element.tags = JSON.parse(element.tags)
			// element.tags.replace('\'', '');
			// element.tags.replace('\'', '');
		});
		// console.log("response")
		// console.log(response)
		res.send({response});
	})
}

exports.GetTags = (req, res) => {
	Objects.GetTags((response) => {
		res.send({response});
	})
}
