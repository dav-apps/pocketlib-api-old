import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'
import * as utils from '../utils.js'

const createCategoryEndpointUrl = `${constants.apiBaseUrl}/api/1/call/store/category`
var resetCategories = false

afterEach(async () => {
	if(resetCategories){
		await utils.resetCategories()
		resetCategories = false
	}
})

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
			assert.equal(2111, error.response.data.errors[0].code);
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
					key: 12
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2213, error.response.data.errors[0].code);
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
					key: "a"
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2310, error.response.data.errors[0].code);
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
					key: "a".repeat(200)
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2410, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not create category with invalid key", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createCategoryEndpointUrl,
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					key: "hello world"
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2502, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not create category with key that is already used", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createCategoryEndpointUrl,
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					key: constants.categories[0].key
				}
			});
		}catch(error){
			assert.equal(422, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2601, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should create category", async () => {
		let response;
		let key = "test";

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
					key
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(201, response.status);
		assert(response.data.uuid != null);
		assert.equal(key, response.data.key);
		assert.equal(0, response.data.names);

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

		assert.equal(key, categoryObjResponse.data.properties.key);
		assert.equal(null, categoryObjResponse.data.properties.names);

		// Tidy up
		resetCategories = true;
	});
});