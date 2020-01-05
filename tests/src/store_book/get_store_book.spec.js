var assert = require('assert');
var axios = require('axios');
var constants = require("../constants");
var utils = require('../utils');

const getStoreBookEndpointUrl = `${constants.apiBaseUrl}/api/1/call/store/book/{0}`;

beforeEach(async () => {
	await utils.resetDatabase();
});

describe("GetStoreBook endpoint", () => {
	it("should not return store book without jwt", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', constants.authorUserAuthor.books[0].uuid)
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2101, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not return store book if jwt is for another app", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', constants.authorUserAuthor.books[0].uuid),
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

	it("should not return store book if the store book does not exist", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', "blablabla"),
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

	it("should return store book", async () => {
		try{
			response = await axios.default({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', constants.authorUserAuthor.books[0].uuid),
				headers: {
					Authorization: constants.authorUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(constants.authorUserAuthor.books[0].uuid, response.data.uuid);
		assert.equal(constants.authorUserAuthor.books[0].title, response.data.title);
		assert.equal(constants.authorUserAuthor.books[0].description, response.data.description);
		assert.equal(constants.authorUserAuthor.books[0].language, response.data.language);
		assert.equal(false, response.data.cover);
		assert.equal(false, response.data.file);
		assert.equal("unpublished", response.data.status);
	});
});