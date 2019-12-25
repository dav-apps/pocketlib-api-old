var assert = require('assert');
var axios = require('axios');
var constants = require('../constants');
var utils = require('../utils');

const updateStoreBookEndpointUrl = `${constants.apiBaseUrl}/api/1/call/store/book/{0}`;

beforeEach(async () => {
	await utils.resetStoreBooks();
});

afterEach(async () => {
	await utils.resetStoreBooks();
});

describe("UpdateStoreBook endpoint", () => {
	it("should not update store book without jwt", async () => {
		try{
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', constants.authorUserAuthor.books[0].uuid)
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2101, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not update store book without content type json", async () => {
		try{
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', constants.authorUserAuthor.books[0].uuid),
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
			assert.equal(2803, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not update store book that does not belong to the author", async () => {
		try{
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', constants.authorUserAuthor.books[0].uuid),
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
				url: updateStoreBookEndpointUrl.replace('{0}', constants.authorUserAuthor.books[0].uuid),
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					title: 23,
					description: false
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(2, error.response.data.errors.length);
			assert.equal(2204, error.response.data.errors[0].code);
			assert.equal(2205, error.response.data.errors[1].code);
			return;
		}

		assert.fail();
	});

	it("should not update store book with too short properties", async () => {
		try{
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', constants.authorUserAuthor.books[0].uuid),
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
				url: updateStoreBookEndpointUrl.replace('{0}', constants.authorUserAuthor.books[0].uuid),
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					title: "a".repeat(40),
					description: "a".repeat(510)
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

	it("should update title of store book", async () => {
		let title = "Updated title";
		let response;

		try{
			response = await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', constants.authorUserAuthor.books[0].uuid),
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
		assert.equal(constants.authorUserAuthor.books[0].uuid, response.data.uuid);
		assert.equal(title, response.data.title);
		assert.equal(constants.authorUserAuthor.books[0].description, response.data.description);
	});

	it("should update description of store book", async () => {
		let description = "Updated description";
		let response;

		try{
			response = await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', constants.authorUserAuthor.books[0].uuid),
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
		assert.equal(constants.authorUserAuthor.books[0].uuid, response.data.uuid);
		assert.equal(constants.authorUserAuthor.books[0].title, response.data.title);
		assert.equal(description, response.data.description);
	});
});