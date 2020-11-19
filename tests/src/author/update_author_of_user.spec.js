import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'
import * as utils from '../utils.js'

const updateAuthorEndpointUrl = `${constants.apiBaseUrl}/api/1/call/author`
var resetAuthors = false

afterEach(async () => {
	if(resetAuthors){
		await utils.resetAuthors()
		resetAuthors = false
	}
})

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
					Authorization: constants.authorUser.jwt
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
					Authorization: constants.davClassLibraryTestUserTestAppJWT,
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

	it("should not update author if the user is an admin", async () => {
		try{
			await axios.default({
				method: 'put',
				url: updateAuthorEndpointUrl,
				headers: {
					Authorization: constants.davUser.jwt,
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
					Authorization: constants.davClassLibraryTestUser.jwt,
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
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: 23,
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

	it("should not update author with too short properties", async () => {
		try{
			await axios.default({
				method: 'put',
				url: updateAuthorEndpointUrl,
				headers: {
					Authorization: constants.authorUser.jwt,
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

	it("should not update author with too long properties", async () => {
		try{
			await axios.default({
				method: 'put',
				url: updateAuthorEndpointUrl,
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: "a".repeat(30),
					last_name: "a".repeat(30)
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

	it("should update first_name of author", async () => {
		let firstName = "Updated name";
		let response;

		try{
			response = await axios.default({
				method: 'put',
				url: updateAuthorEndpointUrl,
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: firstName
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status)
		assert.equal(constants.authorUser.author.uuid, response.data.uuid)
		assert.equal(firstName, response.data.first_name)
		assert.equal(constants.authorUser.author.lastName, response.data.last_name)
		assert.equal(constants.authorUser.author.bios.length, response.data.bios.length)
		assert.equal(constants.authorUser.author.collections.length, response.data.collections.length)
		assert.isTrue(response.data.profile_image)
		assert.equal(constants.authorUser.author.profileImageBlurhash, response.data.profile_image_blurhash)

		for(let i = 0; i < constants.authorUser.author.bios.length; i++){
			let bio = constants.authorUser.author.bios[i]
			let responseBio = response.data.bios[i]

			assert.isUndefined(responseBio.uuid)
			assert.equal(bio.bio, responseBio.bio)
			assert.equal(bio.language, responseBio.language)
		}

		for(let i = 0; i < constants.authorUser.author.collections.length; i++){
			let collection = constants.authorUser.author.collections[i]
			let responseCollection = response.data.collections[i]

			assert.equal(collection.uuid, responseCollection.uuid)

			for(let j = 0; j < collection.names.length; j++){
				let name = collection.names[j]
				let responseName = responseCollection.names[j]

				assert.isUndefined(responseName.uuid)
				assert.equal(name.name, responseName.name)
				assert.equal(name.language, responseName.language)
			}
		}

		// Check if the data was updated correctly on the server
		let objResponse

		try{
			objResponse = await utils.getTableObject(constants.authorUser.author.uuid, constants.authorUser.jwt)
		}catch(error){
			assert.fail()
		}

		assert.equal(constants.authorUser.author.uuid, objResponse.data.uuid)
		assert.equal(firstName, objResponse.data.properties.first_name)
		assert.equal(constants.authorUser.author.lastName, objResponse.data.properties.last_name)

		// Tidy up
		resetAuthors = true
	})

	it("should update last_name of author", async () => {
		let lastName = "Updated name";
		let response;

		try{
			response = await axios.default({
				method: 'put',
				url: updateAuthorEndpointUrl,
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					last_name: lastName
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status)
		assert.equal(constants.authorUser.author.uuid, response.data.uuid)
		assert.equal(constants.authorUser.author.firstName, response.data.first_name)
		assert.equal(lastName, response.data.last_name)
		assert.equal(constants.authorUser.author.bios.length, response.data.bios.length)
		assert.equal(constants.authorUser.author.collections.length, response.data.collections.length)
		assert.isTrue(response.data.profile_image)
		assert.equal(constants.authorUser.author.profileImageBlurhash, response.data.profile_image_blurhash)

		for(let i = 0; i < constants.authorUser.author.bios.length; i++){
			let bio = constants.authorUser.author.bios[i]
			let responseBio = response.data.bios[i]

			assert.isUndefined(responseBio.uuid)
			assert.equal(bio.bio, responseBio.bio)
			assert.equal(bio.language, responseBio.language)
		}

		for(let i = 0; i < constants.authorUser.author.collections.length; i++){
			let collection = constants.authorUser.author.collections[i]
			let responseCollection = response.data.collections[i]

			assert.equal(collection.uuid, responseCollection.uuid)

			for(let j = 0; j < collection.names.length; j++){
				let name = collection.names[j]
				let responseName = responseCollection.names[j]

				assert.isUndefined(responseName.uuid)
				assert.equal(name.name, responseName.name)
				assert.equal(name.language, responseName.language)
			}
		}

		// Check if the data was updated correctly on the server
		let objResponse

		try{
			objResponse = await utils.getTableObject(constants.authorUser.author.uuid, constants.authorUser.jwt)
		}catch(error){
			assert.fail()
		}

		assert.equal(constants.authorUser.author.uuid, objResponse.data.uuid)
		assert.equal(constants.authorUser.author.firstName, objResponse.data.properties.first_name)
		assert.equal(lastName, objResponse.data.properties.last_name)

		// Tidy up
		resetAuthors = true
	})

	it("should update all properties of author", async () => {
		let firstName = "New first name";
		let lastName = "New last name";
		let response;

		try{
			response = await axios.default({
				method: 'put',
				url: updateAuthorEndpointUrl,
				headers: {
					Authorization: constants.authorUser.jwt,
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

		assert.equal(200, response.status)
		assert.equal(constants.authorUser.author.uuid, response.data.uuid)
		assert.equal(firstName, response.data.first_name)
		assert.equal(lastName, response.data.last_name)
		assert.equal(constants.authorUser.author.bios.length, response.data.bios.length)
		assert.equal(constants.authorUser.author.collections.length, response.data.collections.length)
		assert.isTrue(response.data.profile_image)
		assert.equal(constants.authorUser.author.profileImageBlurhash, response.data.profile_image_blurhash)

		for(let i = 0; i < constants.authorUser.author.bios.length; i++){
			let bio = constants.authorUser.author.bios[i]
			let responseBio = response.data.bios[i]

			assert.isUndefined(responseBio.uuid)
			assert.equal(bio.bio, responseBio.bio)
			assert.equal(bio.language, responseBio.language)
		}

		for(let i = 0; i < constants.authorUser.author.collections.length; i++){
			let collection = constants.authorUser.author.collections[i]
			let responseCollection = response.data.collections[i]

			assert.equal(collection.uuid, responseCollection.uuid)

			for(let j = 0; j < collection.names.length; j++){
				let name = collection.names[j]
				let responseName = responseCollection.names[j]

				assert.isUndefined(responseName.uuid)
				assert.equal(name.name, responseName.name)
				assert.equal(name.language, responseName.language)
			}
		}

		// Check if the data was updated correctly on the server
		let objResponse

		try{
			objResponse = await utils.getTableObject(constants.authorUser.author.uuid, constants.authorUser.jwt)
		}catch(error){
			assert.fail()
		}

		assert.equal(constants.authorUser.author.uuid, objResponse.data.uuid)
		assert.equal(firstName, objResponse.data.properties.first_name)
		assert.equal(lastName, objResponse.data.properties.last_name)

		// Tidy up
		resetAuthors = true
	})
})