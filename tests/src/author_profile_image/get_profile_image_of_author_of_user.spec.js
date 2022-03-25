import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import { TableObjectsController } from 'dav-js'
import constants from '../constants.js'
import * as utils from '../utils.js'
import * as ErrorCodes from '../errorCodes.js'

const getProfileImageOfAuthorOfUserEndpoint = `${constants.apiBaseUrl}/author/profile_image`
var resetAuthors = false
var resetAuthorProfileImages = false

afterEach(async () => {
	if (resetAuthors) {
		await utils.resetAuthors()
		resetAuthors = false
	}

	if (resetAuthorProfileImages) {
		await utils.resetAuthorProfileImages()
		resetAuthorProfileImages = false
	}
})

describe("GetProfileImageOfAuthorOfUser endpoint", async () => {
	it("should not return profile image without access token", async () => {
		try {
			await axios({
				method: 'get',
				url: getProfileImageOfAuthorOfUserEndpoint
			})
		} catch (error) {
			assert.equal(error.response.status, 401)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.AuthorizationHeaderMissing)
			return
		}

		assert.fail()
	})

	it("should not return profile image with access token for session that does not exist", async () => {
		try {
			await axios({
				method: 'get',
				url: getProfileImageOfAuthorOfUserEndpoint,
				headers: {
					Authorization: "asdasdasdads"
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

	it("should should not return profile image with access token for another app", async () => {
		try {
			await axios({
				method: 'get',
				url: getProfileImageOfAuthorOfUserEndpoint,
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

	it("should not return profile image if the author has no profile image", async () => {
		resetAuthors = true

		// Remove the profile image uuid from the author table object
		let response = await TableObjectsController.UpdateTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: constants.authorUser.author.uuid,
			properties: {
				profile_image: ""
			}
		})

		assert.equal(response.status, 200)

		try {
			await axios({
				method: 'get',
				url: getProfileImageOfAuthorOfUserEndpoint,
				headers: {
					Authorization: constants.authorUser.accessToken
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 404)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.AuthorProfileImageDoesNotExist)
			return
		}

		assert.fail()
	})

	it("should not return profile image if the user is not an author", async () => {
		try {
			await axios({
				method: 'get',
				url: getProfileImageOfAuthorOfUserEndpoint,
				headers: {
					Authorization: constants.testUser.accessToken
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.UserIsNotAuthor)
			return
		}

		assert.fail()
	})

	it("should not return profile image if the user is an admin", async () => {
		try {
			await axios({
				method: 'get',
				url: getProfileImageOfAuthorOfUserEndpoint,
				headers: {
					Authorization: constants.davUser.accessToken
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

	it("should return profile image", async () => {
		resetAuthorProfileImages = true
		let profileImageContent = "Lorem ipsum dolor sit amet"
		let profileImageType = "image/jpeg"

		// Set the profile image
		try {
			await axios({
				method: 'put',
				url: getProfileImageOfAuthorOfUserEndpoint,
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': profileImageType
				},
				data: profileImageContent
			})
		} catch (error) {
			assert.fail()
		}

		// Try to get the profile image
		let response

		try {
			response = await axios({
				method: 'get',
				url: getProfileImageOfAuthorOfUserEndpoint,
				headers: {
					Authorization: constants.authorUser.accessToken
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(response.headers['content-type'], profileImageType)
		assert.equal(response.data, profileImageContent)
	})
})