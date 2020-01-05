var assert = require('assert');
var axios = require('axios');
const path = require('path');
const fs = require('fs');
var constants = require('../constants');
var utils = require('../utils');

const setStoreBookCoverEndpointUrl = `${constants.apiBaseUrl}/api/1/call/store/book/{0}/cover`;

beforeEach(async () => {
	await utils.resetDatabase();
});

describe("SetStoreBookCover endpoint", () => {
	it("should not set store book cover without jwt", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setStoreBookCoverEndpointUrl.replace('{0}', constants.authorUserAuthor.books[0].uuid)
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
				url: setStoreBookCoverEndpointUrl.replace('{0}', constants.authorUserAuthor.books[0].uuid),
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

	it("should not set store book cover without supported image content type", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setStoreBookCoverEndpointUrl.replace('{0}', constants.authorUserAuthor.books[0].uuid),
				headers: {
					Authorization: constants.authorUserJWT,
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
					Authorization: constants.authorUserJWT,
					'Content-Type': 'image/png'
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

	it("should not set store book cover for store book that does not belong to the author", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setStoreBookCoverEndpointUrl.replace('{0}', constants.authorUserAuthor.books[0].uuid),
				headers: {
					Authorization: constants.davUserJWT,
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

	it("should create store book cover", async () => {
		// Get the store book table object
		let objResponse;

		try{
			objResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${constants.authorUserAuthor.books[0].uuid}`,
				headers: {
					Authorization: constants.authorUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}

		// The store book should not have a cover
		assert.equal(200, objResponse.status);
		assert.equal(null, objResponse.data.properties.cover);

		// Read the cover file and upload it
		let filePath = path.resolve(__dirname, '../files/cover.png');
		let fileContent = fs.readFileSync(filePath);

		try{
			await axios.default({
				method: 'put',
				url: setStoreBookCoverEndpointUrl.replace('{0}', constants.authorUserAuthor.books[0].uuid),
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': 'image/png'
				},
				data: fileContent
			});
		}catch(error){
			assert.fail();
		}

		// Get the store book table object
		let objResponse2;

		try{
			objResponse2 = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${constants.authorUserAuthor.books[0].uuid}`,
				headers: {
					Authorization: constants.authorUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}

		// The store book should now have a cover
		assert.equal(200, objResponse2.status);
		assert(objResponse2.data.properties.cover != null)

		// Get the cover table object
		let objResponse3;

		try{
			objResponse3 = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${objResponse2.data.properties.cover}`,
				params: {
					file: true
				},
				headers: {
					Authorization: constants.authorUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, objResponse3.status);
		assert.equal(objResponse3.data, fileContent);
	});

	it("should update store book cover", async () => {
		// Update the cover
		let setStoreBookCoverResponse;
		let firstCoverContentType = "image/jpeg";
		let firstCoverExt = "jpg";

		try{
			setStoreBookCoverResponse = await axios.default({
				method: 'put',
				url: setStoreBookCoverEndpointUrl.replace('{0}', constants.authorUserAuthor.books[1].uuid),
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': firstCoverContentType
				},
				data: "Labore dicta cupiditate culpa cum harum. Corporis voluptatem debitis eos nam nisi esse in vitae. Molestiae rerum nesciunt sunt sed et dolorum."
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, setStoreBookCoverResponse.status);

		// Get the cover of the store book
		let coverTableObjectResponse;

		try{
			coverTableObjectResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${constants.authorUserAuthor.books[1].cover}`,
				headers: {
					Authorization: constants.authorUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}

		// Update the cover a second time
		let setStoreBookCoverResponse2;
		let secondCoverContentType = "image/png";
		let secondCoverExt = "png";

		try{
			setStoreBookCoverResponse2 = await axios.default({
				method: 'put',
				url: setStoreBookCoverEndpointUrl.replace('{0}', constants.authorUserAuthor.books[1].uuid),
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': secondCoverContentType
				},
				data: "Hello World"
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, setStoreBookCoverResponse2.status);

		// Get the cover table object
		let coverTableObjectResponse2;

		try{
			coverTableObjectResponse2 = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${constants.authorUserAuthor.books[1].cover}`,
				headers: {
					Authorization: constants.authorUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}
		
		assert.equal(firstCoverContentType, coverTableObjectResponse.data.properties.type);
		assert.equal(firstCoverExt, coverTableObjectResponse.data.properties.ext);
		assert.equal(secondCoverContentType, coverTableObjectResponse2.data.properties.type);
		assert.equal(secondCoverExt, coverTableObjectResponse2.data.properties.ext);
		
		assert(coverTableObjectResponse.data.properties.size != coverTableObjectResponse2.data.properties.size);
		assert(coverTableObjectResponse.data.properties.etag != coverTableObjectResponse2.data.properties.etag);
	});
});