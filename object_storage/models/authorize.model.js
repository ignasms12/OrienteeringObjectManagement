const DB_Auth = require('../database/db.js').Auth;
const DB_Session = require('../database/db.js').Session;

const Auth = {};

Auth.Authorize = (username, hash, callback) => {
	DB_Auth.Authorize(username, hash, (res)=>{
		callback(res);
	});
}

Auth.CreateSession = (ipAddress, username, sourcePath, callback) => {
	DB_Session.CreateSession(ipAddress, username, sourcePath, (res)=>{
		callback(res);
	})
}

Auth.CheckSession = (id, callback) => {
	DB_Session.CheckSession(id, (res)=>{
		callback(res);
	})
}

Auth.CreateUser = (userInfo, callback) => {
	let username = userInfo.username;
	let password_hash = userInfo.password_hash;
	let email = userInfo.email;
	let full_name = userInfo.full_name;
	let role = userInfo.role;
	
	DB_Auth.CreateUser(username, password_hash, email, full_name, role, (res) => {
		callback(res);
	})
}

module.exports = Auth;