var assert = require('assert');
var axios = require('axios');
var constants = require("../constants");
var utils = require("../utils");

const getAuthorOfUserEndpointUrl = `${constants.apiBaseUrl}/api/1/call/author`;

before(async () => {
	await utils.resetDatabase();
});

describe("GetAuthorOfUser endpoint", () => {
	it("should not return author without jwt", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getAuthorOfUserEndpointUrl
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2101, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not return author with invalid jwt", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getAuthorOfUserEndpointUrl,
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

	it("should not return author if jwt is for another app", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getAuthorOfUserEndpointUrl,
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

	it("should not return author if the user is not an author", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getAuthorOfUserEndpointUrl,
				headers: {
					Authorization: constants.davClassLibraryTestUserJWT
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

	it("should return the author", async () => {
		let response;

		try{
			response = await axios.default({
				method: 'get',
				url: getAuthorOfUserEndpointUrl,
				headers: {
					Authorization: constants.authorUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(constants.authorUserAuthor.uuid, response.data.uuid);
		assert.equal(constants.authorUserAuthor.firstName, response.data.first_name);
		assert.equal(constants.authorUserAuthor.lastName, response.data.last_name);
		assert.equal(constants.authorUserAuthor.bio, response.data.bio);
		assert.equal(constants.authorUserAuthor.collections.length, response.data.collections.length);

		for(let i = 0; i < constants.authorUserAuthor.collections.length; i++){
			let collection = constants.authorUserAuthor.collections[i];
			let responseCollection = response.data.collections[i];

			assert.equal(collection.uuid, responseCollection.uuid);

			for(let j = 0; j < collection.names.length; j++){
				let name = collection.names[j];
				let responseName = responseCollection.names[j];

				assert.equal(name.name, responseName.name);
				assert.equal(name.language, responseName.language);
			}
		}
	});

	it("should return all authors of the user if the user is an admin", async () => {
		let response;

		try{
			response = await axios.default({
				method: 'get',
				url: getAuthorOfUserEndpointUrl,
				headers: {
					Authorization: constants.davUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		
		for(let i = 0; i < constants.davUserAuthors.length; i++){
			let author = constants.davUserAuthors[i];
			let responseAuthor = response.data.authors[i];

			assert.equal(author.uuid, responseAuthor.uuid);
			assert.equal(author.firstName, responseAuthor.first_name);
			assert.equal(author.lastName, responseAuthor.last_name);
			assert.equal(author.bio, responseAuthor.bio);
			assert.equal(author.collections.length, responseAuthor.collections.length);

			for(let j = 0; j < author.collections.length; j++){
				let collection = author.collections[j];
				let responseCollection = responseAuthor.collections[j];

				assert.equal(collection.uuid, responseCollection.uuid);

				for(let k = 0; k < collection.names.length; k++){
					let name = collection.names[k];
					let responseName = responseCollection.names[k];

					assert.equal(name.name, responseName.name);
					assert.equal(name.language, responseName.language);
				}
			}
		}
	});
});