var assert = require('assert');
var axios = require('axios');
const path = require('path');
const fs = require('fs');
var constants = require('../constants');
var utils = require('../utils');

const setStoreBookCoverEndpointUrl = `${constants.apiBaseUrl}/api/1/call/store/book/{0}/cover`;
var resetStoreBooksAndStoreBookCovers = false;

afterEach(async () => {
	if(resetStoreBooksAndStoreBookCovers){
		await utils.resetStoreBooks();
		await utils.resetStoreBookCovers();
		resetStoreBooksAndStoreBookCovers = false;
	}
});

describe("SetStoreBookCover endpoint", () => {
	it("should not set store book cover without jwt", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setStoreBookCoverEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid)
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2101, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not set store book cover with invalid jwt", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setStoreBookCoverEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: "blablabla",
					'Content-Type': 'image/png'
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

	it("should not set store book cover if jwt is for another app", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setStoreBookCoverEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: constants.davClassLibraryTestUserTestAppJWT,
					'Content-Type': 'image/jpeg'
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

	it("should not set store book cover without supported image content type", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setStoreBookCoverEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
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

	it("should not set store book cover for store book that does not exist", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setStoreBookCoverEndpointUrl.replace('{0}', "blablabla"),
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'image/png'
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

	it("should not set store book cover for store book that does not belong to the author", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setStoreBookCoverEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'image/jpeg'
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

	it("should not set store book cover for published store book", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setStoreBookCoverEndpointUrl.replace('{0}', constants.authorUser.author.collections[1].books[1].uuid),
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'image/png'
				},
				data: "Hello World"
			});
		}catch(error){
			assert.equal(422, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(1503, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not set store book cover for hidden store book", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setStoreBookCoverEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[1].uuid),
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'image/png'
				},
				data: "Hello World"
			});
		}catch(error){
			assert.equal(422, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(1503, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should create and update store book cover", async () => {
		await testCreateAndUpdateStoreBookCover(constants.authorUser.author.collections[2].books[0], constants.authorUser.jwt);

		// Tidy up
		resetStoreBooksAndStoreBookCovers = true;
	});

	it("should not set store book cover for published store book of admin", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setStoreBookCoverEndpointUrl.replace('{0}', constants.davUser.authors[0].collections[0].books[0].uuid),
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'image/png'
				},
				data: "Hello World"
			});
		}catch(error){
			assert.equal(422, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(1503, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not set store book cover for hidden store book of admin", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setStoreBookCoverEndpointUrl.replace('{0}', constants.davUser.authors[0].collections[1].books[0].uuid),
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'image/png'
				},
				data: "Hello World"
			});
		}catch(error){
			assert.equal(422, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(1503, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should create and update store book cover of store book of an admin", async () => {
		await testCreateAndUpdateStoreBookCover(constants.davUser.authors[0].collections[0].books[1], constants.davUser.jwt);

		// Tidy up
		resetStoreBooksAndStoreBookCovers = true;
	});

	async function testCreateAndUpdateStoreBookCover(storeBook, jwt){
		// Get the store book table object
		let getStoreBookObjResponse;

		try{
			getStoreBookObjResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${storeBook.uuid}`,
				headers: {
					Authorization: jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		// The store book should not have a cover
		assert.equal(null, getStoreBookObjResponse.data.properties.cover);

		// Upload the cover (1)
		let filePath = path.resolve(__dirname, '../files/cover.png');
		let firstFileContent = fs.readFileSync(filePath);
		let firstFileType = "image/png";
		let firstFileExt = "png";

		try{
			await axios.default({
				method: 'put',
				url: setStoreBookCoverEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: jwt,
					'Content-Type': firstFileType
				},
				data: firstFileContent
			});
		}catch(error){
			assert.fail();
		}

		// Get the store book table object
		let getStoreBookObjResponse2;

		try{
			getStoreBookObjResponse2 = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${storeBook.uuid}`,
				headers: {
					Authorization: jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		// The store book should now have a cover
		let coverUuid = getStoreBookObjResponse2.data.properties.cover;
		assert(coverUuid != null);

		// Get the cover table object file (1)
		let getCoverFileObjResponse;

		try{
			getCoverFileObjResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${coverUuid}`,
				params: {
					file: true
				},
				headers: {
					Authorization: jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(getCoverFileObjResponse.data, firstFileContent);

		// Get the cover table object (1)
		let getCoverObjResponse;

		try{
			getCoverObjResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${coverUuid}`,
				headers: {
					Authorization: jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(firstFileType, getCoverObjResponse.data.properties.type);
		assert.equal(firstFileExt, getCoverObjResponse.data.properties.ext);

		// Update the cover (2)
		let secondFileType = "image/jpeg";
		let secondFileExt = "jpg";
		let secondFileContent = "Labore dicta cupiditate culpa cum harum. Corporis voluptatem debitis eos nam nisi esse in vitae. Molestiae rerum nesciunt sunt sed et dolorum.";

		try{
			await axios.default({
				method: 'put',
				url: setStoreBookCoverEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: jwt,
					'Content-Type': secondFileType
				},
				data: secondFileContent
			});
		}catch(error){
			assert.fail();
		}

		// Get the cover table object file (2)
		let getCoverFileObjResponse2;

		try{
			getCoverFileObjResponse2 = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${coverUuid}`,
				params: {
					file: true
				},
				headers: {
					Authorization: jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(getCoverFileObjResponse2.data, secondFileContent);

		// Get the cover table object (2)
		let getCoverObjResponse2;

		try{
			getCoverObjResponse2 = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${coverUuid}`,
				headers: {
					Authorization: jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(secondFileType, getCoverObjResponse2.data.properties.type);
		assert.equal(secondFileExt, getCoverObjResponse2.data.properties.ext);
	}
});