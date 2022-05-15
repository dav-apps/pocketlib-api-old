import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'
import * as ErrorCodes from '../errorCodes.js'

const listAuthorsEndpointUrl = `${constants.apiBaseUrl}/authors`

describe("ListAuthors endpoint", () => {
	it("should not return authors of admin without access token", async () => {
		try {
			await axios({
				method: 'get',
				url: listAuthorsEndpointUrl,
				params: {
					mine: true
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 401)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.AuthorizationHeaderMissing)
			return
		}

		assert.fail()
	})

	it("should not return authors of admin with access token for session that does not exist", async () => {
		try {
			await axios({
				method: 'get',
				url: listAuthorsEndpointUrl,
				headers: {
					Authorization: "asdasdasdasdasd"
				},
				params: {
					mine: true
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

	it("should not return authors of admin with access token for another app", async () => {
		try {
			await axios({
				method: 'get',
				url: listAuthorsEndpointUrl,
				headers: {
					Authorization: constants.testUserTestAppAccessToken
				},
				params: {
					mine: true
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

	it("should not return authors of admin if the user is not an admin", async () => {
		try {
			await axios({
				method: 'get',
				url: listAuthorsEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken
				},
				params: {
					mine: true
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

	it("should return authors of admin", async () => {
		let response

		try {
			response = await axios({
				method: 'get',
				url: listAuthorsEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken
				},
				params: {
					fields: "*",
					mine: true
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 2)
		assert.equal(response.data.items.length, constants.davUser.authors.length)

		for (let author of constants.davUser.authors) {
			let responseAuthor = response.data.items.find(a => a.uuid == author.uuid)

			assert.isNotNull(responseAuthor)
			assert.equal(Object.keys(responseAuthor).length, 10)
			assert.equal(responseAuthor.uuid, author.uuid)
			assert.isNull(responseAuthor.publisher)
			assert.equal(responseAuthor.first_name, author.firstName)
			assert.equal(responseAuthor.last_name, author.lastName)
			assert.equal(responseAuthor.website_url, author.websiteUrl)
			assert.equal(responseAuthor.facebook_username, author.facebookUsername)
			assert.equal(responseAuthor.instagram_username, author.instagramUsername)
			assert.equal(responseAuthor.twitter_username, author.twitterUsername)
			assert.equal(responseAuthor.profile_image?.blurhash, author.profileImageItem?.blurhash)

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

	it("should return authors of admin with specified language", async () => {
		let language = "de"
		let response

		try {
			response = await axios({
				method: 'get',
				url: listAuthorsEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken
				},
				params: {
					fields: "*",
					languages: language,
					mine: true
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 2)
		assert.equal(response.data.items.length, constants.davUser.authors.length)

		for (let author of constants.davUser.authors) {
			let responseAuthor = response.data.items.find(a => a.uuid == author.uuid)

			assert.isNotNull(responseAuthor)
			assert.equal(Object.keys(responseAuthor).length, 10)
			assert.equal(responseAuthor.uuid, author.uuid)
			assert.isNull(responseAuthor.publisher)
			assert.equal(responseAuthor.first_name, author.firstName)
			assert.equal(responseAuthor.last_name, author.lastName)
			assert.equal(responseAuthor.website_url, author.websiteUrl)
			assert.equal(responseAuthor.facebook_username, author.facebookUsername)
			assert.equal(responseAuthor.instagram_username, author.instagramUsername)
			assert.equal(responseAuthor.twitter_username, author.twitterUsername)
			assert.equal(responseAuthor.profile_image?.blurhash, author.profileImageItem?.blurhash)

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

	it("should return authors of admin with specified limit and language", async () => {
		let language = "de"
		let response

		try {
			response = await axios({
				method: 'get',
				url: listAuthorsEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken
				},
				params: {
					fields: "*",
					languages: language,
					limit: 1,
					mine: true,
				}
			})
		} catch (error) {
			assert.fail()
		}
	
		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 2)
		assert.equal(response.data.items.length, 1)

		let responseAuthor = response.data.items[0]
		let author = constants.davUser.authors.find(a => a.uuid == responseAuthor.uuid)

		assert.isNotNull(author)
		assert.equal(Object.keys(responseAuthor).length, 10)
		assert.equal(responseAuthor.uuid, author.uuid)
		assert.isNull(responseAuthor.publisher)
		assert.equal(responseAuthor.first_name, author.firstName)
		assert.equal(responseAuthor.last_name, author.lastName)
		assert.equal(responseAuthor.website_url, author.websiteUrl)
		assert.equal(responseAuthor.facebook_username, author.facebookUsername)
		assert.equal(responseAuthor.instagram_username, author.instagramUsername)
		assert.equal(responseAuthor.twitter_username, author.twitterUsername)
		assert.equal(responseAuthor.profile_image?.blurhash, author.profileImageItem?.blurhash)

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
	})

	it("should return latest authors2", async () => {
		let response

		try {
			response = await axios({
				method: 'get',
				url: listAuthorsEndpointUrl,
				params: {
					fields: "*",
					latest: true
				}
			})
		} catch (error) {
			assert.fail()
		}

		// Find all authors with a profile image
		let authors = [{
			author: constants.authorUser.author,
			publisher: null
		}]

		for (let author of constants.davUser.authors) {
			if (author.profileImageItem) {
				authors.push({
					author,
					publisher: null
				})
			}
		}

		for (let author of constants.authorUser.publisher.authors) {
			if (author.profileImageItem) {
				authors.push({
					author,
					publisher: constants.authorUser.publisher.uuid
				})
			}
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 2)
		assert.equal(response.data.items.length, authors.length)

		for (let authorItem of authors) {
			let author = authorItem.author
			let responseAuthor = response.data.items.find(a => a.uuid == author.uuid)

			assert.isNotNull(responseAuthor)
			assert.equal(Object.keys(responseAuthor).length, 10)
			assert.equal(responseAuthor.uuid, author.uuid)
			assert.equal(responseAuthor.publisher, authorItem.publisher)
			assert.equal(responseAuthor.first_name, author.firstName)
			assert.equal(responseAuthor.last_name, author.lastName)
			assert.equal(responseAuthor.website_url, author.websiteUrl)
			assert.equal(responseAuthor.facebook_username, author.facebookUsername)
			assert.equal(responseAuthor.instagram_username, author.instagramUsername)
			assert.equal(responseAuthor.twitter_username, author.twitterUsername)
			assert.equal(responseAuthor.profile_image?.blurhash, author.profileImageItem?.blurhash)

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
				url: listAuthorsEndpointUrl,
				params: {
					fields: "*",
					languages: language,
					latest: true
				}
			})
		} catch (error) {
			assert.fail()
		}

		// Find all authors with a profile image
		let authors = [{
			author: constants.authorUser.author,
			publisher: null
		}]

		for (let author of constants.davUser.authors) {
			if (author.profileImageItem) {
				authors.push({
					author,
					publisher: null
				})
			}
		}

		for (let author of constants.authorUser.publisher.authors) {
			if (author.profileImageItem) {
				authors.push({
					author,
					publisher: constants.authorUser.publisher.uuid
				})
			}
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 2)
		assert.equal(response.data.items.length, authors.length)

		for (let authorItem of authors) {
			let author = authorItem.author
			let responseAuthor = response.data.items.find(a => a.uuid == author.uuid)

			assert.isNotNull(responseAuthor)
			assert.equal(Object.keys(responseAuthor).length, 10)
			assert.equal(responseAuthor.uuid, author.uuid)
			assert.equal(responseAuthor.publisher, authorItem.publisher)
			assert.equal(responseAuthor.first_name, author.firstName)
			assert.equal(responseAuthor.last_name, author.lastName)
			assert.equal(responseAuthor.website_url, author.websiteUrl)
			assert.equal(responseAuthor.facebook_username, author.facebookUsername)
			assert.equal(responseAuthor.instagram_username, author.instagramUsername)
			assert.equal(responseAuthor.twitter_username, author.twitterUsername)
			assert.equal(responseAuthor.profile_image?.blurhash, author.profileImageItem?.blurhash)

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

	it("should return latest authors with specified limit and language", async () => {
		let language = "de"
		let response

		try {
			response = await axios({
				method: 'get',
				url: listAuthorsEndpointUrl,
				params: {
					fields: "*",
					languages: language,
					limit: 1,
					latest: true
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 2)
		assert.equal(response.data.items.length, 1)

		let responseAuthor = response.data.items[0]
		let author = constants.davUser.authors.find(a => a.uuid == responseAuthor.uuid)

		assert.isNotNull(author)
		assert.equal(Object.keys(responseAuthor).length, 10)
		assert.equal(responseAuthor.uuid, author.uuid)
		assert.isNull(responseAuthor.publisher)
		assert.equal(responseAuthor.first_name, author.firstName)
		assert.equal(responseAuthor.last_name, author.lastName)
		assert.equal(responseAuthor.website_url, author.websiteUrl)
		assert.equal(responseAuthor.facebook_username, author.facebookUsername)
		assert.equal(responseAuthor.instagram_username, author.instagramUsername)
		assert.equal(responseAuthor.twitter_username, author.twitterUsername)
		assert.equal(responseAuthor.profile_image?.blurhash, author.profileImageItem?.blurhash)

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
	})

	it("should not return authors of publisher that does not exist", async () => {
		try {
			await axios({
				method: 'get',
				url: listAuthorsEndpointUrl,
				params: {
					publisher: "ksdfkjhsdfhjksdf"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 404)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.PublisherDoesNotExist)
			return
		}

		assert.fail()
	})

	it("should not return authors of publisher with access token for session that does not exist", async () => {
		try {
			await axios({
				method: 'get',
				url: listAuthorsEndpointUrl,
				headers: {
					Authorization: "asdasdasdasdasd"
				},
				params: {
					publisher: constants.authorUser.publisher.uuid
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

	it("should return authors of publisher", async () => {
		let publisher = constants.authorUser.publisher
		let response

		try {
			response = await axios({
				method: 'get',
				url: listAuthorsEndpointUrl,
				params: {
					fields: "*",
					publisher: publisher.uuid
				}
			})
		} catch (error) {
			assert.fail()
		}

		// Find all authors with profile image
		let authors = []

		for (let author of publisher.authors) {
			if (author.profileImageItem) authors.push(author)
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 2)
		assert.equal(response.data.items.length, authors.length)

		for (let author of authors) {
			let responseAuthor = response.data.items.find(a => a.uuid == author.uuid)

			assert.isNotNull(responseAuthor)
			assert.equal(Object.keys(responseAuthor).length, 10)
			assert.equal(responseAuthor.uuid, author.uuid)
			assert.equal(responseAuthor.publisher, publisher.uuid)
			assert.equal(responseAuthor.first_name, author.firstName)
			assert.equal(responseAuthor.last_name, author.lastName)
			assert.equal(responseAuthor.website_url, author.websiteUrl)
			assert.equal(responseAuthor.facebook_username, author.facebookUsername)
			assert.equal(responseAuthor.instagram_username, author.instagramUsername)
			assert.equal(responseAuthor.twitter_username, author.twitterUsername)
			assert.isNotNull(responseAuthor.profile_image.url)
			assert.equal(responseAuthor.profile_image.blurhash, author.profileImageItem.blurhash)

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

	it("should return authors of publisher of user", async () => {
		let publisher = constants.authorUser.publisher
		let response

		try {
			response = await axios({
				method: 'get',
				url: listAuthorsEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken
				},
				params: {
					fields: "*",
					publisher: publisher.uuid
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 2)
		assert.equal(response.data.items.length, publisher.authors.length)

		for (let author of publisher.authors) {
			let responseAuthor = response.data.items.find(a => a.uuid == author.uuid)

			assert.isNotNull(responseAuthor)
			assert.equal(Object.keys(responseAuthor).length, 10)
			assert.equal(responseAuthor.uuid, author.uuid)
			assert.equal(responseAuthor.publisher, publisher.uuid)
			assert.equal(responseAuthor.first_name, author.firstName)
			assert.equal(responseAuthor.last_name, author.lastName)
			assert.equal(responseAuthor.website_url, author.websiteUrl)
			assert.equal(responseAuthor.facebook_username, author.facebookUsername)
			assert.equal(responseAuthor.instagram_username, author.instagramUsername)
			assert.equal(responseAuthor.twitter_username, author.twitterUsername)
			assert.equal(responseAuthor.profile_image?.blurhash, author.profileImageItem?.blurhash)

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