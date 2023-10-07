// mssql config

module.exports = {
	user: 'sa',
	password: 'vIlnius378972!',
	database: 'object_storage',
	server: 'localhost',
	pool: {
		max: 10,
		min: 0,
		idleTimeoutMillis: 30000
	  },
	  options: {
		encrypt: false,
		trustServerCertificate: true
	  }
}

// psql config

// module.exports = {
// 	user: 'import_user',
// 	host: 'localhost',
// 	database: 'object_storage',
// 	password: 'kHQ9!mGpEN?DBVju',
// 	port: 5432
// }

// mysql config

// module.exports = {
// 	user: 'BE_user',
// 	password: 'A2?f}zc~9}djFK6}',
// 	database: 'object_storage',
// 	server: 'localhost',
// 	options: {
// 		encrypt: true,
// 		trustServerCertificate: true // to be changed to false
// 	}
// }