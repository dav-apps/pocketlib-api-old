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

	it("should return author with specified language", async () => {
		await testGetAuthorWithLanguage(constants.authorUser.author, "de")
	})

	it("should return author of admin with specified language", async () => {
		await testGetAuthor(constants.davUser.authors[0], "de")
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
	assert.isNotNull(response.data.bio)
	assert.equal(response.data.website_url, author.websiteUrl)
	assert.equal(response.data.facebook_username, author.facebookUsername)
	assert.equal(response.data.instagram_username, author.instagramUsername)
	assert.equal(response.data.twitter_username, author.twitterUsername)
	assert.equal(response.data.profile_image, author.profileImage != null)
	assert.equal(response.data.profile_image_blurhash, author.profileImageBlurhash)

	let authorBio = author.bios.find(b => b.language == "en")

	assert.isNotNull(authorBio)
	assert.equal(response.data.bio.language, "en")
	assert.equal(response.data.bio.value, authorBio.bio)
}

async function testGetAuthorWithLanguage(author, language) {
	let response

	try {
		response = await axios({
			method: 'get',
			url: getAuthorEndpointUrl.replace('{0}', author.uuid),
			params: {
				fields: "*",
				languages: language
			}
		})
	} catch (error) {
		assert.fail()
	}

	assert.equal(response.status, 200)
	assert.equal(response.data.uuid, author.uuid)
	assert.equal(response.data.first_name, author.firstName)
	assert.equal(response.data.last_name, author.lastName)
	assert.isNotNull(response.data.bio)
	assert.equal(response.data.website_url, author.websiteUrl)
	assert.equal(response.data.facebook_username, author.facebookUsername)
	assert.equal(response.data.instagram_username, author.instagramUsername)
	assert.equal(response.data.twitter_username, author.twitterUsername)
	assert.equal(response.data.profile_image, author.profileImage != null)
	assert.equal(response.data.profile_image_blurhash, author.profileImageBlurhash)

	let authorBio = author.bios.find(b => b.language == language)

	if (authorBio == null) {
		assert.equal(response.data.bio.language, "en")

		authorBio = author.bios.find(b => b.language == "en")

		assert.isNotNull(authorBio)
		assert.equal(response.data.bio.value, authorBio.bio)
	} else {
		assert.equal(response.data.bio.language, language)
		assert.equal(response.data.bio.value, authorBio.bio)
	}
}