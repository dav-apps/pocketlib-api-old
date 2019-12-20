var assert = require('assert');
var axios = require('axios');
var constants = require("../constants");

const createStoreBookEndpointUrl = `${constants.apiBaseUrl}/api/1/call/store/book`;

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
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2105, error.response.data.errors[0].code);
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
					title: false
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2204, error.response.data.errors[0].code);
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
					title: "a"
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
					title: "a".repeat(50)
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
					title: "Hello World"
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
					title
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(201, response.status);
		assert(response.data.uuid != null);
		assert.equal(title, response.data.title);
	});
});