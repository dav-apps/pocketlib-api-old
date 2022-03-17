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
			assert.equal(error.response.status, 404)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.CategoryDoesNotExist)
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.LanguageNotSupported)
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
				url: getStoreBooksByCategoryEndpointUrl.replace('{0}', category.key),
				params: {
					fields: "*"
				}
			})
		} catch (error) {
			assert.fail()
		}

		// Find all store books with the category and language = en
		let storeBooks = []
		for (let collection of constants.authorUser.author.collections) {
			for (let storeBook of collection.books) {
				let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]

				if (
					storeBook.language == "en"
					&& storeBook.status == "published"
					&& storeBookRelease.categories
					&& storeBookRelease.categories.includes(category.uuid)
					&& storeBookRelease.coverItem
				) storeBooks.push(storeBook)
			}
		}

		for (let author of constants.davUser.authors) {
			for (let collection of author.collections) {
				for (let storeBook of collection.books) {
					let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]

					if (
						storeBook.language == "en"
						&& storeBook.status == "published"
						&& storeBookRelease.categories
						&& storeBookRelease.categories.includes(category.uuid)
						&& storeBookRelease.coverItem
					) storeBooks.push(storeBook)
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
			assert.equal(book.cover_aspect_ratio, storeBookRelease.coverItem.aspectRatio)
			assert.equal(book.cover_blurhash, storeBookRelease.coverItem.blurhash)
		}
	})

	it("should return store books by category without page", async () => {
		let response
		let category = constants.categories[0]

		try {
			response = await axios({
				method: 'get',
				url: getStoreBooksByCategoryEndpointUrl.replace('{0}', category.key),
				params: {
					fields: "books.uuid"
				}
			})
		} catch (error) {
			assert.fail()
		}

		// Find all store books with the category and language = en
		let storeBooks = []
		for (let collection of constants.authorUser.author.collections) {
			for (let storeBook of collection.books) {
				let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]

				if (
					storeBook.language == "en"
					&& storeBook.status == "published"
					&& storeBookRelease.categories
					&& storeBookRelease.categories.includes(category.uuid)
					&& storeBookRelease.coverItem
				) storeBooks.push(storeBook)
			}
		}

		for (let author of constants.davUser.authors) {
			for (let collection of author.collections) {
				for (let storeBook of collection.books) {
					let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]

					if (
						storeBook.language == "en"
						&& storeBook.status == "published"
						&& storeBookRelease.categories
						&& storeBookRelease.categories.includes(category.uuid)
						&& storeBookRelease.coverItem
					) storeBooks.push(storeBook)
				}
			}
		}

		assert.equal(response.status, 200)
		assert.equal(response.data.books.length, storeBooks.length)

		for (let book of response.data.books) {
			let storeBook = storeBooks.find(sBook => sBook.uuid == book.uuid)

			assert.equal(book.uuid, storeBook.uuid)
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
					fields: "*",
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
				let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]

				if (
					storeBook.language == language
					&& storeBook.status == "published"
					&& storeBookRelease.categories
					&& storeBookRelease.categories.includes(category.uuid)
					&& storeBookRelease.coverItem
				) storeBooks.push(storeBook)
			}
		}

		for (let author of constants.davUser.authors) {
			for (let collection of author.collections) {
				for (let storeBook of collection.books) {
					let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]

					if (
						storeBook.language == language
						&& storeBook.status == "published"
						&& storeBookRelease.categories
						&& storeBookRelease.categories.includes(category.uuid)
						&& storeBookRelease.coverItem
					) storeBooks.push(storeBook)
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
			assert.equal(book.cover_aspect_ratio, storeBookRelease.coverItem.aspectRatio)
			assert.equal(book.cover_blurhash, storeBookRelease.coverItem.blurhash)
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
					fields: "*",
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
				let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]

				if (
					languages.includes(storeBook.language)
					&& storeBook.status == "published"
					&& storeBookRelease.categories
					&& storeBookRelease.categories.includes(category.uuid)
					&& storeBookRelease.coverItem
				) storeBooks.push(storeBook)
			}
		}

		for (let author of constants.davUser.authors) {
			for (let collection of author.collections) {
				for (let storeBook of collection.books) {
					let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]

					if (
						languages.includes(storeBook.language)
						&& storeBook.status == "published"
						&& storeBookRelease.categories
						&& storeBookRelease.categories.includes(category.uuid)
						&& storeBookRelease.coverItem
					) storeBooks.push(storeBook)
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
			assert.equal(book.cover_aspect_ratio, storeBookRelease.coverItem.aspectRatio)
			assert.equal(book.cover_blurhash, storeBookRelease.coverItem.blurhash)
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
					fields: "*",
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
				let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]

				if (
					languages.includes(storeBook.language)
					&& storeBook.status == "published"
					&& storeBookRelease.categories
					&& storeBookRelease.categories.includes(category.uuid)
					&& storeBookRelease.coverItem
				) storeBooks.push(storeBook)
			}
		}

		for (let author of constants.davUser.authors) {
			for (let collection of author.collections) {
				for (let storeBook of collection.books) {
					let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]

					if (
						languages.includes(storeBook.language)
						&& storeBook.status == "published"
						&& storeBookRelease.categories
						&& storeBookRelease.categories.includes(category.uuid)
						&& storeBookRelease.coverItem
					) storeBooks.push(storeBook)
				}
			}
		}

		let pages = Math.ceil(storeBooks.length / limit)

		assert.equal(response.status, 200)
		assert.equal(response.data.books.length, limit)
		assert.equal(response.data.pages, pages)

		for (let book of response.data.books) {
			let storeBook = storeBooks.find(sBook => sBook.uuid == book.uuid)
			let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]

			assert.equal(book.uuid, storeBook.uuid)
			assert.equal(book.title, storeBookRelease.title)
			assert.equal(book.description, storeBookRelease.description)
			assert.equal(book.language, storeBook.language)
			assert.equal(book.price, storeBook.price ?? 0)
			assert.equal(book.isbn, storeBook.isbn)
			assert.equal(book.cover_aspect_ratio, storeBookRelease.coverItem.aspectRatio)
			assert.equal(book.cover_blurhash, storeBookRelease.coverItem.blurhash)
		}

		// Get the store books of the next page
		try {
			response = await axios({
				method: 'get',
				url: getStoreBooksByCategoryEndpointUrl.replace('{0}', category.key),
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

		for (let book of response.data.books) {
			let storeBook = storeBooks.find(sBook => sBook.uuid == book.uuid)
			let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]

			assert.equal(book.uuid, storeBook.uuid)
			assert.equal(book.title, storeBookRelease.title)
			assert.equal(book.description, storeBookRelease.description)
			assert.equal(book.language, storeBook.language)
			assert.equal(book.price, storeBook.price ?? 0)
			assert.equal(book.isbn, storeBook.isbn)
			assert.equal(book.cover_aspect_ratio, storeBookRelease.coverItem.aspectRatio)
			assert.equal(book.cover_blurhash, storeBookRelease.coverItem.blurhash)
		}
	})

	it("should return store books by mutliple categories", async () => {
		let response
		let firstCategory = constants.categories[0]
		let secondCategory = constants.categories[1]

		try {
			response = await axios({
				method: 'get',
				url: getStoreBooksByCategoryEndpointUrl.replace('{0}', `${firstCategory.key},${secondCategory.key}`),
				params: {
					fields: "*"
				}
			})
		} catch (error) {
			assert.fail()
		}

		// Find all store books with the categories and language = en
		let storeBooks = []
		for (let collection of constants.authorUser.author.collections) {
			for (let storeBook of collection.books) {
				let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]

				if (
					storeBook.language == "en"
					&& storeBook.status == "published"
					&& storeBookRelease.categories
					&& storeBookRelease.categories.includes(firstCategory.uuid)
					&& storeBookRelease.categories.includes(secondCategory.uuid)
					&& storeBookRelease.coverItem
				) storeBooks.push(storeBook)
			}
		}

		for (let author of constants.davUser.authors) {
			for (let collection of author.collections) {
				for (let storeBook of collection.books) {
					let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]

					if (
						storeBook.language == "en"
						&& storeBook.status == "published"
						&& storeBookRelease.categories
						&& storeBookRelease.categories.includes(firstCategory.uuid)
						&& storeBookRelease.categories.includes(secondCategory.uuid)
						&& storeBookRelease.coverItem
					) storeBooks.push(storeBook)
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
			assert.equal(book.cover_aspect_ratio, storeBookRelease.coverItem.aspectRatio)
			assert.equal(book.cover_blurhash, storeBookRelease.coverItem.blurhash)
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
					fields: "*",
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
				let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]

				if (
					storeBook.language == language
					&& storeBook.status == "published"
					&& storeBookRelease.categories
					&& storeBookRelease.categories.includes(firstCategory.uuid)
					&& storeBookRelease.categories.includes(secondCategory.uuid)
					&& storeBookRelease.coverItem
				) storeBooks.push(storeBook)
			}
		}

		for (let author of constants.davUser.authors) {
			for (let collection of author.collections) {
				for (let storeBook of collection.books) {
					let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]

					if (
						storeBook.language == language
						&& storeBook.status == "published"
						&& storeBookRelease.categories
						&& storeBookRelease.categories.includes(firstCategory.uuid)
						&& storeBookRelease.categories.includes(secondCategory.uuid)
						&& storeBookRelease.coverItem
					) storeBooks.push(storeBook)
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
			assert.equal(book.cover_aspect_ratio, storeBookRelease.coverItem.aspectRatio)
			assert.equal(book.cover_blurhash, storeBookRelease.coverItem.blurhash)
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
					fields: "*",
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
				let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]

				if (
					languages.includes(storeBook.language)
					&& storeBook.status == "published"
					&& storeBookRelease.categories
					&& storeBookRelease.categories.includes(firstCategory.uuid)
					&& storeBookRelease.categories.includes(secondCategory.uuid)
					&& storeBookRelease.coverItem
				) storeBooks.push(storeBook)
			}
		}

		for (let author of constants.davUser.authors) {
			for (let collection of author.collections) {
				for (let storeBook of collection.books) {
					let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]

					if (
						languages.includes(storeBook.language)
						&& storeBook.status == "published"
						&& storeBookRelease.categories
						&& storeBookRelease.categories.includes(firstCategory.uuid)
						&& storeBookRelease.categories.includes(secondCategory.uuid)
						&& storeBookRelease.coverItem
					) storeBooks.push(storeBook)
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
			assert.equal(book.cover_aspect_ratio, storeBookRelease.coverItem.aspectRatio)
			assert.equal(book.cover_blurhash, storeBookRelease.coverItem.blurhash)
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
					fields: "*",
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
				let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]

				if (
					languages.includes(storeBook.language)
					&& storeBook.status == "published"
					&& storeBookRelease.categories
					&& storeBookRelease.categories.includes(firstCategory.uuid)
					&& storeBookRelease.categories.includes(secondCategory.uuid)
					&& storeBookRelease.coverItem
				) storeBooks.push(storeBook)
			}
		}

		for (let author of constants.davUser.authors) {
			for (let collection of author.collections) {
				for (let storeBook of collection.books) {
					let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]

					if (
						languages.includes(storeBook.language)
						&& storeBook.status == "published"
						&& storeBookRelease.categories
						&& storeBookRelease.categories.includes(firstCategory.uuid)
						&& storeBookRelease.categories.includes(secondCategory.uuid)
						&& storeBookRelease.coverItem
					) storeBooks.push(storeBook)
				}
			}
		}
		
		let pages = Math.ceil(storeBooks.length / limit)

		assert.equal(response.status, 200)
		assert.equal(response.data.books.length, limit)
		assert.equal(response.data.pages, pages)

		for (let book of response.data.books) {
			let storeBook = storeBooks.find(sBook => sBook.uuid == book.uuid)
			let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]

			assert.equal(book.uuid, storeBook.uuid)
			assert.equal(book.title, storeBookRelease.title)
			assert.equal(book.description, storeBookRelease.description)
			assert.equal(book.language, storeBook.language)
			assert.equal(book.price, storeBook.price ?? 0)
			assert.equal(book.isbn, storeBook.isbn)
			assert.equal(book.cover_aspect_ratio, storeBookRelease.coverItem.aspectRatio)
			assert.equal(book.cover_blurhash, storeBookRelease.coverItem.blurhash)
		}

		try {
			response = await axios({
				method: 'get',
				url: getStoreBooksByCategoryEndpointUrl.replace('{0}', `${firstCategory.key},${secondCategory.key}`),
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

		for (let book of response.data.books) {
			let storeBook = storeBooks.find(sBook => sBook.uuid == book.uuid)
			let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]

			assert.equal(book.uuid, storeBook.uuid)
			assert.equal(book.title, storeBookRelease.title)
			assert.equal(book.description, storeBookRelease.description)
			assert.equal(book.language, storeBook.language)
			assert.equal(book.price, storeBook.price ?? 0)
			assert.equal(book.isbn, storeBook.isbn)
			assert.equal(book.cover_aspect_ratio, storeBookRelease.coverItem.aspectRatio)
			assert.equal(book.cover_blurhash, storeBookRelease.coverItem.blurhash)
		}
	})
})