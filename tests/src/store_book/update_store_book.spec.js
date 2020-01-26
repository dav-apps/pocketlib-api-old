var assert = require('assert');
var axios = require('axios');
var constants = require('../constants');
var utils = require('../utils');

const updateStoreBookEndpointUrl = `${constants.apiBaseUrl}/api/1/call/store/book/{0}`;
var resetStoreBooks = false;

before(async () => {
	await utils.resetDatabase();
});

afterEach(async () => {
	if(resetStoreBooks){
		await utils.resetStoreBooks();
		resetStoreBooks = false;
	}
});

describe("UpdateStoreBook endpoint", () => {
	it("should not update store book without jwt", async () => {
		try{
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', constants.authorUserAuthor.collections[0].books[0].uuid)
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2101, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not update store book with invalid jwt", async () => {
		try{
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', constants.authorUserAuthor.collections[0].books[0].uuid),
				headers: {
					Authorization: "asdasdasdasdsda",
					'Content-Type': 'application/json'
				},
				data: {
					title: "Blabla"
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

	it("should not update store book without content type json", async () => {
		try{
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', constants.authorUserAuthor.collections[0].books[0].uuid),
				headers: {
					Authorization: constants.authorUserJWT
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

	it("should not update store book that does not exist", async () => {
		try{
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', "blabla"),
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					title: "Hello World",
					description: "Hello World"
				}
			});
		}catch(error){
			assert.equal(404, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2806, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not update store book that does not belong to the author", async () => {
		try{
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', constants.authorUserAuthor.collections[0].books[0].uuid),
				headers: {
					Authorization: constants.davUserJWT,
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

	it("should not update store book with properties with wrong types", async () => {
		try{
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', constants.authorUserAuthor.collections[0].books[0].uuid),
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					title: 23,
					description: false,
					language: 2.2,
					published: "Hello"
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(4, error.response.data.errors.length);
			assert.equal(2204, error.response.data.errors[0].code);
			assert.equal(2205, error.response.data.errors[1].code);
			assert.equal(2206, error.response.data.errors[2].code);
			assert.equal(2207, error.response.data.errors[3].code);
			return;
		}

		assert.fail();
	});

	it("should not update store book with too short properties", async () => {
		try{
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', constants.authorUserAuthor.collections[0].books[0].uuid),
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					title: "a",
					description: "a"
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(2, error.response.data.errors.length);
			assert.equal(2304, error.response.data.errors[0].code);
			assert.equal(2305, error.response.data.errors[1].code);
			return;
		}

		assert.fail();
	});

	it("should not update store book with too long properties", async () => {
		try{
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', constants.authorUserAuthor.collections[0].books[0].uuid),
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					title: "a".repeat(150),
					description: "a".repeat(2010)
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(2, error.response.data.errors.length);
			assert.equal(2404, error.response.data.errors[0].code);
			assert.equal(2405, error.response.data.errors[1].code);
			return;
		}

		assert.fail();
	});

	it("should not update store book with not supported language", async () => {
		try{
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', constants.authorUserAuthor.collections[0].books[0].uuid),
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					language: "blablabla"
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

	it("should update title of store book", async () => {
		let collection = constants.authorUserAuthor.collections[0];
		let storeBook = collection.books[0];
		let title = "Updated title";
		let response;

		try{
			response = await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					title
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(storeBook.uuid, response.data.uuid);
		assert.equal(collection.uuid, response.data.collection);
		assert.equal(title, response.data.title);
		assert.equal(storeBook.description, response.data.description);
		assert.equal(storeBook.language, response.data.language);
		assert.equal(storeBook.status, response.data.status);
		assert.equal(true, response.data.cover);
		assert.equal(true, response.data.file);

		// Check if the store book was updated on the server
		let objResponse;
		try{
			objResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${storeBook.uuid}`,
				headers: {
					Authorization: constants.authorUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(storeBook.uuid, objResponse.data.uuid);
		assert.equal(title, objResponse.data.properties.title);
		assert.equal(storeBook.description, objResponse.data.properties.description);
		assert.equal(storeBook.language, objResponse.data.properties.language);

		// Tidy up
		resetStoreBooks = true;
	});

	it("should update description of store book", async () => {
		let collection = constants.authorUserAuthor.collections[0];
		let storeBook = collection.books[0];
		let description = "Updated description";
		let response;

		try{
			response = await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					description
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(storeBook.uuid, response.data.uuid);
		assert.equal(collection.uuid, response.data.collection);
		assert.equal(storeBook.title, response.data.title);
		assert.equal(description, response.data.description);
		assert.equal(storeBook.language, response.data.language);
		assert.equal(storeBook.status, response.data.status);
		assert.equal(true, response.data.cover);
		assert.equal(true, response.data.file);

		// Check if the store book was updated on the server
		let objResponse;
		try{
			objResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${storeBook.uuid}`,
				headers: {
					Authorization: constants.authorUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(storeBook.uuid, objResponse.data.uuid);
		assert.equal(storeBook.title, objResponse.data.properties.title);
		assert.equal(description, objResponse.data.properties.description);
		assert.equal(storeBook.language, objResponse.data.properties.language);

		// Tidy up
		resetStoreBooks = true;
	});

	it("should update language of store book", async () => {
		let collection = constants.authorUserAuthor.collections[0];
		let storeBook = collection.books[0];
		let language = "de";
		let response;

		try{
			response = await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					language
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(storeBook.uuid, response.data.uuid);
		assert.equal(collection.uuid, response.data.collection);
		assert.equal(storeBook.title, response.data.title);
		assert.equal(storeBook.description, response.data.description);
		assert.equal(language, response.data.language);
		assert.equal(storeBook.status, response.data.status);
		assert.equal(true, response.data.cover);
		assert.equal(true, response.data.file);

		// Check if the store book was updated on the server
		let objResponse;
		try{
			objResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${storeBook.uuid}`,
				headers: {
					Authorization: constants.authorUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(storeBook.uuid, objResponse.data.uuid);
		assert.equal(storeBook.title, objResponse.data.properties.title);
		assert.equal(storeBook.description, objResponse.data.properties.description);
		assert.equal(language, objResponse.data.properties.language);

		// Tidy up
		resetStoreBooks = true;
	});

	it("should update store book of an admin", async () => {
		let collection = constants.davUserAuthors[0].collections[0];
		let storeBook = collection.books[0];
		let title = "Updated title";
		let description = "Updated description";
		let language = "de";
		let response;

		try{
			response = await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.davUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					title,
					description,
					language
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(storeBook.uuid, response.data.uuid);
		assert.equal(collection.uuid, response.data.collection);
		assert.equal(title, response.data.title);
		assert.equal(description, response.data.description);
		assert.equal(language, response.data.language);
		assert.equal(storeBook.status, response.data.status);
		assert.equal(false, response.data.cover);
		assert.equal(false, response.data.file);

		// Check if the store book was updated on the server
		let objResponse;
		try{
			objResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${storeBook.uuid}`,
				headers: {
					Authorization: constants.davUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(storeBook.uuid, objResponse.data.uuid);
		assert.equal(title, objResponse.data.properties.title);
		assert.equal(description, objResponse.data.properties.description);
		assert.equal(language, objResponse.data.properties.language);

		// Tidy up
		resetStoreBooks = true;
	});

	it("should publish store book", async () => {
		let collection = constants.authorUserAuthor.collections[1];
		let storeBook = collection.books[0];
		let response;

		try{
			response = await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					published: true
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(storeBook.uuid, response.data.uuid);
		assert.equal(collection.uuid, response.data.collection);
		assert.equal(storeBook.title, response.data.title);
		assert.equal(storeBook.description, response.data.description);
		assert.equal(storeBook.language, response.data.language);
		assert.equal("review", response.data.status);
		assert.equal(false, response.data.cover);
		assert.equal(false, response.data.file);

		// Check if the store book was updated on the server
		let objResponse;
		try{
			objResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${storeBook.uuid}`,
				headers: {
					Authorization: constants.authorUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(storeBook.uuid, objResponse.data.uuid);
		assert.equal(storeBook.title, objResponse.data.properties.title);
		assert.equal(storeBook.description, objResponse.data.properties.description);
		assert.equal(storeBook.language, objResponse.data.properties.language);
		assert.equal("review", objResponse.data.properties.status);

		// Tidy up
		resetStoreBooks = true;
	});

	it("should unpublish store book", async () => {
		let collection = constants.authorUserAuthor.collections[0];
		let storeBook = collection.books[1];
		let response;

		try{
			response = await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					published: false
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(storeBook.uuid, response.data.uuid);
		assert.equal(collection.uuid, response.data.collection);
		assert.equal(storeBook.title, response.data.title);
		assert.equal(storeBook.description, response.data.description);
		assert.equal(storeBook.language, response.data.language);
		assert.equal("unpublished", response.data.status);
		assert.equal(false, response.data.cover);
		assert.equal(false, response.data.file);

		// Check if the store book was updated on the server
		let objResponse;
		try{
			objResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${storeBook.uuid}`,
				headers: {
					Authorization: constants.authorUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(storeBook.uuid, objResponse.data.uuid);
		assert.equal(storeBook.title, objResponse.data.properties.title);
		assert.equal(storeBook.description, objResponse.data.properties.description);
		assert.equal(storeBook.language, objResponse.data.properties.language);
		assert.equal("unpublished", objResponse.data.properties.status);

		// Tidy up
		resetStoreBooks = true;
	});

	it("should publish store book of an admin", async () => {
		let collection = constants.davUserAuthors[0].collections[0];
		let storeBook = collection.books[1];
		let response;

		try{
			response = await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.davUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					published: true
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(storeBook.uuid, response.data.uuid);
		assert.equal(collection.uuid, response.data.collection);
		assert.equal(storeBook.title, response.data.title);
		assert.equal(storeBook.description, response.data.description);
		assert.equal(storeBook.language, response.data.language);
		assert.equal("review", response.data.status);
		assert.equal(false, response.data.cover);
		assert.equal(false, response.data.file);

		// Check if the store book was updated on the server
		let objResponse;
		try{
			objResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${storeBook.uuid}`,
				headers: {
					Authorization: constants.davUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(storeBook.uuid, objResponse.data.uuid);
		assert.equal(storeBook.title, objResponse.data.properties.title);
		assert.equal(storeBook.description, objResponse.data.properties.description);
		assert.equal(storeBook.language, objResponse.data.properties.language);
		assert.equal("review", objResponse.data.properties.status);

		// Tidy up
		resetStoreBooks = true;
	});

	it("should unpublish store book of an admin", async () => {
		let collection = constants.davUserAuthors[0].collections[0];
		let storeBook = collection.books[0];
		let response;

		try{
			response = await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.davUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					published: false
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(storeBook.uuid, response.data.uuid);
		assert.equal(collection.uuid, response.data.collection);
		assert.equal(storeBook.title, response.data.title);
		assert.equal(storeBook.description, response.data.description);
		assert.equal(storeBook.language, response.data.language);
		assert.equal("unpublished", response.data.status);
		assert.equal(false, response.data.cover);
		assert.equal(false, response.data.file);

		// Check if the store book was updated on the server
		let objResponse;
		try{
			objResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${storeBook.uuid}`,
				headers: {
					Authorization: constants.davUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(storeBook.uuid, objResponse.data.uuid);
		assert.equal(storeBook.title, objResponse.data.properties.title);
		assert.equal(storeBook.description, objResponse.data.properties.description);
		assert.equal(storeBook.language, objResponse.data.properties.language);
		assert.equal("unpublished", objResponse.data.properties.status);

		// Tidy up
		resetStoreBooks = true;
	});
});