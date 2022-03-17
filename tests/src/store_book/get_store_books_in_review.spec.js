import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'
import * as ErrorCodes from '../errorCodes.js'

const getStoreBooksInReviewEndpointUrl = `${constants.apiBaseUrl}/store/books/review`

describe("GetStoreBooksInReview endpoint", () => {
	it("should not return store books in review without access token", async () => {
		try {
			await axios({
				method: 'get',
				url: getStoreBooksInReviewEndpointUrl
			})
		} catch (error) {
			assert.equal(error.response.status, 401)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.AuthorizationHeaderMissing)
			return
		}

		assert.fail()
	})

	it("should not return store books in review with access token for session that does not exist", async () => {
		try {
			await axios({
				method: 'get',
				url: getStoreBooksInReviewEndpointUrl,
				headers: {
					Authorization: "asdasdasd"
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

	it("should not return store books in review with access token for another app", async () => {
		try {
			await axios({
				method: 'get',
				url: getStoreBooksInReviewEndpointUrl,
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

	it("should not return store books in review if the user is not an admin", async () => {
		try {
			await axios({
				method: 'get',
				url: getStoreBooksInReviewEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken
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

	it("should return store books in review", async () => {
		let response

		try {
			response = await axios({
				method: 'get',
				url: getStoreBooksInReviewEndpointUrl,
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

		// Find all store books in review
		let storeBooks = []
		for (let collection of constants.authorUser.author.collections) {
			for (let storeBook of collection.books) {
				if (storeBook.status == "review") {
					storeBooks.push(storeBook)
				}
			}
		}

		for (let author of constants.davUser.authors) {
			for (let collection of author.collections) {
				for (let storeBook of collection.books) {
					if (storeBook.status == "review") {
						storeBooks.push(storeBook)
					}
				}
			}
		}

		assert.equal(response.status, 200)
		assert.equal(response.data.books.length, storeBooks.length)

		for (let book of response.data.books) {
			let storeBook = storeBooks.find(sBook => sBook.uuid == book.uuid)
			let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]

			assert.equal(book.uuid, storeBook.uuid)
			assert.equal(book.title, storeBookRelease.title)
			assert.equal(book.description, storeBookRelease.description)
			assert.equal(book.language, storeBook.language)
			assert.equal(book.price, storeBook.price ?? 0)
			assert.equal(book.isbn, storeBook.isbn)
			assert.equal(book.cover, storeBookRelease.coverItem != null)
			assert.equal(book.cover_aspect_ratio, storeBookRelease.coverItem?.aspectRatio)
			assert.equal(book.cover_blurhash, storeBookRelease.coverItem?.blurhash)
			assert.equal(book.file, storeBookRelease.fileItem != null)
			assert.equal(book.file_name, storeBookRelease.fileItem?.fileName)
			assert.equal(book.categories.length, storeBookRelease.categories.length)

			for (let key of book.categories) {
				let category = constants.categories.find(c => c.key == key)

				assert.isNotNull(category)
				assert.isTrue(storeBookRelease.categories.includes(category.uuid))
			}
		}
	})
})