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
			let response = await axios({
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

		for (let i = 0; i < constants.davUser.authors.length; i++) {
			let author = constants.davUser.authors[i]
			let responseAuthor = response.data.authors[i]

			assert.equal(responseAuthor.uuid, author.uuid)
			assert.equal(responseAuthor.first_name, author.firstName)
			assert.equal(responseAuthor.last_name, author.lastName)
			assert.equal(responseAuthor.website_url, author.websiteUrl)
			assert.equal(responseAuthor.facebook_username, author.facebookUsername)
			assert.equal(responseAuthor.instagram_username, author.instagramUsername)
			assert.equal(responseAuthor.twitter_username, author.twitterUsername)
			assert.equal(responseAuthor.bios.length, author.bios.length)
			assert.equal(responseAuthor.collections.length, author.collections.length)
			assert.equal(responseAuthor.series.length, author.series.length)
			assert.equal(responseAuthor.profile_image_blurhash, author.profileImageBlurhash)
			assert.equal(responseAuthor.profile_image, author.profileImage != null)

			for (let j = 0; j < author.bios.length; j++) {
				let bio = author.bios[j]
				let responseBio = responseAuthor.bios[j]

				assert.isUndefined(responseBio.uuid)
				assert.equal(responseBio.bio, bio.bio)
				assert.equal(responseBio.language, bio.language)
			}

			for (let j = 0; j < author.collections.length; j++) {
				let collection = author.collections[j]
				let responseCollection = responseAuthor.collections[j]

				assert.equal(responseCollection.uuid, collection.uuid)

				for (let k = 0; k < collection.names.length; k++) {
					let name = collection.names[k]
					let responseName = responseCollection.names[k]

					assert.isUndefined(responseName.uuid)
					assert.equal(responseName.name, name.name)
					assert.equal(responseName.language, name.language)
				}
			}

			for (let j = 0; j < author.series.length; j++) {
				let series = author.series[j]
				let responseSeries = responseAuthor.series[j]

				assert.equal(responseSeries.uuid, series.uuid)

				for (let k = 0; k < series.names.length; k++) {
					let name = series.names[k]
					let responseName = responseSeries.names[k]

					assert.isUndefined(responseName.uuid)
					assert.equal(responseName.name, name.name)
					assert.equal(responseName.language, name.language)
				}
			}
		}
	})
})