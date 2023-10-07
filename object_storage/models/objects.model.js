const DB_GetObjects = require('../database/db.js').GetObjects;
const DB_Tags = require('../database/db.js').Tags;

const Objects = {};

Objects.GetObjectById = (id, callback) => {
	DB_GetObjects.GetObjectsById(id, (res) => {
		callback(res);
	})
}

Objects.GetObjectsByLocation = (locationInfo, callback) => {
	DB_GetObjects.GetObjectsByLocation(locationInfo, (res) => {
		callback(res);
	})
}

Objects.GetObjectsAll = (callback) => {
	DB_GetObjects.GetObjectsAll((res) => {
		callback(res);
	})
}

Objects.GetTags = (callback) => {
	DB_Tags.GetTags((res)=>{
		callback(res);
	});
}

module.exports = Objects;