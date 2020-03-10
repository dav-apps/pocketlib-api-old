var assert = require('assert');
var axios = require('axios');
var constants = require('../constants');
var utils = require('../utils');

const getCategoriesEndpointUrl = `${constants.apiBaseUrl}/api/1/call/store/categories`;

before(async () => {
	await utils.resetDatabase();
});

describe("GetCategories endpoint", async () => {
	it("should not return categories without jwt", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getCategoriesEndpointUrl
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2101, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not return categories with invalid jwt", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getCategoriesEndpointUrl,
				headers: {
					Authorization: "asdasdasdasdasd"
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

	it("should not return categories if jwt is for another app", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getCategoriesEndpointUrl,
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

	it("should return categories", async () => {
		let response;

		try{
			response = await axios.default({
				method: 'get',
				url: getCategoriesEndpointUrl,
				headers: {
					Authorization: constants.davClassLibraryTestUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);

		let i = 0;
		for(let category of constants.categories){
			assert.equal(category.uuid, response.data.categories[i].uuid);
			assert.equal(category.key, response.data.categories[i].key);

			let j = 0;
			for(let categoryName of category.names){
				assert.equal(categoryName.name, response.data.categories[i].names[j].name);
				assert.equal(categoryName.language, response.data.categories[i].names[j].language);

				j++;
			}

			i++;
		}
	});
});