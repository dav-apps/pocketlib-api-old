import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'
import * as ErrorCodes from '../errorCodes.js'

const getStoreBooksOfCollectionEndpointUrl = `${constants.apiBaseUrl}/store/book/collection/{0}/books`

describe("GetStoreBooksOfCollection endpoint", () => {
	it("should not return store books of collection with access token for session that does not exist", async () => {
		try {
			await axios({
				method: 'get',
				url: getStoreBooksOfCollectionEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].uuid),
				headers: {
					Authorization: "sdaaasdasd",
					'Content-Type': 'application/json'
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

	it("should not return store books of collection with access token for another app", async () => {
		try {
			await axios({
				method: 'get',
				url: getStoreBooksOfCollectionEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].uuid),
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

	it("should not return store books of collection that does not exist", async () => {
		try {
			await axios({
				method: 'get',
				url: getStoreBooksOfCollectionEndpointUrl.replace('{0}', "asdasdasd"),
				headers: {
					Authorization: constants.authorUser.accessToken
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 404)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.StoreBookCollectionDoesNotExist)
			return
		}

		assert.fail()
	})

	it("should return all store books of collection if the user is the author", async () => {
		let author = constants.authorUser.author
		let collection = author.collections[1]

		await testGetAllStoreBooksOfCollection(collection, constants.authorUser.accessToken)
	})

	it("should return collection with all store books if the user is an admin", async () => {
		let author = constants.authorUser.author
		let collection = author.collections[1]

		await testGetAllStoreBooksOfCollection(collection, constants.davUser.accessToken)
	})

	it("should return collection with published store books if the user is not the author", async () => {
		let author = constants.authorUser.author
		let collection = author.collections[1]

		await testGetPublishedStoreBooksOfCollection(author, collection, constants.testUser.accessToken)
	})

	it("should return collection of admin with all store books if the user is the author", async () => {
		let author = constants.davUser.authors[0]
		let collection = author.collections[0]

		await testGetAllStoreBooksOfCollection(collection, constants.davUser.accessToken)
	})

	it("should return collection of admin with published store books if the user is not the author", async () => {
		let author = constants.davUser.authors[0]
		let collection = author.collections[0]

		await testGetPublishedStoreBooksOfCollection(author, collection, constants.testUser.accessToken)
	})

	it("should return collection with published store books if the user is not logged in", async () => {
		let author = constants.authorUser.author
		let collection = author.collections[1]

		await testGetPublishedStoreBooksOfCollection(author, collection, null)
	})

	it("should return collection of admin with published store books if the user is not logged in", async () => {
		let author = constants.davUser.authors[0]
		let collection = author.collections[0]

		await testGetPublishedStoreBooksOfCollection(author, collection, null)
	})

	async function testGetAllStoreBooksOfCollection(collection, accessToken) {
		let response

		try {
			let requestConfig = {
				method: 'get',
				url: getStoreBooksOfCollectionEndpointUrl.replace('{0}', collection.uuid),
				params: {
					fields: "*"
				}
			}

			if (accessToken) {
				requestConfig.headers = {
					Authorization: accessToken
				}
			}

			response = await axios(requestConfig)
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(response.data.books.length, collection.books.length)

		for (let i = 0; i < collection.books.length; i++) {
			let storeBook = collection.books[i]
			let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
			let responseBook = response.data.books[i]

			assert.equal(responseBook.uuid, storeBook.uuid)
			assert.equal(responseBook.title, storeBookRelease.title)
			assert.equal(responseBook.description, storeBookRelease.description)
			assert.equal(responseBook.language, storeBook.language)
			assert.equal(responseBook.cover_aspect_ratio, storeBookRelease.coverItem?.aspectRatio)
			assert.equal(responseBook.cover_blurhash, storeBookRelease.coverItem?.blurhash)
		}
	}

	async function testGetPublishedStoreBooksOfCollection(author, collection, accessToken) {
		let response

		try {
			let requestConfig = {
				method: 'get',
				url: getStoreBooksOfCollectionEndpointUrl.replace('{0}', collection.uuid),
				params: {
					fields: "*"
				}
			}

			if (accessToken) {
				requestConfig.headers = {
					Authorization: accessToken
				}
			}

			response = await axios(requestConfig)
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)

		let booksCount = 0
		for (let i = 0; i < collection.books.length; i++) {
			let storeBook = collection.books[i]
			let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
			let responseBook = response.data.books[booksCount]

			if (storeBook.status != "published") continue
			booksCount++

			assert.equal(responseBook.uuid, storeBook.uuid)
			assert.equal(responseBook.title, storeBookRelease.title)
			assert.equal(responseBook.description, storeBookRelease.description)
			assert.equal(responseBook.language, storeBook.language)
			assert.equal(responseBook.cover_aspect_ratio, storeBookRelease.coverItem?.aspectRatio)
			assert.equal(responseBook.cover_blurhash, storeBookRelease.coverItem?.blurhash)
		}

		assert.equal(response.data.books.length, booksCount)
	}
})