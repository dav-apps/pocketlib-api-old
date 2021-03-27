import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import { TableObjectsController } from 'dav-js'
import constants from '../constants.js'
import * as utils from '../utils.js'
import * as ErrorCodes from '../errorCodes.js'

const createAuthorEndpointUrl = `${constants.apiBaseUrl}/api/1/call/author`
var resetAuthors = false

afterEach(async () => {
	if (resetAuthors) {
		await utils.resetAuthors()
		resetAuthors = false
	}
})

describe("CreateAuthor endpoint", async () => {
	it("should not create author without access token", async () => {
		try {
			await axios.default({
				method: 'post',
				url: createAuthorEndpointUrl
			})
		} catch (error) {
			assert.equal(401, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.AuthorizationHeaderMissing, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not create author with access token for session that does not exist", async () => {
		try {
			await axios.default({
				method: 'post',
				url: createAuthorEndpointUrl,
				headers: {
					Authorization: "blablablabla",
					'Content-Type': 'application/json'
				}
			})
		} catch (error) {
			assert.equal(404, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.SessionDoesNotExist, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not create author without Content-Type json", async () => {
		try {
			await axios.default({
				method: 'post',
				url: createAuthorEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/xml'
				}
			})
		} catch (error) {
			assert.equal(415, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.ContentTypeNotSupported, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not create author with access token for another app", async () => {
		try {
			await axios.default({
				method: 'post',
				url: createAuthorEndpointUrl,
				headers: {
					Authorization: constants.testUserTestAppAccessToken,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: "Dav",
					last_name: "Tester"
				}
			})
		} catch (error) {
			assert.equal(403, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.ActionNotAllowed, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not create author without required properties", async () => {
		try {
			await axios.default({
				method: 'post',
				url: createAuthorEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(2, error.response.data.errors.length)
			assert.equal(ErrorCodes.FirstNameMissing, error.response.data.errors[0].code)
			assert.equal(ErrorCodes.LastNameMissing, error.response.data.errors[1].code)
			return
		}

		assert.fail()
	})

	it("should not create author with properties with wrong types", async () => {
		try {
			await axios.default({
				method: 'post',
				url: createAuthorEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: 12,
					last_name: true
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(2, error.response.data.errors.length)
			assert.equal(ErrorCodes.FirstNameWrongType, error.response.data.errors[0].code)
			assert.equal(ErrorCodes.LastNameWrongType, error.response.data.errors[1].code)
			return
		}

		assert.fail()
	})

	it("should not create author with too short properties", async () => {
		try {
			await axios.default({
				method: 'post',
				url: createAuthorEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: "a",
					last_name: "a"
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(2, error.response.data.errors.length)
			assert.equal(ErrorCodes.FirstNameTooShort, error.response.data.errors[0].code)
			assert.equal(ErrorCodes.LastNameTooShort, error.response.data.errors[1].code)
			return
		}

		assert.fail()
	})

	it("should not create author with too long properties", async () => {
		try {
			await axios.default({
				method: 'post',
				url: createAuthorEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: "a".repeat(30),
					last_name: "a".repeat(30),
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(2, error.response.data.errors.length)
			assert.equal(ErrorCodes.FirstNameTooLong, error.response.data.errors[0].code)
			assert.equal(ErrorCodes.LastNameTooLong, error.response.data.errors[1].code)
			return
		}

		assert.fail()
	})

	it("should not create author if the user is already an author", async () => {
		try {
			await axios.default({
				method: 'post',
				url: createAuthorEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: "Dav",
					last_name: "Tester"
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.UserIsAlreadyAuthor, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should create author", async () => {
		resetAuthors = true
		let firstName = "Dav"
		let lastName = "Tester"
		let response

		try {
			response = await axios.default({
				method: 'post',
				url: createAuthorEndpointUrl,
				headers: {
					Authorization: constants.testUser.accessToken,
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

		assert.equal(201, response.status)
		assert.isNotNull(response.data.uuid)
		assert.equal(firstName, response.data.first_name)
		assert.equal(lastName, response.data.last_name)
		assert.isNull(response.data.website_url)
		assert.isNull(response.data.facebook_username)
		assert.isNull(response.data.instagram_username)
		assert.isNull(response.data.twitter_username)
		assert.equal(0, response.data.bios.length)
		assert.equal(0, response.data.collections.length)
		assert.isFalse(response.data.profile_image)
		assert.isNull(response.data.profile_image_blurhash)

		// Check if the author was correctly created on the server
		let objResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.testUser.accessToken,
			uuid: response.data.uuid
		})

		if (objResponse.status != 200) {
			assert.fail()
		}

		assert.equal(response.data.uuid, objResponse.data.Uuid)
		assert.equal(response.data.first_name, objResponse.data.GetPropertyValue("first_name"))
		assert.equal(response.data.last_name, objResponse.data.GetPropertyValue("last_name"))
		assert.isNull(objResponse.data.GetPropertyValue("website_url"))
		assert.isNull(objResponse.data.GetPropertyValue("facebook_username"))
		assert.isNull(objResponse.data.GetPropertyValue("instagram_username"))
		assert.isNull(objResponse.data.GetPropertyValue("twitter_username"))
		assert.isNull(objResponse.data.GetPropertyValue("bios"))
		assert.isNull(objResponse.data.GetPropertyValue("collections"))
		assert.isNull(objResponse.data.GetPropertyValue("profile_image"))
		assert.isNull(objResponse.data.GetPropertyValue("profile_image_blurhash"))
	})

	it("should create multiple authors if the user is an admin", async () => {
		resetAuthors = true

		// Create first author for first user
		let firstName1 = "Neal"
		let lastName1 = "Gabler"
		let response1

		try {
			response1 = await axios.default({
				method: 'post',
				url: createAuthorEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: firstName1,
					last_name: lastName1
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(201, response1.status)
		assert.isNotNull(response1.data.uuid)
		assert.equal(firstName1, response1.data.first_name)
		assert.equal(lastName1, response1.data.last_name)
		assert.isNull(response1.data.website_url)
		assert.isNull(response1.data.facebook_username)
		assert.isNull(response1.data.instagram_username)
		assert.isNull(response1.data.twitter_username)
		assert.equal(0, response1.data.bios.length)
		assert.equal(0, response1.data.collections.length)
		assert.isFalse(response1.data.profile_image)
		assert.isNull(response1.data.profile_image_blurhash)

		// Create second author for first user
		let response2
		let firstName2 = "Andrew"
		let lastName2 = "Lane"

		try {
			response2 = await axios.default({
				method: 'post',
				url: createAuthorEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: firstName2,
					last_name: lastName2
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(201, response2.status)
		assert.isNotNull(response2.data.uuid)
		assert.equal(firstName2, response2.data.first_name)
		assert.equal(lastName2, response2.data.last_name)
		assert.isNull(response2.data.website_url)
		assert.isNull(response2.data.facebook_username)
		assert.isNull(response2.data.instagram_username)
		assert.isNull(response2.data.twitter_username)
		assert.equal(0, response2.data.bios.length)
		assert.equal(0, response2.data.collections.length)
		assert.isFalse(response2.data.profile_image)
		assert.isNull(response2.data.profile_image_blurhash)

		// Check if the authors were correctly created on the server
		let objResponse1 = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: response1.data.uuid
		})

		if (objResponse1.status != 200) {
			assert.fail()
		}

		assert.equal(response1.data.uuid, objResponse1.data.Uuid)
		assert.equal(response1.data.first_name, objResponse1.data.GetPropertyValue("first_name"))
		assert.equal(response1.data.last_name, objResponse1.data.GetPropertyValue("last_name"))
		assert.isNull(objResponse1.data.GetPropertyValue("website_url"))
		assert.isNull(objResponse1.data.GetPropertyValue("facebook_username"))
		assert.isNull(objResponse1.data.GetPropertyValue("instagram_username"))
		assert.isNull(objResponse1.data.GetPropertyValue("twitter_username"))
		assert.isNull(objResponse1.data.GetPropertyValue("bios"))
		assert.isNull(objResponse1.data.GetPropertyValue("collections"))
		assert.isNull(objResponse1.data.GetPropertyValue("profile_image"))
		assert.isNull(objResponse1.data.GetPropertyValue("profile_image_blurhash"))

		let objResponse2 = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: response2.data.uuid
		})

		if (objResponse2.status != 200) {
			assert.fail()
		}

		assert.equal(response2.data.uuid, objResponse2.data.Uuid)
		assert.equal(response2.data.first_name, objResponse2.data.GetPropertyValue("first_name"))
		assert.equal(response2.data.last_name, objResponse2.data.GetPropertyValue("last_name"))
		assert.isNull(objResponse2.data.GetPropertyValue("bios"))
		assert.isNull(objResponse2.data.GetPropertyValue("collections"))
		assert.isNull(objResponse2.data.GetPropertyValue("profile_image"))
		assert.isNull(objResponse2.data.GetPropertyValue("profile_image_blurhash"))
	})
})