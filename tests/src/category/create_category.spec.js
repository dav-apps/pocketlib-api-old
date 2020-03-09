var assert = require('assert');
var axios = require('axios');
var constants = require('../constants');
var utils = require('../utils');

const createCategoryEndpointUrl = `${constants.apiBaseUrl}/api/1/call/store/category`;
var resetCategories = false;

before(async () => {
	await utils.resetDatabase();
});

afterEach(async () => {
	if(resetCategories){
		await utils.resetCategories();
		await utils.resetCategoryNames();
		resetCategories = false;
	}
});

describe("CreateCategory endpoint", () => {
	it("should not create category without jwt", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createCategoryEndpointUrl
			})
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2101, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not create category with invalid jwt", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createCategoryEndpointUrl,
				headers: {
					Authorization: "asdasdasad",
					'Content-Type': 'application/json'
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

	it("should not create category without content type json", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createCategoryEndpointUrl,
				headers: {
					Authorization: constants.davUser.jwt
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

	it("should not create category if jwt is for another app", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createCategoryEndpointUrl,
				headers: {
					Authorization: constants.davClassLibraryTestUserTestAppJWT,
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

	it("should not create category if the user is not an admin", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createCategoryEndpointUrl,
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					name: "Test"
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

	it("should not create category without required properties", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createCategoryEndpointUrl,
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2108, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not create category with properties with wrong types", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createCategoryEndpointUrl,
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					name: 12
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2209, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not create category with too short properties", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createCategoryEndpointUrl,
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					name: "a"
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2307, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not create category with too long properties", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createCategoryEndpointUrl,
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					name: "a".repeat(200)
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2407, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should create category", async () => {
		let response;
		let name = "TestCategory";
		let language = "en";

		// Create the category
		try{
			response = await axios.default({
				method: 'post',
				url: createCategoryEndpointUrl,
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					name
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(201, response.status);
		assert(response.data.uuid != null);
		assert.equal(1, response.data.names.length);
		assert.equal(name, response.data.names[0].name);
		assert.equal(language, response.data.names[0].language);

		// Check if the data was correctly saved on the server
		// Get the Category table object
		let categoryObjResponse;

		try{
			categoryObjResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${response.data.uuid}`,
				headers: {
					Authorization: constants.davUser.jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		assert(categoryObjResponse.data.properties.names != null);

		// Get the CategoryName table object
		let categoryNameObjResponse;

		try{
			categoryNameObjResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${categoryObjResponse.data.properties.names}`,
				headers: {
					Authorization: constants.davUser.jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(categoryObjResponse.data.properties.names, categoryNameObjResponse.data.uuid);
		assert.equal(name, categoryNameObjResponse.data.properties.name);
		assert.equal(language, categoryNameObjResponse.data.properties.language);

		// Tidy up
		resetCategories = true;
	});
});