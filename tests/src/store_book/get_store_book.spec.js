import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'
import * as ErrorCodes from '../errorCodes.js'

const getStoreBookEndpointUrl = `${constants.apiBaseUrl}/store_books/{0}`

describe("GetStoreBook endpoint", () => {
	it("should not return store book with access token for session that does not exist", async () => {
		try {
			await axios({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: "asdasdasdasd.asdasdasd"
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

	it("should not return store book with access token for another app", async () => {
		try {
			await axios({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
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

	it("should not return store book if the store book does not exist", async () => {
		try {
			await axios({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', "blablabla"),
				headers: {
					Authorization: constants.authorUser.accessToken
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 404)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.StoreBookDoesNotExist)
			return
		}

		assert.fail()
	})

	it("should return unpublished store book if the user is the author", async () => {
		let author = constants.authorUser.author
		let collection = author.collections[1]
		let storeBook = collection.books[0]
		let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
		let response

		try {
			response = await axios({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.authorUser.accessToken
				},
				params: {
					fields: "*"
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 12)
		assert.equal(response.data.uuid, storeBook.uuid)
		assert.equal(response.data.title, storeBookRelease.title)
		assert.equal(response.data.description, storeBookRelease.description)
		assert.equal(response.data.language, storeBook.language)
		assert.equal(response.data.price, storeBookRelease.price ?? 0)
		assert.equal(response.data.isbn, storeBookRelease.isbn)
		assert.equal(response.data.status, storeBook.status ?? "unpublished")
		if (response.data.cover) assert.isNotNull(response.data.cover.url)
		assert.equal(response.data.cover?.aspect_ratio, storeBookRelease.coverItem?.aspectRatio)
		assert.equal(response.data.cover?.blurhash, storeBookRelease.coverItem?.blurhash)
		assert.equal(response.data.file?.file_name, storeBookRelease.fileItem?.fileName)

		if (storeBookRelease.categories) {
			assert.equal(response.data.categories.length, storeBookRelease.categories.length)

			for (let key of response.data.categories) {
				assert.isNotNull(constants.categories.find(c => c.key == key))
			}
		} else {
			assert.equal(response.data.categories.length, 0)
		}

		assert.isFalse(response.data.in_library)
		assert.isFalse(response.data.purchased)
	})

	it("should return unpublished store book if the user is an admin", async () => {
		let author = constants.authorUser.author
		let collection = author.collections[1]
		let storeBook = collection.books[0]
		let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
		let response

		try {
			response = await axios({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
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

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 12)
		assert.equal(response.data.uuid, storeBook.uuid)
		assert.equal(response.data.title, storeBookRelease.title)
		assert.equal(response.data.description, storeBookRelease.description)
		assert.equal(response.data.language, storeBook.language)
		assert.equal(response.data.price, storeBookRelease.price ?? 0)
		assert.equal(response.data.isbn, storeBookRelease.isbn)
		assert.equal(response.data.status, "unpublished")
		if (response.data.cover) assert.isNotNull(response.data.cover.url)
		assert.equal(response.data.cover?.aspect_ratio, storeBookRelease.coverItem?.aspectRatio)
		assert.equal(response.data.cover?.blurhash, storeBookRelease.coverItem?.blurhash)
		assert.equal(response.data.file?.file_name, storeBookRelease.fileItem?.fileName)

		if (storeBookRelease.categories) {
			assert.equal(response.data.categories.length, storeBookRelease.categories.length)

			for (let key of response.data.categories) {
				assert.isNotNull(constants.categories.find(c => c.key == key))
			}
		} else {
			assert.equal(response.data.categories.length, 0)
		}

		assert.isFalse(response.data.in_library)
		assert.isFalse(response.data.purchased)
	})

	it("should not return unpublished store book if the user is not the author", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[0]

		try {
			await axios({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.testUser.accessToken
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

	it("should not return unpublished store book without access token", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[0]

		try {
			await axios({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', storeBook.uuid)
			})
		} catch (error) {
			assert.equal(error.response.status, 403)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.ActionNotAllowed)
			return
		}

		assert.fail()
	})

	it("should return store book in review if the user is the author", async () => {
		let author = constants.authorUser.author
		let collection = author.collections[0]
		let storeBook = collection.books[0]
		let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
		let response

		try {
			response = await axios({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.authorUser.accessToken
				},
				params: {
					fields: "*"
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 12)
		assert.equal(response.data.uuid, storeBook.uuid)
		assert.equal(response.data.title, storeBookRelease.title)
		assert.equal(response.data.description, storeBookRelease.description)
		assert.equal(response.data.language, storeBook.language)
		assert.equal(response.data.price, storeBookRelease.price ?? 0)
		assert.equal(response.data.isbn, storeBookRelease.isbn)
		assert.equal(response.data.status, "review")
		if (response.data.cover) assert.isNotNull(response.data.cover.url)
		assert.equal(response.data.cover?.aspect_ratio, storeBookRelease.coverItem?.aspectRatio)
		assert.equal(response.data.cover?.blurhash, storeBookRelease.coverItem?.blurhash)
		assert.equal(response.data.file?.file_name, storeBookRelease.fileItem?.fileName)

		if (storeBookRelease.categories) {
			assert.equal(response.data.categories.length, storeBookRelease.categories.length)

			for (let key of response.data.categories) {
				assert.isNotNull(constants.categories.find(c => c.key == key))
			}
		} else {
			assert.equal(response.data.categories.length, 0)
		}

		assert.isFalse(response.data.in_library)
		assert.isFalse(response.data.purchased)
	})

	it("should return store book in review if the user is an admin", async () => {
		let author = constants.authorUser.author
		let collection = author.collections[0]
		let storeBook = collection.books[0]
		let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
		let response

		try {
			response = await axios({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
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

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 12)
		assert.equal(response.data.uuid, storeBook.uuid)
		assert.equal(response.data.title, storeBookRelease.title)
		assert.equal(response.data.description, storeBookRelease.description)
		assert.equal(response.data.language, storeBook.language)
		assert.equal(response.data.price, storeBookRelease.price ?? 0)
		assert.equal(response.data.isbn, storeBookRelease.isbn)
		assert.equal(response.data.status, "review")
		if (response.data.cover) assert.isNotNull(response.data.cover.url)
		assert.equal(response.data.cover?.aspect_ratio, storeBookRelease.coverItem?.aspectRatio)
		assert.equal(response.data.cover?.blurhash, storeBookRelease.coverItem?.blurhash)
		assert.equal(response.data.file?.file_name, storeBookRelease.fileItem?.fileName)

		if (storeBookRelease.categories) {
			assert.equal(response.data.categories.length, storeBookRelease.categories.length)

			for (let key of response.data.categories) {
				assert.isNotNull(constants.categories.find(c => c.key == key))
			}
		} else {
			assert.equal(response.data.categories.length, 0)
		}

		assert.isFalse(response.data.in_library)
		assert.isFalse(response.data.purchased)
	})

	it("should not return store book in review if the user is not the author", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[0]

		try {
			response = await axios({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.testUser.accessToken
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

	it("should not return store book in review without access token", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[0]

		try {
			await axios({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', storeBook.uuid)
			})
		} catch (error) {
			assert.equal(error.response.status, 403)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.ActionNotAllowed)
			return
		}

		assert.fail()
	})

	it("should return published store book if the user is the author", async () => {
		let author = constants.authorUser.author
		let collection = author.collections[1]
		let storeBook = collection.books[1]
		let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
		let response

		try {
			response = await axios({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.authorUser.accessToken
				},
				params: {
					fields: "*"
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 12)
		assert.equal(response.data.uuid, storeBook.uuid)
		assert.equal(response.data.title, storeBookRelease.title)
		assert.equal(response.data.description, storeBookRelease.description)
		assert.equal(response.data.language, storeBook.language)
		assert.equal(response.data.price, storeBookRelease.price ?? 0)
		assert.equal(response.data.isbn, storeBookRelease.isbn)
		assert.equal(response.data.status, "published")
		if (response.data.cover) assert.isNotNull(response.data.cover.url)
		assert.equal(response.data.cover?.aspect_ratio, storeBookRelease.coverItem?.aspectRatio)
		assert.equal(response.data.cover?.blurhash, storeBookRelease.coverItem?.blurhash)
		assert.equal(response.data.file?.file_name, storeBookRelease.fileItem?.fileName)

		if (storeBookRelease.categories) {
			assert.equal(response.data.categories.length, storeBookRelease.categories.length)

			for (let key of response.data.categories) {
				assert.isNotNull(constants.categories.find(c => c.key == key))
			}
		} else {
			assert.equal(response.data.categories.length, 0)
		}

		assert.isFalse(response.data.in_library)
		assert.isFalse(response.data.purchased)
	})

	it("should return published store book if the user is an admin", async () => {
		let author = constants.authorUser.author
		let collection = author.collections[1]
		let storeBook = collection.books[1]
		let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
		let response

		try {
			response = await axios({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
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

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 12)
		assert.equal(response.data.uuid, storeBook.uuid)
		assert.equal(response.data.title, storeBookRelease.title)
		assert.equal(response.data.description, storeBookRelease.description)
		assert.equal(response.data.language, storeBook.language)
		assert.equal(response.data.price, storeBookRelease.price ?? 0)
		assert.equal(response.data.isbn, storeBookRelease.isbn)
		assert.equal(response.data.status, "published")
		if (response.data.cover) assert.isNotNull(response.data.cover.url)
		assert.equal(response.data.cover?.aspect_ratio, storeBookRelease.coverItem?.aspectRatio)
		assert.equal(response.data.cover?.blurhash, storeBookRelease.coverItem?.blurhash)
		assert.equal(response.data.file?.file_name, storeBookRelease.fileItem?.fileName)

		if (storeBookRelease.categories) {
			assert.equal(response.data.categories.length, storeBookRelease.categories.length)

			for (let key of response.data.categories) {
				assert.isNotNull(constants.categories.find(c => c.key == key))
			}
		} else {
			assert.equal(response.data.categories.length, 0)
		}

		assert.isFalse(response.data.in_library)
		assert.isFalse(response.data.purchased)
	})

	it("should return published store book if the user is not the author", async () => {
		let author = constants.authorUser.author
		let collection = author.collections[1]
		let storeBook = collection.books[1]
		let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
		let response

		try {
			response = await axios({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.testUser.accessToken
				},
				params: {
					fields: "*"
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 11)
		assert.equal(response.data.uuid, storeBook.uuid)
		assert.equal(response.data.title, storeBookRelease.title)
		assert.equal(response.data.description, storeBookRelease.description)
		assert.equal(response.data.language, storeBook.language)
		assert.equal(response.data.price, storeBookRelease.price ?? 0)
		assert.equal(response.data.isbn, storeBookRelease.isbn)
		assert.equal(response.data.status, "published")
		if (response.data.cover) assert.isNotNull(response.data.cover.url)
		assert.equal(response.data.cover?.aspect_ratio, storeBookRelease.coverItem?.aspectRatio)
		assert.equal(response.data.cover?.blurhash, storeBookRelease.coverItem?.blurhash)
		assert.isUndefined(response.data.file)

		if (storeBookRelease.categories) {
			assert.equal(response.data.categories.length, storeBookRelease.categories.length)

			for (let key of response.data.categories) {
				assert.isNotNull(constants.categories.find(c => c.key == key))
			}
		} else {
			assert.equal(response.data.categories.length, 0)
		}

		assert.isFalse(response.data.in_library)
		assert.isFalse(response.data.purchased)
	})

	it("should return published store book without access token", async () => {
		let author = constants.authorUser.author
		let collection = author.collections[1]
		let storeBook = collection.books[1]
		let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
		let response

		try {
			response = await axios({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				params: {
					fields: "*"
				}
			})
		} catch (error) {
			console.log(error.response.data)
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 9)
		assert.equal(response.data.uuid, storeBook.uuid)
		assert.equal(response.data.title, storeBookRelease.title)
		assert.equal(response.data.description, storeBookRelease.description)
		assert.equal(response.data.language, storeBook.language)
		assert.equal(response.data.price, storeBookRelease.price ?? 0)
		assert.equal(response.data.isbn, storeBookRelease.isbn)
		assert.equal(response.data.status, "published")
		if (response.data.cover) assert.isNotNull(response.data.cover.url)
		assert.equal(response.data.cover?.aspect_ratio, storeBookRelease.coverItem?.aspectRatio)
		assert.equal(response.data.cover?.blurhash, storeBookRelease.coverItem?.blurhash)
		assert.isUndefined(response.data.file)

		if (storeBookRelease.categories) {
			assert.equal(response.data.categories.length, storeBookRelease.categories.length)

			for (let key of response.data.categories) {
				assert.isNotNull(constants.categories.find(c => c.key == key))
			}
		} else {
			assert.equal(response.data.categories.length, 0)
		}

		assert.isUndefined(response.data.in_library)
		assert.isUndefined(response.data.purchased)
	})

	it("should return hidden store book if the user is the author", async () => {
		let author = constants.authorUser.author
		let collection = author.collections[0]
		let storeBook = collection.books[1]
		let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
		let response

		try {
			response = await axios({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.authorUser.accessToken
				},
				params: {
					fields: "*"
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 12)
		assert.equal(response.data.uuid, storeBook.uuid)
		assert.equal(response.data.title, storeBookRelease.title)
		assert.equal(response.data.description, storeBookRelease.description)
		assert.equal(response.data.language, storeBook.language)
		assert.equal(response.data.price, storeBookRelease.price ?? 0)
		assert.equal(response.data.isbn, storeBookRelease.isbn)
		assert.equal(response.data.status, "hidden")
		if (response.data.cover) assert.isNotNull(response.data.cover.url)
		assert.equal(response.data.cover?.aspect_ratio, storeBookRelease.coverItem?.aspectRatio)
		assert.equal(response.data.cover?.blurhash, storeBookRelease.coverItem?.blurhash)
		assert.equal(response.data.file?.file_name, storeBookRelease.fileItem?.fileName)

		if (storeBookRelease.categories) {
			assert.equal(response.data.categories.length, storeBookRelease.categories.length)

			for (let key of response.data.categories) {
				assert.isNotNull(constants.categories.find(c => c.key == key))
			}
		} else {
			assert.equal(response.data.categories.length, 0)
		}

		assert.isFalse(response.data.in_library)
		assert.isFalse(response.data.purchased)
	})

	it("should return hidden store book if the user is an admin", async () => {
		let author = constants.authorUser.author
		let collection = author.collections[0]
		let storeBook = collection.books[1]
		let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
		let response

		try {
			response = await axios({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
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

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 12)
		assert.equal(response.data.uuid, storeBook.uuid)
		assert.equal(response.data.title, storeBookRelease.title)
		assert.equal(response.data.description, storeBookRelease.description)
		assert.equal(response.data.language, storeBook.language)
		assert.equal(response.data.price, storeBookRelease.price ?? 0)
		assert.equal(response.data.isbn, storeBookRelease.isbn)
		assert.equal(response.data.status, "hidden")
		if (response.data.cover) assert.isNotNull(response.data.cover.url)
		assert.equal(response.data.cover?.aspect_ratio, storeBookRelease.coverItem?.aspectRatio)
		assert.equal(response.data.cover?.blurhash, storeBookRelease.coverItem?.blurhash)
		assert.equal(response.data.file?.file_name, storeBookRelease.fileItem?.fileName)

		if (storeBookRelease.categories) {
			assert.equal(response.data.categories.length, storeBookRelease.categories.length)

			for (let key of response.data.categories) {
				assert.isNotNull(constants.categories.find(c => c.key == key))
			}
		} else {
			assert.equal(response.data.categories.length, 0)
		}

		assert.isFalse(response.data.in_library)
		assert.isFalse(response.data.purchased)
	})

	it("should not return hidden store book if the user is not the author", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[1]

		try {
			await axios({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.testUser.accessToken
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

	it("should not return hidden store book without access token", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[1]

		try {
			await axios({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', storeBook.uuid)
			})
		} catch (error) {
			assert.equal(error.response.status, 403)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.ActionNotAllowed)
			return
		}

		assert.fail()
	})
})