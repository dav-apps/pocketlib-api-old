var assert = require('assert');
var axios = require('axios');
var constants = require("../constants");
var utils = require('../utils');

const getStoreBookEndpointUrl = `${constants.apiBaseUrl}/api/1/call/store/book/{0}`;

describe("GetStoreBook endpoint", () => {
	it("should not return store book with invalid jwt", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: "asdasdasdasd.asdasdasd"
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

	it("should not return store book if jwt is for another app", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: constants.davClassLibraryTestUserTestAppJWT
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

	it("should not return store book if the store book does not exist", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', "blablabla"),
				headers: {
					Authorization: constants.authorUser.jwt
				}
			});
		}catch(error){
			assert.equal(404, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2807, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should return unpublished store book if the user is the author", async () => {
		let collection = constants.authorUser.author.collections[1];
		let storeBook = collection.books[0];
		let response;

		try{
			response = await axios.default({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.authorUser.jwt
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
		assert.equal(storeBook.price || 0, response.data.price);
		assert.equal("unpublished", response.data.status);
		assert.equal(storeBook.cover != null, response.data.cover);
		assert.equal(storeBook.file != null, response.data.file);
		assert.equal(false, response.data.in_library);
		assert.equal(false, response.data.purchased);
	});

	it("should return unpublished store book if the user is an admin", async () => {
		let collection = constants.authorUser.author.collections[1];
		let storeBook = collection.books[0];
		let response;

		try{
			response = await axios.default({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.davUser.jwt
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
		assert.equal(storeBook.price || 0, response.data.price);
		assert.equal("unpublished", response.data.status);
		assert.equal(storeBook.cover != null, response.data.cover);
		assert.equal(storeBook.file != null, response.data.file);
		assert.equal(false, response.data.in_library);
		assert.equal(false, response.data.purchased);
	});

	it("should not return unpublished store book if the user is not the author", async () => {
		let collection = constants.authorUser.author.collections[1];
		let storeBook = collection.books[0];

		try{
			await axios.default({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.davClassLibraryTestUser.jwt
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

	it("should not return unpublished store book without jwt", async () => {
		let collection = constants.authorUser.author.collections[1];
		let storeBook = collection.books[0];

		try{
			await axios.default({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', storeBook.uuid)
			});
		}catch(error){
			assert.equal(403, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(1102, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should return store book in review if the user is the author", async () => {
		let collection = constants.authorUser.author.collections[0];
		let storeBook = collection.books[0];
		let response;

		try{
			response = await axios.default({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.authorUser.jwt
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
		assert.equal(storeBook.price || 0, response.data.price);
		assert.equal("review", response.data.status);
		assert.equal(storeBook.cover != null, response.data.cover);
		assert.equal(storeBook.file != null, response.data.file);
		assert.equal(false, response.data.in_library);
		assert.equal(false, response.data.purchased);
	});

	it("should return store book in review if the user is an admin", async () => {
		let collection = constants.authorUser.author.collections[0];
		let storeBook = collection.books[0];
		let response;

		try{
			response = await axios.default({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.davUser.jwt
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
		assert.equal(storeBook.price || 0, response.data.price);
		assert.equal("review", response.data.status);
		assert.equal(storeBook.cover != null, response.data.cover);
		assert.equal(storeBook.file != null, response.data.file);
		assert.equal(false, response.data.in_library);
		assert.equal(false, response.data.purchased);
	});

	it("should not return store book in review if the user is not the author", async () => {
		let collection = constants.authorUser.author.collections[0];
		let storeBook = collection.books[0];

		try{
			response = await axios.default({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.davClassLibraryTestUser.jwt
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

	it("should not return store book in review without jwt", async () => {
		let collection = constants.authorUser.author.collections[0];
		let storeBook = collection.books[0];

		try{
			await axios.default({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', storeBook.uuid)
			});
		}catch(error){
			assert.equal(403, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(1102, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should return published store book if the user is the author", async () => {
		let collection = constants.authorUser.author.collections[1];
		let storeBook = collection.books[1];
		let response;

		try{
			response = await axios.default({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.authorUser.jwt
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
		assert.equal(storeBook.price || 0, response.data.price);
		assert.equal("published", response.data.status);
		assert.equal(storeBook.cover != null, response.data.cover);
		assert.equal(storeBook.file != null, response.data.file);
		assert.equal(false, response.data.in_library);
		assert.equal(false, response.data.purchased);
	});

	it("should return published store book if the user is an admin", async () => {
		let collection = constants.authorUser.author.collections[1];
		let storeBook = collection.books[1];
		let response;

		try{
			response = await axios.default({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.davUser.jwt
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
		assert.equal(storeBook.price || 0, response.data.price);
		assert.equal("published", response.data.status);
		assert.equal(storeBook.cover != null, response.data.cover);
		assert.equal(storeBook.file != null, response.data.file);
		assert.equal(false, response.data.in_library);
		assert.equal(false, response.data.purchased);
	});

	it("should return published store book if the user is not the author", async () => {
		let collection = constants.authorUser.author.collections[1];
		let storeBook = collection.books[1];
		let response;

		try{
			response = await axios.default({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.davClassLibraryTestUser.jwt
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
		assert.equal(storeBook.price || 0, response.data.price);
		assert.equal("published", response.data.status);
		assert.equal(storeBook.cover != null, response.data.cover);
		assert.equal(storeBook.file != null, response.data.file);
		assert.equal(false, response.data.in_library);
		assert.equal(false, response.data.purchased);
	});

	it("should return published store book without jwt", async () => {
		let collection = constants.authorUser.author.collections[1];
		let storeBook = collection.books[1];
		let response;

		try{
			response = await axios.default({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', storeBook.uuid)
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
		assert.equal(storeBook.price || 0, response.data.price);
		assert.equal("published", response.data.status);
		assert.equal(storeBook.cover != null, response.data.cover);
		assert.equal(storeBook.file != null, response.data.file);
		assert.equal(false, response.data.in_library);
		assert.equal(false, response.data.purchased);
	});

	it("should return hidden store book if the user is the author", async () => {
		let collection = constants.authorUser.author.collections[0];
		let storeBook = collection.books[1];
		let response;

		try{
			response = await axios.default({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.authorUser.jwt
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
		assert.equal(storeBook.price || 0, response.data.price);
		assert.equal("hidden", response.data.status);
		assert.equal(storeBook.cover != null, response.data.cover);
		assert.equal(storeBook.file != null, response.data.file);
		assert.equal(false, response.data.in_library);
		assert.equal(false, response.data.purchased);
	});

	it("should return hidden store book if the user is an admin", async () => {
		let collection = constants.authorUser.author.collections[0];
		let storeBook = collection.books[1];
		let response;

		try{
			response = await axios.default({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.davUser.jwt
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
		assert.equal(storeBook.price || 0, response.data.price);
		assert.equal("hidden", response.data.status);
		assert.equal(storeBook.cover != null, response.data.cover);
		assert.equal(storeBook.file != null, response.data.file);
		assert.equal(false, response.data.in_library);
		assert.equal(false, response.data.purchased);
	});

	it("should not return hidden store book if the user is not the author", async () => {
		let collection = constants.authorUser.author.collections[0];
		let storeBook = collection.books[1];

		try{
			await axios.default({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.davClassLibraryTestUser.jwt
				}
			})
		}catch(error){
			assert.equal(403, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(1102, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not return hidden store book without jwt", async () => {
		let collection = constants.authorUser.author.collections[0];
		let storeBook = collection.books[1];

		try{
			await axios.default({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', storeBook.uuid)
			});
		}catch(error){
			assert.equal(403, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(1102, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});
});