var assert = require('assert');
var axios = require('axios');
const path = require('path');
const fs = require('fs');
var constants = require('../constants');
var utils = require('../utils');

const setStoreBookFileEndpointUrl = `${constants.apiBaseUrl}/api/1/call/store/book/{0}/file`;

beforeEach(async () => {
	await utils.resetStoreBooks();
});

describe("SetStoreBookFile endpoint", () => {
	it("should not set store book file without jwt", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setStoreBookFileEndpointUrl.replace('{0}', constants.authorUserAuthor.books[0].uuid)
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2101, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not set store book file with invalid jwt", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setStoreBookFileEndpointUrl.replace('{0}', constants.authorUserAuthor.books[0].uuid),
				headers: {
					Authorization: "blablabla",
					'Content-Type': 'application/pdf'
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

	it("should not set store book file without supported ebook content type", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setStoreBookFileEndpointUrl.replace('{0}', constants.authorUserAuthor.books[0].uuid),
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

	it("should not set store book file for store book that does not exist", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setStoreBookFileEndpointUrl.replace('{0}', "blablabla"),
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/pdf'
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

	it("should not set store book file for store book that does not belong to the author", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setStoreBookFileEndpointUrl.replace('{0}', constants.authorUserAuthor.books[0].uuid),
				headers: {
					Authorization: constants.davUserJWT,
					'Content-Type': 'application/epub+zip'
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

	it("should create store book file", async () => {
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

		// The store book should not have a file
		assert.equal(200, objResponse.status);
		assert.equal(null, objResponse.data.properties.file);

		// Read the ebook file and upload it
		let filePath = path.resolve(__dirname, '../files/animal_farm.pdf');
		let fileContent = fs.readFileSync(filePath);

		try{
			await axios.default({
				method: 'put',
				url: setStoreBookFileEndpointUrl.replace('{0}', constants.authorUserAuthor.books[0].uuid),
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/pdf'
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

		// The store book should not have a file
		assert.equal(200, objResponse2.status);
		assert(objResponse2.data.properties.file != null);

		// Get the file table object
		let objResponse3;

		try{
			objResponse3 = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${objResponse2.data.properties.file}`,
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

	it("should update store book file", async () => {
		// Update the cover
		let setStoreBookFileResponse;
		let firstFileContentType = "application/pdf";
		let firstFileExt = "pdf";

		try{
			setStoreBookFileResponse = await axios.default({
				method: 'put',
				url: setStoreBookFileEndpointUrl.replace('{0}', constants.authorUserAuthor.books[1].uuid),
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': firstFileContentType
				},
				data: "Labore dicta cupiditate culpa cum harum. Corporis voluptatem debitis eos nam nisi esse in vitae. Molestiae rerum nesciunt sunt sed et dolorum."
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, setStoreBookFileResponse.status);

		// Get the file of the store book
		let fileTableObjectResponse;

		try{
			fileTableObjectResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${constants.authorUserAuthor.books[1].file}`,
				headers: {
					Authorization: constants.authorUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}

		// Update the file a second time
		let setStoreBookFileResponse2;
		let secondFileContentType = "application/epub+zip";
		let secondFileExt = "epub";

		try{
			setStoreBookFileResponse2 = await axios.default({
				method: 'put',
				url: setStoreBookFileEndpointUrl.replace('{0}', constants.authorUserAuthor.books[1].uuid),
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': secondFileContentType
				},
				data: "Hello World"
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, setStoreBookFileResponse2.status);

		// Get the file table object
		let fileTableObjectResponse2;

		try{
			fileTableObjectResponse2 = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${constants.authorUserAuthor.books[1].file}`,
				headers: {
					Authorization: constants.authorUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(firstFileContentType, fileTableObjectResponse.data.properties.type);
		assert.equal(firstFileExt, fileTableObjectResponse.data.properties.ext);
		assert.equal(secondFileContentType, fileTableObjectResponse2.data.properties.type);
		assert.equal(secondFileExt, fileTableObjectResponse2.data.properties.ext);

		assert(fileTableObjectResponse.data.properties.size != fileTableObjectResponse2.data.properties.size);
		assert(fileTableObjectResponse.data.properties.etag != fileTableObjectResponse2.data.properties.etag);
	});
});