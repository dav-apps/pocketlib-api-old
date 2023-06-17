import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import { TableObjectsController } from 'dav-js'
import constants from '../constants.js'
import * as utils from '../utils.js'
import * as ErrorCodes from '../errorCodes.js'

const createAuthorEndpointUrl = `${constants.apiBaseUrl}/authors`
var resetPublishers = false
var resetAuthors = false

afterEach(async () => {
	if (resetPublishers) {
		await utils.resetPublishers()
		resetPublishers = false
	}

	if (resetAuthors) {
		await utils.resetAuthors()
		resetAuthors = false
	}
})

describe("CreateAuthor endpoint", () => {
	it("should not create author without access token", async () => {
		try {
			await axios({
				method: "post",
				url: createAuthorEndpointUrl
			})
		} catch (error) {
			assert.equal(error.response.status, 401)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(
				error.response.data.errors[0],
				ErrorCodes.AuthorizationHeaderMissing
			)
			return
		}

		assert.fail()
	})

	it("should not create author with access token for session that does not exist", async () => {
		try {
			await axios({
				method: "post",
				url: createAuthorEndpointUrl,
				headers: {
					Authorization: "blablablabla",
					"Content-Type": "application/json"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 404)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(
				error.response.data.errors[0],
				ErrorCodes.SessionDoesNotExist
			)
			return
		}

		assert.fail()
	})

	it("should not create author without Content-Type json", async () => {
		try {
			await axios({
				method: "post",
				url: createAuthorEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					"Content-Type": "application/xml"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 415)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(
				error.response.data.errors[0],
				ErrorCodes.ContentTypeNotSupported
			)
			return
		}

		assert.fail()
	})

	it("should not create author with access token for another app", async () => {
		try {
			await axios({
				method: "post",
				url: createAuthorEndpointUrl,
				headers: {
					Authorization: constants.testUserTestAppAccessToken,
					"Content-Type": "application/json"
				},
				data: {
					first_name: "Dav",
					last_name: "Tester"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 403)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(
				error.response.data.errors[0],
				ErrorCodes.ActionNotAllowed
			)
			return
		}

		assert.fail()
	})

	it("should not create author without required properties", async () => {
		try {
			await axios({
				method: "post",
				url: createAuthorEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					"Content-Type": "application/json"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 2)
			assert.equal(
				error.response.data.errors[0],
				ErrorCodes.FirstNameMissing
			)
			assert.equal(error.response.data.errors[1], ErrorCodes.LastNameMissing)
			return
		}

		assert.fail()
	})

	it("should not create author with properties with wrong types", async () => {
		try {
			await axios({
				method: "post",
				url: createAuthorEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					"Content-Type": "application/json"
				},
				data: {
					first_name: 12,
					last_name: true
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 2)
			assert.equal(
				error.response.data.errors[0],
				ErrorCodes.FirstNameWrongType
			)
			assert.equal(
				error.response.data.errors[1],
				ErrorCodes.LastNameWrongType
			)
			return
		}

		assert.fail()
	})

	it("should not create author with too short properties", async () => {
		try {
			await axios({
				method: "post",
				url: createAuthorEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					"Content-Type": "application/json"
				},
				data: {
					first_name: "a",
					last_name: "a"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 2)
			assert.equal(
				error.response.data.errors[0],
				ErrorCodes.FirstNameTooShort
			)
			assert.equal(
				error.response.data.errors[1],
				ErrorCodes.LastNameTooShort
			)
			return
		}

		assert.fail()
	})

	it("should not create author with too long properties", async () => {
		try {
			await axios({
				method: "post",
				url: createAuthorEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					"Content-Type": "application/json"
				},
				data: {
					first_name: "a".repeat(30),
					last_name: "a".repeat(30)
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 2)
			assert.equal(
				error.response.data.errors[0],
				ErrorCodes.FirstNameTooLong
			)
			assert.equal(error.response.data.errors[1], ErrorCodes.LastNameTooLong)
			return
		}

		assert.fail()
	})

	it("should not create author if the user is already an author", async () => {
		try {
			await axios({
				method: "post",
				url: createAuthorEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken,
					"Content-Type": "application/json"
				},
				data: {
					first_name: "Dav",
					last_name: "Tester"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(
				error.response.data.errors[0],
				ErrorCodes.UserIsAlreadyAuthor
			)
			return
		}

		assert.fail()
	})

	it("should not create author for publisher that does not exist", async () => {
		try {
			await axios({
				method: "post",
				url: createAuthorEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					"Content-Type": "application/json"
				},
				data: {
					publisher: "sjkldfjklsdfjklsfd",
					first_name: "Dav",
					last_name: "Tester"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 404)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(
				error.response.data.errors[0],
				ErrorCodes.PublisherDoesNotExist
			)
			return
		}

		assert.fail()
	})

	it("should not create author for publisher that belongs to another user", async () => {
		try {
			await axios({
				method: "post",
				url: createAuthorEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					"Content-Type": "application/json"
				},
				data: {
					publisher: constants.authorUser.publisher.uuid,
					first_name: "Dav",
					last_name: "Tester"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 403)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(
				error.response.data.errors[0],
				ErrorCodes.ActionNotAllowed
			)
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
				method: "post",
				url: createAuthorEndpointUrl,
				headers: {
					Authorization: constants.testUser.accessToken,
					"Content-Type": "application/json"
				},
				params: {
					fields:
						"uuid,first_name,last_name,website_url,facebook_username,instagram_username,twitter_username"
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
		assert.equal(Object.keys(response.data).length, 7)
		assert.isNotNull(response.data.uuid)
		assert.equal(response.data.first_name, firstName)
		assert.equal(response.data.last_name, lastName)
		assert.isNull(response.data.website_url)
		assert.isNull(response.data.facebook_username)
		assert.isNull(response.data.instagram_username)
		assert.isNull(response.data.twitter_username)

		// Check if the author was correctly created on the server
		let objResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.testUser.accessToken,
			uuid: response.data.uuid
		})

		assert.equal(objResponse.status, 200)
		assert.equal(objResponse.data.tableObject.Uuid, response.data.uuid)
		assert.equal(
			Object.keys(objResponse.data.tableObject.Properties).length,
			2
		)
		assert.equal(
			objResponse.data.tableObject.GetPropertyValue("first_name"),
			firstName
		)
		assert.equal(
			objResponse.data.tableObject.GetPropertyValue("last_name"),
			lastName
		)
	})

	it("should create multiple authors if the user is an admin", async () => {
		resetAuthors = true

		// Create first author for first user
		let firstName1 = "Neal"
		let lastName1 = "Gabler"
		let response1

		try {
			response1 = await axios({
				method: "post",
				url: createAuthorEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					"Content-Type": "application/json"
				},
				params: {
					fields:
						"uuid,first_name,last_name,website_url,facebook_username,instagram_username,twitter_username"
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
		assert.equal(Object.keys(response1.data).length, 7)
		assert.isNotNull(response1.data.uuid)
		assert.equal(response1.data.first_name, firstName1)
		assert.equal(response1.data.last_name, lastName1)
		assert.isNull(response1.data.website_url)
		assert.isNull(response1.data.facebook_username)
		assert.isNull(response1.data.instagram_username)
		assert.isNull(response1.data.twitter_username)

		// Create second author for first user
		let response2
		let firstName2 = "Andrew"
		let lastName2 = "Lane"

		try {
			response2 = await axios({
				method: "post",
				url: createAuthorEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					"Content-Type": "application/json"
				},
				params: {
					fields:
						"uuid,first_name,last_name,website_url,facebook_username,instagram_username,twitter_username"
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
		assert.equal(Object.keys(response2.data).length, 7)
		assert.isNotNull(response2.data.uuid)
		assert.equal(response2.data.first_name, firstName2)
		assert.equal(response2.data.last_name, lastName2)
		assert.isNull(response2.data.website_url)
		assert.isNull(response2.data.facebook_username)
		assert.isNull(response2.data.instagram_username)
		assert.isNull(response2.data.twitter_username)

		// Check if the authors were correctly created on the server
		let objResponse1 = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: response1.data.uuid
		})

		assert.equal(objResponse1.status, 200)
		assert.equal(objResponse1.data.tableObject.Uuid, response1.data.uuid)
		assert.equal(
			objResponse1.data.tableObject.GetPropertyValue("first_name"),
			firstName1
		)
		assert.equal(
			objResponse1.data.tableObject.GetPropertyValue("last_name"),
			lastName1
		)

		let objResponse2 = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: response2.data.uuid
		})

		assert.equal(objResponse2.status, 200)
		assert.equal(objResponse2.data.tableObject.Uuid, response2.data.uuid)
		assert.equal(
			objResponse2.data.tableObject.GetPropertyValue("first_name"),
			firstName2
		)
		assert.equal(
			objResponse2.data.tableObject.GetPropertyValue("last_name"),
			lastName2
		)
	})

	it("should create author for publisher of admin", async () => {
		resetPublishers = true
		resetAuthors = true
		let publisher = constants.davUser.publishers[0]
		let firstName = "Dav"
		let lastName = "Tester"
		let response

		try {
			response = await axios({
				method: "post",
				url: createAuthorEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					"Content-Type": "application/json"
				},
				params: {
					fields:
						"uuid,publisher[uuid],first_name,last_name,website_url,facebook_username,instagram_username,twitter_username"
				},
				data: {
					publisher: publisher.uuid,
					first_name: firstName,
					last_name: lastName
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 201)
		assert.equal(Object.keys(response.data).length, 8)
		assert.isNotNull(response.data.uuid)
		assert.equal(response.data.publisher.uuid, publisher.uuid)
		assert.equal(response.data.first_name, firstName)
		assert.equal(response.data.last_name, lastName)
		assert.isNull(response.data.website_url)
		assert.isNull(response.data.facebook_username)
		assert.isNull(response.data.instagram_username)
		assert.isNull(response.data.twitter_username)

		// Check if the author was correctly created on the server
		let authorObjResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: response.data.uuid
		})

		assert.equal(authorObjResponse.status, 200)
		assert.equal(authorObjResponse.data.tableObject.Uuid, response.data.uuid)
		assert.equal(
			Object.keys(authorObjResponse.data.tableObject.Properties).length,
			3
		)
		assert.equal(
			authorObjResponse.data.tableObject.GetPropertyValue("publisher"),
			publisher.uuid
		)
		assert.equal(
			authorObjResponse.data.tableObject.GetPropertyValue("first_name"),
			firstName
		)
		assert.equal(
			authorObjResponse.data.tableObject.GetPropertyValue("last_name"),
			lastName
		)

		let publisherObjResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: publisher.uuid
		})

		assert.equal(publisherObjResponse.status, 200)
		assert.equal(publisherObjResponse.data.tableObject.Uuid, publisher.uuid)

		let publisherAuthorUuids = []
		publisher.authors.forEach(a => publisherAuthorUuids.push(a.uuid))
		publisherAuthorUuids.push(response.data.uuid)

		assert.equal(
			publisherObjResponse.data.tableObject.GetPropertyValue("authors"),
			publisherAuthorUuids.join(",")
		)
	})
})