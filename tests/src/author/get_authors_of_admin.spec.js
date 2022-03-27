import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'
import * as ErrorCodes from '../errorCodes.js'

const getAuthorsOfAdminEndpointUrl = `${constants.apiBaseUrl}/authors`

describe("GetAuthorsOfAdmin endpoint", () => {
	it("should not return authors without access token", async () => {
		try {
			await axios({
				method: 'get',
				url: getAuthorsOfAdminEndpointUrl
			})
		} catch (error) {
			assert.equal(error.response.status, 401)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.AuthorizationHeaderMissing)
			return
		}

		assert.fail()
	})

	it("should not return authors with access token for session that does not exist", async () => {
		try {
			await axios({
				method: 'get',
				url: getAuthorsOfAdminEndpointUrl,
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

	it("should not return authors with access token for another app", async () => {
		try {
			await axios({
				method: 'get',
				url: getAuthorsOfAdminEndpointUrl,
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

	it("should not return authors if the user is not an admin", async () => {
		try {
			await axios({
				method: 'get',
				url: getAuthorsOfAdminEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.UserIsNotAdmin)
			return
		}

		assert.fail()
	})

	it("should return authors", async () => {
		let response

		try {
			response = await axios({
				method: 'get',
				url: getAuthorsOfAdminEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken
				},
				params: {
					fields: "*"
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(response.data.authors.length, constants.davUser.authors.length)
		
		for (let author of constants.davUser.authors) {
			let responseAuthor = response.data.authors.find(a => a.uuid == author.uuid)

			assert.isNotNull(responseAuthor)
			assert.equal(responseAuthor.uuid, author.uuid)
			assert.equal(responseAuthor.first_name, author.firstName)
			assert.equal(responseAuthor.last_name, author.lastName)
			assert.equal(responseAuthor.website_url, author.websiteUrl)
			assert.equal(responseAuthor.facebook_username, author.facebookUsername)
			assert.equal(responseAuthor.instagram_username, author.instagramUsername)
			assert.equal(responseAuthor.twitter_username, author.twitterUsername)
			assert.equal(responseAuthor.profile_image, author.profileImage != null)
			assert.equal(responseAuthor.profile_image_blurhash, author.profileImageBlurhash)

			if (author.bios.length == 0) {
				assert.isNull(responseAuthor.bio)
			} else {
				let authorBio = author.bios.find(b => b.language == "en")

				assert.isNotNull(authorBio)
				assert.equal(responseAuthor.bio.language, "en")
				assert.equal(responseAuthor.bio.value, authorBio.bio)
			}
		}
	})

	it("should return authors with specified language", async () => {
		let language = "de"
		let response

		try {
			response = await axios({
				method: 'get',
				url: getAuthorsOfAdminEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken
				},
				params: {
					fields: "*",
					languages: language
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(response.data.authors.length, constants.davUser.authors.length)
		
		for (let author of constants.davUser.authors) {
			let responseAuthor = response.data.authors.find(a => a.uuid == author.uuid)

			assert.isNotNull(responseAuthor)
			assert.equal(responseAuthor.uuid, author.uuid)
			assert.equal(responseAuthor.first_name, author.firstName)
			assert.equal(responseAuthor.last_name, author.lastName)
			assert.equal(responseAuthor.website_url, author.websiteUrl)
			assert.equal(responseAuthor.facebook_username, author.facebookUsername)
			assert.equal(responseAuthor.instagram_username, author.instagramUsername)
			assert.equal(responseAuthor.twitter_username, author.twitterUsername)
			assert.equal(responseAuthor.profile_image, author.profileImage != null)
			assert.equal(responseAuthor.profile_image_blurhash, author.profileImageBlurhash)

			if (author.bios.length == 0) {
				assert.isNull(responseAuthor.bio)
			} else {
				let authorBio = author.bios.find(b => b.language == language)

				if (authorBio == null) {
					assert.equal(responseAuthor.bio.language, "en")

					authorBio = author.bios.find(b => b.language == "en")

					assert.isNotNull(authorBio)
					assert.equal(responseAuthor.bio.value, authorBio.bio)
				} else {
					assert.equal(responseAuthor.bio.language, language)
					assert.equal(responseAuthor.bio.value, authorBio.bio)
				}
			}
		}
	})
})