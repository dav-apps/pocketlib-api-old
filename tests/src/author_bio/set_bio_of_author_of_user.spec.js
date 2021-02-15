import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import { TableObjectsController } from 'dav-npm'
import constants from '../constants.js'
import * as utils from '../utils.js'

const setBioOfAuthorOfUserEndpointUrl = `${constants.apiBaseUrl}/api/1/call/author/bio/{0}`
var resetAuthorsAndAuthorBios = false

afterEach(async () => {
	if (resetAuthorsAndAuthorBios) {
		await utils.resetAuthors()
		await utils.resetAuthorBios()
		resetAuthorsAndAuthorBios = false
	}
})

describe("SetBioOfAuthorOfUser endpoint", () => {
	it("should not set bio without access token", async () => {
		try {
			await axios.default({
				method: 'put',
				url: setBioOfAuthorOfUserEndpointUrl.replace('{0}', "en"),
				headers: {
					'Content-Type': 'application/json'
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(2101, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not set bio with access token for session that does not exist", async () => {
		try {
			await axios.default({
				method: 'put',
				url: setBioOfAuthorOfUserEndpointUrl.replace('{0}', "en"),
				headers: {
					Authorization: "asdasdasasdasd",
					'Content-Type': 'application/json'
				}
			})
		} catch (error) {
			assert.equal(404, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(2802, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not set bio without Content-Type json", async () => {
		try {
			await axios.default({
				method: 'put',
				url: setBioOfAuthorOfUserEndpointUrl.replace('{0}', "en"),
				headers: {
					Authorization: constants.authorUser.accessToken
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

	it("should not set bio with access token for another app", async () => {
		try {
			await axios.default({
				method: 'put',
				url: setBioOfAuthorOfUserEndpointUrl.replace('{0}', "de"),
				headers: {
					Authorization: constants.testUserTestAppAccessToken,
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

	it("should not set bio if the user is not an author", async () => {
		try {
			await axios.default({
				method: 'put',
				url: setBioOfAuthorOfUserEndpointUrl.replace('{0}', "de"),
				headers: {
					Authorization: constants.testUser.accessToken,
					'Content-Type': 'application/json'
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(1105, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not set bio if the user is an admin", async () => {
		try {
			await axios.default({
				method: 'put',
				url: setBioOfAuthorOfUserEndpointUrl.replace('{0}', "de"),
				headers: {
					Authorization: constants.davUser.accessToken,
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

	it("should not set bio without required properties", async () => {
		try {
			await axios.default({
				method: 'put',
				url: setBioOfAuthorOfUserEndpointUrl.replace('{0}', "en"),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(2104, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not set bio with properties with wrong types", async () => {
		try {
			await axios.default({
				method: 'put',
				url: setBioOfAuthorOfUserEndpointUrl.replace('{0}', "de"),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					bio: true
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(2203, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not set bio with too short properties", async () => {
		try {
			await axios.default({
				method: 'put',
				url: setBioOfAuthorOfUserEndpointUrl.replace('{0}', "fr"),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					bio: "a"
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(2303, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not set bio with too long properties", async () => {
		try {
			await axios.default({
				method: 'put',
				url: setBioOfAuthorOfUserEndpointUrl.replace('{0}', "en"),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					bio: "a".repeat(2100)
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(2403, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not set bio for not supported language", async () => {
		try {
			await axios.default({
				method: 'put',
				url: setBioOfAuthorOfUserEndpointUrl.replace('{0}', "asd"),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					bio: "Hello World!"
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(1107, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should create author bio", async () => {
		resetAuthorsAndAuthorBios = true
		let response
		let language = "fr"
		let bio = "Hello World!!!"

		try {
			response = await axios.default({
				method: 'put',
				url: setBioOfAuthorOfUserEndpointUrl.replace('{0}', language),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					bio
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(200, response.status)
		assert.equal(bio, response.data.bio)
		assert.equal(language, response.data.language)

		// Check if the data was correctly saved on the server
		// Get the author
		let authorResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: constants.authorUser.author.uuid
		})

		if (authorResponse.status != 200) {
			assert.fail()
		}

		let responseAuthorBios = authorResponse.data.GetPropertyValue("bios")
		let responseAuthorBioUuids = responseAuthorBios.split(',')

		let authorBioUuids = []
		constants.authorUser.author.bios.forEach(bio => authorBioUuids.push(bio.uuid))
		authorBioUuids.push(responseAuthorBioUuids[responseAuthorBioUuids.length - 1])
		let authorBios = authorBioUuids.join(',')

		assert.equal(authorBioUuids.length, responseAuthorBioUuids.length)
		assert.equal(authorBios, responseAuthorBios)

		// Get the AuthorBio
		let newAuthorBioUuid = responseAuthorBioUuids[responseAuthorBioUuids.length - 1]

		let authorBioResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: newAuthorBioUuid
		})

		if (authorBioResponse.status != 200) {
			assert.fail()
		}

		assert.equal(newAuthorBioUuid, authorBioResponse.data.Uuid)
		assert.equal(bio, authorBioResponse.data.GetPropertyValue("bio"))
		assert.equal(language, authorBioResponse.data.GetPropertyValue("language"))
	})

	it("should update author bio", async () => {
		resetAuthorsAndAuthorBios = true
		let response
		let authorBio = constants.authorUser.author.bios[0]
		let authorBioUuid = authorBio.uuid
		let language = authorBio.language
		let bio = "Updated bio!"

		try {
			response = await axios.default({
				method: 'put',
				url: setBioOfAuthorOfUserEndpointUrl.replace('{0}', language),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					bio
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(200, response.status)
		assert.equal(bio, response.data.bio)
		assert.equal(language, response.data.language)

		// Check if the data was correctly updated on the server
		// Get the author
		let authorResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: constants.authorUser.author.uuid
		})

		if (authorResponse.status != 200) {
			assert.fail()
		}

		let responseAuthorBios = authorResponse.data.GetPropertyValue("bios")
		let responseAuthorBioUuids = responseAuthorBios.split(',')

		let authorBioUuids = []
		constants.authorUser.author.bios.forEach(bio => authorBioUuids.push(bio.uuid))
		let authorBios = authorBioUuids.join(',')

		assert.equal(authorBioUuids.length, responseAuthorBioUuids.length)
		assert.equal(authorBios, responseAuthorBios)

		// Get the AuthorBio
		let authorBioResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: authorBioUuid
		})

		if (authorBioResponse.status != 200) {
			assert.fail()
		}

		assert.equal(authorBioUuid, authorBioResponse.data.Uuid)
		assert.equal(bio, authorBioResponse.data.GetPropertyValue("bio"))
		assert.equal(language, authorBioResponse.data.GetPropertyValue("language"))
	})
})