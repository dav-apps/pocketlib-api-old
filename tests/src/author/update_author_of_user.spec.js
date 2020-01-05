var assert = require('assert');
var axios = require('axios');
var constants = require('../constants');
var utils = require('../utils');

const updateAuthorEndpointUrl = `${constants.apiBaseUrl}/api/1/call/author`;

beforeEach(async () => {
	await utils.resetDatabase();
});

describe("UpdateAuthorOfUser endpoint", async () => {
	it("should not update author without jwt", async () => {
		try{
			await axios.default({
				method: 'put',
				url: updateAuthorEndpointUrl
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2101, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not update author with invalid jwt", async () => {
		try{
			await axios.default({
				method: 'put',
				url: updateAuthorEndpointUrl,
				headers: {
					Authorization: "blablabla",
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

	it("should not update author without content type json", async () => {
		try{
			await axios.default({
				method: 'put',
				url: updateAuthorEndpointUrl,
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

	it("should not update author if jwt is for another app", async () => {
		try{
			await axios.default({
				method: 'put',
				url: updateAuthorEndpointUrl,
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

	it("should not update author if the user is the first user", async () => {
		try{
			await axios.default({
				method: 'put',
				url: updateAuthorEndpointUrl,
				headers: {
					Authorization: constants.davUserJWT,
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

	it("should not update author if the user is not an author", async () => {
		try{
			await axios.default({
				method: 'put',
				url: updateAuthorEndpointUrl,
				headers: {
					Authorization: constants.davClassLibraryTestUserPocketLibJWT,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: "Blabla"
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

	it("should not update author with properties with wrong types", async () => {
		try{
			await axios.default({
				method: 'put',
				url: updateAuthorEndpointUrl,
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: 23,
					last_name: true,
					bio: 30.12
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(3, error.response.data.errors.length);
			assert.equal(2201, error.response.data.errors[0].code);
			assert.equal(2202, error.response.data.errors[1].code);
			assert.equal(2203, error.response.data.errors[2].code);
			return;
		}

		assert.fail();
	});

	it("should not update author with too short properties", async () => {
		try{
			await axios.default({
				method: 'put',
				url: updateAuthorEndpointUrl,
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: "a",
					last_name: "a",
					bio: "a"
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(3, error.response.data.errors.length);
			assert.equal(2301, error.response.data.errors[0].code);
			assert.equal(2302, error.response.data.errors[1].code);
			assert.equal(2303, error.response.data.errors[2].code);
			return;
		}

		assert.fail();
	});

	it("should not update author with too long properties", async () => {
		try{
			await axios.default({
				method: 'put',
				url: updateAuthorEndpointUrl,
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: "a".repeat(30),
					last_name: "a".repeat(30),
					bio: "a".repeat(2010)
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(3, error.response.data.errors.length);
			assert.equal(2401, error.response.data.errors[0].code);
			assert.equal(2402, error.response.data.errors[1].code);
			assert.equal(2403, error.response.data.errors[2].code);
			return;
		}

		assert.fail();
	});

	it("should update first_name of author", async () => {
		let firstName = "Updated name";
		let response;

		try{
			response = await axios.default({
				method: 'put',
				url: updateAuthorEndpointUrl,
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: firstName
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(constants.authorUserAuthor.uuid, response.data.uuid);
		assert.equal(firstName, response.data.first_name);
		assert.equal(constants.authorUserAuthor.lastName, response.data.last_name);
		assert.equal(constants.authorUserAuthor.bio, response.data.bio);

		// Check if the data was updated correctly on the server
		let objResponse;

		try{
			objResponse = await utils.getTableObject(constants.authorUserAuthor.uuid, constants.authorUserJWT);
		}catch(error){
			assert.fail();
		}

		assert.equal(constants.authorUserAuthor.uuid, objResponse.data.uuid);
		assert.equal(firstName, objResponse.data.properties.first_name);
		assert.equal(constants.authorUserAuthor.lastName, objResponse.data.properties.last_name);
		assert.equal(constants.authorUserAuthor.bio, objResponse.data.properties.bio);
	});

	it("should update last_name of author", async () => {
		let lastName = "Updated name";
		let response;

		try{
			response = await axios.default({
				method: 'put',
				url: updateAuthorEndpointUrl,
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					last_name: lastName
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(constants.authorUserAuthor.uuid, response.data.uuid);
		assert.equal(constants.authorUserAuthor.firstName, response.data.first_name);
		assert.equal(lastName, response.data.last_name);
		assert.equal(constants.authorUserAuthor.bio, response.data.bio);

		// Check if the data was updated correctly on the server
		let objResponse;

		try{
			objResponse = await utils.getTableObject(constants.authorUserAuthor.uuid, constants.authorUserJWT);
		}catch(error){
			assert.fail();
		}

		assert.equal(constants.authorUserAuthor.uuid, objResponse.data.uuid);
		assert.equal(constants.authorUserAuthor.firstName, objResponse.data.properties.first_name);
		assert.equal(lastName, objResponse.data.properties.last_name);
		assert.equal(constants.authorUserAuthor.bio, objResponse.data.properties.bio);
	});

	it("should update bio of author", async () => {
		let bio = "Updated bio";
		let response;

		try{
			response = await axios.default({
				method: 'put',
				url: updateAuthorEndpointUrl,
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					bio
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(constants.authorUserAuthor.uuid, response.data.uuid);
		assert.equal(constants.authorUserAuthor.firstName, response.data.first_name);
		assert.equal(constants.authorUserAuthor.lastName, response.data.last_name);
		assert.equal(bio, response.data.bio);

		// Check if the data was updated correctly on the server
		let objResponse;

		try{
			objResponse = await utils.getTableObject(constants.authorUserAuthor.uuid, constants.authorUserJWT);
		}catch(error){
			assert.fail();
		}

		assert.equal(constants.authorUserAuthor.uuid, objResponse.data.uuid);
		assert.equal(constants.authorUserAuthor.firstName, objResponse.data.properties.first_name);
		assert.equal(constants.authorUserAuthor.lastName, objResponse.data.properties.last_name);
		assert.equal(bio, objResponse.data.properties.bio);
	});

	it("should update all properties of author", async () => {
		let firstName = "New first name";
		let lastName = "New last name";
		let bio = "New bio";
		let response;

		try{
			response = await axios.default({
				method: 'put',
				url: updateAuthorEndpointUrl,
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: firstName,
					last_name: lastName,
					bio
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(constants.authorUserAuthor.uuid, response.data.uuid);
		assert.equal(firstName, response.data.first_name);
		assert.equal(lastName, response.data.last_name);
		assert.equal(bio, response.data.bio);

		// Check if the data was updated correctly on the server
		let objResponse;

		try{
			objResponse = await utils.getTableObject(constants.authorUserAuthor.uuid, constants.authorUserJWT);
		}catch(error){
			assert.fail();
		}

		assert.equal(constants.authorUserAuthor.uuid, objResponse.data.uuid);
		assert.equal(firstName, objResponse.data.properties.first_name);
		assert.equal(lastName, objResponse.data.properties.last_name);
		assert.equal(bio, objResponse.data.properties.bio);
	});
});