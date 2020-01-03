var assert = require('assert');
var axios = require('axios');
var constants = require("../constants");
var utils = require('../utils');

const getStoreBookFileEndpointUrl = `${constants.apiBaseUrl}/api/1/call/store/book/{0}/file`;

beforeEach(async () => {
	await utils.resetStoreBooks();
});

describe("GetStoreBookFile endpoint", () => {
	it("should not return store book file without jwt", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getStoreBookFileEndpointUrl.replace('{0}', constants.authorUserAuthor.books[1].uuid)
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
				url: getStoreBookFileEndpointUrl.replace('{0}', constants.authorUserAuthor.books[1].uuid),
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
				url: getStoreBookFileEndpointUrl.replace('{0}', constants.authorUserAuthor.books[1].uuid),
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

	it("should return store book file", async () => {
		let fileContent = "Lorem ipsum dolor sit amet";
		let contentType = "application/epub+zip";

		// Update the store book file
		try{
			await axios.default({
				method: 'put',
				url: getStoreBookFileEndpointUrl.replace('{0}', constants.authorUserAuthor.books[1].uuid),
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': contentType
				},
				data: fileContent
			});
		}catch(error){
			assert.fail();
		}

		// Get the store book file
		let getFileResponse;

		try{
			getFileResponse = await axios.default({
				method: 'get',
				url: getStoreBookFileEndpointUrl.replace('{0}', constants.authorUserAuthor.books[1].uuid),
				headers: {
					Authorization: constants.authorUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, getFileResponse.status);
		assert.equal(contentType, getFileResponse.headers['content-type']);
		assert.equal(fileContent, getFileResponse.data);
	});
});