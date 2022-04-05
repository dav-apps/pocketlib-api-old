import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'
import * as ErrorCodes from '../errorCodes.js'

const listStoreBooksEndpointUrl = `${constants.apiBaseUrl}/store_books`

describe("GetLatestStoreBooks endpoint", async () => {
	it("should not return latest store books with not supported language", async () => {
		try {
			await axios({
				method: 'get',
				url: listStoreBooksEndpointUrl,
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
				url: listStoreBooksEndpointUrl,
				params: {
					fields: "*",
					latest: true
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
		assert.equal(Object.keys(response.data).length, 3)
		assert.equal(response.data.items.length, storeBooks.length)

		for (let storeBook of storeBooks) {
			let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
			let responseStoreBook = response.data.items.find(s => s.uuid == storeBook.uuid)
			
			assert.isNotNull(responseStoreBook)
			assert.equal(Object.keys(responseStoreBook).length, 9)
			assert.equal(responseStoreBook.uuid, storeBook.uuid)
			assert.equal(responseStoreBook.title, storeBookRelease.title)
			assert.equal(responseStoreBook.description, storeBookRelease.description)
			assert.equal(responseStoreBook.language, storeBook.language)
			assert.equal(responseStoreBook.price, storeBookRelease.price ?? 0)
			assert.equal(responseStoreBook.isbn, storeBookRelease.isbn)
			assert.equal(responseStoreBook.status, "published")
			assert.isNotNull(responseStoreBook.cover)
			assert.isNotNull(responseStoreBook.cover.url)
			assert.equal(responseStoreBook.cover.aspect_ratio, storeBookRelease.coverItem.aspectRatio)
			assert.equal(responseStoreBook.cover.blurhash, storeBookRelease.coverItem.blurhash)
			assert.isUndefined(responseStoreBook.file)

			if (storeBookRelease.categories) {
				assert.equal(responseStoreBook.categories.length, storeBookRelease.categories.length)

				for (let key of responseStoreBook.categories) {
					assert.isNotNull(constants.categories.find(c => c.key == key))
				}
			} else {
				assert.equal(responseStoreBook.categories.length, 0)
			}

			assert.isUndefined(responseStoreBook.in_library)
			assert.isUndefined(responseStoreBook.purchased)
		}
	})

	it("should return latest store books with limit", async () => {
		let response
		let limit = 3

		try {
			response = await axios({
				method: 'get',
				url: listStoreBooksEndpointUrl,
				params: {
					fields: "*",
					limit,
					latest: true
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
		let pages = Math.ceil(storeBooks.length / limit)

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 3)
		assert.equal(response.data.items.length, limit)
		assert.equal(response.data.pages, pages)

		for (let responseStoreBook of response.data.items) {
			let storeBook = storeBooks.find(s => s.uuid == responseStoreBook.uuid)
			assert.isNotNull(storeBook)

			let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
			assert.isNotNull(storeBookRelease)

			assert.equal(Object.keys(responseStoreBook).length, 9)
			assert.equal(responseStoreBook.uuid, storeBook.uuid)
			assert.equal(responseStoreBook.title, storeBookRelease.title)
			assert.equal(responseStoreBook.description, storeBookRelease.description)
			assert.equal(responseStoreBook.language, storeBook.language)
			assert.equal(responseStoreBook.price, storeBookRelease.price ?? 0)
			assert.equal(responseStoreBook.isbn, storeBookRelease.isbn)
			assert.equal(responseStoreBook.status, "published")
			assert.isNotNull(responseStoreBook.cover)
			assert.isNotNull(responseStoreBook.cover.url)
			assert.equal(responseStoreBook.cover.aspect_ratio, storeBookRelease.coverItem.aspectRatio)
			assert.equal(responseStoreBook.cover.blurhash, storeBookRelease.coverItem.blurhash)
			assert.isUndefined(responseStoreBook.file)

			if (storeBookRelease.categories) {
				assert.equal(responseStoreBook.categories.length, storeBookRelease.categories.length)

				for (let key of responseStoreBook.categories) {
					assert.isNotNull(constants.categories.find(c => c.key == key))
				}
			} else {
				assert.equal(responseStoreBook.categories.length, 0)
			}

			assert.isUndefined(responseStoreBook.in_library)
			assert.isUndefined(responseStoreBook.purchased)
		}
	})

	it("should return latest store books with single specified language", async () => {
		let response
		let language = "de"

		try {
			response = await axios({
				method: 'get',
				url: listStoreBooksEndpointUrl,
				params: {
					fields: "*",
					languages: language,
					latest: true
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
		assert.equal(Object.keys(response.data).length, 3)
		assert.equal(response.data.items.length, storeBooks.length)

		for (let storeBook of storeBooks) {
			let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
			let responseStoreBook = response.data.items.find(s => s.uuid == storeBook.uuid)
			
			assert.isNotNull(responseStoreBook)
			assert.equal(Object.keys(responseStoreBook).length, 9)
			assert.equal(responseStoreBook.uuid, storeBook.uuid)
			assert.equal(responseStoreBook.title, storeBookRelease.title)
			assert.equal(responseStoreBook.description, storeBookRelease.description)
			assert.equal(responseStoreBook.language, storeBook.language)
			assert.equal(responseStoreBook.price, storeBookRelease.price ?? 0)
			assert.equal(responseStoreBook.isbn, storeBookRelease.isbn)
			assert.equal(responseStoreBook.status, "published")
			assert.isNotNull(responseStoreBook.cover)
			assert.isNotNull(responseStoreBook.cover.url)
			assert.equal(responseStoreBook.cover.aspect_ratio, storeBookRelease.coverItem.aspectRatio)
			assert.equal(responseStoreBook.cover.blurhash, storeBookRelease.coverItem.blurhash)
			assert.isUndefined(responseStoreBook.file)

			if (storeBookRelease.categories) {
				assert.equal(responseStoreBook.categories.length, storeBookRelease.categories.length)

				for (let key of responseStoreBook.categories) {
					assert.isNotNull(constants.categories.find(c => c.key == key))
				}
			} else {
				assert.equal(responseStoreBook.categories.length, 0)
			}

			assert.isUndefined(responseStoreBook.in_library)
			assert.isUndefined(responseStoreBook.purchased)
		}
	})

	it("should return latest store books with multiple specified languages", async () => {
		let response
		let languages = ["de", "en"]

		try {
			response = await axios({
				method: 'get',
				url: listStoreBooksEndpointUrl,
				params: {
					fields: "*",
					languages: languages.join(','),
					latest: true
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
		assert.equal(Object.keys(response.data).length, 3)
		assert.equal(response.data.items.length, storeBooks.length)

		for (let storeBook of storeBooks) {
			let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
			let responseStoreBook = response.data.items.find(s => s.uuid == storeBook.uuid)
			
			assert.isNotNull(responseStoreBook)
			assert.equal(Object.keys(responseStoreBook).length, 9)
			assert.equal(responseStoreBook.uuid, storeBook.uuid)
			assert.equal(responseStoreBook.title, storeBookRelease.title)
			assert.equal(responseStoreBook.description, storeBookRelease.description)
			assert.equal(responseStoreBook.language, storeBook.language)
			assert.equal(responseStoreBook.price, storeBookRelease.price ?? 0)
			assert.equal(responseStoreBook.isbn, storeBookRelease.isbn)
			assert.equal(responseStoreBook.status, "published")
			assert.isNotNull(responseStoreBook.cover)
			assert.isNotNull(responseStoreBook.cover.url)
			assert.equal(responseStoreBook.cover.aspect_ratio, storeBookRelease.coverItem.aspectRatio)
			assert.equal(responseStoreBook.cover.blurhash, storeBookRelease.coverItem.blurhash)
			assert.isUndefined(responseStoreBook.file)

			if (storeBookRelease.categories) {
				assert.equal(responseStoreBook.categories.length, storeBookRelease.categories.length)

				for (let key of responseStoreBook.categories) {
					assert.isNotNull(constants.categories.find(c => c.key == key))
				}
			} else {
				assert.equal(responseStoreBook.categories.length, 0)
			}

			assert.isUndefined(responseStoreBook.in_library)
			assert.isUndefined(responseStoreBook.purchased)
		}
	})

	it("should return latest store books with limit and page", async () => {
		let response
		let languages = ["de", "en"]
		let limit = 2

		try {
			response = await axios({
				method: 'get',
				url: listStoreBooksEndpointUrl,
				params: {
					fields: "*",
					languages: languages.join(','),
					limit,
					latest: true
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
		assert.equal(Object.keys(response.data).length, 3)
		assert.equal(response.data.items.length, limit)
		assert.equal(response.data.pages, pages)

		for (let responseStoreBook of response.data.items) {
			let storeBook = storeBooks.find(s => s.uuid == responseStoreBook.uuid)
			assert.isNotNull(storeBook)

			let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
			assert.isNotNull(storeBookRelease)

			assert.equal(Object.keys(responseStoreBook).length, 9)
			assert.equal(responseStoreBook.uuid, storeBook.uuid)
			assert.equal(responseStoreBook.title, storeBookRelease.title)
			assert.equal(responseStoreBook.description, storeBookRelease.description)
			assert.equal(responseStoreBook.language, storeBook.language)
			assert.equal(responseStoreBook.price, storeBookRelease.price ?? 0)
			assert.equal(responseStoreBook.isbn, storeBookRelease.isbn)
			assert.equal(responseStoreBook.status, "published")
			assert.isNotNull(responseStoreBook.cover)
			assert.isNotNull(responseStoreBook.cover.url)
			assert.equal(responseStoreBook.cover.aspect_ratio, storeBookRelease.coverItem.aspectRatio)
			assert.equal(responseStoreBook.cover.blurhash, storeBookRelease.coverItem.blurhash)
			assert.isUndefined(responseStoreBook.file)

			if (storeBookRelease.categories) {
				assert.equal(responseStoreBook.categories.length, storeBookRelease.categories.length)

				for (let key of responseStoreBook.categories) {
					assert.isNotNull(constants.categories.find(c => c.key == key))
				}
			} else {
				assert.equal(responseStoreBook.categories.length, 0)
			}

			assert.isUndefined(responseStoreBook.in_library)
			assert.isUndefined(responseStoreBook.purchased)
		}

		// Get the store books of the next page
		try {
			response = await axios({
				method: 'get',
				url: listStoreBooksEndpointUrl,
				params: {
					fields: "*",
					languages: languages.join(','),
					limit,
					page: 2,
					latest: true
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 3)
		assert.equal(response.data.items.length, limit)
		assert.equal(response.data.pages, pages)
		
		for (let responseStoreBook of response.data.items) {
			let storeBook = storeBooks.find(s => s.uuid == responseStoreBook.uuid)
			assert.isNotNull(storeBook)

			let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
			assert.isNotNull(storeBookRelease)

			assert.equal(Object.keys(responseStoreBook).length, 9)
			assert.equal(responseStoreBook.uuid, storeBook.uuid)
			assert.equal(responseStoreBook.title, storeBookRelease.title)
			assert.equal(responseStoreBook.description, storeBookRelease.description)
			assert.equal(responseStoreBook.language, storeBook.language)
			assert.equal(responseStoreBook.price, storeBookRelease.price ?? 0)
			assert.equal(responseStoreBook.isbn, storeBookRelease.isbn)
			assert.equal(responseStoreBook.status, "published")
			assert.isNotNull(responseStoreBook.cover)
			assert.isNotNull(responseStoreBook.cover.url)
			assert.equal(responseStoreBook.cover.aspect_ratio, storeBookRelease.coverItem.aspectRatio)
			assert.equal(responseStoreBook.cover.blurhash, storeBookRelease.coverItem.blurhash)
			assert.isUndefined(responseStoreBook.file)

			if (storeBookRelease.categories) {
				assert.equal(responseStoreBook.categories.length, storeBookRelease.categories.length)

				for (let key of responseStoreBook.categories) {
					assert.isNotNull(constants.categories.find(c => c.key == key))
				}
			} else {
				assert.equal(responseStoreBook.categories.length, 0)
			}

			assert.isUndefined(responseStoreBook.in_library)
			assert.isUndefined(responseStoreBook.purchased)
		}
	})
})