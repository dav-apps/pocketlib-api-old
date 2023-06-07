import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'
import * as ErrorCodes from '../errorCodes.js'

const listPublishersEndpointUrl = `${constants.apiBaseUrl}/publishers`

describe("ListPublishers endpoint", () => {
	it("should not return publishers of admin without access token", async () => {
		try {
			await axios({
				method: "get",
				url: listPublishersEndpointUrl,
				params: {
					mine: true
				}
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

	it("should not return publishers of admin with access token for session that does not exist", async () => {
		try {
			await axios({
				method: "get",
				url: listPublishersEndpointUrl,
				headers: {
					Authorization: "jksdfhjsdfjhksdf"
				},
				params: {
					mine: true
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

	it("should not return publishers of admin with access token for another app", async () => {
		try {
			await axios({
				method: "get",
				url: listPublishersEndpointUrl,
				headers: {
					Authorization: constants.testUserTestAppAccessToken
				},
				params: {
					mine: true
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

	it("should not return publishers of admin if the user is not an admin", async () => {
		try {
			await axios({
				method: "get",
				url: listPublishersEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken
				},
				params: {
					mine: true
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0], ErrorCodes.UserIsNotAdmin)
			return
		}

		assert.fail()
	})

	it("should return publishers of admin", async () => {
		let response

		try {
			response = await axios({
				method: "get",
				url: listPublishersEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken
				},
				params: {
					fields:
						"uuid,name,description,website_url,facebook_username,instagram_username,twitter_username",
					mine: true
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(
			Object.keys(response.data.items).length,
			constants.davUser.publishers.length
		)
		assert.equal(
			response.data.items.length,
			constants.davUser.publishers.length
		)

		for (let publisher of constants.davUser.publishers) {
			let responsePublisher = response.data.items.find(
				p => p.uuid == publisher.uuid
			)

			assert.isNotNull(responsePublisher)
			assert.equal(Object.keys(responsePublisher).length, 7)
			assert.equal(responsePublisher.uuid, publisher.uuid)
			assert.equal(responsePublisher.name, publisher.name)
			assert.equal(responsePublisher.description, publisher.description)
			assert.equal(responsePublisher.website_url, publisher.websiteUrl)
			assert.equal(
				responsePublisher.facebook_username,
				publisher.facebookUsername
			)
			assert.equal(
				responsePublisher.instagram_username,
				publisher.instagramUsername
			)
			assert.equal(
				responsePublisher.twitter_username,
				publisher.twitterUsername
			)
		}
	})
})