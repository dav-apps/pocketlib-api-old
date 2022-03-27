import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'

const getLatestAuthorsEndpointUrl = `${constants.apiBaseUrl}/authors/latest`

describe("GetLatestAuthors endpoint", () => {
	it("should return latest authors", async () => {
		let response

		try {
			response = await axios({
				method: 'get',
				url: getLatestAuthorsEndpointUrl,
				params: {
					fields: "*"
				}
			})
		} catch (error) {
			assert.fail()
		}

		// Find all authors with a profile image
		let authors = [constants.authorUser.author]
		for (let author of constants.davUser.authors) {
			if (author.profileImage) authors.push(author)
		}
		authors = authors.reverse()

		assert.equal(response.status, 200)
		assert.equal(response.data.authors.length, authors.length)

		for (let author of authors) {
			let responseAuthor = response.data.authors.find(a => a.uuid == author.uuid)

			assert.isNotNull(responseAuthor)
			assert.equal(responseAuthor.uuid, author.uuid)
			assert.equal(responseAuthor.first_name, author.firstName)
			assert.equal(responseAuthor.last_name, author.lastName)
			assert.equal(responseAuthor.website_url, author.websiteUrl)
			assert.equal(responseAuthor.facebook_username, author.facebookUsername)
			assert.equal(responseAuthor.instagram_username, author.instagramUsername)
			assert.equal(responseAuthor.twitter_username, author.twitterUsername)
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

	it("should return latest authors with specified language", async () => {
		let language = "de"
		let response

		try {
			response = await axios({
				method: 'get',
				url: getLatestAuthorsEndpointUrl,
				params: {
					fields: "*",
					languages: language
				}
			})
		} catch (error) {
			assert.fail()
		}

		// Find all authors with a profile image
		let authors = [constants.authorUser.author]
		for (let author of constants.davUser.authors) {
			if (author.profileImage) authors.push(author)
		}
		authors = authors.reverse()

		assert.equal(response.status, 200)
		assert.equal(response.data.authors.length, authors.length)

		for (let author of authors) {
			let responseAuthor = response.data.authors.find(a => a.uuid == author.uuid)

			assert.isNotNull(responseAuthor)
			assert.equal(responseAuthor.uuid, author.uuid)
			assert.equal(responseAuthor.first_name, author.firstName)
			assert.equal(responseAuthor.last_name, author.lastName)
			assert.equal(responseAuthor.website_url, author.websiteUrl)
			assert.equal(responseAuthor.facebook_username, author.facebookUsername)
			assert.equal(responseAuthor.instagram_username, author.instagramUsername)
			assert.equal(responseAuthor.twitter_username, author.twitterUsername)
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

	it("should return latest authors with specified limit", async () => {
		let response

		try {
			response = await axios({
				method: 'get',
				url: getLatestAuthorsEndpointUrl,
				params: {
					fields: "*",
					limit: 1
				}
			})
		} catch (error) {
			assert.fail()
		}

		// Find all authors with a profile image
		let authors = [constants.authorUser.author]
		for (let author of constants.davUser.authors) {
			if (author.profileImage) authors.push(author)
		}

		let author = authors.pop()

		assert.equal(response.status, 200)
		assert.equal(response.data.authors.length, 1)

		let responseAuthor = response.data.authors.pop()
		assert.equal(responseAuthor.uuid, author.uuid)
		assert.equal(responseAuthor.first_name, author.firstName)
		assert.equal(responseAuthor.last_name, author.lastName)
		assert.equal(responseAuthor.website_url, author.websiteUrl)
		assert.equal(responseAuthor.facebook_username, author.facebookUsername)
		assert.equal(responseAuthor.instagram_username, author.instagramUsername)
		assert.equal(responseAuthor.twitter_username, author.twitterUsername)
		assert.equal(responseAuthor.profile_image_blurhash, author.profileImageBlurhash)

		if (author.bios.length == 0) {
			assert.isNull(responseAuthor.bio)
		} else {
			let authorBio = author.bios.find(b => b.language == "en")

			assert.isNotNull(authorBio)
			assert.equal(responseAuthor.bio.language, "en")
			assert.equal(responseAuthor.bio.value, authorBio.bio)
		}
	})
})