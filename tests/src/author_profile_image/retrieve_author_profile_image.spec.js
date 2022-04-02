import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'
import * as utils from '../utils.js'
import * as ErrorCodes from '../errorCodes.js'

const retrieveAuthorProfileImageEndpoint = `${constants.apiBaseUrl}/authors/{0}/profile_image`

describe("GetProfileImageOfAuthor endpoint", () => {
	it("should not return profile image of author without access token", async () => {
		try {
			await axios({
				method: 'get',
				url: retrieveAuthorProfileImageEndpoint.replace('{0}', "mine")
			})
		} catch (error) {
			assert.equal(error.response.status, 401)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.AuthorizationHeaderMissing)
			return
		}

		assert.fail()
	})

	it("should not return profile image of author with access token for session that does not exist", async () => {
		try {
			await axios({
				method: 'get',
				url: retrieveAuthorProfileImageEndpoint.replace('{0}', "mine"),
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

	it("should not return profile image of author with access token for another app", async () => {
		try {
			await axios({
				method: 'get',
				url: retrieveAuthorProfileImageEndpoint.replace('{0}', "mine"),
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

	it("should not return profile image of author if the user is not an author", async () => {
		try {
			await axios({
				method: 'get',
				url: retrieveAuthorProfileImageEndpoint.replace('{0}', "mine"),
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

	it("should not return profile image of author if the user is an admin", async () => {
		try {
			await axios({
				method: 'get',
				url: retrieveAuthorProfileImageEndpoint.replace('{0}', "mine"),
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

	it("should not return profile image if the author has no profile image", async () => {
		try {
			await axios({
				method: 'get',
				url: retrieveAuthorProfileImageEndpoint.replace('{0}', constants.davUser.authors[1].uuid),
				headers: {
					Authorization: constants.authorUser.accessToken
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 404)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.AuthorProfileImageItemDoesNotExist)
			return
		}

		assert.fail()
	})

	it("should not return profile image if the author does not exist", async () => {
		try {
			await axios({
				method: 'get',
				url: retrieveAuthorProfileImageEndpoint.replace('{0}', "adasdasdasdasad"),
				headers: {
					Authorization: constants.davUser.accessToken
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 404)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.AuthorDoesNotExist)
			return
		}
	})

	it("should return profile image of author", async () => {
		let author = constants.davUser.authors[0]
		let response

		try {
			response = await axios({
				method: 'get',
				url: retrieveAuthorProfileImageEndpoint.replace('{0}', author.uuid),
				params: {
					fields: "*"
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 3)
		assert.equal(response.data.uuid, author.profileImageItem.uuid)
		assert.isNotNull(response.data.url)
		assert.equal(response.data.blurhash, author.profileImageItem.blurhash)
	})

	it("should return profile image of author of user", async () => {
		let author = constants.authorUser.author
		let response

		try {
			response = await axios({
				method: 'get',
				url: retrieveAuthorProfileImageEndpoint.replace('{0}', "mine"),
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
		assert.equal(response.data.uuid, author.profileImageItem.uuid)
		assert.isNotNull(response.data.url)
		assert.equal(response.data.blurhash, author.profileImageItem.blurhash)
	})
})