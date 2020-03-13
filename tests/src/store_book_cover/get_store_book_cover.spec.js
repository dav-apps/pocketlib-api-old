var assert = require('assert');
var axios = require('axios');
var constants = require("../constants");
var utils = require('../utils');

const getStoreBookCoverEndpointUrl = `${constants.apiBaseUrl}/api/1/call/store/book/{0}/cover`;

describe("GetStoreBookCover endpoint", () => {
	it("should not return store book cover with invalid jwt", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getStoreBookCoverEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
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
				url: getStoreBookCoverEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
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

	it("should not return store book cover if the store book has no cover", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getStoreBookCoverEndpointUrl.replace('{0}', constants.davUser.authors[0].collections[0].books[1].uuid),
				headers: {
					Authorization: constants.davUser.jwt
				}
			});
		}catch(error){
			assert.equal(404, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2808, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not return store book cover if the store book does not exist", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getStoreBookCoverEndpointUrl.replace('{0}', "asdasdasdsad"),
				headers: {
					Authorization: constants.authorUser.jwt
				}
			})
		}catch(error){
			assert.equal(404, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2807, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should return cover of unpublished store book if the user is the author", async () => {
		let jwt = constants.authorUser.jwt;
		let storeBook = constants.authorUser.author.collections[1].books[0];

		await testShouldReturnCover(jwt, storeBook);
	});

	it("should return cover of unpublished store book if the user is an admin", async () => {
		let jwt = constants.davUser.jwt;
		let storeBook = constants.authorUser.author.collections[1].books[0];

		await testShouldReturnCover(jwt, storeBook);
	});

	it("should not return cover of unpublished store book if the user is not the author", async () => {
		let jwt = constants.davClassLibraryTestUserJWT;
		let storeBook = constants.authorUser.author.collections[1].books[0];

		await testShouldNotReturnCover(jwt, storeBook);
	});

	it("should not return cover of unpublished store book without jwt", async () => {
		let jwt = null;
		let storeBook = constants.authorUser.author.collections[1].books[0];

		await testShouldNotReturnCover(jwt, storeBook);
	});

	it("should return cover of store book in review if the user is the author", async () => {
		let jwt = constants.authorUser.jwt;
		let storeBook = constants.authorUser.author.collections[0].books[0];

		await testShouldReturnCover(jwt, storeBook);
	});

	it("should return cover of store book in review if the user is an admin", async () => {
		let jwt = constants.davUser.jwt;
		let storeBook = constants.authorUser.author.collections[0].books[0];

		await testShouldReturnCover(jwt, storeBook);
	});

	it("should not return cover of store book in review if the user is not the author", async () => {
		let jwt = constants.davClassLibraryTestUserJWT;
		let storeBook = constants.authorUser.author.collections[0].books[0];

		await testShouldNotReturnCover(jwt, storeBook);
	});

	it("should not return cover of store book in review without jwt", async () => {
		let jwt = null;
		let storeBook = constants.authorUser.author.collections[0].books[0];

		await testShouldNotReturnCover(jwt, storeBook);
	});

	it("should return cover of published store book if the user is the author", async () => {
		let jwt = constants.authorUser.jwt;
		let storeBook = constants.authorUser.author.collections[1].books[1];

		await testShouldReturnCover(jwt, storeBook);
	});

	it("should return cover of published store book if the user is an admin", async () => {
		let jwt = constants.davUser.jwt;
		let storeBook = constants.authorUser.author.collections[1].books[1];

		await testShouldReturnCover(jwt, storeBook);
	});

	it("should return cover of published store book if the user is not the author", async () => {
		let jwt = constants.davClassLibraryTestUserJWT;
		let storeBook = constants.authorUser.author.collections[1].books[1];

		await testShouldReturnCover(jwt, storeBook);
	});

	it("should return cover of published store book without jwt", async () => {
		let jwt = null;
		let storeBook = constants.authorUser.author.collections[1].books[1];

		await testShouldReturnCover(jwt, storeBook);
	});

	it("should return cover of hidden store book if the user is the author", async () => {
		let jwt = constants.authorUser.jwt;
		let storeBook = constants.authorUser.author.collections[0].books[1];

		await testShouldReturnCover(jwt, storeBook);
	});

	it("should return cover of hidden store book if the user is an admin", async () => {
		let jwt = constants.davUser.jwt;
		let storeBook = constants.authorUser.author.collections[0].books[1];

		await testShouldReturnCover(jwt, storeBook);
	});

	it("should not return cover of hidden store book if the user is not the author", async () => {
		let jwt = constants.davClassLibraryTestUserJWT;
		let storeBook = constants.authorUser.author.collections[0].books[1];

		await testShouldNotReturnCover(jwt, storeBook);
	});

	it("should not return cover of hidden store book without jwt", async () => {
		let jwt = null;
		let storeBook = constants.authorUser.author.collections[0].books[1];

		await testShouldNotReturnCover(jwt, storeBook);
	});
});

async function testShouldReturnCover(jwt, storeBook){
	let response;

	try{
		let options = {
			method: 'get',
			url: getStoreBookCoverEndpointUrl.replace('{0}', storeBook.uuid)
		}

		if(jwt){
			options.headers = {
				Authorization: jwt
			}
		}

		response = await axios.default(options);
	}catch(error){
		assert.fail();
	}

	assert.equal(200, response.status);
	assert.equal(storeBook.cover.type, response.headers['content-type']);
	assert(response.data.length > 0);
}

async function testShouldNotReturnCover(jwt, storeBook){
	try{
		let options = {
			method: 'get',
			url: getStoreBookCoverEndpointUrl.replace('{0}', storeBook.uuid)
		}

		if(jwt){
			options.headers = {
				Authorization: jwt
			}
		}
		
		await axios.default(options);
	}catch(error){
		assert.equal(403, error.response.status);
		assert.equal(1, error.response.data.errors.length);
		assert.equal(1102, error.response.data.errors[0].code);
		return;
	}

	assert.fail();
}