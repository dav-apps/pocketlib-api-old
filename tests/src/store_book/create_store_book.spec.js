var assert = require('assert');
var axios = require('axios');
var constants = require('../constants');
var utils = require('../utils');

const createStoreBookEndpointUrl = `${constants.apiBaseUrl}/api/1/call/store/book`;

beforeEach(async () => {
	await utils.resetStoreBooks();
});

afterEach(async () => {
	await utils.resetStoreBooks();
});

describe("CreateStoreBook endpoint", () => {
	it("should not create store book without jwt", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2101, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not create store book without content type json", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUserJWT
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

	it("should not create store book if jwt is for another app", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.davClassLibraryTestUserJWT,
					'Content-Type': 'application/json'
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

	it("should not create store book without required properties", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/json'
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(2, error.response.data.errors.length);
			assert.equal(2105, error.response.data.errors[0].code);
			assert.equal(2106, error.response.data.errors[1].code);
			return;
		}

		assert.fail();
	});

	it("should not create store book with properties with wrong types", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					title: false,
					language: 23
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(2, error.response.data.errors.length);
			assert.equal(2204, error.response.data.errors[0].code);
			assert.equal(2206, error.response.data.errors[1].code);
			return;
		}

		assert.fail();
	});

	it("should not create store book with optional properties with wrong types", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					title: 12,
					description: true,
					language: false
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(3, error.response.data.errors.length);
			assert.equal(2204, error.response.data.errors[0].code);
			assert.equal(2205, error.response.data.errors[1].code);
			assert.equal(2206, error.response.data.errors[2].code);
			return;
		}

		assert.fail();
	});

	it("should not create store book with too short properties", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					title: "a",
					language: "en"
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2304, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not create store book with too short optional properties", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					title: "a",
					description: "a",
					language: "en"
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(2, error.response.data.errors.length);
			assert.equal(2304, error.response.data.errors[0].code);
			assert.equal(2305, error.response.data.errors[1].code);
			return;
		}

		assert.fail();
	});

	it("should not create store book with too long properties", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					title: "a".repeat(50),
					language: "en"
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2404, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not create store book with too long optional properties", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					title: "a".repeat(50),
					description: "a".repeat(2010),
					language: "de"
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(2, error.response.data.errors.length);
			assert.equal(2404, error.response.data.errors[0].code);
			assert.equal(2405, error.response.data.errors[1].code);
			return;
		}

		assert.fail();
	});

	it("should not create store book with not supported language", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					title: "Hello World",
					language: "blabla"
				}
			})
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(1106, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not create store book if the user is not an author", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.davUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					title: "Hello World",
					language: "de"
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

	it("should create store book", async () => {
		let title = "Hello World";
		let language = "de";
		let response;

		try{
			response = await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					title,
					language
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(201, response.status);
		assert(response.data.uuid != null);
		assert.equal(title, response.data.title);
		assert.equal(null, response.data.description);
		assert.equal(language, response.data.language);

		// Check if the data was correctly saved in the database
		// Get the author
		let authorObjResponse;
		try{
			authorObjResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${constants.authorUserAuthor.uuid}`,
				headers: {
					Authorization: constants.authorUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}
		
		assert.equal([constants.authorUserAuthor.books[0].uuid, response.data.uuid].join(','), authorObjResponse.data.properties.books);
		
		// Get the store book
		let storeBookObjResponse;
		try{
			storeBookObjResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${response.data.uuid}`,
				headers: {
					Authorization: constants.authorUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(response.data.uuid, storeBookObjResponse.data.uuid);
		assert.equal(title, storeBookObjResponse.data.properties.title);
		assert.equal(language, storeBookObjResponse.data.properties.language);
		assert.equal(constants.authorUserAuthor.uuid, storeBookObjResponse.data.properties.author);
	});

	it("should create store book with optional properties", async () => {
		let title = "Hello World";
		let description = "Hello World";
		let language = "en";
		let response;

		try{
			response = await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					title,
					description,
					language
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(201, response.status);
		assert(response.data.uuid != null);
		assert.equal(title, response.data.title);
		assert.equal(description, response.data.description);
		assert.equal(language, response.data.language);

		// Check if the data was correctly saved in the database
		// Get the author
		let authorObjResponse;
		try{
			authorObjResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${constants.authorUserAuthor.uuid}`,
				headers: {
					Authorization: constants.authorUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal([constants.authorUserAuthor.books[0].uuid, response.data.uuid].join(','), authorObjResponse.data.properties.books);

		// Get the store book
		let storeBookObjResponse;
		try{
			storeBookObjResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${response.data.uuid}`,
				headers: {
					Authorization: constants.authorUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(response.data.uuid, storeBookObjResponse.data.uuid);
		assert.equal(title, storeBookObjResponse.data.properties.title);
		assert.equal(description, storeBookObjResponse.data.properties.description);
		assert.equal(language, storeBookObjResponse.data.properties.language);
		assert.equal(constants.authorUserAuthor.uuid, storeBookObjResponse.data.properties.author);
	});
});