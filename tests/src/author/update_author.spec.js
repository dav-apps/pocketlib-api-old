import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'
import * as utils from '../utils.js'

const updateAuthorEndpointUrl = `${constants.apiBaseUrl}/api/1/call/author/{0}`
var resetAuthors = false

afterEach(async () => {
	if (resetAuthors) {
		await utils.resetAuthors()
		resetAuthors = false
	}
})

describe("UpdateAuthor endpoint", () => {
	it("should not update author without jwt", async () => {
		try {
			await axios.default({
				method: 'put',
				url: updateAuthorEndpointUrl.replace('{0}', constants.davUser.authors[0].uuid)
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(2101, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not update author with invalid jwt", async () => {
		try {
			await axios.default({
				method: 'put',
				url: updateAuthorEndpointUrl.replace('{0}', constants.davUser.authors[0].uuid),
				headers: {
					Authorization: 'asodasfobasf',
					'Content-Type': 'application/json'
				}
			})
		} catch (error) {
			assert.equal(401, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(1302, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not update author without content type json", async () => {
		try {
			await axios.default({
				method: 'put',
				url: updateAuthorEndpointUrl.replace('{0}', constants.davUser.authors[0].uuid),
				headers: {
					Authorization: constants.davUser.jwt
				}
			})
		} catch (error) {
			assert.equal(415, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(1104, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not update author if jwt is for another app", async () => {
		try {
			await axios.default({
				method: 'put',
				url: updateAuthorEndpointUrl.replace('{0}', constants.davUser.authors[0].uuid),
				headers: {
					Authorization: constants.davClassLibraryTestUserTestAppJWT,
					'Content-Type': 'application/json'
				}
			})
		} catch (error) {
			assert.equal(403, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(1102, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not update author if the user is not an admin", async () => {
		try {
			await axios.default({
				method: 'put',
				url: updateAuthorEndpointUrl.replace('{0}', constants.davUser.authors[0].uuid),
				headers: {
					Authorization: constants.davClassLibraryTestUser.jwt,
					'Content-Type': 'application/json'
				}
			})
		} catch (error) {
			assert.equal(403, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(1102, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not update author if the author does not belong to the user", async () => {
		try {
			await axios.default({
				method: 'put',
				url: updateAuthorEndpointUrl.replace('{0}', constants.authorUser.author.uuid),
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				}
			})
		} catch (error) {
			assert.equal(403, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(1102, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not update author with properties with wrong types", async () => {
		try {
			await axios.default({
				method: 'put',
				url: updateAuthorEndpointUrl.replace('{0}', constants.davUser.authors[0].uuid),
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: true,
					last_name: 21
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(2, error.response.data.errors.length)
			assert.equal(2201, error.response.data.errors[0].code)
			assert.equal(2202, error.response.data.errors[1].code)
			return
		}

		assert.fail()
	})

	it("should not update author with too short properties", async () => {
		try {
			await axios.default({
				method: 'put',
				url: updateAuthorEndpointUrl.replace('{0}', constants.davUser.authors[0].uuid),
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: "a",
					last_name: "b"
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(2, error.response.data.errors.length)
			assert.equal(2301, error.response.data.errors[0].code)
			assert.equal(2302, error.response.data.errors[1].code)
			return
		}

		assert.fail()
	})

	it("should not update author with too long properties", async () => {
		try {
			await axios.default({
				method: 'put',
				url: updateAuthorEndpointUrl.replace('{0}', constants.davUser.authors[0].uuid),
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: "a".repeat(30),
					last_name: "b".repeat(30)
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(2, error.response.data.errors.length)
			assert.equal(2401, error.response.data.errors[0].code)
			assert.equal(2402, error.response.data.errors[1].code)
			return
		}

		assert.fail()
	})

	it("should update first_name of author", async () => {
		resetAuthors = true
		let firstName = "Updated name"
		let response

		try {
			response = await axios.default({
				method: 'put',
				url: updateAuthorEndpointUrl.replace('{0}', constants.davUser.authors[0].uuid),
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: firstName
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(200, response.status)
		assert.equal(constants.davUser.authors[0].uuid, response.data.uuid)
		assert.equal(firstName, response.data.first_name)
		assert.equal(constants.davUser.authors[0].lastName, response.data.last_name)
		assert.equal(constants.davUser.authors[0].bios.length, response.data.bios.length)
		assert.equal(constants.davUser.authors[0].collections.length, response.data.collections.length)
		assert.isTrue(response.data.profile_image)
		assert.equal(constants.davUser.authors[0].profileImageBlurhash, response.data.profile_image_blurhash)

		for(let i = 0; i < constants.davUser.authors[0].bios.length; i++){
			let bio = constants.davUser.authors[0].bios[i]
			let responseBio = response.data.bios[i]

			assert.isUndefined(responseBio.uuid)
			assert.equal(bio.bio, responseBio.bio)
			assert.equal(bio.language, responseBio.language)
		}

		for(let i = 0; i < constants.davUser.authors[0].collections.length; i++){
			let collection = constants.davUser.authors[0].collections[i]
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

		try {
			objResponse = await utils.getTableObject(constants.davUser.authors[0].uuid, constants.davUser.jwt)
		} catch (error) {
			assert.fail()
		}

		assert.equal(constants.davUser.authors[0].uuid, objResponse.data.uuid)
		assert.equal(firstName, objResponse.data.properties.first_name)
		assert.equal(constants.davUser.authors[0].lastName, objResponse.data.properties.last_name)
	})

	it("should update last_name of author", async () => {
		resetAuthors = true
		let lastName = "Updated name"
		let response

		try {
			response = await axios.default({
				method: 'put',
				url: updateAuthorEndpointUrl.replace('{0}', constants.davUser.authors[0].uuid),
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					last_name: lastName
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(200, response.status)
		assert.equal(constants.davUser.authors[0].uuid, response.data.uuid)
		assert.equal(constants.davUser.authors[0].firstName, response.data.first_name)
		assert.equal(lastName, response.data.last_name)
		assert.equal(constants.davUser.authors[0].bios.length, response.data.bios.length)
		assert.equal(constants.davUser.authors[0].collections.length, response.data.collections.length)
		assert.isTrue(response.data.profile_image)
		assert.equal(constants.davUser.authors[0].profileImageBlurhash, response.data.profile_image_blurhash)

		for(let i = 0; i < constants.davUser.authors[0].bios.length; i++){
			let bio = constants.davUser.authors[0].bios[i]
			let responseBio = response.data.bios[i]

			assert.isUndefined(responseBio.uuid)
			assert.equal(bio.bio, responseBio.bio)
			assert.equal(bio.language, responseBio.language)
		}

		for(let i = 0; i < constants.davUser.authors[0].collections.length; i++){
			let collection = constants.davUser.authors[0].collections[i]
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

		try {
			objResponse = await utils.getTableObject(constants.davUser.authors[0].uuid, constants.davUser.jwt)
		} catch (error) {
			assert.fail()
		}

		assert.equal(constants.davUser.authors[0].uuid, objResponse.data.uuid)
		assert.equal(constants.davUser.authors[0].firstName, objResponse.data.properties.first_name)
		assert.equal(lastName, objResponse.data.properties.last_name)
	})

	it("should update all properties of author", async () => {
		resetAuthors = true
		let firstName = "updated first name"
		let lastName = "updated last name"
		let response

		try {
			response = await axios.default({
				method: 'put',
				url: updateAuthorEndpointUrl.replace('{0}', constants.davUser.authors[0].uuid),
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: firstName,
					last_name: lastName
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(200, response.status)
		assert.equal(constants.davUser.authors[0].uuid, response.data.uuid)
		assert.equal(firstName, response.data.first_name)
		assert.equal(lastName, response.data.last_name)
		assert.equal(constants.davUser.authors[0].bios.length, response.data.bios.length)
		assert.equal(constants.davUser.authors[0].collections.length, response.data.collections.length)
		assert.isTrue(response.data.profile_image)
		assert.equal(constants.davUser.authors[0].profileImageBlurhash, response.data.profile_image_blurhash)

		for(let i = 0; i < constants.davUser.authors[0].bios.length; i++){
			let bio = constants.davUser.authors[0].bios[i]
			let responseBio = response.data.bios[i]

			assert.isUndefined(responseBio.uuid)
			assert.equal(bio.bio, responseBio.bio)
			assert.equal(bio.language, responseBio.language)
		}

		for(let i = 0; i < constants.davUser.authors[0].collections.length; i++){
			let collection = constants.davUser.authors[0].collections[i]
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

		try {
			objResponse = await utils.getTableObject(constants.davUser.authors[0].uuid, constants.davUser.jwt)
		} catch (error) {
			assert.fail()
		}

		assert.equal(constants.davUser.authors[0].uuid, objResponse.data.uuid)
		assert.equal(firstName, objResponse.data.properties.first_name)
		assert.equal(lastName, objResponse.data.properties.last_name)
	})
})