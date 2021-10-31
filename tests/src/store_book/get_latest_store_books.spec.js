import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'
import * as ErrorCodes from '../errorCodes.js'

const getLatestStoreBooksEndpointUrl = `${constants.apiBaseUrl}/store/books/latest`

describe("GetLatestStoreBooks endpoint", async () => {
	it("should not return latest store books with not supported language", async () => {
		try {
			await axios({
				method: 'get',
				url: getLatestStoreBooksEndpointUrl,
				params: {
					languages: "asdasd"
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.LanguageNotSupported, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should return latest store books", async () => {
		let response

		try {
			response = await axios({
				method: 'get',
				url: getLatestStoreBooksEndpointUrl
			})
		} catch (error) {
			assert.fail()
		}

		// Find all published store books with language = en
		let storeBooks = []
		for (let collection of constants.authorUser.author.collections) {
			for (let storeBook of collection.books) {
				if (storeBook.language == "en" && storeBook.status == "published") {
					storeBooks.push(storeBook)
				}
			}
		}

		for (let author of constants.davUser.authors) {
			for (let collection of author.collections) {
				for (let storeBook of collection.books) {
					if (storeBook.language == "en" && storeBook.status == "published") {
						storeBooks.push(storeBook)
					}
				}
			}
		}

		storeBooks = storeBooks.reverse()

		assert.equal(200, response.status)
		assert.equal(storeBooks.length, response.data.books.length)

		let i = 0;
		for (let book of response.data.books) {
			let storeBook = storeBooks[i]
			assert.equal(storeBook.uuid, book.uuid)
			assert.equal(storeBook.title, book.title)
			assert.equal(storeBook.description, book.description)
			assert.equal(storeBook.language, book.language)
			assert.equal(storeBook.price ?? 0, book.price)
			assert.equal(storeBook.isbn, book.isbn)
			assert.equal(storeBook.status, book.status)
			assert.equal(storeBook.cover != null, book.cover)
			assert.equal(storeBook.coverAspectRatio, book.cover_aspect_ratio)
			assert.equal(storeBook.coverBlurhash, book.cover_blurhash)
			assert.equal(storeBook.file != null, book.file)
			assert.equal(storeBook.fileName, book.file_name)

			if (storeBook.categories) {
				assert.equal(storeBook.categories.length, book.categories.length)

				for (let key of book.categories) {
					assert(constants.categories.find(c => c.key == key) != null)
				}
			} else {
				assert.equal(0, book.categories.length)
			}

			i++
		}
	})

	it("should return latest store books with single specified language", async () => {
		let response
		let language = "de"

		try {
			response = await axios({
				method: 'get',
				url: getLatestStoreBooksEndpointUrl,
				params: {
					languages: language
				}
			})
		} catch (error) {
			assert.fail()
		}

		// Find all published store books with the language
		let storeBooks = []
		for (let collection of constants.authorUser.author.collections) {
			for (let storeBook of collection.books) {
				if (storeBook.language == language && storeBook.status == "published") {
					storeBooks.push(storeBook)
				}
			}
		}

		for (let author of constants.davUser.authors) {
			for (let collection of author.collections) {
				for (let storeBook of collection.books) {
					if (storeBook.language == language && storeBook.status == "published") {
						storeBooks.push(storeBook)
					}
				}
			}
		}

		storeBooks = storeBooks.reverse()

		assert.equal(200, response.status)
		assert.equal(storeBooks.length, response.data.books.length)

		let i = 0
		for (let book of response.data.books) {
			let storeBook = storeBooks[i]
			assert.equal(storeBook.uuid, book.uuid)
			assert.equal(storeBook.title, book.title)
			assert.equal(storeBook.description, book.description)
			assert.equal(storeBook.language, book.language)
			assert.equal(storeBook.price ?? 0, book.price)
			assert.equal(storeBook.isbn, book.isbn)
			assert.equal(storeBook.status, book.status)
			assert.equal(storeBook.cover != null, book.cover)
			assert.equal(storeBook.coverAspectRatio, book.cover_aspect_ratio)
			assert.equal(storeBook.coverBlurhash, book.cover_blurhash)
			assert.equal(storeBook.file != null, book.file)
			assert.equal(storeBook.fileName, book.file_name)

			if (storeBook.categories) {
				assert.equal(storeBook.categories.length, book.categories.length)

				for (let key of book.categories) {
					assert(constants.categories.find(c => c.key == key) != null)
				}
			} else {
				assert.equal(0, book.categories.length)
			}

			i++
		}
	})

	it("should return latest store books with multiple specified languages", async () => {
		let response
		let languages = ["de", "en"]

		try {
			response = await axios({
				method: 'get',
				url: getLatestStoreBooksEndpointUrl,
				params: {
					languages: languages.join(',')
				}
			})
		} catch (error) {
			assert.fail()
		}

		// Find all published store books with the languages
		let storeBooks = []
		for (let collection of constants.authorUser.author.collections) {
			for (let storeBook of collection.books) {
				if (languages.includes(storeBook.language) && storeBook.status == "published") {
					storeBooks.push(storeBook)
				}
			}
		}

		for (let author of constants.davUser.authors) {
			for (let collection of author.collections) {
				for (let storeBook of collection.books) {
					if (languages.includes(storeBook.language) && storeBook.status == "published") {
						storeBooks.push(storeBook)
					}
				}
			}
		}

		storeBooks = storeBooks.reverse()

		assert.equal(200, response.status)
		assert.equal(storeBooks.length, response.data.books.length)

		let i = 0
		for (let book of response.data.books) {
			let storeBook = storeBooks[i]
			assert.equal(storeBook.uuid, book.uuid)
			assert.equal(storeBook.title, book.title)
			assert.equal(storeBook.description, book.description)
			assert.equal(storeBook.language, book.language)
			assert.equal(storeBook.price ?? 0, book.price)
			assert.equal(storeBook.isbn, book.isbn)
			assert.equal(storeBook.status, book.status)
			assert.equal(storeBook.cover != null, book.cover)
			assert.equal(storeBook.coverAspectRatio, book.cover_aspect_ratio)
			assert.equal(storeBook.coverBlurhash, book.cover_blurhash)
			assert.equal(storeBook.file != null, book.file)
			assert.equal(storeBook.fileName, book.file_name)

			if (storeBook.categories) {
				assert.equal(storeBook.categories.length, book.categories.length)

				for (let key of book.categories) {
					assert(constants.categories.find(c => c.key == key) != null)
				}
			} else {
				assert.equal(0, book.categories.length)
			}

			i++
		}
	})

	it("should return latest store books with limit and page", async () => {
		let response
		let languages = ["de", "en"]
		let limit = 2

		try {
			response = await axios({
				method: 'get',
				url: getLatestStoreBooksEndpointUrl,
				params: {
					languages: languages.join(','),
					limit
				}
			})
		} catch (error) {
			assert.fail()
		}

		// Find all published store books with the languages
		let storeBooks = []
		for (let collection of constants.authorUser.author.collections) {
			for (let storeBook of collection.books) {
				if (languages.includes(storeBook.language) && storeBook.status == "published") {
					storeBooks.push(storeBook)
				}
			}
		}

		for (let author of constants.davUser.authors) {
			for (let collection of author.collections) {
				for (let storeBook of collection.books) {
					if (languages.includes(storeBook.language) && storeBook.status == "published") {
						storeBooks.push(storeBook)
					}
				}
			}
		}

		storeBooks = storeBooks.reverse()
		let pages = Math.ceil(storeBooks.length / limit)

		assert.equal(200, response.status)
		assert.equal(limit, response.data.books.length)
		assert.equal(pages, response.data.pages)

		for (let i = 0; i < limit; i++){
			let storeBook = storeBooks[i]
			let responseBook = response.data.books[i]

			assert.equal(storeBook.uuid, responseBook.uuid)
			assert.equal(storeBook.title, responseBook.title)
			assert.equal(storeBook.description, responseBook.description)
			assert.equal(storeBook.language, responseBook.language)
			assert.equal(storeBook.price ?? 0, responseBook.price)
			assert.equal(storeBook.isbn, responseBook.isbn)
			assert.equal(storeBook.status, responseBook.status)
			assert.equal(storeBook.cover != null, responseBook.cover)
			assert.equal(storeBook.coverAspectRatio, responseBook.cover_aspect_ratio)
			assert.equal(storeBook.coverBlurhash, responseBook.cover_blurhash)
			assert.equal(storeBook.file != null, responseBook.file)
			assert.equal(storeBook.fileName, responseBook.file_name)

			if (storeBook.categories) {
				assert.equal(storeBook.categories.length, responseBook.categories.length)

				for (let key of responseBook.categories) {
					assert(constants.categories.find(c => c.key == key) != null)
				}
			} else {
				assert.equal(0, responseBook.categories.length)
			}
		}

		// Get the store books of the next page
		try {
			response = await axios({
				method: 'get',
				url: getLatestStoreBooksEndpointUrl,
				params: {
					languages: languages.join(','),
					limit,
					page: 2
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(200, response.status)
		assert.equal(limit, response.data.books.length)
		assert.equal(pages, response.data.pages)

		for (let i = 0; i < limit; i++){
			let storeBook = storeBooks[i + limit]
			let responseBook = response.data.books[i]

			assert.equal(storeBook.uuid, responseBook.uuid)
			assert.equal(storeBook.title, responseBook.title)
			assert.equal(storeBook.description, responseBook.description)
			assert.equal(storeBook.language, responseBook.language)
			assert.equal(storeBook.price ?? 0, responseBook.price)
			assert.equal(storeBook.isbn, responseBook.isbn)
			assert.equal(storeBook.status, responseBook.status)
			assert.equal(storeBook.cover != null, responseBook.cover)
			assert.equal(storeBook.coverAspectRatio, responseBook.cover_aspect_ratio)
			assert.equal(storeBook.coverBlurhash, responseBook.cover_blurhash)
			assert.equal(storeBook.file != null, responseBook.file)
			assert.equal(storeBook.fileName, responseBook.file_name)

			if (storeBook.categories) {
				assert.equal(storeBook.categories.length, responseBook.categories.length)

				for (let key of responseBook.categories) {
					assert(constants.categories.find(c => c.key == key) != null)
				}
			} else {
				assert.equal(0, responseBook.categories.length)
			}
		}
	})
})