var assert = require('assert');
var axios = require('axios');
var constants = require("../constants");
var utils = require('../utils');

const getStoreBookFileEndpointUrl = `${constants.apiBaseUrl}/api/1/call/store/book/{0}/file`;

beforeEach(async () => {
	await utils.resetDatabase();
});

describe("GetStoreBookFile endpoint", () => {
	it("should not return store book file without jwt", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getStoreBookFileEndpointUrl.replace('{0}', constants.authorUserAuthor.collections[0].books[1].uuid)
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2101, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not return store book file with invalid jwt", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getStoreBookFileEndpointUrl.replace('{0}', constants.authorUserAuthor.collections[0].books[1].uuid),
				headers: {
					Authorization: "bkaasdasdfdasd"
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

	it("should not return store book file if jwt is for another app", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getStoreBookFileEndpointUrl.replace('{0}', constants.authorUserAuthor.collections[0].books[1].uuid),
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

	it("should not return store book file if the store book has no file", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getStoreBookFileEndpointUrl.replace('{0}', constants.authorUserAuthor.collections[0].books[1].uuid),
				headers: {
					Authorization: constants.authorUserJWT
				}
			});
		}catch(error){
			assert.equal(404, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2805, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not return store book file if the store book does not exist", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getStoreBookFileEndpointUrl.replace('{0}', "asdasdasdsda"),
				headers: {
					Authorization: constants.authorUserJWT
				}
			});
		}catch(error){
			assert.equal(404, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2803, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should return file of unpublished store book if the user is the author", async () => {
		let collection = constants.authorUserAuthor.collections[1];
		let storeBook = collection.books[0];
		let fileContent = "Lorem ipsum dolor sit amet";
		let fileType = "application/epub+zip";

		// Set the store book file
		await setStoreBookFile(storeBook.uuid, fileContent, fileType, constants.authorUserJWT);

		// Try to get the store book file
		let response;

		try{
			response = await axios.default({
				method: 'get',
				url: getStoreBookFileEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.authorUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(fileType, response.headers['content-type']);
		assert.equal(fileContent, response.data);
	});

	it("should return file of unpublished store book if the user is an admin", async () => {
		let collection = constants.authorUserAuthor.collections[1];
		let storeBook = collection.books[0];
		let fileContent = "Lorem ipsum dolor sit amet";
		let fileType = "application/epub+zip";

		// Set the store book file
		await setStoreBookFile(storeBook.uuid, fileContent, fileType, constants.authorUserJWT);

		// Try to get the store book file
		let response;

		try{
			response = await axios.default({
				method: 'get',
				url: getStoreBookFileEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.davUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(fileType, response.headers['content-type']);
		assert.equal(fileContent, response.data);
	});

	it("should not return file of unpublished store book if the user is not the author", async () => {
		let collection = constants.authorUserAuthor.collections[1];
		let storeBook = collection.books[0];
		let fileContent = "Lorem ipsum dolor sit amet";
		let fileType = "application/epub+zip";

		// Set the store book file
		await setStoreBookFile(storeBook.uuid, fileContent, fileType, constants.authorUserJWT);

		// Try to get the store book file
		try{
			await axios.default({
				method: 'get',
				url: getStoreBookFileEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.davClassLibraryTestUserJWT
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

	it("should return file of store book in review if the user is the author", async () => {
		let collection = constants.authorUserAuthor.collections[0];
		let storeBook = collection.books[0];
		let fileContent = "Lorem ipsum dolor sit amet";
		let fileType = "application/epub+zip";

		// Set the store book file
		await setStoreBookFile(storeBook.uuid, fileContent, fileType, constants.authorUserJWT);

		// Try to get the store book file
		let response;

		try{
			response = await axios.default({
				method: 'get',
				url: getStoreBookFileEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.authorUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(fileType, response.headers['content-type']);
		assert.equal(fileContent, response.data);
	});

	it("should not return file of store book in review if the user is not the author", async () => {
		let collection = constants.authorUserAuthor.collections[0];
		let storeBook = collection.books[0];
		let fileContent = "Lorem ipsum dolor sit amet";
		let fileType = "application/epub+zip";

		// Set the store book file
		await setStoreBookFile(storeBook.uuid, fileContent, fileType, constants.authorUserJWT);

		// Try to get the store book file
		try{
			await axios.default({
				method: 'get',
				url: getStoreBookFileEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.davClassLibraryTestUserJWT
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

	it("should return file of store book in review if the user is an admin", async () => {
		let collection = constants.authorUserAuthor.collections[0];
		let storeBook = collection.books[0];
		let fileContent = "Lorem ipsum dolor sit amet";
		let fileType = "application/epub+zip";

		// Set the store book file
		await setStoreBookFile(storeBook.uuid, fileContent, fileType, constants.authorUserJWT);

		// Try to get the store book file
		let response;

		try{
			response = await axios.default({
				method: 'get',
				url: getStoreBookFileEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.davUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(fileType, response.headers['content-type']);
		assert.equal(fileContent, response.data);
	});

	it("should return file of published store book if the user is the author", async () => {
		let collection = constants.davUserAuthors[0].collections[0];
		let storeBook = collection.books[0];
		let fileContent = "Lorem ipsum dolor sit amet";
		let fileType = "application/epub+zip";

		// Set the store book file
		await setStoreBookFile(storeBook.uuid, fileContent, fileType, constants.davUserJWT);

		// Try to get the store book file
		let response;

		try{
			response = await axios.default({
				method: 'get',
				url: getStoreBookFileEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.davUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(fileType, response.headers['content-type']);
		assert.equal(fileContent, response.data);
	});

	it("should not return file of published store book if the user is not the author", async () => {
		let collection = constants.davUserAuthors[0].collections[0];
		let storeBook = collection.books[0];
		let fileContent = "Lorem ipsum dolor sit amet";
		let fileType = "application/epub+zip";

		// Set the store book file
		await setStoreBookFile(storeBook.uuid, fileContent, fileType, constants.davUserJWT);

		// Try to get the store book file
		try{
			await axios.default({
				method: 'get',
				url: getStoreBookFileEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.authorUserJWT
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
});

async function setStoreBookFile(storeBookUuid, coverContent, coverType, authorJWT){
	try{
		await axios.default({
			method: 'put',
			url: getStoreBookFileEndpointUrl.replace('{0}', storeBookUuid),
			headers: {
				Authorization: authorJWT,
				'Content-Type': coverType
			},
			data: coverContent
		});
	}catch(error){
		assert.fail();
	}
}