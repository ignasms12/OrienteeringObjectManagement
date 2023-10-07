const Auth = require('../models/authorize.model.js');


exports.Authorize = (req, res) => {
	if(!req.body){
		res.status(400).send({message: 'Request body cannot be empty'});
	}
	else{
		Auth.Authorize(req.body.username, req.body.password, (response)=>{
			if(response.status != 0){
				res.status(500).send({message: response.message});
			}
			else{
				var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
				var url = req.url;
				var user_id = response.user_id;
	
				Auth.CreateSession(ip, user_id, url, (sessResponse)=>{
					console.log("session response");
					console.log(sessResponse);
					if(sessResponse.status != 0){
						res.status(500).send({message: sessResponse.message});
					}
					else{
						// req.session.id = sessResponse.sessionId;
						console.log("session data is: ");
						console.log(sessResponse.sessionId);
						res.send(sessResponse.message);
					}
				})
			}
		});

	}	
}

exports.CreateUser = (req, res) => {
	if(!req.body){
		res.status(400).send({message: 'Request body cannot be empty'});
	}
	else{
		Auth.CreateUser(req.body.userInfo, (response) => {
			if(response.status != 0){
				res.status(500).send({message: response.message});
			}
			else{
				res.send(response.message);
			}
		})
	}
}

exports.CheckSession = (req, res) => {
	if(!req.body){
		res.status(400).send({message: 'Request body cannot be empty'});
	}
	else{
		Auth.CheckSession(req.body.session_id);
	}
}
