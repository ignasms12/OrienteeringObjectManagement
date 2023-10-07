// const mysql = require('mysql');
const {Pool} = require('pg');

const dbConfig = require('../secrets/db.js');

const DB = {
	Pool: new Pool(dbConfig),

	Auth: {
		Authorize: (username, passwordHash, result) => {
			DB.Pool.query("CALL sp_Authorize(?,?)", [username, passwordHash], (err, res) =>{
				if(err){
					console.log(err);
				}
				else{
					let ob = res[0];
					console.log(ob[0]);
					result(ob[0]);
				}
			});
		},
		CreateUser: (username, password_hash, email, full_name, role, result) =>{
			DB.Pool.query("CALL sp_CreateUser(?,?,?,?,?)", [username, password_hash, email, full_name, role], (err, res)=>{
				if(err){
					console.log(err);
				}
				else{
					let ob = res[0];
					console.log(ob[0]);
					result(ob[0]);
				}
			});
		}
	},

	Session: {
		CreateSession: (ipAddress, username, sourcePath, result) => {
			DB.Pool.query("CALL sp_CreateSession(?, ?, ?)", [ipAddress, username, sourcePath], (err, res)=>{
				if(err){
					console.log(err);
				}
				else{
					let ob = res[1];
					console.log(ob[0]);
					result(ob[0]);
				}
			});
		},

		CheckSession: (id, result) => {
			DB.Pool.query("CALL sp_CheckSession(?)", [id], (err, res)=>{
				if(err){
					console.log(err);
				}
				else{
					let ob = res[0];
					console.log(ob[0]);
					result(ob[0]);
				}
			});
		}
	},

	GetObjects: {
		GetObjectById: (id, result) => {
			DB.Pool.query('CALL sp_GetObjectById(?)', [id], (err, res) =>{
				if(err){
					console.log(err);
				}
				else{
					let ob = res[0];
					console.log(ob[0]);
					result(ob[0]);
				}
			});
		},

		GetObjectsByLocation: (locationInfo, result) => {

		},

		GetObjectsAll: (result) => {

			DB.Pool.connect()
			.then(client => {
				return client.query('SELECT * FROM get_all_objects()')
				.then(res => {
					client.release();
					result(res.rows);
					// console.log(res.rows);
				})
				.catch(err => {
					client.release();
					console.log("error");
					console.log(err.stack);
				})
			})

			// DB.Pool.query('CALL sp_GetObjectsAll()', (err, res) =>{
			// 	if(err){
			// 		console.log(err);
			// 	}
			// 	else{
			// 		let ob = res[0];
			// 		console.log(ob[0]);
			// 		result(ob[0]);
			// 	}
			// });
		}
	},

	Tags:{
		GetTags: (result) => {
			DB.Pool.connect()
			.then(client => {
				return client.query('SELECT * FROM get_tags()')
				.then(res => {
					client.release();
					result(res.rows);
				})
				.catch(err => {
					client.release();
					console.log("error");
					console.log(err.stack);
				})
			})
		}
	} 



}

module.exports = DB;