import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'
import * as ErrorCodes from '../errorCodes.js'

const getStoreBookCollectionEndpointUrl = `${constants.apiBaseUrl}/store/collection/{0}`

describe("GetStoreBookCollection endpoint", async () => {
	it("should not return collection with access token for session that does not exist", async () => {
		try {
			await axios({
				method: 'get',
				url: getStoreBookCollectionEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].uuid),
				headers: {
					Authorization: "sdaaasdasd",
					'Content-Type': 'application/json'
				}
			})
		} catch (error) {
			assert.equal(404, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.SessionDoesNotExist, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not return collection with access token for another app", async () => {
		try {
			await axios({
				method: 'get',
				url: getStoreBookCollectionEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].uuid),
				headers: {
					Authorization: constants.testUserTestAppAccessToken
				}
			})
		} catch (error) {
			assert.equal(403, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.ActionNotAllowed, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not return collection if the store book collection does not exist", async () => {
		try {
			await axios({
				method: 'get',
				url: getStoreBookCollectionEndpointUrl.replace('{0}', "asdasdasd"),
				headers: {
					Authorization: constants.authorUser.accessToken
				}
			})
		} catch (error) {
			assert.equal(404, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.StoreBookCollectionDoesNotExist, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should return collection with all store books if the user is the author", async () => {
		let author = constants.authorUser.author
		let collection = author.collections[1]

		await testGetCollectionWithAllStoreBooks(author, collection, constants.authorUser.accessToken)
	})

	it("should return collection with all store books if the user is an admin", async () => {
		let author = constants.authorUser.author
		let collection = author.collections[1]

		await testGetCollectionWithAllStoreBooks(author, collection, constants.davUser.accessToken)
	})

	it("should return collection with published store books if the user is not the author", async () => {
		let author = constants.authorUser.author
		let collection = author.collections[1]

		await testGetCollectionWithPublishedStoreBooks(author, collection, constants.testUser.accessToken)
	})

	it("should return collection of admin with all store books if the user is the author", async () => {
		let author = constants.davUser.authors[0]
		let collection = author.collections[0]

		await testGetCollectionWithAllStoreBooks(author, collection, constants.davUser.accessToken)
	})

	it("should return collection of admin with published store books if the user is not the author", async () => {
		let author = constants.davUser.authors[0]
		let collection = author.collections[0]

		await testGetCollectionWithPublishedStoreBooks(author, collection, constants.testUser.accessToken)
	})

	it("should return collection with published store books if the user is not logged in", async () => {
		let author = constants.authorUser.author
		let collection = author.collections[1]

		await testGetCollectionWithPublishedStoreBooks(author, collection, null)
	})

	it("should return collection of admin with published store books if the user is not logged in", async () => {
		let author = constants.davUser.authors[0]
		let collection = author.collections[0]

		await testGetCollectionWithPublishedStoreBooks(author, collection, null)
	})

	async function testGetCollectionWithAllStoreBooks(author, collection, accessToken) {
		let response

		try {
			let requestConfig = {
				method: 'get',
				url: getStoreBookCollectionEndpointUrl.replace('{0}', collection.uuid)
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

		assert.equal(200, response.status)
		assert.equal(collection.uuid, response.data.uuid)
		assert.equal(author.uuid, response.data.author)

		assert.equal(collection.names.length, response.data.names.length)

		for (let i = 0; i < collection.names.length; i++) {
			let collectionName = collection.names[i]
			let responseCollectionName = response.data.names[i]

			assert.equal(collectionName.name, responseCollectionName.name)
			assert.equal(collectionName.language, responseCollectionName.language)
		}

		assert.equal(collection.books.length, response.data.books.length)

		for (let i = 0; i < collection.books.length; i++) {
			let book = collection.books[i]
			let responseBook = response.data.books[i]

			assert.equal(book.uuid, responseBook.uuid)
			assert.equal(book.title, responseBook.title)
			assert.equal(book.description, responseBook.description)
			assert.equal(book.language, responseBook.language)
			assert.equal(book.status, responseBook.status)
			assert.equal(book.cover != null, responseBook.cover)
			assert.equal(book.coverAspectRatio, responseBook.cover_aspect_ratio)
			assert.equal(book.coverBlurhash, responseBook.cover_blurhash)
			assert.equal(book.file != null, responseBook.file)
			assert.equal(book.fileName, responseBook.file_name)
		}
	}

	async function testGetCollectionWithPublishedStoreBooks(author, collection, accessToken) {
		let response

		try {
			let requestConfig = {
				method: 'get',
				url: getStoreBookCollectionEndpointUrl.replace('{0}', collection.uuid)
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

		assert.equal(200, response.status)
		assert.equal(collection.uuid, response.data.uuid)
		assert.equal(author.uuid, response.data.author)

		assert.equal(collection.names.length, response.data.names.length)

		for (let i = 0; i < collection.names.length; i++) {
			let collectionName = collection.names[i]
			let responseCollectionName = response.data.names[i]

			assert.equal(collectionName.name, responseCollectionName.name)
			assert.equal(collectionName.language, responseCollectionName.language)
		}

		let booksCount = 0
		for (let i = 0; i < collection.books.length; i++) {
			let book = collection.books[i]
			let responseBook = response.data.books[booksCount]

			if (book.status != "published") continue
			booksCount++

			assert.equal(book.uuid, responseBook.uuid)
			assert.equal(book.title, responseBook.title)
			assert.equal(book.description, responseBook.description)
			assert.equal(book.language, responseBook.language)
			assert.equal(book.status, responseBook.status)
			assert.equal(book.cover != null, responseBook.cover)
			assert.equal(book.coverAspectRatio, responseBook.cover_aspect_ratio)
			assert.equal(book.coverBlurhash, responseBook.cover_blurhash)
			assert.equal(book.file != null, responseBook.file)
			assert.equal(book.fileName, responseBook.file_name)
		}

		assert.equal(booksCount, response.data.books.length)
	}
})