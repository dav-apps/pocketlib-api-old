var assert = require('assert');
var axios = require('axios');
var constants = require("../constants");

const getAuthorEndpointUrl = `${constants.apiBaseUrl}/api/1/call/author`;

describe("GetAuthorOfUser endpoint", () => {
	it("should not return author without jwt", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getAuthorEndpointUrl
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2101, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not return author if jwt is for another app", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getAuthorEndpointUrl,
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

	it("should not return author if the user is not an author", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getAuthorEndpointUrl,
				headers: {
					Authorization: constants.davUserJWT
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(1105, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should return the author", async () => {
		let response;

		try{
			response = await axios.default({
				method: 'get',
				url: getAuthorEndpointUrl,
				headers: {
					Authorization: constants.authorUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(constants.authorUserAuthor.uuid, response.data.uuid);
		assert.equal(constants.authorUserAuthor.firstName, response.data.first_name);
		assert.equal(constants.authorUserAuthor.lastName, response.data.last_name);
		assert.equal(constants.authorUserAuthor.bio, response.data.bio);

		assert.equal(1, response.data.books.length);
		assert.equal(constants.authorUserAuthor.books[0].uuid, response.data.books[0].uuid);
		assert.equal(constants.authorUserAuthor.books[0].title, response.data.books[0].title);
	});
});