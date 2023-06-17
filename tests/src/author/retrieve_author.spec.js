import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'
import * as ErrorCodes from '../errorCodes.js'

const retrieveAuthorEndpointUrl = `${constants.apiBaseUrl}/authors/{0}`

describe("RetrieveAuthor endpoint", () => {
	it("should not return author of user with access token for session that does not exist", async () => {
		try {
			await axios({
				method: "get",
				url: retrieveAuthorEndpointUrl.replace("{0}", "mine"),
				headers: {
					Authorization: "asdasdasdasdasd"
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

	it("should not return author of user with access token for another app", async () => {
		try {
			await axios({
				method: "get",
				url: retrieveAuthorEndpointUrl.replace("{0}", "mine"),
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

	it("should not return author of user if the user is an admin", async () => {
		try {
			await axios({
				method: "get",
				url: retrieveAuthorEndpointUrl.replace("{0}", "mine"),
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

	it("should not return author of user if the user is not an author", async () => {
		try {
			await axios({
				method: "get",
				url: retrieveAuthorEndpointUrl.replace("{0}", "mine"),
				headers: {
					Authorization: constants.testUser.accessToken
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0], ErrorCodes.UserIsNotAuthor)
			return
		}

		assert.fail()
	})

	it("should not return author that does not exist", async () => {
		try {
			await axios({
				method: "get",
				url: retrieveAuthorEndpointUrl.replace("{0}", "asdasdasd")
			})
		} catch (error) {
			assert.equal(error.response.status, 404)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(
				error.response.data.errors[0],
				ErrorCodes.AuthorDoesNotExist
			)
			return
		}

		assert.fail()
	})

	it("should not return author if the table object is not an author", async () => {
		try {
			await axios({
				method: "get",
				url: retrieveAuthorEndpointUrl.replace(
					"{0}",
					constants.davUser.authors[0].bios[0].uuid
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

	it("should return author of user", async () => {
		let author = constants.authorUser.author
		let response

		try {
			response = await axios({
				method: "get",
				url: retrieveAuthorEndpointUrl.replace("{0}", "mine"),
				headers: {
					Authorization: constants.authorUser.accessToken
				},
				params: {
					fields:
						"uuid,first_name,last_name,website_url,facebook_username,instagram_username,twitter_username,bio[uuid,bio,language]"
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 8)
		assert.equal(response.data.uuid, author.uuid)
		assert.equal(response.data.first_name, author.firstName)
		assert.equal(response.data.last_name, author.lastName)
		assert.equal(response.data.website_url, author.websiteUrl)
		assert.equal(response.data.facebook_username, author.facebookUsername)
		assert.equal(response.data.instagram_username, author.instagramUsername)
		assert.equal(response.data.twitter_username, author.twitterUsername)

		if (author.bios.length == 0) {
			assert.isNull(response.data.bio)
		} else {
			let authorBio = author.bios.find(b => b.language == "en")

			assert.isNotNull(authorBio)
			assert.equal(response.data.bio.language, "en")
			assert.equal(response.data.bio.bio, authorBio.bio)
		}
	})

	it("should return author of user with specified language", async () => {
		let author = constants.authorUser.author
		let language = "de"
		let response

		try {
			response = await axios({
				method: "get",
				url: retrieveAuthorEndpointUrl.replace("{0}", "mine"),
				headers: {
					Authorization: constants.authorUser.accessToken
				},
				params: {
					fields:
						"uuid,first_name,last_name,website_url,facebook_username,instagram_username,twitter_username,bio[uuid,bio,language]",
					languages: language
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 8)
		assert.equal(response.data.uuid, author.uuid)
		assert.equal(response.data.first_name, author.firstName)
		assert.equal(response.data.last_name, author.lastName)
		assert.equal(response.data.website_url, author.websiteUrl)
		assert.equal(response.data.facebook_username, author.facebookUsername)
		assert.equal(response.data.instagram_username, author.instagramUsername)
		assert.equal(response.data.twitter_username, author.twitterUsername)

		if (author.bios.length == 0) {
			assert.isNull(response.data.bio)
		} else {
			let authorBio = author.bios.find(b => b.language == language)

			if (authorBio == null) {
				assert.equal(response.data.bio.language, "en")

				authorBio = author.bios.find(b => b.language == "en")

				assert.isNotNull(authorBio)
				assert.equal(response.data.bio.value, authorBio.bio)
			} else {
				assert.equal(response.data.bio.language, language)
				assert.equal(response.data.bio.bio, authorBio.bio)
			}
		}
	})

	it("should return author of publisher", async () => {
		let publisher = constants.authorUser.publisher
		let author = publisher.authors[0]
		let response

		try {
			response = await axios({
				method: "get",
				url: retrieveAuthorEndpointUrl.replace("{0}", author.uuid),
				params: {
					fields:
						"uuid,first_name,last_name,website_url,facebook_username,instagram_username,twitter_username,bio[uuid,bio,language]"
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 8)
		assert.equal(response.data.uuid, author.uuid)
		assert.equal(response.data.first_name, author.firstName)
		assert.equal(response.data.last_name, author.lastName)
		assert.equal(response.data.website_url, author.websiteUrl)
		assert.equal(response.data.facebook_username, author.facebookUsername)
		assert.equal(response.data.instagram_username, author.instagramUsername)
		assert.equal(response.data.twitter_username, author.twitterUsername)

		if (author.bios.length == 0) {
			assert.isNull(response.data.bio)
		} else {
			let authorBio = author.bios.find(b => b.language == "en")

			assert.isNotNull(authorBio)
			assert.equal(response.data.bio.language, "en")
			assert.equal(response.data.bio.bio, authorBio.bio)
		}
	})

	it("should return author of publisher of admin", async () => {
		let publisher = constants.davUser.publishers[0]
		let author = publisher.authors[0]
		let response

		try {
			response = await axios({
				method: "get",
				url: retrieveAuthorEndpointUrl.replace("{0}", author.uuid),
				params: {
					fields:
						"uuid,first_name,last_name,website_url,facebook_username,instagram_username,twitter_username,bio[uuid,bio,language]"
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 8)
		assert.equal(response.data.uuid, author.uuid)
		assert.equal(response.data.first_name, author.firstName)
		assert.equal(response.data.last_name, author.lastName)
		assert.equal(response.data.website_url, author.websiteUrl)
		assert.equal(response.data.facebook_username, author.facebookUsername)
		assert.equal(response.data.instagram_username, author.instagramUsername)
		assert.equal(response.data.twitter_username, author.twitterUsername)

		if (author.bios.length == 0) {
			assert.isNull(response.data.bio)
		} else {
			let authorBio = author.bios.find(b => b.language == "en")

			assert.isNotNull(authorBio)
			assert.equal(response.data.bio.language, "en")
			assert.equal(response.data.bio.bio, authorBio.bio)
		}
	})
})

async function testGetAuthor(author) {
	let response

	try {
		response = await axios({
			method: "get",
			url: retrieveAuthorEndpointUrl.replace("{0}", author.uuid),
			params: {
				fields:
					"uuid,first_name,last_name,website_url,facebook_username,instagram_username,twitter_username,bio[uuid,bio,language]"
			}
		})
	} catch (error) {
		assert.fail()
	}

	assert.equal(response.status, 200)
	assert.equal(Object.keys(response.data).length, 8)
	assert.equal(response.data.uuid, author.uuid)
	assert.equal(response.data.first_name, author.firstName)
	assert.equal(response.data.last_name, author.lastName)
	assert.equal(response.data.website_url, author.websiteUrl)
	assert.equal(response.data.facebook_username, author.facebookUsername)
	assert.equal(response.data.instagram_username, author.instagramUsername)
	assert.equal(response.data.twitter_username, author.twitterUsername)

	if (author.bios.length == 0) {
		assert.isNull(response.data.bio)
	} else {
		let authorBio = author.bios.find(b => b.language == "en")

		assert.isNotNull(authorBio)
		assert.equal(response.data.bio.language, "en")
		assert.equal(response.data.bio.bio, authorBio.bio)
	}
}

async function testGetAuthorWithLanguage(author, language) {
	let response

	try {
		response = await axios({
			method: "get",
			url: retrieveAuthorEndpointUrl.replace("{0}", author.uuid),
			params: {
				fields:
					"uuid,first_name,last_name,website_url,facebook_username,instagram_username,twitter_username,bio[uuid,bio,language]",
				languages: language
			}
		})
	} catch (error) {
		assert.fail()
	}

	assert.equal(response.status, 200)
	assert.equal(Object.keys(response.data).length, 8)
	assert.equal(response.data.uuid, author.uuid)
	assert.equal(response.data.first_name, author.firstName)
	assert.equal(response.data.last_name, author.lastName)
	assert.equal(response.data.website_url, author.websiteUrl)
	assert.equal(response.data.facebook_username, author.facebookUsername)
	assert.equal(response.data.instagram_username, author.instagramUsername)
	assert.equal(response.data.twitter_username, author.twitterUsername)

	if (author.bios.length == 0) {
		assert.isNull(response.data.bio)
	} else {
		let authorBio = author.bios.find(b => b.language == language)

		if (authorBio == null) {
			assert.equal(response.data.bio.language, "en")

			authorBio = author.bios.find(b => b.language == "en")

			assert.isNotNull(authorBio)
			assert.equal(response.data.bio.value, authorBio.bio)
		} else {
			assert.equal(response.data.bio.language, language)
			assert.equal(response.data.bio.bio, authorBio.bio)
		}
	}
}