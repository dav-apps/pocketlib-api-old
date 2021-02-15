import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'

const getLatestAuthors = `${constants.apiBaseUrl}/api/1/call/authors/latest`

describe("GetLatestAuthors endpoint", () => {
	it("should return latest authors", async () => {
		let response

		try {
			response = await axios.default({
				method: 'get',
				url: getLatestAuthors
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

		assert.equal(200, response.status)
		assert.equal(authors.length, response.data.authors.length)

		let i = 0
		for (let author of response.data.authors) {
			assert.equal(authors[i].uuid, author.uuid)
			assert.equal(authors[i].firstName, author.first_name)
			assert.equal(authors[i].lastName, author.last_name)
			assert.equal(authors[i].websiteUrl, author.website_url)
			assert.equal(authors[i].facebookUsername, author.facebook_username)
			assert.equal(authors[i].instagramUsername, author.instagram_username)
			assert.equal(authors[i].twitterUsername, author.twitter_username)
			assert.equal(authors[i].profileImage != null, author.profile_image)
			assert.equal(authors[i].profileImageBlurhash, author.profile_image_blurhash)

			i++
		}
	})
})