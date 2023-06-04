import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import { TableObjectsController } from 'dav-js'
import constants from '../constants.js'
import * as utils from '../utils.js'
import * as ErrorCodes from '../errorCodes.js'

const createPublisherEndpointUrl = `${constants.apiBaseUrl}/publishers`
var resetPublishers = false

afterEach(async () => {
	if (resetPublishers) {
		await utils.resetPublishers()
		resetPublishers = false
	}
})

describe("CreatePublisher endpoint", () => {
	it("should not create publisher without access token", async () => {
		try {
			await axios({
				method: "post",
				url: createPublisherEndpointUrl
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

	it("should not create publisher with access token for session that does not exist", async () => {
		try {
			await axios({
				method: "post",
				url: createPublisherEndpointUrl,
				headers: {
					Authorization: "badasdasdad",
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

	it("should not create publisher without Content-Type json", async () => {
		try {
			await axios({
				method: "post",
				url: createPublisherEndpointUrl,
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

	it("should not create publisher with access token for another app", async () => {
		try {
			await axios({
				method: "post",
				url: createPublisherEndpointUrl,
				headers: {
					Authorization: constants.testUserTestAppAccessToken,
					"Content-Type": "application/json"
				},
				data: {
					name: "asdasd"
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

	it("should not create publisher without required properties", async () => {
		try {
			await axios({
				method: "post",
				url: createPublisherEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					"Content-Type": "application/json"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0], ErrorCodes.NameMissing)
			return
		}

		assert.fail()
	})

	it("should not create publisher with properties with wrong types", async () => {
		try {
			await axios({
				method: "post",
				url: createPublisherEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					"Content-Type": "application/json"
				},
				data: {
					name: true
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0], ErrorCodes.NameWrongType)
			return
		}

		assert.fail()
	})

	it("should not create publisher with too short properties", async () => {
		try {
			await axios({
				method: "post",
				url: createPublisherEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					"Content-Type": "application/json"
				},
				data: {
					name: "a"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0], ErrorCodes.NameTooShort)
			return
		}

		assert.fail()
	})

	it("should not create publisher with too long properties", async () => {
		try {
			await axios({
				method: "post",
				url: createPublisherEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					"Content-Type": "application/json"
				},
				data: {
					name: "a".repeat(140)
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0], ErrorCodes.NameTooLong)
			return
		}

		assert.fail()
	})

	it("should not create publisher if the user is already a publisher", async () => {
		try {
			await axios({
				method: "post",
				url: createPublisherEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken,
					"Content-Type": "application/json"
				},
				data: {
					name: "Test publisher"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(
				error.response.data.errors[0],
				ErrorCodes.UserIsAlreadyPublisher
			)
			return
		}

		assert.fail()
	})

	it("should create publisher", async () => {
		resetPublishers = true
		let name = "Test publisher"
		let response

		try {
			response = await axios({
				method: "post",
				url: createPublisherEndpointUrl,
				headers: {
					Authorization: constants.testUser.accessToken,
					"Content-Type": "application/json"
				},
				params: {
					fields:
						"uuid,name,description,website_url,facebook_username,instagram_username,twitter_username"
				},
				data: {
					name
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 201)
		assert.equal(Object.keys(response.data).length, 7)
		assert.isNotNull(response.data.uuid)
		assert.equal(response.data.name, name)
		assert.isNull(response.data.description)
		assert.isNull(response.data.website_url)
		assert.isNull(response.data.facebook_username)
		assert.isNull(response.data.instagram_username)
		assert.isNull(response.data.twitter_username)

		// Check if the publisher was correctly created on the server
		let objResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.testUser.accessToken,
			uuid: response.data.uuid
		})

		assert.equal(objResponse.status, 200)
		assert.equal(objResponse.data.tableObject.Uuid, response.data.uuid)
		assert.equal(
			Object.keys(objResponse.data.tableObject.Properties).length,
			1
		)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("name"), name)
	})

	it("should create publisher for admin", async () => {
		resetPublishers = true
		let name = "Test publisher"
		let response

		try {
			response = await axios({
				method: "post",
				url: createPublisherEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					"Content-Type": "application/json"
				},
				params: {
					fields:
						"uuid,name,description,website_url,facebook_username,instagram_username,twitter_username"
				},
				data: {
					name
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 201)
		assert.equal(Object.keys(response.data).length, 7)
		assert.isNotNull(response.data.uuid)
		assert.equal(response.data.name, name)
		assert.isNull(response.data.description)
		assert.isNull(response.data.website_url)
		assert.isNull(response.data.facebook_username)
		assert.isNull(response.data.instagram_username)
		assert.isNull(response.data.twitter_username)

		// Check if the publisher was correctly created on the server
		let objResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: response.data.uuid
		})

		assert.equal(objResponse.status, 200)
		assert.equal(objResponse.data.tableObject.Uuid, response.data.uuid)
		assert.equal(
			Object.keys(objResponse.data.tableObject.Properties).length,
			1
		)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("name"), name)
	})
})