var assert = require('assert');
var axios = require('axios');
var constants = require("../constants");
var utils = require('../utils');

const getStoreBookCoverEndpointUrl = `${constants.apiBaseUrl}/api/1/call/store/book/{0}/cover`;

beforeEach(async () => {
	await utils.resetDatabase();
});

describe("GetStoreBookCover endpoint", () => {
	it("should not return store book cover without jwt", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getStoreBookCoverEndpointUrl.replace('{0}', constants.authorUserAuthor.books[1].uuid)
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2101, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not return store book cover with invalid jwt", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getStoreBookCoverEndpointUrl.replace('{0}', constants.authorUserAuthor.books[1].uuid),
				headers: {
					Authorization: "nlablablalsasd"
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

	it("should not return store book cover if jwt is for another app", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getStoreBookCoverEndpointUrl.replace('{0}', constants.authorUserAuthor.books[1].uuid),
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

	it("should return store book cover", async () => {
		let coverContent = "Lorem ipsum dolor sit amet";
		let contentType = "image/png";

		// Update the store book cover
		try{
			await axios.default({
				method: 'put',
				url: getStoreBookCoverEndpointUrl.replace('{0}', constants.authorUserAuthor.books[1].uuid),
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': contentType
				},
				data: coverContent
			});
		}catch(error){
			assert.fail();
		}

		// Get the store book cover
		let getCoverResponse;

		try{
			getCoverResponse = await axios.default({
				method: 'get',
				url: getStoreBookCoverEndpointUrl.replace('{0}', constants.authorUserAuthor.books[1].uuid),
				headers: {
					Authorization: constants.authorUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, getCoverResponse.status);
		assert.equal(contentType, getCoverResponse.headers['content-type']);
		assert.equal(coverContent, getCoverResponse.data);
	});
});