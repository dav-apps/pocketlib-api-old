import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'
import * as ErrorCodes from '../errorCodes.js'

const retrievePublisherEndpointUrl = `${constants.apiBaseUrl}/publishers/{0}`

describe("RetrievePublisher endpoint", () => {
	it("should not return publisher of user with access token for session that does not exist", async () => {
		try {
			await axios({
				method: "get",
				url: retrievePublisherEndpointUrl.replace("{0}", "mine"),
				headers: {
					Authorization: "asdasdasd"
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

	it("should not return publisher of user with access token for another app", async () => {
		try {
			await axios({
				method: "get",
				url: retrievePublisherEndpointUrl.replace("{0}", "mine"),
				headers: {
					Authorization: constants.testUserTestAppAccessToken
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

	it("should not return publisher of user if the user is an admin", async () => {
		try {
			await axios({
				method: "get",
				url: retrievePublisherEndpointUrl.replace("{0}", "mine"),
				headers: {
					Authorization: constants.davUser.accessToken
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0], ErrorCodes.UserIsAdmin)
			return
		}

		assert.fail()
	})

	it("should not return publisher of user if the user is not a publisher", async () => {
		try {
			await axios({
				method: "get",
				url: retrievePublisherEndpointUrl.replace("{0}", "mine"),
				headers: {
					Authorization: constants.testUser.accessToken
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(
				error.response.data.errors[0],
				ErrorCodes.UserIsNotPublisher
			)
			return
		}

		assert.fail()
	})

	it("should not return publisher that does not exist", async () => {
		try {
			await axios({
				method: "get",
				url: retrievePublisherEndpointUrl.replace("{0}", "asdasdasd")
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

	it("should not return publisher if the table object is not a publisher", async () => {
		try {
			await axios({
				method: "get",
				url: retrievePublisherEndpointUrl.replace(
					"{0}",
					constants.davUser.authors[0].uuid
				)
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

	it("should return publisher", async () => {
		await testGetPublisher(constants.authorUser.publisher)
	})

	it("should return publisher of admin", async () => {
		await testGetPublisher(constants.davUser.publishers[0])
	})

	it("should return publisher of user", async () => {
		await testGetPublisher(
			constants.authorUser.publisher,
			"mine",
			constants.authorUser.accessToken
		)
	})
})

async function testGetPublisher(publisher, uuid, accessToken) {
	let response

	try {
		let options = {
			method: "get",
			url: retrievePublisherEndpointUrl.replace(
				"{0}",
				uuid || publisher.uuid
			),
			params: {
				fields:
					"uuid,name,description,website_url,facebook_username,instagram_username,twitter_username"
			}
		}

		if (accessToken) {
			options["headers"] = {
				Authorization: accessToken
			}
		}

		response = await axios(options)
	} catch (error) {
		assert.fail()
	}

	assert.equal(response.status, 200)
	assert.equal(Object.keys(response.data).length, 7)
	assert.equal(response.data.uuid, publisher.uuid)
	assert.equal(response.data.name, publisher.name)
	assert.equal(response.data.description, publisher.description)
	assert.equal(response.data.website_url, publisher.websiteUrl)
	assert.equal(response.data.facebook_username, publisher.facebookUsername)
	assert.equal(response.data.instagram_username, publisher.instagramUsername)
	assert.equal(response.data.twitter_username, publisher.twitterUsername)
}