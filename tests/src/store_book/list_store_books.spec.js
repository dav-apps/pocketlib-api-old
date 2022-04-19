import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'
import * as ErrorCodes from '../errorCodes.js'

const listStoreBooksEndpointUrl = `${constants.apiBaseUrl}/store_books`

describe("ListStoreBooks endpoint", async () => {
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
					storeBooks.push({
						collection: collection.uuid,
						storeBook
					})
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
						storeBooks.push({
							collection: collection.uuid,
							storeBook
						})
					}
				}
			}
		}

		storeBooks = storeBooks.reverse()

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 3)
		assert.equal(response.data.items.length, storeBooks.length)

		for (let storeBookItem of storeBooks) {
			let storeBook = storeBookItem.storeBook
			let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
			let responseStoreBook = response.data.items.find(s => s.uuid == storeBook.uuid)

			assert.isNotNull(responseStoreBook)
			assert.equal(Object.keys(responseStoreBook).length, 10)
			assert.equal(responseStoreBook.uuid, storeBook.uuid)
			assert.equal(responseStoreBook.collection, storeBookItem.collection)
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
					storeBooks.push({
						collection: collection.uuid,
						storeBook
					})
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
						storeBooks.push({
							collection: collection.uuid,
							storeBook
						})
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
			let storeBookItem = storeBooks.find(s => s.storeBook.uuid == responseStoreBook.uuid)
			assert.isNotNull(storeBookItem)
			let storeBook = storeBookItem.storeBook

			let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
			assert.isNotNull(storeBookRelease)

			assert.equal(Object.keys(responseStoreBook).length, 10)
			assert.equal(responseStoreBook.uuid, storeBook.uuid)
			assert.equal(responseStoreBook.collection, storeBookItem.collection)
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
					storeBooks.push({
						collection: collection.uuid,
						storeBook
					})
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
						storeBooks.push({
							collection: collection.uuid,
							storeBook
						})
					}
				}
			}
		}

		storeBooks = storeBooks.reverse()

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 3)
		assert.equal(response.data.items.length, storeBooks.length)

		for (let storeBookItem of storeBooks) {
			let storeBook = storeBookItem.storeBook
			let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
			let responseStoreBook = response.data.items.find(s => s.uuid == storeBook.uuid)
			
			assert.isNotNull(responseStoreBook)
			assert.equal(Object.keys(responseStoreBook).length, 10)
			assert.equal(responseStoreBook.uuid, storeBook.uuid)
			assert.equal(responseStoreBook.collection, storeBookItem.collection)
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
					storeBooks.push({
						collection: collection.uuid,
						storeBook
					})
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
						storeBooks.push({
							collection: collection.uuid,
							storeBook
						})
					}
				}
			}
		}

		storeBooks = storeBooks.reverse()

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 3)
		assert.equal(response.data.items.length, storeBooks.length)

		for (let storeBookItem of storeBooks) {
			let storeBook = storeBookItem.storeBook
			let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
			let responseStoreBook = response.data.items.find(s => s.uuid == storeBook.uuid)
			
			assert.isNotNull(responseStoreBook)
			assert.equal(Object.keys(responseStoreBook).length, 10)
			assert.equal(responseStoreBook.uuid, storeBook.uuid)
			assert.equal(responseStoreBook.collection, storeBookItem.collection)
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
					storeBooks.push({
						collection: collection.uuid,
						storeBook
					})
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
						storeBooks.push({
							collection: collection.uuid,
							storeBook
						})
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
			let storeBookItem = storeBooks.find(s => s.storeBook.uuid == responseStoreBook.uuid)
			assert.isNotNull(storeBookItem)
			let storeBook = storeBookItem.storeBook

			let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
			assert.isNotNull(storeBookRelease)

			assert.equal(Object.keys(responseStoreBook).length, 10)
			assert.equal(responseStoreBook.uuid, storeBook.uuid)
			assert.equal(responseStoreBook.collection, storeBookItem.collection)
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
			let storeBookItem = storeBooks.find(s => s.storeBook.uuid == responseStoreBook.uuid)
			assert.isNotNull(storeBookItem)
			let storeBook = storeBookItem.storeBook

			let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
			assert.isNotNull(storeBookRelease)

			assert.equal(Object.keys(responseStoreBook).length, 10)
			assert.equal(responseStoreBook.uuid, storeBook.uuid)
			assert.equal(responseStoreBook.collection, storeBookItem.collection)
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

	it("should return latest store books with user details as authenticated user", async () => {
		let response

		try {
			response = await axios({
				method: 'get',
				url: listStoreBooksEndpointUrl,
				headers: {
					Authorization: constants.testUser.accessToken
				},
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
					storeBooks.push({
						collection: collection.uuid,
						storeBook
					})
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
						storeBooks.push({
							collection: collection.uuid,
							storeBook
						})
					}
				}
			}
		}

		storeBooks = storeBooks.reverse()

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 3)
		assert.equal(response.data.items.length, storeBooks.length)

		for (let storeBookItem of storeBooks) {
			let storeBook = storeBookItem.storeBook
			let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
			let responseStoreBook = response.data.items.find(s => s.uuid == storeBook.uuid)
			
			assert.isNotNull(responseStoreBook)
			assert.equal(Object.keys(responseStoreBook).length, 12)
			assert.equal(responseStoreBook.uuid, storeBook.uuid)
			assert.equal(responseStoreBook.collection, storeBookItem.collection)
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

			assert.equal(responseStoreBook.in_library, userHasStoreBookInLibrary(constants.testUser, storeBook.uuid))
			assert.equal(responseStoreBook.purchased, userHasPurchasedBook(constants.testUser, storeBook.uuid))
		}
	})

	it("should not return store books of author that does not exist", async () => {
		try {
			await axios({
				method: 'get',
				url: listStoreBooksEndpointUrl,
				params: {
					author: "asfdasdasdasd"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 404)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.AuthorDoesNotExist)
			return
		}

		assert.fail()
	})

	it("should not return store books of author if the table object is not an author", async () => {
		try {
			await axios({
				method: 'get',
				url: listStoreBooksEndpointUrl,
				params: {
					author: constants.davUser.authors[0].bios[0].uuid
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

	it("should not return author with store books with not supported language", async () => {
		try {
			await axios({
				method: 'get',
				url: listStoreBooksEndpointUrl,
				params: {
					languages: "asd",
					author: constants.authorUser.author.uuid
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

	it("should return store books of author", async () => {
		await testGetStoreBooksOfAuthor(constants.authorUser.author)
	})

	it("should return store books of author with specified language", async () => {
		await testGetStoreBooksOfAuthor(constants.authorUser.author, ["de"])
	})

	it("should return store books of author with specified languages", async () => {
		await testGetStoreBooksOfAuthor(constants.authorUser.author, ["en", "de"])
	})

	it("should return store books of author of admin", async () => {
		await testGetStoreBooksOfAuthor(constants.davUser.authors[0])
	})

	it("should return store books of author of admin with specified language", async () => {
		await testGetStoreBooksOfAuthor(constants.davUser.authors[0], ["de"])
	})

	it("should return store books of author of admin with specified languages", async () => {
		await testGetStoreBooksOfAuthor(constants.davUser.authors[0], ["en", "de"])
	})

	it("should not return store books of collection with access token for session that does not exist", async () => {
		try {
			await axios({
				method: 'get',
				url: listStoreBooksEndpointUrl,
				headers: {
					Authorization: "sdaaasdasd",
					'Content-Type': 'application/json'
				},
				params: {
					collection: constants.authorUser.author.collections[0].uuid
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
				url: listStoreBooksEndpointUrl,
				headers: {
					Authorization: constants.testUserTestAppAccessToken
				},
				params: {
					collection: constants.authorUser.author.collections[0].uuid
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
				url: listStoreBooksEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken
				},
				params: {
					collection: "asdasdsda"
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

		await testGetAllStoreBooksOfCollection(constants.authorUser, collection)
	})

	it("should return collection with all store books if the user is an admin", async () => {
		let author = constants.authorUser.author
		let collection = author.collections[1]

		await testGetAllStoreBooksOfCollection(constants.davUser, collection)
	})

	it("should return collection with published store books if the user is not the author", async () => {
		let author = constants.davUser.authors[0]
		let collection = author.collections[0]

		await testGetPublishedStoreBooksOfCollection(constants.testUser, collection)
	})

	it("should return collection of admin with all store books if the user is the author", async () => {
		let author = constants.davUser.authors[0]
		let collection = author.collections[0]

		await testGetAllStoreBooksOfCollection(constants.davUser, collection)
	})

	it("should return collection of admin with published store books if the user is not the author", async () => {
		let author = constants.davUser.authors[0]
		let collection = author.collections[0]

		await testGetPublishedStoreBooksOfCollection(constants.testUser, collection)
	})

	it("should return collection with published store books if the user is not logged in", async () => {
		let author = constants.authorUser.author
		let collection = author.collections[1]

		await testGetPublishedStoreBooksOfCollection(null, collection)
	})

	it("should return collection of admin with published store books if the user is not logged in", async () => {
		let author = constants.davUser.authors[0]
		let collection = author.collections[0]

		await testGetPublishedStoreBooksOfCollection(null, collection)
	})

	it("should not return store books of series with not supported languages", async () => {
		try {
			await axios({
				method: 'get',
				url: listStoreBooksEndpointUrl,
				params: {
					languages: "bla,test",
					series: constants.authorUser.author.series[0].uuid
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

	it("should not return store books of series that does not exist", async () => {
		try {
			await axios({
				method: 'get',
				url: listStoreBooksEndpointUrl,
				params: {
					series: "dfjsdjfsodjsfdo"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 404)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.StoreBookSeriesDoesNotExist)
			return
		}

		assert.fail()
	})

	it("should not return store books of series whose store books are not all published", async () => {
		try {
			await axios({
				method: 'get',
				url: listStoreBooksEndpointUrl,
				params: {
					series: constants.authorUser.author.series[0].uuid
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 412)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.StoreBookSeriesIsIncomplete)
			return
		}

		assert.fail()
	})

	it("should return store books of series", async () => {
		let response
		let series = constants.davUser.authors[2].series[0]
		let storeBooks = [
			{
				collection: constants.davUser.authors[2].collections[0].uuid,
				storeBook: constants.davUser.authors[2].collections[0].books[0]
			},
			{
				collection: constants.davUser.authors[2].collections[1].uuid,
				storeBook: constants.davUser.authors[2].collections[1].books[0]
			}
		]

		try {
			response = await axios({
				method: 'get',
				url: listStoreBooksEndpointUrl,
				params: {
					fields: "*",
					series: series.uuid
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 3)
		assert.equal(response.data.items.length, storeBooks.length)

		for (let storeBookItem of storeBooks) {
			let storeBook = storeBookItem.storeBook
			let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
			let responseStoreBook = response.data.items.find(s => s.uuid == storeBook.uuid)

			assert.isNotNull(responseStoreBook)
			assert.equal(Object.keys(responseStoreBook).length, 10)
			assert.equal(responseStoreBook.uuid, storeBook.uuid)
			assert.equal(responseStoreBook.collection, storeBookItem.collection)
			assert.equal(responseStoreBook.title, storeBookRelease.title)
			assert.equal(responseStoreBook.description, storeBookRelease.description)
			assert.equal(responseStoreBook.language, storeBook.language)
			assert.equal(responseStoreBook.price, storeBookRelease.price ?? 0)
			assert.equal(responseStoreBook.isbn, storeBookRelease.isbn)
			assert.equal(responseStoreBook.status, "published")
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

	it("should return store books of series with author as user", async () => {
		let response
		let series = constants.davUser.authors[2].series[0]
		let storeBooks = [
			{
				collection: constants.davUser.authors[2].collections[0].uuid,
				storeBook: constants.davUser.authors[2].collections[0].books[0]
			},
			{
				collection: constants.davUser.authors[2].collections[1].uuid,
				storeBook: constants.davUser.authors[2].collections[1].books[0]
			}
		]

		try {
			response = await axios({
				method: 'get',
				url: listStoreBooksEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken
				},
				params: {
					fields: "*",
					series: series.uuid
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 3)
		assert.equal(response.data.items.length, storeBooks.length)

		for (let storeBookItem of storeBooks) {
			let storeBook = storeBookItem.storeBook
			let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
			let responseStoreBook = response.data.items.find(s => s.uuid == storeBook.uuid)

			assert.isNotNull(responseStoreBook)
			assert.equal(Object.keys(responseStoreBook).length, 13)
			assert.equal(responseStoreBook.uuid, storeBook.uuid)
			assert.equal(responseStoreBook.collection, storeBookItem.collection)
			assert.equal(responseStoreBook.title, storeBookRelease.title)
			assert.equal(responseStoreBook.description, storeBookRelease.description)
			assert.equal(responseStoreBook.language, storeBook.language)
			assert.equal(responseStoreBook.price, storeBookRelease.price ?? 0)
			assert.equal(responseStoreBook.isbn, storeBookRelease.isbn)
			assert.equal(responseStoreBook.status, storeBook.status ?? "unpublished")
			if (responseStoreBook.cover) assert.isNotNull(responseStoreBook.cover.url)
			assert.equal(responseStoreBook.cover.aspect_ratio, storeBookRelease.coverItem?.aspectRatio)
			assert.equal(responseStoreBook.cover.blurhash, storeBookRelease.coverItem?.blurhash)
			assert.equal(responseStoreBook.file?.file_name, storeBookRelease.fileItem?.fileName)

			if (storeBookRelease.categories) {
				assert.equal(responseStoreBook.categories.length, storeBookRelease.categories.length)

				for (let key of responseStoreBook.categories) {
					assert.isNotNull(constants.categories.find(c => c.key == key))
				}
			} else {
				assert.equal(responseStoreBook.categories.length, 0)
			}

			assert.equal(responseStoreBook.in_library, userHasStoreBookInLibrary(constants.davUser, storeBook.uuid))
			assert.equal(responseStoreBook.purchased, userHasPurchasedBook(constants.davUser, storeBook.uuid))
		}
	})

	it("should not return store books by category that does not exist", async () => {
		try {
			await axios({
				method: 'get',
				url: listStoreBooksEndpointUrl,
				params: {
					categories: "asd"
				}
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
				url: listStoreBooksEndpointUrl,
				params: {
					languages: "bla",
					categories: constants.categories[0].key
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
				url: listStoreBooksEndpointUrl,
				params: {
					fields: "*",
					categories: category.key
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
				) {
					storeBooks.push({
						collection: collection.uuid,
						storeBook
					})
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
						&& storeBookRelease.categories
						&& storeBookRelease.categories.includes(category.uuid)
						&& storeBookRelease.coverItem
					) {
						storeBooks.push({
							collection: collection.uuid,
							storeBook
						})
					}
				}
			}
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 3)
		assert.equal(response.data.items.length, storeBooks.length)

		for (let storeBookItem of storeBooks) {
			let storeBook = storeBookItem.storeBook
			let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
			let responseStoreBook = response.data.items.find(s => s.uuid == storeBook.uuid)
			
			assert.isNotNull(responseStoreBook)
			assert.equal(Object.keys(responseStoreBook).length, 10)
			assert.equal(responseStoreBook.uuid, storeBook.uuid)
			assert.equal(responseStoreBook.collection, storeBookItem.collection)
			assert.equal(responseStoreBook.title, storeBookRelease.title)
			assert.equal(responseStoreBook.description, storeBookRelease.description)
			assert.equal(responseStoreBook.language, storeBook.language)
			assert.equal(responseStoreBook.price, storeBookRelease.price ?? 0)
			assert.equal(responseStoreBook.isbn, storeBookRelease.isbn)
			assert.equal(responseStoreBook.status, "published")
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

	it("should return store books by category with single specified language", async () => {
		let response
		let category = constants.categories[0]
		let language = "de"

		try {
			response = await axios({
				method: 'get',
				url: listStoreBooksEndpointUrl,
				params: {
					fields: "*",
					languages: language,
					categories: category.key
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
				) {
					storeBooks.push({
						collection: collection.uuid,
						storeBook
					})
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
						&& storeBookRelease.categories
						&& storeBookRelease.categories.includes(category.uuid)
						&& storeBookRelease.coverItem
					) {
						storeBooks.push({
							collection: collection.uuid,
							storeBook
						})
					}
				}
			}
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 3)
		assert.equal(response.data.items.length, storeBooks.length)

		for (let storeBookItem of storeBooks) {
			let storeBook = storeBookItem.storeBook
			let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
			let responseStoreBook = response.data.items.find(s => s.uuid == storeBook.uuid)

			assert.isNotNull(responseStoreBook)
			assert.equal(Object.keys(responseStoreBook).length, 10)
			assert.equal(responseStoreBook.uuid, storeBook.uuid)
			assert.equal(responseStoreBook.collection, storeBookItem.collection)
			assert.equal(responseStoreBook.title, storeBookRelease.title)
			assert.equal(responseStoreBook.description, storeBookRelease.description)
			assert.equal(responseStoreBook.language, storeBook.language)
			assert.equal(responseStoreBook.price, storeBookRelease.price ?? 0)
			assert.equal(responseStoreBook.isbn, storeBookRelease.isbn)
			assert.equal(responseStoreBook.status, "published")
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

	it("should return store books by category with multiple specified languages", async () => {
		let response
		let category = constants.categories[0]
		let languages = ["de", "en"]

		try {
			response = await axios({
				method: 'get',
				url: listStoreBooksEndpointUrl,
				params: {
					fields: "*",
					languages: languages.join(','),
					categories: category.key
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
				) {
					storeBooks.push({
						collection: collection.uuid,
						storeBook
					})
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
						&& storeBookRelease.categories
						&& storeBookRelease.categories.includes(category.uuid)
						&& storeBookRelease.coverItem
					) {
						storeBooks.push({
							collection: collection.uuid,
							storeBook
						})
					}
				}
			}
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 3)
		assert.equal(response.data.items.length, storeBooks.length)

		for (let storeBookItem of storeBooks) {
			let storeBook = storeBookItem.storeBook
			let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
			let responseStoreBook = response.data.items.find(s => s.uuid == storeBook.uuid)

			assert.isNotNull(responseStoreBook)
			assert.equal(Object.keys(responseStoreBook).length, 10)
			assert.equal(responseStoreBook.uuid, storeBook.uuid)
			assert.equal(responseStoreBook.collection, storeBookItem.collection)
			assert.equal(responseStoreBook.title, storeBookRelease.title)
			assert.equal(responseStoreBook.description, storeBookRelease.description)
			assert.equal(responseStoreBook.language, storeBook.language)
			assert.equal(responseStoreBook.price, storeBookRelease.price ?? 0)
			assert.equal(responseStoreBook.isbn, storeBookRelease.isbn)
			assert.equal(responseStoreBook.status, "published")
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

	it("should return store books by category with limit and page", async () => {
		let response
		let category = constants.categories[0]
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
					categories: category.key
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
				) {
					storeBooks.push({
						collection: collection.uuid,
						storeBook
					})
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
						&& storeBookRelease.categories
						&& storeBookRelease.categories.includes(category.uuid)
						&& storeBookRelease.coverItem
					) {
						storeBooks.push({
							collection: collection.uuid,
							storeBook
						})
					}
				}
			}
		}

		let pages = Math.ceil(storeBooks.length / limit)

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 3)
		assert.equal(response.data.items.length, limit)
		assert.equal(response.data.pages, pages)

		for (let responseStoreBook of response.data.items) {
			let storeBookItem = storeBooks.find(s => s.storeBook.uuid == responseStoreBook.uuid)
			assert.isNotNull(storeBookItem)
			let storeBook = storeBookItem.storeBook

			let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
			assert.isNotNull(storeBookRelease)

			assert.equal(Object.keys(responseStoreBook).length, 10)
			assert.equal(responseStoreBook.uuid, storeBook.uuid)
			assert.equal(responseStoreBook.collection, storeBookItem.collection)
			assert.equal(responseStoreBook.title, storeBookRelease.title)
			assert.equal(responseStoreBook.description, storeBookRelease.description)
			assert.equal(responseStoreBook.language, storeBook.language)
			assert.equal(responseStoreBook.price, storeBookRelease.price ?? 0)
			assert.equal(responseStoreBook.isbn, storeBookRelease.isbn)
			assert.equal(responseStoreBook.status, "published")
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
					categories: category.key
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
			let storeBookItem = storeBooks.find(s => s.storeBook.uuid == responseStoreBook.uuid)
			assert.isNotNull(storeBookItem)
			let storeBook = storeBookItem.storeBook

			let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
			assert.isNotNull(storeBookRelease)

			assert.equal(Object.keys(responseStoreBook).length, 10)
			assert.equal(responseStoreBook.uuid, storeBook.uuid)
			assert.equal(responseStoreBook.collection, storeBookItem.collection)
			assert.equal(responseStoreBook.title, storeBookRelease.title)
			assert.equal(responseStoreBook.description, storeBookRelease.description)
			assert.equal(responseStoreBook.language, storeBook.language)
			assert.equal(responseStoreBook.price, storeBookRelease.price ?? 0)
			assert.equal(responseStoreBook.isbn, storeBookRelease.isbn)
			assert.equal(responseStoreBook.status, "published")
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

	it("should return store books by mutliple categories", async () => {
		let response
		let firstCategory = constants.categories[0]
		let secondCategory = constants.categories[1]

		try {
			response = await axios({
				method: 'get',
				url: listStoreBooksEndpointUrl,
				params: {
					fields: "*",
					categories: `${firstCategory.key},${secondCategory.key}`
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
				) {
					storeBooks.push({
						collection: collection.uuid,
						storeBook
					})
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
						&& storeBookRelease.categories
						&& storeBookRelease.categories.includes(firstCategory.uuid)
						&& storeBookRelease.categories.includes(secondCategory.uuid)
						&& storeBookRelease.coverItem
					) {
						storeBooks.push({
							collection: collection.uuid,
							storeBook
						})
					}
				}
			}
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 3)
		assert.equal(response.data.items.length, storeBooks.length)

		for (let storeBookItem of storeBooks) {
			let storeBook = storeBookItem.storeBook
			let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
			let responseStoreBook = response.data.items.find(s => s.uuid == storeBook.uuid)

			assert.isNotNull(responseStoreBook)
			assert.equal(Object.keys(responseStoreBook).length, 10)
			assert.equal(responseStoreBook.uuid, storeBook.uuid)
			assert.equal(responseStoreBook.collection, storeBookItem.collection)
			assert.equal(responseStoreBook.title, storeBookRelease.title)
			assert.equal(responseStoreBook.description, storeBookRelease.description)
			assert.equal(responseStoreBook.language, storeBook.language)
			assert.equal(responseStoreBook.price, storeBookRelease.price ?? 0)
			assert.equal(responseStoreBook.isbn, storeBookRelease.isbn)
			assert.equal(responseStoreBook.status, "published")
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

	it("should return store books by multiple categories with single specified language", async () => {
		let response
		let firstCategory = constants.categories[0]
		let secondCategory = constants.categories[1]
		let language = "de"

		try {
			response = await axios({
				method: 'get',
				url: listStoreBooksEndpointUrl,
				params: {
					fields: "*",
					languages: language,
					categories: `${firstCategory.key},${secondCategory.key}`
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
				) {
					storeBooks.push({
						collection: collection.uuid,
						storeBook
					})
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
						&& storeBookRelease.categories
						&& storeBookRelease.categories.includes(firstCategory.uuid)
						&& storeBookRelease.categories.includes(secondCategory.uuid)
						&& storeBookRelease.coverItem
					) {
						storeBooks.push({
							collection: collection.uuid,
							storeBook
						})
					}
				}
			}
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 3)
		assert.equal(response.data.items.length, storeBooks.length)

		for (let storeBookItem of storeBooks) {
			let storeBook = storeBookItem.storeBook
			let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
			let responseStoreBook = response.data.items.find(s => s.uuid == storeBook.uuid)

			assert.isNotNull(responseStoreBook)
			assert.equal(Object.keys(responseStoreBook).length, 10)
			assert.equal(responseStoreBook.uuid, storeBook.uuid)
			assert.equal(responseStoreBook.collection, storeBookItem.collection)
			assert.equal(responseStoreBook.title, storeBookRelease.title)
			assert.equal(responseStoreBook.description, storeBookRelease.description)
			assert.equal(responseStoreBook.language, storeBook.language)
			assert.equal(responseStoreBook.price, storeBookRelease.price ?? 0)
			assert.equal(responseStoreBook.isbn, storeBookRelease.isbn)
			assert.equal(responseStoreBook.status, "published")
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

	it("should return store books by multiple categories with multiple specified languages", async () => {
		let response
		let firstCategory = constants.categories[0]
		let secondCategory = constants.categories[1]
		let languages = ["de", "en"]

		try {
			response = await axios({
				method: 'get',
				url: listStoreBooksEndpointUrl,
				params: {
					fields: "*",
					languages: languages.join(','),
					categories: `${firstCategory.key},${secondCategory.key}`
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
				) {
					storeBooks.push({
						collection: collection.uuid,
						storeBook
					})
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
						&& storeBookRelease.categories
						&& storeBookRelease.categories.includes(firstCategory.uuid)
						&& storeBookRelease.categories.includes(secondCategory.uuid)
						&& storeBookRelease.coverItem
					) {
						storeBooks.push({
							collection: collection.uuid,
							storeBook
						})
					}
				}
			}
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 3)
		assert.equal(response.data.items.length, storeBooks.length)

		for (let storeBookItem of storeBooks) {
			let storeBook = storeBookItem.storeBook
			let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
			let responseStoreBook = response.data.items.find(s => s.uuid == storeBook.uuid)
			
			assert.isNotNull(responseStoreBook)
			assert.equal(Object.keys(responseStoreBook).length, 10)
			assert.equal(responseStoreBook.uuid, storeBook.uuid)
			assert.equal(responseStoreBook.collection, storeBookItem.collection)
			assert.equal(responseStoreBook.title, storeBookRelease.title)
			assert.equal(responseStoreBook.description, storeBookRelease.description)
			assert.equal(responseStoreBook.language, storeBook.language)
			assert.equal(responseStoreBook.price, storeBookRelease.price ?? 0)
			assert.equal(responseStoreBook.isbn, storeBookRelease.isbn)
			assert.equal(responseStoreBook.status, "published")
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

	it("should return store books by multiple categories with limit and page", async () => {
		let response
		let firstCategory = constants.categories[0]
		let secondCategory = constants.categories[1]
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
					categories: `${firstCategory.key},${secondCategory.key}`
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
				) {
					storeBooks.push({
						collection: collection.uuid,
						storeBook
					})
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
						&& storeBookRelease.categories
						&& storeBookRelease.categories.includes(firstCategory.uuid)
						&& storeBookRelease.categories.includes(secondCategory.uuid)
						&& storeBookRelease.coverItem
					) {
						storeBooks.push({
							collection: collection.uuid,
							storeBook
						})
					}
				}
			}
		}
		
		let pages = Math.ceil(storeBooks.length / limit)

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 3)
		assert.equal(response.data.items.length, limit)
		assert.equal(response.data.pages, pages)

		for (let responseStoreBook of response.data.items) {
			let storeBookItem = storeBooks.find(s => s.storeBook.uuid == responseStoreBook.uuid)
			assert.isNotNull(storeBookItem)
			let storeBook = storeBookItem.storeBook

			let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
			assert.isNotNull(storeBookRelease)

			assert.equal(Object.keys(responseStoreBook).length, 10)
			assert.equal(responseStoreBook.uuid, storeBook.uuid)
			assert.equal(responseStoreBook.collection, storeBookItem.collection)
			assert.equal(responseStoreBook.title, storeBookRelease.title)
			assert.equal(responseStoreBook.description, storeBookRelease.description)
			assert.equal(responseStoreBook.language, storeBook.language)
			assert.equal(responseStoreBook.price, storeBookRelease.price ?? 0)
			assert.equal(responseStoreBook.isbn, storeBookRelease.isbn)
			assert.equal(responseStoreBook.status, "published")
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

		try {
			response = await axios({
				method: 'get',
				url: listStoreBooksEndpointUrl,
				params: {
					fields: "*",
					languages: languages.join(','),
					limit,
					page: 2,
					categories: `${firstCategory.key},${secondCategory.key}`
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
			let storeBookItem = storeBooks.find(s => s.storeBook.uuid == responseStoreBook.uuid)
			assert.isNotNull(storeBookItem)
			let storeBook = storeBookItem.storeBook

			let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
			assert.isNotNull(storeBookRelease)

			assert.equal(Object.keys(responseStoreBook).length, 10)
			assert.equal(responseStoreBook.uuid, storeBook.uuid)
			assert.equal(responseStoreBook.collection, storeBookItem.collection)
			assert.equal(responseStoreBook.title, storeBookRelease.title)
			assert.equal(responseStoreBook.description, storeBookRelease.description)
			assert.equal(responseStoreBook.language, storeBook.language)
			assert.equal(responseStoreBook.price, storeBookRelease.price ?? 0)
			assert.equal(responseStoreBook.isbn, storeBookRelease.isbn)
			assert.equal(responseStoreBook.status, "published")
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

	it("should not return store books in review without access token", async () => {
		try {
			await axios({
				method: 'get',
				url: listStoreBooksEndpointUrl,
				params: {
					review: true
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

	it("should not return store books in review with access token for session that does not exist", async () => {
		try {
			await axios({
				method: 'get',
				url: listStoreBooksEndpointUrl,
				headers: {
					Authorization: "asdasdasd"
				},
				params: {
					review: true
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
				url: listStoreBooksEndpointUrl,
				headers: {
					Authorization: constants.testUserTestAppAccessToken
				},
				params: {
					review: true
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
				url: listStoreBooksEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken
				},
				params: {
					review: true
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
				url: listStoreBooksEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken
				},
				params: {
					fields: "*",
					review: true
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
					storeBooks.push({
						collection: collection.uuid,
						storeBook
					})
				}
			}
		}

		for (let author of constants.davUser.authors) {
			for (let collection of author.collections) {
				for (let storeBook of collection.books) {
					if (storeBook.status == "review") {
						storeBooks.push({
							collection: collection.uuid,
							storeBook
						})
					}
				}
			}
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 3)
		assert.equal(response.data.items.length, storeBooks.length)

		for (let storeBookItem of storeBooks) {
			let storeBook = storeBookItem.storeBook
			let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
			let responseStoreBook = response.data.items.find(s => s.uuid == storeBook.uuid)

			assert.isNotNull(responseStoreBook)
			assert.equal(Object.keys(responseStoreBook).length, 13)
			assert.equal(responseStoreBook.uuid, storeBook.uuid)
			assert.equal(responseStoreBook.collection, storeBookItem.collection)
			assert.equal(responseStoreBook.title, storeBookRelease.title)
			assert.equal(responseStoreBook.description, storeBookRelease.description)
			assert.equal(responseStoreBook.language, storeBook.language)
			assert.equal(responseStoreBook.price, storeBookRelease.price ?? 0)
			assert.equal(responseStoreBook.isbn, storeBookRelease.isbn)
			assert.equal(responseStoreBook.status, storeBook.status ?? "unpublished")
			if (responseStoreBook.cover) assert.isNotNull(responseStoreBook.cover.url)
			assert.equal(responseStoreBook.cover?.aspect_ratio, storeBookRelease.coverItem?.aspectRatio)
			assert.equal(responseStoreBook.cover?.blurhash, storeBookRelease.coverItem?.blurhash)
			assert.equal(responseStoreBook.file?.file_name, storeBookRelease.fileItem?.fileName)

			if (storeBookRelease.categories) {
				assert.equal(responseStoreBook.categories.length, storeBookRelease.categories.length)

				for (let key of responseStoreBook.categories) {
					assert.isNotNull(constants.categories.find(c => c.key == key))
				}
			} else {
				assert.equal(responseStoreBook.categories.length, 0)
			}

			assert.equal(responseStoreBook.in_library, userHasStoreBookInLibrary(constants.davUser, storeBook.uuid))
			assert.equal(responseStoreBook.purchased, userHasPurchasedBook(constants.davUser, storeBook.uuid))
		}
	})

	async function testGetStoreBooksOfAuthor(author, languages) {
		let response

		try {
			let options = {
				method: 'get',
				url: listStoreBooksEndpointUrl,
				params: {
					fields: "*",
					author: author.uuid
				}
			}

			if (languages) {
				options.params["languages"] = languages.join(',')
			}

			response = await axios(options)
		} catch (error) {
			assert.fail()
		}

		if (!languages) {
			languages = ["en"]
		}

		// Find the store books
		let storeBooks = []

		for (let collection of author.collections) {
			for (let storeBook of collection.books) {
				if (
					storeBook.status == "published"
					&& languages.includes(storeBook.language)
					&& storeBook.releases.length > 0
				) {
					storeBooks.push({
						collection: collection.uuid,
						storeBook
					})
				}
			}
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 3)
		assert.equal(response.data.items.length, storeBooks.length)

		for (let storeBookItem of storeBooks) {
			let storeBook = storeBookItem.storeBook
			let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
			let responseStoreBook = response.data.items.find(s => s.uuid == storeBook.uuid)
			
			assert.isNotNull(responseStoreBook)
			assert.equal(Object.keys(responseStoreBook).length, 10)
			assert.equal(responseStoreBook.uuid, storeBook.uuid)
			assert.equal(responseStoreBook.collection, storeBookItem.collection)
			assert.equal(responseStoreBook.title, storeBookRelease.title)
			assert.equal(responseStoreBook.description, storeBookRelease.description)
			assert.equal(responseStoreBook.language, storeBook.language)
			assert.equal(responseStoreBook.price, storeBookRelease.price ?? 0)
			assert.equal(responseStoreBook.isbn, storeBookRelease.isbn)
			assert.equal(responseStoreBook.status, "published")
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
	}

	async function testGetAllStoreBooksOfCollection(user, collection) {
		let response

		try {
			let requestConfig = {
				method: 'get',
				url: listStoreBooksEndpointUrl,
				params: {
					fields: "*",
					collection: collection.uuid
				}
			}

			if (user) {
				requestConfig.headers = {
					Authorization: user.accessToken
				}
			}

			response = await axios(requestConfig)
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 3)
		assert.equal(response.data.items.length, collection.books.length)

		for (let storeBook of collection.books) {
			let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
			let responseStoreBook = response.data.items.find(s => s.uuid == storeBook.uuid)
			
			assert.isNotNull(responseStoreBook)
			assert.equal(Object.keys(responseStoreBook).length, 13)
			assert.equal(responseStoreBook.uuid, storeBook.uuid)
			assert.equal(responseStoreBook.collection, collection.uuid)
			assert.equal(responseStoreBook.title, storeBookRelease.title)
			assert.equal(responseStoreBook.description, storeBookRelease.description)
			assert.equal(responseStoreBook.language, storeBook.language)
			assert.equal(responseStoreBook.price, storeBookRelease.price ?? 0)
			assert.equal(responseStoreBook.isbn, storeBookRelease.isbn)
			assert.equal(responseStoreBook.status, storeBook.status ?? "unpublished")
			if (responseStoreBook.cover) assert.isNotNull(responseStoreBook.cover.url)
			assert.equal(responseStoreBook.cover?.aspect_ratio, storeBookRelease.coverItem?.aspectRatio)
			assert.equal(responseStoreBook.cover?.blurhash, storeBookRelease.coverItem?.blurhash)
			assert.equal(responseStoreBook.file?.file_name, storeBookRelease.fileItem?.fileName)

			if (storeBookRelease.categories) {
				assert.equal(responseStoreBook.categories.length, storeBookRelease.categories.length)

				for (let key of responseStoreBook.categories) {
					assert.isNotNull(constants.categories.find(c => c.key == key))
				}
			} else {
				assert.equal(responseStoreBook.categories.length, 0)
			}

			assert.equal(responseStoreBook.in_library, userHasStoreBookInLibrary(user, storeBook.uuid))
			assert.equal(responseStoreBook.purchased, userHasPurchasedBook(user, storeBook.uuid))
		}
	}

	async function testGetPublishedStoreBooksOfCollection(user, collection) {
		let response

		try {
			let requestConfig = {
				method: 'get',
				url: listStoreBooksEndpointUrl,
				params: {
					fields: "*",
					collection: collection.uuid
				}
			}

			if (user) {
				requestConfig.headers = {
					Authorization: user.accessToken
				}
			}

			response = await axios(requestConfig)
		} catch (error) {
			assert.fail()
		}

		let storeBooks = []

		for (let storeBook of collection.books) {
			if (storeBook.status == "published" && storeBook.language == "en") {
				storeBooks.push(storeBook)
			}
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 3)
		assert.equal(response.data.items.length, storeBooks.length)

		for (let storeBook of storeBooks) {
			let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
			let responseStoreBook = response.data.items.find(s => s.uuid == storeBook.uuid)

			assert.isNotNull(responseStoreBook)
			assert.equal(Object.keys(responseStoreBook).length, user == null ? 10 : 12)
			assert.equal(responseStoreBook.uuid, storeBook.uuid)
			assert.equal(responseStoreBook.collection, collection.uuid)
			assert.equal(responseStoreBook.title, storeBookRelease.title)
			assert.equal(responseStoreBook.description, storeBookRelease.description)
			assert.equal(responseStoreBook.language, storeBook.language)
			assert.equal(responseStoreBook.price, storeBookRelease.price ?? 0)
			assert.equal(responseStoreBook.isbn, storeBookRelease.isbn)
			assert.equal(responseStoreBook.status, "published")
			assert.isNotNull(responseStoreBook.cover.url)
			assert.equal(responseStoreBook.cover?.aspect_ratio, storeBookRelease.coverItem?.aspectRatio)
			assert.equal(responseStoreBook.cover?.blurhash, storeBookRelease.coverItem?.blurhash)
			assert.isUndefined(responseStoreBook.file)

			if (storeBookRelease.categories) {
				assert.equal(responseStoreBook.categories.length, storeBookRelease.categories.length)

				for (let key of responseStoreBook.categories) {
					assert.isNotNull(constants.categories.find(c => c.key == key))
				}
			} else {
				assert.equal(responseStoreBook.categories.length, 0)
			}

			if (user == null) {
				assert.isUndefined(responseStoreBook.in_library)
				assert.isUndefined(responseStoreBook.purchased)
			} else {
				assert.equal(responseStoreBook.in_library, userHasStoreBookInLibrary(user, storeBook.uuid))
				assert.equal(responseStoreBook.purchased, userHasPurchasedBook(user, storeBook.uuid))
			}
		}
	}

	function userHasStoreBookInLibrary(user, storeBookUuid) {
		return user.books?.find(b => b.storeBook == storeBookUuid) != null
	}

	function userHasPurchasedBook(user, storeBookUuid) {
		return constants.purchases.find(p => p.userId == user.id && p.tableObjects.includes(storeBookUuid)) != null
	}
})