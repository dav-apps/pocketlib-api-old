import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'
import * as ErrorCodes from '../errorCodes.js'

const getAuthorEndpointUrl = `${constants.apiBaseUrl}/author/{0}`

describe("GetAuthor endpoint", () => {
	it("should not return author that does not exist", async () => {
		try {
			await axios({
				method: 'get',
				url: getAuthorEndpointUrl.replace('{0}', "asdasdasd")
			})
		} catch (error) {
			assert.equal(error.response.status, 404)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.AuthorDoesNotExist)
			return
		}

		assert.fail()
	})

	it("should not return author if the table object is not an author", async () => {
		try {
			await axios({
				method: 'get',
				url: getAuthorEndpointUrl.replace('{0}', constants.davUser.authors[0].bios[0].uuid)
			})
		} catch (error) {
			assert.equal(error.response.status, 403)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.ActionNotAllowed)
			return
		}

		assert.fail()
	})

	it("should return author", async () => {
		await testGetAuthor(constants.authorUser.author)
	})

	it("should return author of admin", async () => {
		await testGetAuthor(constants.davUser.authors[0])
	})
})

async function testGetAuthor(author) {
	let response

	try {
		response = await axios({
			method: 'get',
			url: getAuthorEndpointUrl.replace('{0}', author.uuid),
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
	assert.equal(response.data.profile_image, author.profileImage != null)
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

		assert.equal(responseCollection.uuid, collection.uuid)

		for (let j = 0; j < collection.names.length; j++) {
			let name = collection.names[j]
			let responseName = responseCollection.names[j]

			assert.isUndefined(responseName.uuid)
			assert.equal(responseName.name, name.name)
			assert.equal(responseName.language, name.language)
		}
	}
}