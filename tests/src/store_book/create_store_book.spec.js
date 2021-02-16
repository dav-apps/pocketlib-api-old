import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import { TableObjectsController } from 'dav-npm'
import constants from '../constants.js'
import * as utils from '../utils.js'

const createStoreBookEndpointUrl = `${constants.apiBaseUrl}/api/1/call/store/book`
var resetStoreBooksAndCollections = false

afterEach(async () => {
	if (resetStoreBooksAndCollections) {
		await utils.resetStoreBooks()
		await utils.resetStoreBookCollections()
		resetStoreBooksAndCollections = false
	}
})

describe("CreateStoreBook endpoint", () => {
	it("should not create store book without access token", async () => {
		try {
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					'Content-Type': 'application/json'
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(2101, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not create store book with access token for session that does not exist", async () => {
		try {
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: "asdasdasd.asdasd",
					'Content-Type': 'application/json'
				},
				data: {
					collection: "blabla",
					title: "Hello World",
					language: "de"
				}
			})
		} catch (error) {
			assert.equal(404, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(2802, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not create store book without Content-Type json", async () => {
		try {
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken
				}
			})
		} catch (error) {
			assert.equal(415, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(1104, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not create store book with access token for another app", async () => {
		try {
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.testUserTestAppAccessToken,
					'Content-Type': 'application/json'
				}
			})
		} catch (error) {
			assert.equal(403, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(1102, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not create store book without required properties", async () => {
		try {
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(3, error.response.data.errors.length)
			assert.equal(2109, error.response.data.errors[0].code)
			assert.equal(2105, error.response.data.errors[1].code)
			assert.equal(2106, error.response.data.errors[2].code)
			return
		}

		assert.fail()
	})

	it("should not create store book with properties with wrong types", async () => {
		try {
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					collection: 12.2,
					title: false,
					language: 23
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(3, error.response.data.errors.length)
			assert.equal(2210, error.response.data.errors[0].code)
			assert.equal(2204, error.response.data.errors[1].code)
			assert.equal(2206, error.response.data.errors[2].code)
			return
		}

		assert.fail()
	})

	it("should not create store book with optional properties with wrong types", async () => {
		try {
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					collection: 12.23,
					title: 12,
					description: true,
					language: false,
					price: "123",
					isbn: true,
					categories: 51
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(7, error.response.data.errors.length)
			assert.equal(2210, error.response.data.errors[0].code)
			assert.equal(2204, error.response.data.errors[1].code)
			assert.equal(2205, error.response.data.errors[2].code)
			assert.equal(2206, error.response.data.errors[3].code)
			assert.equal(2211, error.response.data.errors[4].code)
			assert.equal(2220, error.response.data.errors[5].code)
			assert.equal(2215, error.response.data.errors[6].code)
			return
		}

		assert.fail()
	})

	it("should not create store book with too short properties", async () => {
		try {
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					collection: "a",
					title: "a",
					language: "en"
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(2, error.response.data.errors.length)
			assert.equal(2308, error.response.data.errors[0].code)
			assert.equal(2304, error.response.data.errors[1].code)
			return
		}

		assert.fail()
	})

	it("should not create store book with too short optional properties", async () => {
		try {
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					collection: "a",
					title: "a",
					description: "",
					language: "en"
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(3, error.response.data.errors.length)
			assert.equal(2308, error.response.data.errors[0].code)
			assert.equal(2304, error.response.data.errors[1].code)
			assert.equal(2305, error.response.data.errors[2].code)
			return
		}

		assert.fail()
	})

	it("should not create store book with too long properties", async () => {
		try {
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					collection: "a".repeat(220),
					title: "a".repeat(150),
					language: "en"
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(2, error.response.data.errors.length)
			assert.equal(2408, error.response.data.errors[0].code)
			assert.equal(2404, error.response.data.errors[1].code)
			return
		}

		assert.fail()
	})

	it("should not create store book with too long optional properties", async () => {
		try {
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					collection: "a".repeat(220),
					title: "a".repeat(150),
					description: "a".repeat(2010),
					language: "de"
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(3, error.response.data.errors.length)
			assert.equal(2408, error.response.data.errors[0].code)
			assert.equal(2404, error.response.data.errors[1].code)
			assert.equal(2405, error.response.data.errors[2].code)
			return
		}

		assert.fail()
	})

	it("should not create store book with not supported language", async () => {
		try {
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					collection: constants.authorUser.author.collections[0].uuid,
					title: "Hello World",
					language: "blabla"
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(1107, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not create store book with invalid price", async () => {
		try {
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					collection: constants.authorUser.author.collections[0].uuid,
					title: "Hello World",
					language: "en",
					price: -123
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(2501, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not create store book with invalid isbn", async () => {
		try {
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					collection: constants.authorUser.author.collections[0].uuid,
					title: "Hello World",
					language: "de",
					isbn: "aaopsjdasd2342"
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(2507, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not create store book if the user is not an author", async () => {
		try {
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.testUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					collection: "adsadasdasd",
					title: "Hello World",
					language: "de"
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(1105, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not create store book for collection that is not a collection", async () => {
		try {
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					collection: constants.authorUser.author.uuid,
					title: "Hallo Welt",
					language: "de"
				}
			})
		} catch (error) {
			assert.equal(403, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(1102, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not create store book for collection that does not belong to the author", async () => {
		try {
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					collection: constants.davUser.authors[0].collections[0].uuid,
					title: "Hallo Welt",
					description: "Hallo Welt",
					language: "de"
				}
			})
		} catch (error) {
			assert.equal(403, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(1102, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not create store book for collection that does not exist", async () => {
		try {
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					collection: "asdasdasddas",
					title: "Hello World",
					description: "Hello World",
					language: "en"
				}
			})
		} catch (error) {
			assert.equal(404, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(2805, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should create store book", async () => {
		resetStoreBooksAndCollections = true
		let collection = constants.authorUser.author.collections[0]
		let title = "Hello World"
		let language = "de"
		let response

		// Create the store book
		try {
			response = await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					collection: collection.uuid,
					title,
					language
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(201, response.status)
		assert(response.data.uuid != null)
		assert.equal(collection.uuid, response.data.collection)
		assert.equal(title, response.data.title)
		assert.equal("", response.data.description)
		assert.equal(language, response.data.language)
		assert.equal(0, response.data.price)
		assert.isNull(response.data.isbn)
		assert.equal("unpublished", response.data.status)
		assert.isFalse(response.data.cover)
		assert.isNull(response.data.cover_aspect_ratio)
		assert.isNull(response.data.cover_blurhash)
		assert.isFalse(response.data.file)
		assert.isNull(response.data.file_name)
		assert.equal(0, response.data.categories.length)
		assert.isFalse(response.data.in_library)
		assert.isFalse(response.data.purchased)

		// Check if the data was correctly saved in the database
		// Get the collection
		let collectionObjResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: collection.uuid
		})

		if (collectionObjResponse.status != 200) {
			assert.fail()
		}

		let storeBookUuids = []
		for (let book of collection.books) storeBookUuids.push(book.uuid)
		storeBookUuids.push(response.data.uuid)

		assert.equal(storeBookUuids.join(','), collectionObjResponse.data.GetPropertyValue("books"))

		// Get the store book
		let storeBookObjResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: response.data.uuid
		})

		if (storeBookObjResponse.status != 200) {
			assert.fail()
		}

		assert.equal(response.data.uuid, storeBookObjResponse.data.Uuid)
		assert.equal(collection.uuid, storeBookObjResponse.data.GetPropertyValue("collection"))
		assert.equal(title, storeBookObjResponse.data.GetPropertyValue("title"))
		assert.isNull(storeBookObjResponse.data.GetPropertyValue("description"))
		assert.equal(language, storeBookObjResponse.data.GetPropertyValue("language"))
		assert.isNull(storeBookObjResponse.data.GetPropertyValue("categories"))
	})

	it("should create store book with optional properties", async () => {
		resetStoreBooksAndCollections = true
		let collection = constants.authorUser.author.collections[1]
		let title = "Hello World"
		let description = "Test description"
		let language = "en"
		let price = 444
		let isbn = "9780064407663"
		let categories = [constants.categories[0].key, constants.categories[1].key]
		let categoryUuids = [constants.categories[0].uuid, constants.categories[1].uuid]
		let response

		// Create the store book
		try {
			response = await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					collection: collection.uuid,
					title,
					description,
					language,
					price,
					isbn,
					categories
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(201, response.status)
		assert.isNotNull(response.data.uuid)
		assert.equal(collection.uuid, response.data.collection)
		assert.equal(title, response.data.title)
		assert.equal(description, response.data.description)
		assert.equal(language, response.data.language)
		assert.equal(price, response.data.price)
		assert.equal(isbn, response.data.isbn)
		assert.equal("unpublished", response.data.status)
		assert.isFalse(response.data.cover)
		assert.isNull(response.data.cover_aspect_ratio)
		assert.isNull(response.data.cover_blurhash)
		assert.isFalse(response.data.file)
		assert.isNull(response.data.file_name)
		assert.equal(categories.length, response.data.categories.length)
		assert.isFalse(response.data.in_library)
		assert.isFalse(response.data.purchased)

		// Check if the data was correctly saved in the database
		// Get the author
		let collectionObjResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: collection.uuid
		})

		if (collectionObjResponse.status != 200) {
			assert.fail()
		}

		let storeBookUuids = []
		for (let book of collection.books) storeBookUuids.push(book.uuid)
		storeBookUuids.push(response.data.uuid)

		assert.equal(storeBookUuids.join(','), collectionObjResponse.data.GetPropertyValue("books"))

		// Get the store book
		let storeBookObjResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: response.data.uuid
		})

		if (storeBookObjResponse.status != 200) {
			assert.fail()
		}

		assert.equal(response.data.uuid, storeBookObjResponse.data.Uuid)
		assert.equal(collection.uuid, storeBookObjResponse.data.GetPropertyValue("collection"))
		assert.equal(title, storeBookObjResponse.data.GetPropertyValue("title"))
		assert.equal(description, storeBookObjResponse.data.GetPropertyValue("description"))
		assert.equal(language, storeBookObjResponse.data.GetPropertyValue("language"))
		assert.equal(price.toString(), storeBookObjResponse.data.GetPropertyValue("price"))
		assert.equal(isbn, storeBookObjResponse.data.GetPropertyValue("isbn"))
		assert.equal(categoryUuids.join(','), storeBookObjResponse.data.GetPropertyValue("categories"))
	})
})