var assert = require('assert');
var axios = require('axios');
var constants = require("../constants");

const createAuthorEndpointUrl = `${constants.apiBaseUrl}/api/1/call/author`;

describe("CreateAuthor endpoint", () => {
	it("should not create author without jwt", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createAuthorEndpointUrl
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2102, error.response.data.errors[0].code);
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
					Authorization: constants.davUserJWT
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
					Authorization: constants.davClassLibraryTestUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: "Dav",
					last_name: "Tester",
					bio: "Hello World"
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
			assert.equal(3, error.response.data.errors.length);
			assert.equal(2103, error.response.data.errors[0].code);
			assert.equal(2104, error.response.data.errors[1].code);
			assert.equal(2105, error.response.data.errors[2].code);
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
					last_name: 34.2,
					bio: true
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(3, error.response.data.errors.length);
			assert.equal(2203, error.response.data.errors[0].code);
			assert.equal(2204, error.response.data.errors[1].code);
			assert.equal(2205, error.response.data.errors[2].code);
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
					bio: "a".repeat(510)
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
					last_name: "Tester",
					bio: "Hello World"
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

	it("should create author", async () => {
		let firstName = "Dav";
		let lastName = "Tester";
		let bio = "Hello World";
		let response;

		try{
			response = await axios.default({
				method: 'post',
				url: createAuthorEndpointUrl,
				headers: {
					Authorization: constants.davUserJWT,
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

		assert.equal(201, response.status);
		assert(response.data.uuid != null);
		assert.equal(firstName, response.data.first_name);
		assert.equal(lastName, response.data.last_name);
		assert.equal(bio, response.data.bio);

		// Delete the author
		await deleteAuthorOfUser(constants.davUserJWT);
	});
});

async function deleteAuthorOfUser(jwt){
	try{
		// First, get the author table
		let response = await axios.default({
			method: 'get',
			url: `${constants.apiBaseUrl}/apps/table/${constants.authorTableId}`,
			headers: {
				Authorization: jwt
			}
		});

		// Return if there are no table objects
		let tableObjects = response.data.table_objects;
		if(tableObjects.length == 0) return;

		// Delete the first table object
		await axios.default({
			method: 'delete',
			url: `${constants.apiBaseUrl}/apps/object/${tableObjects[0].id}`,
			headers: {
				Authorization: jwt
			}
		});
	}catch(error){
		console.log("Error when trying to delete author of user:")
		console.log(error);
	}
}