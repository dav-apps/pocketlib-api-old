var assert = require('assert');
var axios = require('axios');
var constants = require('../constants');
var utils = require('../utils');

const setStoreBookCollectionNameEndpointUrl = `${constants.apiBaseUrl}/api/1/call/store/collection/{0}/name/{1}`;
var resetStoreBookCollectionsAndStoreBookCollectionNames = false;

afterEach(async () => {
	if(resetStoreBookCollectionsAndStoreBookCollectionNames){
		await utils.resetStoreBookCollections();
		await utils.resetStoreBookCollectionNames();
		resetStoreBookCollectionsAndStoreBookCollectionNames = false;
	}
});

describe("SetStoreBookCollectionName endpoint", () => {
	it("should not set collection name without jwt", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setStoreBookCollectionNameEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].uuid).replace('{1}', "en")
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2101, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not set collection name with invalid jwt", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setStoreBookCollectionNameEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: "asdasdadsasdasdasd",
					'Content-Type': 'application/json'
				}
			});
		}catch(error){
			assert.equal(401, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(1302, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not set collection name without content type json", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setStoreBookCollectionNameEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': "asdasd"
				}
			});
		}catch(error){
			assert.equal(415, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(1104, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not set collection name if jwt is for another app", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setStoreBookCollectionNameEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: constants.davClassLibraryTestUserTestAppJWT,
					'Content-Type': 'application/json'
				}
			});
		}catch(error){
			assert.equal(403, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(1102, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not set collection name for collection of another user", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setStoreBookCollectionNameEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				}
			});
		}catch(error){
			assert.equal(403, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(1102, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not set collection name without required properties", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setStoreBookCollectionNameEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2108, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not set collection name with properties with wrong types", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setStoreBookCollectionNameEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					name: 23
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2209, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not set collection name with too short properties", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setStoreBookCollectionNameEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					name: "a"
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2307, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not set collection name with too long properties", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setStoreBookCollectionNameEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					name: "a".repeat(150)
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2407, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not set collection name for not supported language", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setStoreBookCollectionNameEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].uuid).replace('{1}', "bla"),
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					name: "Hello World"
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(1107, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should create collection name", async () => {
		// Create the collection name
		let response;
		let collection = constants.authorUser.author.collections[0];
		let language = "fr";
		let name = "Hello World";
		let jwt = constants.authorUser.jwt;

		try{
			response = await axios.default({
				method: 'put',
				url: setStoreBookCollectionNameEndpointUrl.replace('{0}', collection.uuid).replace('{1}', language),
				headers: {
					Authorization: jwt,
					'Content-Type': 'application/json'
				},
				data: {
					name
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(name, response.data.name);
		assert.equal(language, response.data.language);

		// Check if the data was correctly saved on the server
		// Get the collection
		let collectionResponse;

		try{
			collectionResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${collection.uuid}`,
				headers: {
					Authorization: jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		let responseCollectionNames = collectionResponse.data.properties.names;
		let responseCollectionNameUuids = responseCollectionNames.split(',');

		let collectionNameUuids = [];
		collection.names.forEach(name => collectionNameUuids.push(name.uuid));
		collectionNameUuids.push(responseCollectionNameUuids[responseCollectionNameUuids.length - 1]);
		let collectionNames = collectionNameUuids.join(',');

		assert.equal(collectionNameUuids.length, responseCollectionNameUuids.length);
		assert.equal(collectionNames, responseCollectionNames);

		// Get the collection name
		let collectionNameResponse;
		let newCollectionNameUuid = responseCollectionNameUuids[responseCollectionNameUuids.length - 1];

		try{
			collectionNameResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${newCollectionNameUuid}`,
				headers: {
					Authorization: jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(newCollectionNameUuid, collectionNameResponse.data.uuid);
		assert.equal(name, collectionNameResponse.data.properties.name);
		assert.equal(language, collectionNameResponse.data.properties.language);

		// Tidy up
		resetStoreBookCollectionsAndStoreBookCollectionNames = true;
	});

	it("should update collection name", async () => {
		// Update the collection name
		let response;
		let collection = constants.authorUser.author.collections[0];
		let language = "en";
		let name = "Hello World";
		let collectionNameUuid = collection.names[0].uuid;
		let jwt = constants.authorUser.jwt;

		try{
			response = await axios.default({
				method: 'put',
				url: setStoreBookCollectionNameEndpointUrl.replace('{0}', collection.uuid).replace('{1}', language),
				headers: {
					Authorization: jwt,
					'Content-Type': 'application/json'
				},
				data: {
					name
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(name, response.data.name);
		assert.equal(language, response.data.language);

		// Check if the data was correctly updated on the server
		// Get the collection
		let collectionResponse;

		try{
			collectionResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${collection.uuid}`,
				headers: {
					Authorization: jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		let responseCollectionNames = collectionResponse.data.properties.names;
		let responseCollectionNameUuids = responseCollectionNames.split(',');

		let collectionNameUuids = [];
		collection.names.forEach(name => collectionNameUuids.push(name.uuid));
		let collectionNames = collectionNameUuids.join(',');

		assert.equal(collectionNameUuids.length, responseCollectionNameUuids.length);
		assert.equal(collectionNames, responseCollectionNames);

		// Get the collection name
		let collectionNameResponse;

		try{
			collectionNameResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${collectionNameUuid}`,
				headers: {
					Authorization: jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(collectionNameUuid, collectionNameResponse.data.uuid);
		assert.equal(name, collectionNameResponse.data.properties.name);
		assert.equal(language, collectionNameResponse.data.properties.language);

		// Tidy up
		resetStoreBookCollectionsAndStoreBookCollectionNames = true;
	});

	it("should create collection name for collection of admin", async () => {
		// Create the collection name
		let response;
		let collection = constants.davUser.authors[0].collections[0];
		let language = "fr";
		let name = "Updated name";
		let jwt = constants.davUser.jwt;

		try{
			response = await axios.default({
				method: 'put',
				url: setStoreBookCollectionNameEndpointUrl.replace('{0}', collection.uuid).replace('{1}', language),
				headers: {
					Authorization: jwt,
					'Content-Type': 'application/json'
				},
				data: {
					name
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(name, response.data.name);
		assert.equal(language, response.data.language);

		// Check if the data was correctly saved on the server
		// Get the collection
		let collectionResponse;

		try{
			collectionResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${collection.uuid}`,
				headers: {
					Authorization: jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		let responseCollectionNames = collectionResponse.data.properties.names;
		let responseCollectionNameUuids = responseCollectionNames.split(',');

		let collectionNameUuids = [];
		collection.names.forEach(name => collectionNameUuids.push(name.uuid));
		collectionNameUuids.push(responseCollectionNameUuids[responseCollectionNameUuids.length - 1]);
		let collectionNames = collectionNameUuids.join(',');

		assert.equal(collectionNameUuids.length, responseCollectionNameUuids.length);
		assert.equal(collectionNames, responseCollectionNames);

		// Get the collection name
		let collectionNameResponse;
		let newCollectionNameUuid = responseCollectionNameUuids[responseCollectionNameUuids.length - 1];

		try{
			collectionNameResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${newCollectionNameUuid}`,
				headers: {
					Authorization: jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(newCollectionNameUuid, collectionNameResponse.data.uuid);
		assert.equal(name, collectionNameResponse.data.properties.name);
		assert.equal(language, collectionNameResponse.data.properties.language);

		// Tidy up
		resetStoreBookCollectionsAndStoreBookCollectionNames = true;
	});

	it("should update collection name for collection of admin", async () => {
		// Update the collection name
		let response;
		let collection = constants.davUser.authors[0].collections[0];
		let language = "en";
		let name = "Hallo Welt";
		let collectionNameUuid = collection.names[0].uuid;
		let jwt = constants.davUser.jwt;

		try{
			response = await axios.default({
				method: 'put',
				url: setStoreBookCollectionNameEndpointUrl.replace('{0}', collection.uuid).replace('{1}', language),
				headers: {
					Authorization: jwt,
					'Content-Type': 'application/json'
				},
				data: {
					name
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(name, response.data.name);
		assert.equal(language, response.data.language);

		// Check if the data was correctly updated on the server
		// Get the collection
		let collectionResponse;

		try{
			collectionResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${collection.uuid}`,
				headers: {
					Authorization: jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		let responseCollectionNames = collectionResponse.data.properties.names;
		let responseCollectionNameUuids = responseCollectionNames.split(',');

		let collectionNameUuids = [];
		collection.names.forEach(name => collectionNameUuids.push(name.uuid));
		let collectionNames = collectionNameUuids.join(',');

		assert.equal(collectionNameUuids.length, responseCollectionNameUuids.length);
		assert.equal(collectionNames, responseCollectionNames);

		// Get the collection name
		let collectionNameResponse;

		try{
			collectionNameResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${collectionNameUuid}`,
				headers: {
					Authorization: jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(collectionNameUuid, collectionNameResponse.data.uuid);
		assert.equal(name, collectionNameResponse.data.properties.name);
		assert.equal(language, collectionNameResponse.data.properties.language);

		// Tidy up
		resetStoreBookCollectionsAndStoreBookCollectionNames = true;
	});
});