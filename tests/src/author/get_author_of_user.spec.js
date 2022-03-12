import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'
import * as ErrorCodes from '../errorCodes.js'

const getAuthorOfUserEndpointUrl = `${constants.apiBaseUrl}/author`

describe("GetAuthorOfUser endpoint", () => {
	it("should not return author without access token", async () => {
		try {
			await axios({
				method: 'get',
				url: getAuthorOfUserEndpointUrl
			})
		} catch (error) {
			assert.equal(error.response.status, 401)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.AuthorizationHeaderMissing)
			return
		}

		assert.fail()
	})

	it("should not return author with access token for session that does not exist", async () => {
		try {
			await axios({
				method: 'get',
				url: getAuthorOfUserEndpointUrl,
				headers: {
					Authorization: "asdasdasdasdasd"
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

	it("should not return author with access token for another app", async () => {
		try {
			await axios({
				method: 'get',
				url: getAuthorOfUserEndpointUrl,
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

	it("should not return author if the user is an admin", async () => {
		try {
			await axios({
				method: 'get',
				url: getAuthorOfUserEndpointUrl,
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
	})

	it("should not return author if the user is not an author", async () => {
		try {
			await axios({
				method: 'get',
				url: getAuthorOfUserEndpointUrl,
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

	it("should return the author", async () => {
		let author = constants.authorUser.author
		let response

		try {
			response = await axios({
				method: 'get',
				url: getAuthorOfUserEndpointUrl,
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
		assert.equal(response.data.uuid, author.uuid)
		assert.equal(response.data.first_name, author.firstName)
		assert.equal(response.data.last_name, author.lastName)
		assert.equal(response.data.website_url, author.websiteUrl)
		assert.equal(response.data.facebook_username, author.facebookUsername)
		assert.equal(response.data.instagram_username, author.instagramUsername)
		assert.equal(response.data.twitter_username, author.twitterUsername)
		assert.equal(response.data.bios.length, author.bios.length)
		assert.equal(response.data.collections.length, author.collections.length)
		assert.isTrue(response.data.profile_image)
		assert.equal(response.data.profile_image_blurhash, author.profileImageBlurhash)

		for (let i = 0; i < author.bios.length; i++) {
			let bio = author.bios[i]
			let responseBio = response.data.bios[i]

			assert.isUndefined(responseBio.uuid)
			assert.equal(responseBio.bio, bio.bio)
			assert.equal(responseBio.language, bio.language)
		}

		for (let i = 0; i < author.collections.length; i++) {
			let collection = author.collections[i]
			let responseCollection = response.data.collections[i]

			assert.equal(collection.uuid, responseCollection.uuid)

			for (let j = 0; j < collection.names.length; j++) {
				let name = collection.names[j]
				let responseName = responseCollection.names[j]

				assert.isUndefined(responseName.uuid)
				assert.equal(responseName.name, name.name)
				assert.equal(responseName.language, name.language)
			}
		}
	})
})