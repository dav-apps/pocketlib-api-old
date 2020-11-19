import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'
import * as utils from '../utils.js'

const createAuthorEndpointUrl = `${constants.apiBaseUrl}/api/1/call/author`
var resetAuthors = false

afterEach(async () => {
	if(resetAuthors){
		await utils.resetAuthors()
		resetAuthors = false
	}
})

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
					Authorization: constants.davUser.jwt,
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
					Authorization: constants.davUser.jwt,
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
					Authorization: constants.davUser.jwt,
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
					Authorization: constants.davUser.jwt,
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
					Authorization: constants.authorUser.jwt,
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
					Authorization: constants.davClassLibraryTestUser.jwt,
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

		assert.equal(201, response.status)
		assert.isNotNull(response.data.uuid)
		assert.equal(firstName, response.data.first_name)
		assert.equal(lastName, response.data.last_name)
		assert.equal(0, response.data.bios.length)
		assert.equal(0, response.data.collections.length)
		assert.isFalse(response.data.profile_image)
		assert.isNull(response.data.profile_image_blurhash)

		// Check if the author was correctly created on the server
		let objResponse
		try{
			objResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${response.data.uuid}`,
				headers: {
					Authorization: constants.davClassLibraryTestUser.jwt
				}
			})
		}catch(error){
			assert.fail()
		}

		assert.equal(response.data.uuid, objResponse.data.uuid)
		assert.equal(response.data.first_name, objResponse.data.properties.first_name)
		assert.equal(response.data.last_name, objResponse.data.properties.last_name)
		assert.isUndefined(objResponse.data.properties.bios)
		assert.isUndefined(objResponse.data.properties.collections)
		assert.isUndefined(objResponse.data.properties.profile_image)
		assert.isUndefined(objResponse.data.properties.profile_image_blurhash)

		// Tidy up
		resetAuthors = true
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
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: firstName1,
					last_name: lastName1
				}
			})
		}catch(error){
			assert.fail()
		}

		assert.equal(201, response1.status)
		assert.isNotNull(response1.data.uuid)
		assert.equal(firstName1, response1.data.first_name)
		assert.equal(lastName1, response1.data.last_name)
		assert.equal(0, response1.data.bios.length)
		assert.equal(0, response1.data.collections.length)
		assert.isFalse(response1.data.profile_image)
		assert.isNull(response1.data.profile_image_blurhash)

		// Create second author for first user
		let response2
		let firstName2 = "Andrew"
		let lastName2 = "Lane"

		try{
			response2 = await axios.default({
				method: 'post',
				url: createAuthorEndpointUrl,
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: firstName2,
					last_name: lastName2
				}
			})
		}catch(error){
			assert.fail()
		}

		assert.equal(201, response2.status)
		assert.isNotNull(response2.data.uuid)
		assert.equal(firstName2, response2.data.first_name)
		assert.equal(lastName2, response2.data.last_name)
		assert.equal(0, response2.data.bios.length)
		assert.equal(0, response2.data.collections.length)
		assert.isFalse(response2.data.profile_image)
		assert.isNull(response2.data.profile_image_blurhash)

		// Check if the authors were correctly created on the server
		let objResponse1

		try{
			objResponse1 = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${response1.data.uuid}`,
				headers: {
					Authorization: constants.davUser.jwt
				}
			})
		}catch(error){
			assert.fail()
		}

		assert.equal(response1.data.uuid, objResponse1.data.uuid)
		assert.equal(response1.data.first_name, objResponse1.data.properties.first_name)
		assert.equal(response1.data.last_name, objResponse1.data.properties.last_name)
		assert.isUndefined(objResponse1.data.properties.bios)
		assert.isUndefined(objResponse1.data.properties.collections)
		assert.isUndefined(objResponse1.data.properties.profile_image)
		assert.isUndefined(objResponse1.data.properties.profile_image_blurhash)

		let objResponse2

		try{
			objResponse2 = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${response2.data.uuid}`,
				headers: {
					Authorization: constants.davUser.jwt
				}
			})
		}catch(error){
			assert.fail()
		}

		assert.equal(response2.data.uuid, objResponse2.data.uuid)
		assert.equal(response2.data.first_name, objResponse2.data.properties.first_name)
		assert.equal(response2.data.last_name, objResponse2.data.properties.last_name)
		assert.isUndefined(objResponse2.data.properties.bios)
		assert.isUndefined(objResponse2.data.properties.collections)
		assert.isUndefined(objResponse2.data.properties.profile_image)
		assert.isUndefined(objResponse2.data.properties.profile_image_blurhash)

		// Tidy up
		resetAuthors = true
	});
});