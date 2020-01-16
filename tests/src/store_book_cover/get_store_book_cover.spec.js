var assert = require('assert');
var axios = require('axios');
var constants = require("../constants");
var utils = require('../utils');

const getStoreBookCoverEndpointUrl = `${constants.apiBaseUrl}/api/1/call/store/book/{0}/cover`;
var resetStoreBooksAndStoreBookCovers = false;

before(async () => {
	await utils.resetDatabase();
});

afterEach(async () => {
	if(resetStoreBooksAndStoreBookCovers){
		await utils.resetStoreBooks();
		await utils.resetStoreBookCovers();
		resetStoreBooksAndStoreBookCovers = false;
	}
});

describe("GetStoreBookCover endpoint", () => {
	it("should not return store book cover without jwt", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getStoreBookCoverEndpointUrl.replace('{0}', constants.authorUserAuthor.collections[0].books[0].uuid)
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
				url: getStoreBookCoverEndpointUrl.replace('{0}', constants.authorUserAuthor.collections[0].books[0].uuid),
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
				url: getStoreBookCoverEndpointUrl.replace('{0}', constants.authorUserAuthor.collections[0].books[0].uuid),
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
				url: getStoreBookCoverEndpointUrl.replace('{0}', constants.authorUserAuthor.collections[0].books[1].uuid),
				headers: {
					Authorization: constants.authorUserJWT
				}
			});
		}catch(error){
			assert.equal(404, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2806, error.response.data.errors[0].code);
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
					Authorization: constants.authorUserJWT
				}
			})
		}catch(error){
			assert.equal(404, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2805, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should return cover of unpublished store book if the user is the author", async () => {
		let collection = constants.authorUserAuthor.collections[1];
		let storeBook = collection.books[0];
		let coverContent = "Lorem ipsum dolor sit amet";
		let coverType = "image/png";

		// Set the store book cover
		await setStoreBookCover(storeBook.uuid, coverContent, coverType, constants.authorUserJWT);

		// Try to get the store book cover
		let response;

		try{
			response = await axios.default({
				method: 'get',
				url: getStoreBookCoverEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.authorUserJWT
				}
			})
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(coverType, response.headers['content-type']);
		assert.equal(coverContent, response.data);

		// Tidy up
		resetStoreBooksAndStoreBookCovers = true;
	});

	it("should return cover of unpublished store book if the user is an admin", async () => {
		let collection = constants.authorUserAuthor.collections[1];
		let storeBook = collection.books[0];
		let coverContent = "Lorem ipsum dolor sit amet";
		let coverType = "image/png";

		// Set the store book cover
		await setStoreBookCover(storeBook.uuid, coverContent, coverType, constants.authorUserJWT);

		// Try to get the store book cover
		let response;

		try{
			response = await axios.default({
				method: 'get',
				url: getStoreBookCoverEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.davUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(coverType, response.headers['content-type']);
		assert.equal(coverContent, response.data);

		// Tidy up
		resetStoreBooksAndStoreBookCovers = true;
	});

	it("should not return cover of unpublished store book if the user is not the author", async () => {
		let collection = constants.authorUserAuthor.collections[1];
		let storeBook = collection.books[0];
		let coverContent = "Lorem ipsum dolor sit amet";
		let coverType = "image/png";

		// Set the store book cover
		await setStoreBookCover(storeBook.uuid, coverContent, coverType, constants.authorUserJWT);

		// Try to get the store book cover
		try{
			await axios.default({
				method: 'get',
				url: getStoreBookCoverEndpointUrl.replace('{0}', storeBook.uuid),
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

		// Tidy up
		resetStoreBooksAndStoreBookCovers = true;
	});

	it("should return cover of store book in review if the user is the author", async () => {
		let collection = constants.authorUserAuthor.collections[0];
		let storeBook = collection.books[0];
		let coverContent = "Lorem ipsum dolor sit amet";
		let coverType = "image/png";

		// Set the store book cover
		await setStoreBookCover(storeBook.uuid, coverContent, coverType, constants.authorUserJWT);

		// Try to get the store book cover
		let response;

		try{
			response = await axios.default({
				method: 'get',
				url: getStoreBookCoverEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.authorUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(coverType, response.headers['content-type']);
		assert.equal(coverContent, response.data);

		// Tidy up
		resetStoreBooksAndStoreBookCovers = true;
	});

	it("should not return cover of store book in review if the user is not the author", async () => {
		let collection = constants.authorUserAuthor.collections[0];
		let storeBook = collection.books[0];
		let coverContent = "Lorem ipsum dolor sit amet";
		let coverType = "image/png";

		// Set the store book cover
		await setStoreBookCover(storeBook.uuid, coverContent, coverType, constants.authorUserJWT);

		// Try to get the store book cover
		try{
			await axios.default({
				method: 'get',
				url: getStoreBookCoverEndpointUrl.replace('{0}', storeBook.uuid),
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

		// Tidy up
		resetStoreBooksAndStoreBookCovers = true;
	});

	it("should return cover of store book in review if the user is an admin", async () => {
		let collection = constants.authorUserAuthor.collections[0];
		let storeBook = collection.books[0];
		let coverContent = "Lorem ipsum dolor sit amet";
		let coverType = "image/png";

		// Set the store book cover
		await setStoreBookCover(storeBook.uuid, coverContent, coverType, constants.authorUserJWT);

		// Try to get the store book cover
		let response;

		try{
			response = await axios.default({
				method: 'get',
				url: getStoreBookCoverEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.davUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(coverType, response.headers['content-type']);
		assert.equal(coverContent, response.data);

		// Tidy up
		resetStoreBooksAndStoreBookCovers = true;
	});

	it("should return cover of published store book if the user is the author", async () => {
		let collection = constants.davUserAuthors[0].collections[0];
		let storeBook = collection.books[0];
		let coverContent = "Lorem ipsum dolor sit amet";
		let coverType = "image/png";

		// Set the store book cover
		await setStoreBookCover(storeBook.uuid, coverContent, coverType, constants.davUserJWT);

		// Try to get the store book cover
		let response;

		try{
			response = await axios.default({
				method: 'get',
				url: getStoreBookCoverEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.davUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(coverType, response.headers['content-type']);
		assert.equal(coverContent, response.data);

		// Tidy up
		resetStoreBooksAndStoreBookCovers = true;
	});

	it("should return cover of published store book if the user is not the author", async () => {
		let collection = constants.davUserAuthors[0].collections[0];
		let storeBook = collection.books[0];
		let coverContent = "Lorem ipsum dolor sit amet";
		let coverType = "image/png";

		// Set the store book cover
		await setStoreBookCover(storeBook.uuid, coverContent, coverType, constants.davUserJWT);

		// Try to get the store book cover
		let response;

		try{
			response = await axios.default({
				method: 'get',
				url: getStoreBookCoverEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.authorUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(coverType, response.headers['content-type']);
		assert.equal(coverContent, response.data);

		// Tidy up
		resetStoreBooksAndStoreBookCovers = true;
	});
});

async function setStoreBookCover(storeBookUuid, coverContent, coverType, authorJWT){
	try{
		await axios.default({
			method: 'put',
			url: getStoreBookCoverEndpointUrl.replace('{0}', storeBookUuid),
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