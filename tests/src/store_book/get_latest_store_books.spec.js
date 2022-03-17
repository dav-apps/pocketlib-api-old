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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.LanguageNotSupported)
			return
		}

		assert.fail()
	})

	it("should return latest store books", async () => {
		let response

		try {
			response = await axios({
				method: 'get',
				url: getLatestStoreBooksEndpointUrl,
				params: {
					fields: "*"
				}
			})
		} catch (error) {
			assert.fail()
		}

		// Find all published store books with language = en
		let storeBooks = []
		for (let collection of constants.authorUser.author.collections) {
			for (let storeBook of collection.books) {
				let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]

				if (
					storeBook.language == "en"
					&& storeBook.status == "published"
					&& storeBookRelease.coverItem
				) {
					storeBooks.push(storeBook)
				}
			}
		}

		for (let author of constants.davUser.authors) {
			for (let collection of author.collections) {
				for (let storeBook of collection.books) {
					let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]

					if (
						storeBook.language == "en"
						&& storeBook.status == "published"
						&& storeBookRelease.coverItem
					) {
						storeBooks.push(storeBook)
					}
				}
			}
		}

		storeBooks = storeBooks.reverse()

		assert.equal(response.status, 200)
		assert.equal(response.data.books.length, storeBooks.length)

		let i = 0
		for (let book of response.data.books) {
			let storeBook = storeBooks[i]
			let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]

			assert.equal(book.uuid, storeBook.uuid)
			assert.equal(book.title, storeBookRelease.title)
			assert.equal(book.description, storeBookRelease.description)
			assert.equal(book.language, storeBook.language)
			assert.equal(book.price, storeBook.price == null ? 0 : storeBook.price)
			assert.equal(book.isbn, storeBook.isbn)
			assert.equal(book.cover_aspect_ratio, storeBookRelease.coverItem.aspectRatio)
			assert.equal(book.cover_blurhash, storeBookRelease.coverItem.blurhash)
			i++
		}
	})

	it("should return latest store books without page", async () => {
		let response
		let limit = 3

		try {
			response = await axios({
				method: 'get',
				url: getLatestStoreBooksEndpointUrl,
				params: {
					fields: "books.uuid",
					limit
				}
			})
		} catch (error) {
			assert.fail()
		}

		// Find all published store books with language = en
		let storeBooks = []
		for (let collection of constants.authorUser.author.collections) {
			for (let storeBook of collection.books) {
				let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]

				if (
					storeBook.language == "en"
					&& storeBook.status == "published"
					&& storeBookRelease.coverItem
				) {
					storeBooks.push(storeBook)
				}
			}
		}

		for (let author of constants.davUser.authors) {
			for (let collection of author.collections) {
				for (let storeBook of collection.books) {
					let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]

					if (
						storeBook.language == "en"
						&& storeBook.status == "published"
						&& storeBookRelease.coverItem
					) {
						storeBooks.push(storeBook)
					}
				}
			}
		}

		storeBooks = storeBooks.reverse()

		assert.equal(response.status, 200)
		assert.equal(response.data.books.length, limit)

		let i = 0
		for (let book of response.data.books) {
			let storeBook = storeBooks[i]

			assert.equal(book.uuid, storeBook.uuid)
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
					fields: "*",
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
				let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]

				if (
					storeBook.language == language
					&& storeBook.status == "published"
					&& storeBookRelease.coverItem
				) {
					storeBooks.push(storeBook)
				}
			}
		}

		for (let author of constants.davUser.authors) {
			for (let collection of author.collections) {
				for (let storeBook of collection.books) {
					let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]

					if (
						storeBook.language == language
						&& storeBook.status == "published"
						&& storeBookRelease.coverItem
					) {
						storeBooks.push(storeBook)
					}
				}
			}
		}

		storeBooks = storeBooks.reverse()

		assert.equal(response.status, 200)
		assert.equal(response.data.books.length, storeBooks.length)

		let i = 0
		for (let book of response.data.books) {
			let storeBook = storeBooks[i]
			let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]

			assert.equal(book.uuid, storeBook.uuid)
			assert.equal(book.title, storeBookRelease.title)
			assert.equal(book.description, storeBookRelease.description)
			assert.equal(book.language, storeBook.language)
			assert.equal(book.price, storeBook.price == null ? 0 : storeBook.price)
			assert.equal(book.isbn, storeBook.isbn)
			assert.equal(book.cover_aspect_ratio, storeBookRelease.coverItem.aspectRatio)
			assert.equal(book.cover_blurhash, storeBookRelease.coverItem.blurhash)
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
					fields: "*",
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
				let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]

				if (
					languages.includes(storeBook.language)
					&& storeBook.status == "published"
					&& storeBookRelease.coverItem
				) {
					storeBooks.push(storeBook)
				}
			}
		}

		for (let author of constants.davUser.authors) {
			for (let collection of author.collections) {
				for (let storeBook of collection.books) {
					let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]

					if (
						languages.includes(storeBook.language)
						&& storeBook.status == "published"
						&& storeBookRelease.coverItem
					) {
						storeBooks.push(storeBook)
					}
				}
			}
		}

		storeBooks = storeBooks.reverse()

		assert.equal(response.status, 200)
		assert.equal(response.data.books.length, storeBooks.length)

		let i = 0
		for (let book of response.data.books) {
			let storeBook = storeBooks[i]
			let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]

			assert.equal(book.uuid, storeBook.uuid)
			assert.equal(book.title, storeBookRelease.title)
			assert.equal(book.description, storeBookRelease.description)
			assert.equal(book.language, storeBook.language)
			assert.equal(book.price, storeBook.price == null ? 0 : storeBook.price)
			assert.equal(book.isbn, storeBook.isbn)
			assert.equal(book.cover_aspect_ratio, storeBookRelease.coverItem.aspectRatio)
			assert.equal(book.cover_blurhash, storeBookRelease.coverItem.blurhash)
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
					fields: "*",
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
				let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]

				if (
					languages.includes(storeBook.language)
					&& storeBook.status == "published"
					&& storeBookRelease.coverItem
				) {
					storeBooks.push(storeBook)
				}
			}
		}

		for (let author of constants.davUser.authors) {
			for (let collection of author.collections) {
				for (let storeBook of collection.books) {
					let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]

					if (
						languages.includes(storeBook.language)
						&& storeBook.status == "published"
						&& storeBookRelease.coverItem
					) {
						storeBooks.push(storeBook)
					}
				}
			}
		}

		storeBooks = storeBooks.reverse()
		let pages = Math.ceil(storeBooks.length / limit)

		assert.equal(response.status, 200)
		assert.equal(response.data.books.length, limit)
		assert.equal(response.data.pages, pages)

		for (let i = 0; i < limit; i++) {
			let storeBook = storeBooks[i]
			let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
			let book = response.data.books[i]

			assert.equal(book.uuid, storeBook.uuid)
			assert.equal(book.title, storeBookRelease.title)
			assert.equal(book.description, storeBookRelease.description)
			assert.equal(book.language, storeBook.language)
			assert.equal(book.price, storeBook.price == null ? 0 : storeBook.price)
			assert.equal(book.isbn, storeBook.isbn)
			assert.equal(book.cover_aspect_ratio, storeBookRelease.coverItem.aspectRatio)
			assert.equal(book.cover_blurhash, storeBookRelease.coverItem.blurhash)
		}

		// Get the store books of the next page
		try {
			response = await axios({
				method: 'get',
				url: getLatestStoreBooksEndpointUrl,
				params: {
					fields: "*",
					languages: languages.join(','),
					limit,
					page: 2
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(response.data.books.length, limit)
		assert.equal(response.data.pages, pages)

		for (let i = 0; i < limit; i++) {
			let storeBook = storeBooks[i + limit]
			let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
			let book = response.data.books[i]

			assert.equal(book.uuid, storeBook.uuid)
			assert.equal(book.title, storeBookRelease.title)
			assert.equal(book.description, storeBookRelease.description)
			assert.equal(book.language, storeBook.language)
			assert.equal(book.price, storeBook.price == null ? 0 : storeBook.price)
			assert.equal(book.isbn, storeBook.isbn)
			assert.equal(book.cover_aspect_ratio, storeBookRelease.coverItem.aspectRatio)
			assert.equal(book.cover_blurhash, storeBookRelease.coverItem.blurhash)
		}
	})
})