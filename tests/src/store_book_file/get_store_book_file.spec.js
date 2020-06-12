var assert = require('assert');
var axios = require('axios');
var constants = require("../constants");

const getStoreBookFileEndpointUrl = `${constants.apiBaseUrl}/api/1/call/store/book/{0}/file`;

describe("GetStoreBookFile endpoint", () => {
	it("should not return store book file without jwt", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getStoreBookFileEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[1].uuid)
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
				url: getStoreBookFileEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[1].uuid),
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
				url: getStoreBookFileEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[1].uuid),
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
				url: getStoreBookFileEndpointUrl.replace('{0}', constants.davUser.authors[0].collections[0].books[2].uuid),
				headers: {
					Authorization: constants.davUser.jwt
				}
			});
		}catch(error){
			assert.equal(404, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2809, error.response.data.errors[0].code);
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

	it("should return file of unpublished store book if the user is the author", async () => {
		let jwt = constants.authorUser.jwt;
		let storeBook = constants.authorUser.author.collections[1].books[0];

		await testShouldReturnFile(jwt, storeBook);
	});

	it("should return file of unpublished store book if the user is an admin", async () => {
		let jwt = constants.davUser.jwt;
		let storeBook = constants.authorUser.author.collections[1].books[0];

		await testShouldReturnFile(jwt, storeBook);
	});

	it("should not return file of unpublished store book if the user is not the author", async () => {
		let jwt = constants.davClassLibraryTestUser.jwt;
		let storeBook = constants.authorUser.author.collections[1].books[0];

		await testShouldNotReturnFile(jwt, storeBook);
	});

	it("should not return file of unpublished store book if the user is on dav Pro", async () => {
		let jwt = constants.klausUser.jwt;
		let storeBook = constants.authorUser.author.collections[1].books[0];

		await testShouldNotReturnFile(jwt, storeBook);
	});

	it("should return file of store book in review if the user is the author", async () => {
		let jwt = constants.authorUser.jwt;
		let storeBook = constants.authorUser.author.collections[0].books[0];

		await testShouldReturnFile(jwt, storeBook);
	});

	it("should return file of store book in review if the user is an admin", async () => {
		let jwt = constants.davUser.jwt;
		let storeBook = constants.authorUser.author.collections[0].books[0];

		await testShouldReturnFile(jwt, storeBook);
	});

	it("should not return file of store book in review if the user is not the author", async () => {
		let jwt = constants.davClassLibraryTestUser.jwt;
		let storeBook = constants.authorUser.author.collections[0].books[0];

		await testShouldNotReturnFile(jwt, storeBook);
	});

	it("should not return file of store book in review if the user is on dav Pro", async () => {
		let jwt = constants.klausUser.jwt;
		let storeBook = constants.authorUser.author.collections[0].books[0];

		await testShouldNotReturnFile(jwt, storeBook);
	});

	it("should return file of published store book if the user is the author", async () => {
		let jwt = constants.authorUser.jwt;
		let storeBook = constants.authorUser.author.collections[1].books[1];

		await testShouldReturnFile(jwt, storeBook);
	});

	it("should return file of published store book if the user is an admin", async () => {
		let jwt = constants.davUser.jwt;
		let storeBook = constants.authorUser.author.collections[1].books[1];

		await testShouldReturnFile(jwt, storeBook);
	});

	it("should not return file of published store book if the user is not the author", async () => {
		let jwt = constants.davClassLibraryTestUser.jwt;
		let storeBook = constants.authorUser.author.collections[1].books[1];

		await testShouldNotReturnFile(jwt, storeBook);
	});

	it("should not return file of published store book if the user is on dav Pro", async () => {
		let jwt = constants.klausUser.jwt;
		let storeBook = constants.authorUser.author.collections[1].books[1];

		await testShouldNotReturnFile(jwt, storeBook);
	});

	it("should return file of published store book if the user is on dav Pro and has the StoreBook in the library", async () => {
		let jwt = constants.klausUser.jwt;
		let storeBook = constants.davUser.authors[0].collections[0].books[0];

		await testShouldReturnFile(jwt, storeBook);
	});

	it("should return file of hidden store book if the user is the author", async () => {
		let jwt = constants.authorUser.jwt;
		let storeBook = constants.authorUser.author.collections[0].books[1];

		await testShouldReturnFile(jwt, storeBook);
	});

	it("should return file of hidden store book if the user is an admin", async () => {
		let jwt = constants.davUser.jwt;
		let storeBook = constants.authorUser.author.collections[0].books[1];

		await testShouldReturnFile(jwt, storeBook);
	});

	it("should not return file of hidden store book if the user is not the author", async () => {
		let jwt = constants.davClassLibraryTestUser.jwt;
		let storeBook = constants.authorUser.author.collections[0].books[1];

		await testShouldNotReturnFile(jwt, storeBook);
	});

	it("should not return file of hidden store book if the user is on dav Pro", async () => {
		let jwt = constants.klausUser.jwt;
		let storeBook = constants.authorUser.author.collections[0].books[1];

		await testShouldNotReturnFile(jwt, storeBook);
	});
});

async function testShouldReturnFile(jwt, storeBook){
	let response;

	try{
		response = await axios.default({
			method: 'get',
			url: getStoreBookFileEndpointUrl.replace('{0}', storeBook.uuid),
			headers: {
				Authorization: jwt
			}
		});
	}catch(error){
		assert.fail();
	}

	assert.equal(200, response.status);
	assert.equal(storeBook.file.type, response.headers['content-type']);
	assert(response.data.length > 0);
}

async function testShouldNotReturnFile(jwt, storeBook){
	try{
		await axios.default({
			method: 'get',
			url: getStoreBookFileEndpointUrl.replace('{0}', storeBook.uuid),
			headers: {
				Authorization: jwt
			}
		});
	}catch(error){
		assert.equal(403, error.response.status);
		assert.equal(1, error.response.data.errors.length);
		assert.equal(1102, error.response.data.errors[0].code);
		return;
	}

	assert.fail();
}