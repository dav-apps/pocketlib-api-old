var assert = require('assert');
var axios = require('axios');

const apiBaseUrl = "http://localhost:3111/v1";
const createAuthorEndpointUrl = `${apiBaseUrl}/api/1/call/author`;
const authorTableId = 19;
const davUserJWT = "eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImRhdkBkYXYtYXBwcy50ZWNoIiwidXNlcl9pZCI6MSwiZGV2X2lkIjoxLCJleHAiOjM3NTYxMDE3NjAwfQ.6LvizKcYttmWGLwGFS4A2nhSu6aOs8O9_pa2StxTQqE.3";
const authorUserJWT = "eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImF1dGhvckBkYXYtYXBwcy50ZWNoIiwidXNlcl9pZCI6NiwiZGV2X2lkIjoxLCJleHAiOjM3NTYxMDE3NjAwfQ.npXRbu87twmlyqBSPuGb1qOn7Mh1ug_j0qEQiLz3N6U.2";

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
					Authorization: davUserJWT
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

	it("should not create author without required properties", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createAuthorEndpointUrl,
				headers: {
					Authorization: davUserJWT,
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
					Authorization: davUserJWT,
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
					Authorization: davUserJWT,
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
					Authorization: davUserJWT,
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
					Authorization: authorUserJWT,
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
					Authorization: davUserJWT,
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
		await deleteAuthorOfUser(davUserJWT);
	});
});

async function deleteAuthorOfUser(jwt) {
	try{
		// First, get the author table
		let response = await axios.default({
			method: 'get',
			url: `${apiBaseUrl}/apps/table/${authorTableId}`,
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
			url: `${apiBaseUrl}/apps/object/${tableObjects[0].id}`,
			headers: {
				Authorization: jwt
			}
		});
	}catch(error){
		console.log("Error when trying to delete author of user:")
		console.log(error);
	}
}