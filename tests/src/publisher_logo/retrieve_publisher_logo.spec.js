import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'
import * as ErrorCodes from '../errorCodes.js'

const retrievePublisherLogoEndpoint = `${constants.apiBaseUrl}/publishers/{0}/logo`

describe("RetrievePublisherLogo endpoint", () => {
	it("should not return logo of publisher without access token", async () => {
		try {
			await axios({
				method: 'get',
				url: retrievePublisherLogoEndpoint.replace('{0}', "mine")
			})
		} catch (error) {
			assert.equal(error.response.status, 401)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.AuthorizationHeaderMissing)
			return
		}

		assert.fail()
	})

	it("should not return logo of publisher with access token for session that does not exist", async () => {
		try {
			await axios({
				method: 'get',
				url: retrievePublisherLogoEndpoint.replace('{0}', "mine"),
				headers: {
					Authorization: "kljdjksdfljsdlsdjfk"
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

	it("should not return logo of publisher with access token for another app", async () => {
		try {
			await axios({
				method: 'get',
				url: retrievePublisherLogoEndpoint.replace('{0}', "mine"),
				headers: {
					Authorization: constants.testUserTestAppAccessToken
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

	it("should not return logo of publisher if the user is not a publisher", async () => {
		try {
			await axios({
				method: 'get',
				url: retrievePublisherLogoEndpoint.replace('{0}', "mine"),
				headers: {
					Authorization: constants.testUser.accessToken
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.UserIsNotPublisher)
			return
		}

		assert.fail()
	})

	it("should not return logo of publisher if the user is an admin", async () => {
		try {
			await axios({
				method: 'get',
				url: retrievePublisherLogoEndpoint.replace('{0}', "mine"),
				headers: {
					Authorization: constants.davUser.accessToken
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.UserIsAdmin)
			return
		}

		assert.fail()
	})

	it("should not return logo if the publisher has no logo", async () => {
		try {
			await axios({
				method: 'get',
				url: retrievePublisherLogoEndpoint.replace('{0}', constants.davUser.publishers[1].uuid),
				headers: {
					Authorization: constants.authorUser.accessToken
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 404)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.PublisherLogoItemDoesNotExist)
			return
		}

		assert.fail()
	})

	it("should not return logo of publisher that does not exist", async () => {
		try {
			await axios({
				method: 'get',
				url: retrievePublisherLogoEndpoint.replace('{0}', "kjsdfjkhsdfhjksdf"),
				headers: {
					Authorization: constants.davUser.accessToken
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 404)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.PublisherDoesNotExist)
			return
		}

		assert.fail()
	})

	it("should return logo of publisher", async () => {
		let publisher = constants.davUser.publishers[0]
		let response

		try {
			response = await axios({
				method: 'get',
				url: retrievePublisherLogoEndpoint.replace('{0}', publisher.uuid),
				params: {
					fields: "*"
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 3)
		assert.equal(response.data.uuid, publisher.logoItem.uuid)
		assert.isNotNull(response.data.url)
		assert.equal(response.data.blurhash, publisher.logoItem.blurhash)
	})

	it("should return logo of publisher of user", async () => {
		let publisher = constants.authorUser.publisher
		let response

		try {
			response = await axios({
				method: 'get',
				url: retrievePublisherLogoEndpoint.replace('{0}', "mine"),
				headers: {
					Authorization: constants.authorUser.accessToken
				},
				params: {
					fields: "*"
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 3)
		assert.equal(response.data.uuid, publisher.logoItem.uuid)
		assert.isNotNull(response.data.url)
		assert.equal(response.data.blurhash, publisher.logoItem.blurhash)
	})
})