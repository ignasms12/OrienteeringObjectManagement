const sql = require('mssql')

const sqlConfig = require('../secrets/db.js');

const DB = {
	Pool: new sql.ConnectionPool(sqlConfig),

	Objects: {
		GetObjectsAll: (result) => {
			DB.Pool.connect()
			.then(async (pool) => {
				var sp_result = await pool.request()
				.execute('dbo.getAllObjects')
				.catch((err)=>{
					console.log("err");
					console.log(err);
				})
				DB.Logs.Log('./database/db.js:14 - dbo.getAllObjects called', 'Back end/database log', (recs)=>{
					// console.log(recs)
				})

				console.log(sp_result.recordset);

				result(sp_result.recordset);
			})
		}
	},

	Tags: {
		GetTags: (result) => {
			DB.Pool.connect()
			.then(async (pool) => {
				var sp_result = await pool.request()
				.execute('dbo.getTags');
				DB.Logs.Log('./database/db.js:29 - dbo.getTags called', 'Back end/database log', (recs)=>{
					// console.log(recs)
				})

				result(sp_result.recordset);
			})
		}
	},
	Logs: {
		Log: (log_content, type, result) => {
			DB.Pool.connect()
			.then(async (pool) => {
				var sp_result = await pool.request()
				.input('log_content', log_content)
				.input('type', type)
				.execute('dbo.log');

				// console.log('Inserting logs to db...');
				result(sp_result.recordset);
			})
		}
	}
}

module.exports = DB;