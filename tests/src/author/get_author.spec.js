var assert = require('assert');
var axios = require('axios');
var constants = require("../constants");
var utils = require("../utils");

const getAuthorEndpointUrl = `${constants.apiBaseUrl}/api/1/call/author/{0}`;

before(async () => {
	await utils.resetDatabase();
});

describe("GetAuthor endpoint", async () => {
	it("should not return author that does not exist", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getAuthorEndpointUrl.replace('{0}', "asdasdasd")
			});
		}catch(error){
			assert.equal(404, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2803, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not return author if the table object is not an author", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getAuthorEndpointUrl.replace('{0}', constants.davUser.authors[0].bios[0].uuid)
			});
		}catch(error){
			assert.equal(403, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(1102, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should return author", async () => {
		await testGetAuthor(constants.authorUser.author);
	});

	it("should return author of admin", async () => {
		await testGetAuthor(constants.davUser.authors[0]);
	});

	async function testGetAuthor(author){
		let response;

		try{
			response = await axios.default({
				method: 'get',
				url: getAuthorEndpointUrl.replace('{0}', author.uuid)
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(author.uuid, response.data.uuid);
		assert.equal(author.firstName, response.data.first_name);
		assert.equal(author.lastName, response.data.last_name);
		assert.equal(author.bios.length, response.data.bios.length);
		assert.equal(author.collections.length, response.data.collections.length);
		assert.equal(author.profileImage != null, response.data.profile_image);

		for(let i = 0; i < author.bios.length; i++){
			let bio = author.bios[i];
			let responseBio = response.data.bios[i];

			assert.equal(null, responseBio.uuid);
			assert.equal(bio.bio, responseBio.bio);
			assert.equal(bio.language, responseBio.language);
		}

		for(let i = 0; i < author.collections.length; i++){
			let collection = author.collections[i];
			let responseCollection = response.data.collections[i];

			assert.equal(collection.uuid, responseCollection.uuid);

			for(let j = 0; j < collection.names.length; j++){
				let name = collection.names[j];
				let responseName = responseCollection.names[j];

				assert.equal(null, responseName.uuid);
				assert.equal(name.name, responseName.name);
				assert.equal(name.language, responseName.language);
			}
		}
	}
});