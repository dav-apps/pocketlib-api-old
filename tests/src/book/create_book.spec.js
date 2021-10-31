import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import { TableObjectsController } from 'dav-js'
import constants from '../constants.js'
import * as utils from '../utils.js'
import * as ErrorCodes from '../errorCodes.js'

const createBookEndpointUrl = `${constants.apiBaseUrl}/book`
var resetBooks = false

afterEach(async () => {
	if (resetBooks) {
		await utils.resetBooks()
		resetBooks = false
	}
})

describe("CreateBook endpoint", () => {
	it("should not create book without access token", async () => {
		try {
			await axios({
				method: 'post',
				url: createBookEndpointUrl,
				headers: {
					'Content-Type': 'application/json'
				}
			})
		} catch (error) {
			assert.equal(401, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.AuthorizationHeaderMissing, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not create book with access token for session that does not exist", async () => {
		try {
			await axios({
				method: 'post',
				url: createBookEndpointUrl,
				headers: {
					Authorization: "asdasdasd",
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

	it("should not create book without supported Content-Type", async () => {
		try {
			await axios({
				method: 'post',
				url: createBookEndpointUrl,
				headers: {
					Authorization: constants.klausUser.accessToken,
					'Content-Type': 'application/xml'
				}
			})
		} catch (error) {
			assert.equal(415, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.ContentTypeNotSupported, error.response.data.errors[0].code)
			return
		}
	})

	it("should not create book with access token for another app", async () => {
		try {
			await axios({
				method: 'post',
				url: createBookEndpointUrl,
				headers: {
					Authorization: constants.testUserTestAppAccessToken,
					'Content-Type': 'application/json'
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

	it("should not create book from store book without required fields", async () => {
		try {
			await axios({
				method: 'post',
				url: createBookEndpointUrl,
				headers: {
					Authorization: constants.klausUser.accessToken,
					'Content-Type': 'application/json'
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.StoreBookMissing, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not create book from store book with properties with wrong types", async () => {
		try {
			await axios({
				method: 'post',
				url: createBookEndpointUrl,
				headers: {
					Authorization: constants.klausUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					store_book: false
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.StoreBookWrongType, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not create book from not purchased store book without dav Pro", async () => {
		try {
			await axios({
				method: 'post',
				url: createBookEndpointUrl,
				headers: {
					Authorization: constants.testUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					store_book: constants.authorUser.author.collections[1].books[1].uuid
				}
			})
		} catch (error) {
			assert.equal(422, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.DavProRequired, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should create book from purchased store book without dav Pro", async () => {
		await testShouldCreateBookFromStoreBook(
			constants.testUser.accessToken,
			constants.authorUser.author.collections[3].books[0]
		)
	})

	it("should create book from not purchased store book with dav Pro", async () => {
		await testShouldCreateBookFromStoreBook(
			constants.klausUser.accessToken,
			constants.authorUser.author.collections[3].books[0]
		)
	})

	it("should create book from purchased store book with dav Pro", async () => {
		await testShouldCreateBookFromStoreBook(
			constants.klausUser.accessToken,
			constants.authorUser.author.collections[3].books[0]
		)
	})

	it("should not create book from free not purchased store book without dav Pro", async () => {
		try {
			await axios({
				method: 'post',
				url: createBookEndpointUrl,
				headers: {
					Authorization: constants.testUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					store_book: constants.authorUser.author.collections[4].books[0].uuid
				}
			})
		} catch (error) {
			assert.equal(422, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.FreeStoreBooksMustBePurchased, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should create book from free purchased store book without dav Pro", async () => {
		await testShouldCreateBookFromStoreBook(
			constants.testUser.accessToken,
			constants.davUser.authors[0].collections[1].books[2]
		)
	})

	it("should not create book from free not purchased store book with dav Pro", async () => {
		try {
			await axios({
				method: 'post',
				url: createBookEndpointUrl,
				headers: {
					Authorization: constants.klausUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					store_book: constants.authorUser.author.collections[4].books[0].uuid
				}
			})
		} catch (error) {
			assert.equal(422, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.FreeStoreBooksMustBePurchased, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should create book from free purchased store book with dav Pro", async () => {
		await testShouldCreateBookFromStoreBook(
			constants.klausUser.accessToken,
			constants.davUser.authors[0].collections[1].books[2]
		)
	})

	it("should not create book from store book if the store book is already in the library of the user", async () => {
		try {
			await axios({
				method: 'post',
				url: createBookEndpointUrl,
				headers: {
					Authorization: constants.klausUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					store_book: constants.davUser.authors[0].collections[0].books[0].uuid
				}
			})
		} catch (error) {
			assert.equal(422, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.StoreBookIsAlreadyInLibrary, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})


	it("should create book from unpublished store book as the author", async () => {
		await testShouldCreateBookFromStoreBook(constants.authorUser.accessToken, constants.authorUser.author.collections[1].books[0])
	})

	it("should create book from store book in review as the author", async () => {
		await testShouldCreateBookFromStoreBook(constants.authorUser.accessToken, constants.authorUser.author.collections[0].books[0])
	})

	it("should create book from published store book as the author", async () => {
		await testShouldCreateBookFromStoreBook(constants.authorUser.accessToken, constants.authorUser.author.collections[1].books[1])
	})

	it("should create book from hidden store book as the author", async () => {
		await testShouldCreateBookFromStoreBook(constants.authorUser.accessToken, constants.authorUser.author.collections[0].books[1])
	})


	it("should create book from unpublished store book as admin", async () => {
		await testShouldCreateBookFromStoreBook(constants.davUser.accessToken, constants.authorUser.author.collections[1].books[0])
	})

	it("should create book from store book in review as admin", async () => {
		await testShouldCreateBookFromStoreBook(constants.davUser.accessToken, constants.authorUser.author.collections[0].books[0])
	})

	it("should create book from published store book as admin", async () => {
		await testShouldCreateBookFromStoreBook(constants.davUser.accessToken, constants.authorUser.author.collections[1].books[1])
	})

	it("should create book from hidden store book as admin", async () => {
		await testShouldCreateBookFromStoreBook(constants.davUser.accessToken, constants.authorUser.author.collections[0].books[1])
	})


	it("should not create book from unpublished store book as dav Pro user", async () => {
		await testShouldNotCreateBookFromStoreBook(constants.klausUser.accessToken, constants.authorUser.author.collections[1].books[0])
	})

	it("should not create book from store book in review as dav Pro user", async () => {
		await testShouldNotCreateBookFromStoreBook(constants.klausUser.accessToken, constants.authorUser.author.collections[0].books[0])
	})

	it("should create book from published store book as dav Pro user", async () => {
		await testShouldCreateBookFromStoreBook(constants.klausUser.accessToken, constants.authorUser.author.collections[1].books[1])
	})

	it("should not create book from hidden store book as dav Pro user", async () => {
		await testShouldNotCreateBookFromStoreBook(constants.klausUser.accessToken, constants.authorUser.author.collections[0].books[1])
	})


	async function testShouldCreateBookFromStoreBook(accessToken, storeBook) {
		resetBooks = true

		// Create the book
		let response
		try {
			response = await axios({
				method: 'post',
				url: createBookEndpointUrl,
				headers: {
					Authorization: accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					store_book: storeBook.uuid
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(201, response.status)
		assert(response.data.uuid != null)
		assert.equal(response.data.store_book, storeBook.uuid)
		assert(response.data.file != null)

		// Get the store book file table object
		let storeBookFileObjResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: response.data.file
		})

		if (storeBookFileObjResponse.status != 200) {
			assert.fail()
		}

		if (storeBookFileObjResponse.data.GetPropertyValue("type") == "application/pdf") {
			// PDF Book
			assert.equal(storeBook.title, response.data.title)
			assert.equal(0, response.data.page)
			assert.equal(0, response.data.bookmarks.length)
		} else {
			// EPUB Book
			assert.equal(0, response.data.chapter)
			assert.equal(0, response.data.progress)
		}

		// Check if the book was correctly created on the server
		let bookObjResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: response.data.uuid
		})

		if (bookObjResponse.status != 200) {
			assert.fail()
		}

		assert.equal(response.data.store_book, bookObjResponse.data.GetPropertyValue("store_book"))
		assert.equal(response.data.file, bookObjResponse.data.GetPropertyValue("file"))

		if (storeBookFileObjResponse.data.GetPropertyValue("type") == "application/pdf") {
			// PDF Book
			assert.equal(response.data.title, bookObjResponse.data.GetPropertyValue("title"))
			assert.isNull(bookObjResponse.data.GetPropertyValue("page"))
			assert.isNull(bookObjResponse.data.GetPropertyValue("bookmarks"))
		} else {
			// EPUB Book
			assert.isNull(bookObjResponse.data.GetPropertyValue("chapter"))
			assert.isNull(bookObjResponse.data.GetPropertyValue("progress"))
		}
	}

	async function testShouldNotCreateBookFromStoreBook(accessToken, storeBook) {
		try {
			await axios({
				method: 'post',
				url: createBookEndpointUrl,
				headers: {
					Authorization: accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					store_book: storeBook.uuid
				}
			})
		} catch (error) {
			assert.equal(403, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.ActionNotAllowed, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	}
})