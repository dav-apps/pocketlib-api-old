var assert = require('assert');
var axios = require('axios');
var constants = require('../constants');
var utils = require('../utils');

const createAuthorEndpointUrl = `${constants.apiBaseUrl}/api/1/call/author`;

beforeEach(async () => {
	await utils.resetDatabase();
});

describe("CreateAuthor endpoint", async () => {
	it("should not create author without jwt", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createAuthorEndpointUrl
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2101, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not create author with invalid jwt", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createAuthorEndpointUrl,
				headers: {
					Authorization: "blablablabla",
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

	it("should not create author without content type json", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createAuthorEndpointUrl,
				headers: {
					Authorization: constants.davUserJWT,
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

	it("should not create author if jwt is for another app", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createAuthorEndpointUrl,
				headers: {
					Authorization: constants.davClassLibraryTestUserTestAppJWT,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: "Dav",
					last_name: "Tester"
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

	it("should not create author without required properties", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createAuthorEndpointUrl,
				headers: {
					Authorization: constants.davUserJWT,
					'Content-Type': 'application/json'
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(2, error.response.data.errors.length);
			assert.equal(2102, error.response.data.errors[0].code);
			assert.equal(2103, error.response.data.errors[1].code);
			return;
		}

		assert.fail();
	});

	it("should not create author with properties with wrong types", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createAuthorEndpointUrl,
				headers: {
					Authorization: constants.davUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: 12,
					last_name: true
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(2, error.response.data.errors.length);
			assert.equal(2201, error.response.data.errors[0].code);
			assert.equal(2202, error.response.data.errors[1].code);
			return;
		}

		assert.fail();
	});

	it("should not create author with too short properties", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createAuthorEndpointUrl,
				headers: {
					Authorization: constants.davUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: "a",
					last_name: "a"
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(2, error.response.data.errors.length);
			assert.equal(2301, error.response.data.errors[0].code);
			assert.equal(2302, error.response.data.errors[1].code);
			return;
		}

		assert.fail();
	});

	it("should not create author with too long properties", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createAuthorEndpointUrl,
				headers: {
					Authorization: constants.davUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: "a".repeat(30),
					last_name: "a".repeat(30),
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(2, error.response.data.errors.length);
			assert.equal(2401, error.response.data.errors[0].code);
			assert.equal(2402, error.response.data.errors[1].code);
			return;
		}

		assert.fail();
	});

	it("should not create author if the user is already an author", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createAuthorEndpointUrl,
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: "Dav",
					last_name: "Tester"
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(1106, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should create author", async () => {
		let response;
		let firstName = "Dav";
		let lastName = "Tester";

		try{
			response = await axios.default({
				method: 'post',
				url: createAuthorEndpointUrl,
				headers: {
					Authorization: constants.davClassLibraryTestUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: firstName,
					last_name: lastName
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(201, response.status);
		assert(response.data.uuid != null);
		assert.equal(firstName, response.data.first_name);
		assert.equal(lastName, response.data.last_name);
		assert.equal(null, response.data.bio);
		assert.equal(0, response.data.collections.length);

		// Check if the author was correctly created on the server
		let objResponse;
		try{
			objResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${response.data.uuid}`,
				headers: {
					Authorization: constants.davClassLibraryTestUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(response.data.uuid, objResponse.data.uuid);
		assert.equal(response.data.first_name, objResponse.data.properties.first_name);
		assert.equal(response.data.last_name, objResponse.data.properties.last_name);
		assert.equal(null, objResponse.data.properties.bio);
		assert.equal(null, objResponse.data.properties.collections);
	});

	it("should create multiple authors if the user is an admin", async () => {
		// Create first author for first user
		let response1;
		let firstName1 = "Neal";
		let lastName1 = "Gabler";

		try{
			response1 = await axios.default({
				method: 'post',
				url: createAuthorEndpointUrl,
				headers: {
					Authorization: constants.davUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: firstName1,
					last_name: lastName1
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(201, response1.status);
		assert(response1.data.uuid != null);
		assert.equal(firstName1, response1.data.first_name);
		assert.equal(lastName1, response1.data.last_name);
		assert.equal(null, response1.data.bio);
		assert.equal(0, response1.data.collections.length);

		// Create second author for first user
		let response2;
		let firstName2 = "Andrew";
		let lastName2 = "Lane";

		try{
			response2 = await axios.default({
				method: 'post',
				url: createAuthorEndpointUrl,
				headers: {
					Authorization: constants.davUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: firstName2,
					last_name: lastName2
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(201, response2.status);
		assert(response2.data.uuid != null);
		assert.equal(firstName2, response2.data.first_name)
		assert.equal(lastName2, response2.data.last_name);
		assert.equal(null, response2.data.bio);
		assert.equal(0, response2.data.collections.length);

		// Check if the authors were correctly created on the server
		let objResponse1;

		try{
			objResponse1 = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${response1.data.uuid}`,
				headers: {
					Authorization: constants.davUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(response1.data.uuid, objResponse1.data.uuid);
		assert.equal(response1.data.first_name, objResponse1.data.properties.first_name);
		assert.equal(response1.data.last_name, objResponse1.data.properties.last_name);
		assert.equal(null, objResponse1.data.properties.bio);
		assert.equal(null, objResponse1.data.properties.collections);

		let objResponse2;

		try{
			objResponse2 = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${response2.data.uuid}`,
				headers: {
					Authorization: constants.davUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(response2.data.uuid, objResponse2.data.uuid);
		assert.equal(response2.data.first_name, objResponse2.data.properties.first_name);
		assert.equal(response2.data.last_name, objResponse2.data.properties.last_name);
		assert.equal(null, objResponse2.data.properties.bio);
		assert.equal(null, objResponse2.data.properties.collections);
	});
});