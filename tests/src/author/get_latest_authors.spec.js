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

		let i = 0
		for (let author of response.data.authors) {
			assert.equal(author.uuid, authors[i].uuid)
			assert.equal(author.first_name, authors[i].firstName)
			assert.equal(author.last_name, authors[i].lastName)
			assert.equal(author.website_url, authors[i].websiteUrl)
			assert.equal(author.facebook_username, authors[i].facebookUsername)
			assert.equal(author.instagram_username, authors[i].instagramUsername)
			assert.equal(author.twitter_username, authors[i].twitterUsername)
			assert.equal(author.profile_image_blurhash, authors[i].profileImageBlurhash)

			i++
		}
	})

	it("should return latest authors with limit", async () => {
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
	})
})