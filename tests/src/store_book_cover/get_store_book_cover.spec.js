var assert = require('assert');
var axios = require('axios');
var constants = require("../constants");

const getStoreBookCoverEndpointUrl = `${constants.apiBaseUrl}/api/1/call/store/book/{0}/cover`;

describe("GetStoreBookCover endpoint", () => {
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

	it("should return cover of unpublished store book", async () => {
		let storeBook = constants.authorUser.author.collections[1].books[0];
		await testShouldReturnCover(storeBook);
	});

	it("should return cover of store book in review", async () => {
		let storeBook = constants.authorUser.author.collections[0].books[0];
		await testShouldReturnCover(storeBook);
	});

	it("should return cover of published store book", async () => {
		let storeBook = constants.authorUser.author.collections[1].books[1];
		await testShouldReturnCover(storeBook);
	});

	it("should return cover of hidden store book", async () => {
		let storeBook = constants.authorUser.author.collections[0].books[1];
		await testShouldReturnCover(storeBook);
	});
});

async function testShouldReturnCover(storeBook){
	let response;

	try{
		response = await axios.default({
			method: 'get',
			url: getStoreBookCoverEndpointUrl.replace('{0}', storeBook.uuid)
		});
	}catch(error){
		assert.fail();
	}

	assert.equal(200, response.status);
	assert.equal(storeBook.cover.type, response.headers['content-type']);
	assert(response.data.length > 0);
}