var assert = require('assert');
var axios = require('axios');
var constants = require('../constants');
var utils = require('../utils');

const getCategoriesEndpointUrl = `${constants.apiBaseUrl}/api/1/call/store/categories`;

describe("GetCategories endpoint", async () => {
	it("should return categories", async () => {
		let response;

		try{
			response = await axios.default({
				method: 'get',
				url: getCategoriesEndpointUrl,
				headers: {
					Authorization: constants.davClassLibraryTestUser.jwt
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