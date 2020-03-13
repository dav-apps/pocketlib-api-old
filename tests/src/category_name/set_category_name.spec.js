var assert = require('assert');
var axios = require('axios');
var constants = require('../constants');
var utils = require('../utils');

const setCategoryNameEndpointUrl = `${constants.apiBaseUrl}/api/1/call/store/category/{0}/name/{1}`;
var resetCategoriesAndCategoryNames = false;

afterEach(async () => {
	if(resetCategoriesAndCategoryNames){
		await utils.resetCategories();
		await utils.resetCategoryNames();
		resetCategoriesAndCategoryNames = false;
	}
});

describe("SetCategoryName endpoint", () => {
	it("should not set category name without jwt", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setCategoryNameEndpointUrl.replace('{0}', constants.categories[0].uuid).replace('{1}', "en")
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2101, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not set category name with invalid jwt", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setCategoryNameEndpointUrl.replace('{0}', constants.categories[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: "asdasdasdas",
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

	it("should not set category name without content type json", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setCategoryNameEndpointUrl.replace('{0}', constants.categories[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/xml'
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

	it("should not set category name if jwt is for another app", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setCategoryNameEndpointUrl.replace('{0}', constants.categories[0].uuid).replace('{1}', "en"),
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

	it("should not set category name if the user is not an admin", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setCategoryNameEndpointUrl.replace('{0}', constants.categories[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: constants.authorUser.jwt,
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

	it("should not set category name without required properties", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setCategoryNameEndpointUrl.replace('{0}', constants.categories[0].uuid).replace('{1}', "en"),
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

	it("should not set category name with properties with wrong types", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setCategoryNameEndpointUrl.replace('{0}', constants.categories[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					name: false
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

	it("should not set category name with too short properties", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setCategoryNameEndpointUrl.replace('{0}', constants.categories[0].uuid).replace('{1}', "en"),
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

	it("should not set category name with too long properties", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setCategoryNameEndpointUrl.replace('{0}', constants.categories[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					name: "a".repeat(150)
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

	it("should not set category name for not supported language", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setCategoryNameEndpointUrl.replace('{0}', constants.categories[0].uuid).replace('{1}', "bla"),
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					name: "Hello World"
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(1107, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should create category name", async () => {
		// Create the category name
		let response;
		let category = constants.categories[1];
		let language = "fr";
		let name = "Hello World!";
		let jwt = constants.davUser.jwt;

		try{
			response = await axios.default({
				method: 'put',
				url: setCategoryNameEndpointUrl.replace('{0}', category.uuid).replace('{1}', language),
				headers: {
					Authorization: jwt,
					'Content-Type': 'application/json'
				},
				data: {
					name
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(name, response.data.name);
		assert.equal(language, response.data.language);

		// Check if the data was correctly saved on the server
		// Get the category table object
		let categoryObjResponse;

		try{
			categoryObjResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${category.uuid}`,
				headers: {
					Authorization: jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		let responseCategoryNames = categoryObjResponse.data.properties.names;
		let responseCategoryNameUuids = responseCategoryNames.split(',');

		let categoryNameUuids = [];
		category.names.forEach(name => categoryNameUuids.push(name.uuid));
		categoryNameUuids.push(responseCategoryNameUuids[responseCategoryNameUuids.length - 1]);
		let categoryNames = categoryNameUuids.join(',');

		assert.equal(categoryNameUuids.length, responseCategoryNameUuids.length);
		assert.equal(categoryNames, responseCategoryNames);

		// Get the category name table object
		let categoryNameObjResponse;
		let newCategoryNameUuid = responseCategoryNameUuids[responseCategoryNameUuids.length - 1];

		try{
			categoryNameObjResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${newCategoryNameUuid}`,
				headers: {
					Authorization: jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(newCategoryNameUuid, categoryNameObjResponse.data.uuid);
		assert.equal(name, categoryNameObjResponse.data.properties.name);
		assert.equal(language, categoryNameObjResponse.data.properties.language);

		// Tidy up
		resetCategoriesAndCategoryNames = true;
	});

	it("should update category name", async () => {
		// Update the category name
		let response;
		let category = constants.categories[1];
		let language = "en";
		let name = "Updated name";
		let categoryNameUuid = category.names[0].uuid;
		let jwt = constants.davUser.jwt;

		try{
			response = await axios.default({
				method: 'put',
				url: setCategoryNameEndpointUrl.replace('{0}', category.uuid).replace('{1}', language),
				headers: {
					Authorization: jwt,
					'Content-Type': 'application/json'
				},
				data: {
					name
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(name, response.data.name);
		assert.equal(language, response.data.language);

		// Check if the data was correctly updated on the server
		// Get the category
		let categoryObjResponse;

		try{
			categoryObjResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${category.uuid}`,
				headers: {
					Authorization: jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		let responseCategoryNames = categoryObjResponse.data.properties.names;
		let responseCategoryNameUuids = responseCategoryNames.split(',');

		let categoryNameUuids = [];
		category.names.forEach(name => categoryNameUuids.push(name.uuid));
		let categoryNames = categoryNameUuids.join(',');

		assert.equal(categoryNameUuids.length, responseCategoryNameUuids.length);
		assert.equal(categoryNames, responseCategoryNames);

		// Get the category name table object
		let categoryNameObjResponse;

		try{
			categoryNameObjResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${categoryNameUuid}`,
				headers: {
					Authorization: jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(categoryNameUuid, categoryNameObjResponse.data.uuid);
		assert.equal(name, categoryNameObjResponse.data.properties.name);
		assert.equal(language, categoryNameObjResponse.data.properties.language);

		// Tidy up
		resetCategoriesAndCategoryNames = true;
	});
});