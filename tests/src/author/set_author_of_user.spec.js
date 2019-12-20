var assert = require('assert');
var axios = require('axios');
var constants = require("../constants");

const setAuthorEndpointUrl = `${constants.apiBaseUrl}/api/1/call/author`;

beforeEach(() => {
	resetAuthors();
});

afterEach(() => {
	resetAuthors();
});

describe("SetAuthorOfUser endpoint", () => {
	it("should not set author without jwt", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setAuthorEndpointUrl
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2101, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not set author without content type json", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setAuthorEndpointUrl,
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

	it("should not set author if jwt is for another app", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setAuthorEndpointUrl,
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
				method: 'put',
				url: setAuthorEndpointUrl,
				headers: {
					Authorization: constants.davUserJWT,
					'Content-Type': 'application/json'
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(3, error.response.data.errors.length);
			assert.equal(2102, error.response.data.errors[0].code);
			assert.equal(2103, error.response.data.errors[1].code);
			assert.equal(2104, error.response.data.errors[2].code);
			return;
		}

		assert.fail();
	});

	it("should not create author with properties with wrong types", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setAuthorEndpointUrl,
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
			assert.equal(2201, error.response.data.errors[0].code);
			assert.equal(2202, error.response.data.errors[1].code);
			assert.equal(2203, error.response.data.errors[2].code);
			return;
		}

		assert.fail();
	});

	it("should not update author with properties with wrong types", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setAuthorEndpointUrl,
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: 12,
					last_name: 23.45,
					bio: true
				}
			})
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

	it("should not create author with too short properties", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setAuthorEndpointUrl,
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
				method: 'put',
				url: setAuthorEndpointUrl,
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

	it("should create author", async () => {
		let firstName = "Dav";
		let lastName = "Tester";
		let bio = "Hello World";
		let response;

		try{
			response = await axios.default({
				method: 'put',
				url: setAuthorEndpointUrl,
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

		assert.equal(200, response.status);
		assert(response.data.uuid != null);
		assert.equal(firstName, response.data.first_name);
		assert.equal(lastName, response.data.last_name);
		assert.equal(bio, response.data.bio);
	});

	it("should update author", async () => {
		let firstName = "Test";
		let bio = "Author description";
		let response;

		try{
			response = await axios.default({
				method: 'put',
				url: setAuthorEndpointUrl,
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: firstName,
					bio
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(constants.authorUserAuthor.uuid, response.data.uuid);
		assert.equal(firstName, response.data.first_name);
		assert.equal(constants.authorUserAuthor.lastName, response.data.last_name);
		assert.equal(bio, response.data.bio);
	});
});

async function resetAuthors(){
	// Delete the author of dav user
	// Get the author table
	let authorObjUuid;
	let response;

	try{
		response = await axios.default({
			method: 'get',
			url: `${constants.apiBaseUrl}/apps/table/${constants.authorTableId}`,
			headers: {
				Authorization: constants.davUserJWT
			}
		});

		if(response.data.table_objects.length > 0){
			authorObjUuid = response.data.table_objects[0].uuid;
		}
	}catch(error){
		console.log("Error in trying to get the author table");
		console.log(error.response.data);
	}

	if(authorObjUuid){
		// Delete the author object
		try{
			await axios.default({
				method: 'delete',
				url: `${constants.apiBaseUrl}/apps/object/${authorObjUuid}`,
				headers: {
					Authorization: constants.davUserJWT
				}
			});
		}catch(error){
			console.log("Error in trying to delete the author object");
			console.log(error.response.data);
		}
	}

	// Reset the author of author user
	try{
		await axios.default({
			method: 'put',
			url: `${constants.apiBaseUrl}/apps/object/${constants.authorUserAuthor.uuid}`,
			headers: {
				Authorization: constants.authorUserJWT,
				'Content-Type': 'application/json'
			},
			data: {
				first_name: constants.authorUserAuthor.firstName,
				last_name: constants.authorUserAuthor.lastName,
				bio: constants.authorUserAuthor.bio
			}
		});
	}catch(error){
		console.log("Error in resetting the author of the author user");
		console.log(error.response.data);
	}
}