import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'
import * as ErrorCodes from '../errorCodes.js'

const getStoreBookEndpointUrl = `${constants.apiBaseUrl}/store/book/{0}`

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
			assert.equal(404, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.SessionDoesNotExist, error.response.data.errors[0].code)
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
			assert.equal(403, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.ActionNotAllowed, error.response.data.errors[0].code)
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
			assert.equal(404, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.StoreBookDoesNotExist, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should return unpublished store book if the user is the author", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[0]
		let response

		try {
			response = await axios({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.authorUser.accessToken
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(200, response.status)
		assert.equal(storeBook.uuid, response.data.uuid)
		assert.equal(collection.uuid, response.data.collection)
		assert.equal(storeBook.title, response.data.title)
		assert.equal(storeBook.description, response.data.description)
		assert.equal(storeBook.language, response.data.language)
		assert.equal(storeBook.price || 0, response.data.price)
		assert.equal(storeBook.isbn, response.data.isbn)
		assert.equal("unpublished", response.data.status)
		assert.equal(storeBook.cover != null, response.data.cover)
		assert.equal(storeBook.coverAspectRatio, response.data.cover_aspect_ratio)
		assert.equal(storeBook.coverBlurhash, response.data.cover_blurhash)
		assert.equal(storeBook.file != null, response.data.file)
		assert.equal(storeBook.fileName, response.data.file_name)

		if (storeBook.categories) {
			assert.equal(storeBook.categories.length, response.data.categories.length)

			for (let key of response.data.categories) {
				assert(constants.categories.find(c => c.key == key) != null)
			}
		} else {
			assert.equal(0, response.data.categories.length)
		}

		assert.isFalse(response.data.in_library)
		assert.isFalse(response.data.purchased)
	})

	it("should return unpublished store book if the user is an admin", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[0]
		let response

		try {
			response = await axios({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.davUser.accessToken
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(200, response.status)
		assert.equal(storeBook.uuid, response.data.uuid)
		assert.equal(collection.uuid, response.data.collection)
		assert.equal(storeBook.title, response.data.title)
		assert.equal(storeBook.description, response.data.description)
		assert.equal(storeBook.language, response.data.language)
		assert.equal(storeBook.price || 0, response.data.price)
		assert.equal(storeBook.isbn, response.data.isbn)
		assert.equal("unpublished", response.data.status)
		assert.equal(storeBook.cover != null, response.data.cover)
		assert.equal(storeBook.coverAspectRatio, response.data.cover_aspect_ratio)
		assert.equal(storeBook.coverBlurhash, response.data.cover_blurhash)
		assert.equal(storeBook.file != null, response.data.file)
		assert.equal(storeBook.fileName, response.data.file_name)

		if (storeBook.categories) {
			assert.equal(storeBook.categories.length, response.data.categories.length)

			for (let key of response.data.categories) {
				assert(constants.categories.find(c => c.key == key) != null)
			}
		} else {
			assert.equal(0, response.data.categories.length)
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
			assert.equal(403, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.ActionNotAllowed, error.response.data.errors[0].code)
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
			assert.equal(403, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.ActionNotAllowed, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should return store book in review if the user is the author", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[0]
		let response

		try {
			response = await axios({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.authorUser.accessToken
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(200, response.status)
		assert.equal(storeBook.uuid, response.data.uuid)
		assert.equal(collection.uuid, response.data.collection)
		assert.equal(storeBook.title, response.data.title)
		assert.equal(storeBook.description, response.data.description)
		assert.equal(storeBook.language, response.data.language)
		assert.equal(storeBook.price || 0, response.data.price)
		assert.equal(storeBook.isbn, response.data.isbn)
		assert.equal("review", response.data.status)
		assert.equal(storeBook.cover != null, response.data.cover)
		assert.equal(storeBook.coverAspectRatio, response.data.cover_aspect_ratio)
		assert.equal(storeBook.coverBlurhash, response.data.cover_blurhash)
		assert.equal(storeBook.file != null, response.data.file)
		assert.equal(storeBook.fileName, response.data.file_name)

		if (storeBook.categories) {
			assert.equal(storeBook.categories.length, response.data.categories.length)

			for (let key of response.data.categories) {
				assert(constants.categories.find(c => c.key == key) != null)
			}
		} else {
			assert.equal(0, response.data.categories.length)
		}

		assert.isFalse(response.data.in_library)
		assert.isFalse(response.data.purchased)
	})

	it("should return store book in review if the user is an admin", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[0]
		let response

		try {
			response = await axios({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.davUser.accessToken
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(200, response.status)
		assert.equal(storeBook.uuid, response.data.uuid)
		assert.equal(collection.uuid, response.data.collection)
		assert.equal(storeBook.title, response.data.title)
		assert.equal(storeBook.description, response.data.description)
		assert.equal(storeBook.language, response.data.language)
		assert.equal(storeBook.price || 0, response.data.price)
		assert.equal(storeBook.isbn, response.data.isbn)
		assert.equal("review", response.data.status)
		assert.equal(storeBook.cover != null, response.data.cover)
		assert.equal(storeBook.coverAspectRatio, response.data.cover_aspect_ratio)
		assert.equal(storeBook.coverBlurhash, response.data.cover_blurhash)
		assert.equal(storeBook.file != null, response.data.file)
		assert.equal(storeBook.fileName, response.data.file_name)

		if (storeBook.categories) {
			assert.equal(storeBook.categories.length, response.data.categories.length)

			for (let key of response.data.categories) {
				assert(constants.categories.find(c => c.key == key) != null)
			}
		} else {
			assert.equal(0, response.data.categories.length)
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
			assert.equal(403, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.ActionNotAllowed, error.response.data.errors[0].code)
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
			assert.equal(403, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.ActionNotAllowed, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should return published store book if the user is the author", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[1]
		let response

		try {
			response = await axios({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.authorUser.accessToken
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(200, response.status)
		assert.equal(storeBook.uuid, response.data.uuid)
		assert.equal(collection.uuid, response.data.collection)
		assert.equal(storeBook.title, response.data.title)
		assert.equal(storeBook.description, response.data.description)
		assert.equal(storeBook.language, response.data.language)
		assert.equal(storeBook.price || 0, response.data.price)
		assert.equal(storeBook.isbn, response.data.isbn)
		assert.equal("published", response.data.status)
		assert.equal(storeBook.cover != null, response.data.cover)
		assert.equal(storeBook.coverAspectRatio, response.data.cover_aspect_ratio)
		assert.equal(storeBook.coverBlurhash, response.data.cover_blurhash)
		assert.equal(storeBook.file != null, response.data.file)
		assert.equal(storeBook.fileName, response.data.file_name)

		if (storeBook.categories) {
			assert.equal(storeBook.categories.length, response.data.categories.length)

			for (let key of response.data.categories) {
				assert(constants.categories.find(c => c.key == key) != null)
			}
		} else {
			assert.equal(0, response.data.categories.length)
		}

		assert.isFalse(response.data.in_library)
		assert.isFalse(response.data.purchased)
	})

	it("should return published store book if the user is an admin", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[1]
		let response

		try {
			response = await axios({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.davUser.accessToken
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(200, response.status)
		assert.equal(storeBook.uuid, response.data.uuid)
		assert.equal(collection.uuid, response.data.collection)
		assert.equal(storeBook.title, response.data.title)
		assert.equal(storeBook.description, response.data.description)
		assert.equal(storeBook.language, response.data.language)
		assert.equal(storeBook.price || 0, response.data.price)
		assert.equal(storeBook.isbn, response.data.isbn)
		assert.equal("published", response.data.status)
		assert.equal(storeBook.cover != null, response.data.cover)
		assert.equal(storeBook.coverAspectRatio, response.data.cover_aspect_ratio)
		assert.equal(storeBook.coverBlurhash, response.data.cover_blurhash)
		assert.equal(storeBook.file != null, response.data.file)
		assert.equal(storeBook.fileName, response.data.file_name)

		if (storeBook.categories) {
			assert.equal(storeBook.categories.length, response.data.categories.length)

			for (let key of response.data.categories) {
				assert(constants.categories.find(c => c.key == key) != null)
			}
		} else {
			assert.equal(0, response.data.categories.length)
		}

		assert.isFalse(response.data.in_library)
		assert.isFalse(response.data.purchased)
	})

	it("should return published store book if the user is not the author", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[1]
		let response

		try {
			response = await axios({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.testUser.accessToken
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(200, response.status)
		assert.equal(storeBook.uuid, response.data.uuid)
		assert.equal(collection.uuid, response.data.collection)
		assert.equal(storeBook.title, response.data.title)
		assert.equal(storeBook.description, response.data.description)
		assert.equal(storeBook.language, response.data.language)
		assert.equal(storeBook.price || 0, response.data.price)
		assert.equal(storeBook.isbn, response.data.isbn)
		assert.equal("published", response.data.status)
		assert.equal(storeBook.cover != null, response.data.cover)
		assert.equal(storeBook.coverAspectRatio, response.data.cover_aspect_ratio)
		assert.equal(storeBook.coverBlurhash, response.data.cover_blurhash)
		assert.equal(storeBook.file != null, response.data.file)
		assert.equal(storeBook.fileName, response.data.file_name)

		if (storeBook.categories) {
			assert.equal(storeBook.categories.length, response.data.categories.length)

			for (let key of response.data.categories) {
				assert(constants.categories.find(c => c.key == key) != null)
			}
		} else {
			assert.equal(0, response.data.categories.length)
		}

		assert.isFalse(response.data.in_library)
		assert.isFalse(response.data.purchased)
	})

	it("should return published store book without access token", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[1]
		let response

		try {
			response = await axios({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', storeBook.uuid)
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(200, response.status)
		assert.equal(storeBook.uuid, response.data.uuid)
		assert.equal(collection.uuid, response.data.collection)
		assert.equal(storeBook.title, response.data.title)
		assert.equal(storeBook.description, response.data.description)
		assert.equal(storeBook.language, response.data.language)
		assert.equal(storeBook.price || 0, response.data.price)
		assert.equal(storeBook.isbn, response.data.isbn)
		assert.equal("published", response.data.status)
		assert.equal(storeBook.cover != null, response.data.cover)
		assert.equal(storeBook.coverAspectRatio, response.data.cover_aspect_ratio)
		assert.equal(storeBook.coverBlurhash, response.data.cover_blurhash)
		assert.equal(storeBook.file != null, response.data.file)
		assert.equal(storeBook.fileName, response.data.file_name)

		if (storeBook.categories) {
			assert.equal(storeBook.categories.length, response.data.categories.length)

			for (let key of response.data.categories) {
				assert(constants.categories.find(c => c.key == key) != null)
			}
		} else {
			assert.equal(0, response.data.categories.length)
		}

		assert.isFalse(response.data.in_library)
		assert.isFalse(response.data.purchased)
	})

	it("should return hidden store book if the user is the author", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[1]
		let response

		try {
			response = await axios({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.authorUser.accessToken
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(200, response.status)
		assert.equal(storeBook.uuid, response.data.uuid)
		assert.equal(collection.uuid, response.data.collection)
		assert.equal(storeBook.title, response.data.title)
		assert.equal(storeBook.description, response.data.description)
		assert.equal(storeBook.language, response.data.language)
		assert.equal(storeBook.price || 0, response.data.price)
		assert.equal(storeBook.isbn, response.data.isbn)
		assert.equal("hidden", response.data.status)
		assert.equal(storeBook.cover != null, response.data.cover)
		assert.equal(storeBook.coverAspectRatio, response.data.cover_aspect_ratio)
		assert.equal(storeBook.coverBlurhash, response.data.cover_blurhash)
		assert.equal(storeBook.file != null, response.data.file)
		assert.equal(storeBook.fileName, response.data.file_name)

		if (storeBook.categories) {
			assert.equal(storeBook.categories.length, response.data.categories.length)

			for (let key of response.data.categories) {
				assert(constants.categories.find(c => c.key == key) != null)
			}
		} else {
			assert.equal(0, response.data.categories.length)
		}

		assert.isFalse(response.data.in_library)
		assert.isFalse(response.data.purchased)
	})

	it("should return hidden store book if the user is an admin", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[1]
		let response

		try {
			response = await axios({
				method: 'get',
				url: getStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.davUser.accessToken
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(200, response.status)
		assert.equal(storeBook.uuid, response.data.uuid)
		assert.equal(collection.uuid, response.data.collection)
		assert.equal(storeBook.title, response.data.title)
		assert.equal(storeBook.description, response.data.description)
		assert.equal(storeBook.language, response.data.language)
		assert.equal(storeBook.price || 0, response.data.price)
		assert.equal(storeBook.isbn, response.data.isbn)
		assert.equal("hidden", response.data.status)
		assert.equal(storeBook.cover != null, response.data.cover)
		assert.equal(storeBook.coverAspectRatio, response.data.cover_aspect_ratio)
		assert.equal(storeBook.coverBlurhash, response.data.cover_blurhash)
		assert.equal(storeBook.file != null, response.data.file)
		assert.equal(storeBook.fileName, response.data.file_name)

		if (storeBook.categories) {
			assert.equal(storeBook.categories.length, response.data.categories.length)

			for (let key of response.data.categories) {
				assert(constants.categories.find(c => c.key == key) != null)
			}
		} else {
			assert.equal(0, response.data.categories.length)
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
			assert.equal(403, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.ActionNotAllowed, error.response.data.errors[0].code)
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
			assert.equal(403, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.ActionNotAllowed, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})
})