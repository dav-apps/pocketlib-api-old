import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import { TableObjectsController } from 'dav-js'
import constants from '../constants.js'
import * as utils from '../utils.js'
import * as ErrorCodes from '../errorCodes.js'

const createAuthorEndpointUrl = `${constants.apiBaseUrl}/author`
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
			await axios({
				method: 'post',
				url: createAuthorEndpointUrl
			})
		} catch (error) {
			assert.equal(error.response.status, 401)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.AuthorizationHeaderMissing)
			return
		}

		assert.fail()
	})

	it("should not create author with access token for session that does not exist", async () => {
		try {
			await axios({
				method: 'post',
				url: createAuthorEndpointUrl,
				headers: {
					Authorization: "blablablabla",
					'Content-Type': 'application/json'
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 404)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.SessionDoesNotExist)
			return
		}

		assert.fail()
	})

	it("should not create author without Content-Type json", async () => {
		try {
			await axios({
				method: 'post',
				url: createAuthorEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/xml'
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 415)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.ContentTypeNotSupported)
			return
		}

		assert.fail()
	})

	it("should not create author with access token for another app", async () => {
		try {
			await axios({
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
			assert.equal(error.response.status, 403)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.ActionNotAllowed)
			return
		}

		assert.fail()
	})

	it("should not create author without required properties", async () => {
		try {
			await axios({
				method: 'post',
				url: createAuthorEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 2)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.FirstNameMissing)
			assert.equal(error.response.data.errors[1].code, ErrorCodes.LastNameMissing)
			return
		}

		assert.fail()
	})

	it("should not create author with properties with wrong types", async () => {
		try {
			await axios({
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 2)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.FirstNameWrongType)
			assert.equal(error.response.data.errors[1].code, ErrorCodes.LastNameWrongType)
			return
		}

		assert.fail()
	})

	it("should not create author with too short properties", async () => {
		try {
			await axios({
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 2)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.FirstNameTooShort)
			assert.equal(error.response.data.errors[1].code, ErrorCodes.LastNameTooShort)
			return
		}

		assert.fail()
	})

	it("should not create author with too long properties", async () => {
		try {
			await axios({
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 2)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.FirstNameTooLong)
			assert.equal(error.response.data.errors[1].code, ErrorCodes.LastNameTooLong)
			return
		}

		assert.fail()
	})

	it("should not create author if the user is already an author", async () => {
		try {
			await axios({
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.UserIsAlreadyAuthor)
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
			response = await axios({
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

		assert.equal(response.status, 201)
		assert.equal(Object.keys(response.data).length, 1)
		assert.isNotNull(response.data.uuid)

		// Check if the author was correctly created on the server
		let objResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.testUser.accessToken,
			uuid: response.data.uuid
		})

		if (objResponse.status != 200) {
			assert.fail()
		}

		assert.equal(objResponse.data.Uuid, response.data.uuid)
		assert.equal(Object.keys(objResponse.data.Properties).length, 2)
		assert.equal(objResponse.data.GetPropertyValue("first_name"), firstName)
		assert.equal(objResponse.data.GetPropertyValue("last_name"), lastName)
	})

	it("should create multiple authors if the user is an admin", async () => {
		resetAuthors = true

		// Create first author for first user
		let firstName1 = "Neal"
		let lastName1 = "Gabler"
		let response1

		try {
			response1 = await axios({
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

		assert.equal(response1.status, 201)
		assert.equal(Object.keys(response1.data).length, 1)
		assert.isNotNull(response1.data.uuid)

		// Create second author for first user
		let response2
		let firstName2 = "Andrew"
		let lastName2 = "Lane"

		try {
			response2 = await axios({
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

		assert.equal(response2.status, 201)
		assert.equal(Object.keys(response2.data).length, 1)
		assert.isNotNull(response2.data.uuid)

		// Check if the authors were correctly created on the server
		let objResponse1 = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: response1.data.uuid
		})

		if (objResponse1.status != 200) {
			assert.fail()
		}

		assert.equal(objResponse1.data.Uuid, response1.data.uuid)
		assert.equal(objResponse1.data.GetPropertyValue("first_name"), firstName1)
		assert.equal(objResponse1.data.GetPropertyValue("last_name"), lastName1)

		let objResponse2 = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: response2.data.uuid
		})

		if (objResponse2.status != 200) {
			assert.fail()
		}

		assert.equal(objResponse2.data.Uuid, response2.data.uuid)
		assert.equal(objResponse2.data.GetPropertyValue("first_name"), firstName2)
		assert.equal(objResponse2.data.GetPropertyValue("last_name"), lastName2)
	})
})