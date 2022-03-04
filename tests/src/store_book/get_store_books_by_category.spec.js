import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'
import * as ErrorCodes from '../errorCodes.js'

const getStoreBooksByCategoryEndpointUrl = `${constants.apiBaseUrl}/store/books/category/{0}`

describe("GetStoreBooksByCategory endpoint", () => {
	it("should not return store books by category that does not exist", async () => {
		try {
			await axios({
				method: 'get',
				url: getStoreBooksByCategoryEndpointUrl.replace('{0}', "asd")
			})
		} catch (error) {
			assert.equal(404, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.CategoryDoesNotExist, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not return store books by category with not supported language", async () => {
		try {
			await axios({
				method: 'get',
				url: getStoreBooksByCategoryEndpointUrl.replace('{0}', constants.categories[0].key),
				params: {
					languages: "bla"
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

	it("should return store books by category", async () => {
		let response
		let category = constants.categories[0]

		try {
			response = await axios({
				method: 'get',
				url: getStoreBooksByCategoryEndpointUrl.replace('{0}', category.key)
			})
		} catch (error) {
			assert.fail()
		}

		// Find all store books with the category and language = en
		let storeBooks = []
		for (let collection of constants.authorUser.author.collections) {
			for (let storeBook of collection.books) {
				if (
					storeBook.language == "en"
					&& storeBook.status == "published"
					&& storeBook.categories
					&& storeBook.categories.includes(category.uuid)
				) storeBooks.push(storeBook)
			}
		}

		assert.equal(200, response.status)
		assert.equal(storeBooks.length, response.data.books.length)

		for (let book of response.data.books) {
			let storeBook = storeBooks.find(sBook => sBook.uuid == book.uuid)

			assert.isNotNull(storeBook)
			assert.equal(storeBook.uuid, book.uuid)
			assert.equal(storeBook.title, book.title)
			assert.equal(storeBook.cover != null, book.cover)
			assert.equal(storeBook.coverAspectRatio, book.cover_aspect_ratio)
			assert.equal(storeBook.coverBlurhash, book.cover_blurhash)
		}
	})

	it("should return store books by category with single specified language", async () => {
		let response
		let category = constants.categories[0]
		let language = "de"

		try {
			response = await axios({
				method: 'get',
				url: getStoreBooksByCategoryEndpointUrl.replace('{0}', category.key),
				params: {
					languages: language
				}
			})
		} catch (error) {
			assert.fail()
		}

		// Find all store books with the category and the language
		let storeBooks = []
		for (let collection of constants.authorUser.author.collections) {
			for (let storeBook of collection.books) {
				if (
					storeBook.language == language
					&& storeBook.status == "published"
					&& storeBook.categories
					&& storeBook.categories.includes(category.uuid)
				) storeBooks.push(storeBook)
			}
		}

		assert.equal(200, response.status)
		assert.equal(storeBooks.length, response.data.books.length)

		for (let book of response.data.books) {
			let storeBook = storeBooks.find(sBook => sBook.uuid == book.uuid)

			assert.isNotNull(storeBook)
			assert.equal(storeBook.uuid, book.uuid)
			assert.equal(storeBook.title, book.title)
			assert.equal(storeBook.cover != null, book.cover)
			assert.equal(storeBook.coverAspectRatio, book.cover_aspect_ratio)
			assert.equal(storeBook.coverBlurhash, book.cover_blurhash)
		}
	})

	it("should return store books by category with multiple specified languages", async () => {
		let response
		let category = constants.categories[0]
		let languages = ["de", "en"]

		try {
			response = await axios({
				method: 'get',
				url: getStoreBooksByCategoryEndpointUrl.replace('{0}', category.key),
				params: {
					languages: languages.join(',')
				}
			})
		} catch (error) {
			assert.fail()
		}

		// Find all store books with the category and the languages
		let storeBooks = []
		for (let collection of constants.authorUser.author.collections) {
			for (let storeBook of collection.books) {
				if (
					languages.includes(storeBook.language)
					&& storeBook.status == "published"
					&& storeBook.categories
					&& storeBook.categories.includes(category.uuid)
				) storeBooks.push(storeBook)
			}
		}

		assert.equal(200, response.status)
		assert.equal(storeBooks.length, response.data.books.length)

		for (let book of response.data.books) {
			let storeBook = storeBooks.find(sBook => sBook.uuid == book.uuid)

			assert.isNotNull(storeBook)
			assert.equal(storeBook.uuid, book.uuid)
			assert.equal(storeBook.title, book.title)
			assert.equal(storeBook.cover != null, book.cover)
			assert.equal(storeBook.coverAspectRatio, book.cover_aspect_ratio)
			assert.equal(storeBook.coverBlurhash, book.cover_blurhash)
		}
	})

	it("should return store books by category with limit and page", async () => {
		let response
		let category = constants.categories[0]
		let languages = ["de", "en"]
		let limit = 2

		try {
			response = await axios({
				method: 'get',
				url: getStoreBooksByCategoryEndpointUrl.replace('{0}', category.key),
				params: {
					languages: languages.join(','),
					limit
				}
			})
		} catch (error) {
			assert.fail()
		}

		// Find all store books with the category and the languages
		let storeBooks = []
		for (let collection of constants.authorUser.author.collections) {
			for (let storeBook of collection.books) {
				if (
					languages.includes(storeBook.language)
					&& storeBook.status == "published"
					&& storeBook.categories
					&& storeBook.categories.includes(category.uuid)
				) storeBooks.push(storeBook)
			}
		}

		let pages = Math.ceil(storeBooks.length / limit)

		assert.equal(200, response.status)
		assert.equal(limit, response.data.books.length)
		assert.equal(pages, response.data.pages)

		for (let book of response.data.books) {
			let storeBook = storeBooks.find(sBook => sBook.uuid == book.uuid)

			assert.isNotNull(storeBook)
			assert.equal(storeBook.uuid, book.uuid)
			assert.equal(storeBook.title, book.title)
			assert.equal(storeBook.cover != null, book.cover)
			assert.equal(storeBook.coverAspectRatio, book.cover_aspect_ratio)
			assert.equal(storeBook.coverBlurhash, book.cover_blurhash)
		}

		// Get the store books of the next page
		try {
			response = await axios({
				method: 'get',
				url: getStoreBooksByCategoryEndpointUrl.replace('{0}', category.key),
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

		for (let book of response.data.books) {
			let storeBook = storeBooks.find(sBook => sBook.uuid == book.uuid)

			assert.isNotNull(storeBook)
			assert.equal(storeBook.uuid, book.uuid)
			assert.equal(storeBook.title, book.title)
			assert.equal(storeBook.cover != null, book.cover)
			assert.equal(storeBook.coverAspectRatio, book.cover_aspect_ratio)
			assert.equal(storeBook.coverBlurhash, book.cover_blurhash)
		}
	})

	it("should return store books by mutliple categories", async () => {
		let response
		let firstCategory = constants.categories[0]
		let secondCategory = constants.categories[1]

		try {
			response = await axios({
				method: 'get',
				url: getStoreBooksByCategoryEndpointUrl.replace('{0}', `${firstCategory.key},${secondCategory.key}`)
			})
		} catch (error) {
			assert.fail()
		}

		// Find all store books with the categories and language = en
		let storeBooks = []
		for (let collection of constants.authorUser.author.collections) {
			for (let storeBook of collection.books) {
				if (
					storeBook.language == "en"
					&& storeBook.status == "published"
					&& storeBook.categories
					&& storeBook.categories.includes(firstCategory.uuid)
					&& storeBook.categories.includes(secondCategory.uuid)
				) storeBooks.push(storeBook)
			}
		}

		assert.equal(200, response.status)
		assert.equal(storeBooks.length, response.data.books.length)

		for (let book of response.data.books) {
			let storeBook = storeBooks.find(sBook => sBook.uuid == book.uuid)

			assert.isNotNull(storeBook)
			assert.equal(storeBook.uuid, book.uuid)
			assert.equal(storeBook.title, book.title)
			assert.equal(storeBook.cover != null, book.cover)
			assert.equal(storeBook.coverAspectRatio, book.cover_aspect_ratio)
			assert.equal(storeBook.coverBlurhash, book.cover_blurhash)
		}
	})

	it("should return store books by multiple categories with single specified language", async () => {
		let response
		let firstCategory = constants.categories[0]
		let secondCategory = constants.categories[1]
		let language = "de"

		try {
			response = await axios({
				method: 'get',
				url: getStoreBooksByCategoryEndpointUrl.replace('{0}', `${firstCategory.key},${secondCategory.key}`),
				params: {
					languages: language
				}
			})
		} catch (error) {
			assert.fail()
		}

		// Find all store books with the category and the language
		let storeBooks = []
		for (let collection of constants.authorUser.author.collections) {
			for (let storeBook of collection.books) {
				if (
					storeBook.language == language
					&& storeBook.status == "published"
					&& storeBook.categories
					&& storeBook.categories.includes(firstCategory.uuid)
					&& storeBook.categories.includes(secondCategory.uuid)
				) storeBooks.push(storeBook)
			}
		}

		assert.equal(200, response.status)
		assert.equal(storeBooks.length, response.data.books.length)

		for (let book of response.data.books) {
			let storeBook = storeBooks.find(sBook => sBook.uuid == book.uuid)

			assert.isNotNull(storeBook)
			assert.equal(storeBook.uuid, book.uuid)
			assert.equal(storeBook.title, book.title)
			assert.equal(storeBook.cover != null, book.cover)
			assert.equal(storeBook.coverAspectRatio, book.cover_aspect_ratio)
			assert.equal(storeBook.coverBlurhash, book.cover_blurhash)
		}
	})

	it("should return store books by multiple categories with multiple specified languages", async () => {
		let response
		let firstCategory = constants.categories[0]
		let secondCategory = constants.categories[1]
		let languages = ["de", "en"]

		try {
			response = await axios({
				method: 'get',
				url: getStoreBooksByCategoryEndpointUrl.replace('{0}', `${firstCategory.key},${secondCategory.key}`),
				params: {
					languages: languages.join(',')
				}
			})
		} catch (error) {
			assert.fail()
		}

		// Find all store books with the category and the languages
		let storeBooks = []
		for (let collection of constants.authorUser.author.collections) {
			for (let storeBook of collection.books) {
				if (
					languages.includes(storeBook.language)
					&& storeBook.status == "published"
					&& storeBook.categories
					&& storeBook.categories.includes(firstCategory.uuid)
					&& storeBook.categories.includes(secondCategory.uuid)
				) storeBooks.push(storeBook)
			}
		}

		assert.equal(200, response.status)
		assert.equal(storeBooks.length, response.data.books.length)

		for (let book of response.data.books) {
			let storeBook = storeBooks.find(sBook => sBook.uuid == book.uuid)

			assert.isNotNull(storeBook)
			assert.equal(storeBook.uuid, book.uuid)
			assert.equal(storeBook.title, book.title)
			assert.equal(storeBook.cover != null, book.cover)
			assert.equal(storeBook.coverAspectRatio, book.cover_aspect_ratio)
			assert.equal(storeBook.coverBlurhash, book.cover_blurhash)
		}
	})

	it("should return store books by multiple categories with limit and page", async () => {
		let response
		let firstCategory = constants.categories[0]
		let secondCategory = constants.categories[1]
		let languages = ["de", "en"]
		let limit = 2

		try {
			response = await axios({
				method: 'get',
				url: getStoreBooksByCategoryEndpointUrl.replace('{0}', `${firstCategory.key},${secondCategory.key}`),
				params: {
					languages: languages.join(','),
					limit
				}
			})
		} catch (error) {
			assert.fail()
		}

		// Find all store books with the category and the languages
		let storeBooks = []
		for (let collection of constants.authorUser.author.collections) {
			for (let storeBook of collection.books) {
				if (
					languages.includes(storeBook.language)
					&& storeBook.status == "published"
					&& storeBook.categories
					&& storeBook.categories.includes(firstCategory.uuid)
					&& storeBook.categories.includes(secondCategory.uuid)
				) storeBooks.push(storeBook)
			}
		}
		
		let pages = Math.ceil(storeBooks.length / limit)

		assert.equal(200, response.status)
		assert.equal(limit, response.data.books.length)
		assert.equal(pages, response.data.pages)

		for (let book of response.data.books) {
			let storeBook = storeBooks.find(sBook => sBook.uuid == book.uuid)

			assert.isNotNull(storeBook)
			assert.equal(storeBook.uuid, book.uuid)
			assert.equal(storeBook.title, book.title)
			assert.equal(storeBook.cover != null, book.cover)
			assert.equal(storeBook.coverAspectRatio, book.cover_aspect_ratio)
			assert.equal(storeBook.coverBlurhash, book.cover_blurhash)
		}

		try {
			response = await axios({
				method: 'get',
				url: getStoreBooksByCategoryEndpointUrl.replace('{0}', `${firstCategory.key},${secondCategory.key}`),
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

		for (let book of response.data.books) {
			let storeBook = storeBooks.find(sBook => sBook.uuid == book.uuid)

			assert.isNotNull(storeBook)
			assert.equal(storeBook.uuid, book.uuid)
			assert.equal(storeBook.title, book.title)
			assert.equal(storeBook.cover != null, book.cover)
			assert.equal(storeBook.coverAspectRatio, book.cover_aspect_ratio)
			assert.equal(storeBook.coverBlurhash, book.cover_blurhash)
		}
	})
})