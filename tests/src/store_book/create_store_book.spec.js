import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import { TableObjectsController } from 'dav-js'
import constants from '../constants.js'
import * as utils from '../utils.js'
import * as ErrorCodes from '../errorCodes.js'

const createStoreBookEndpointUrl = `${constants.apiBaseUrl}/store_books`
var resetStoreBooksAndCollections = false
var resetAuthors = false

afterEach(async () => {
	if (resetStoreBooksAndCollections) {
		await utils.resetStoreBooks()
		await utils.resetStoreBookCollections()
		resetStoreBooksAndCollections = false
	}

	if (resetAuthors) {
		await utils.resetAuthors()
		resetAuthors = false
	}
})

describe("CreateStoreBook endpoint", () => {
	it("should not create store book without access token", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					'Content-Type': 'application/json'
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

	it("should not create store book with access token for session that does not exist", async () => {
		try {
			await axios({
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
			assert.equal(error.response.status, 404)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.SessionDoesNotExist)
			return
		}

		assert.fail()
	})

	it("should not create store book without Content-Type json", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 415)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.ContentTypeNotSupported)
			return
		}

		assert.fail()
	})

	it("should not create store book with access token for another app", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.testUserTestAppAccessToken,
					'Content-Type': 'application/json'
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

	it("should not create store book without required properties", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 2)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.TitleMissing)
			assert.equal(error.response.data.errors[1].code, ErrorCodes.LanguageMissing)
			return
		}

		assert.fail()
	})

	it("should not create store book without required properties as admin", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 3)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.AuthorMissing)
			assert.equal(error.response.data.errors[1].code, ErrorCodes.TitleMissing)
			assert.equal(error.response.data.errors[2].code, ErrorCodes.LanguageMissing)
			return
		}

		assert.fail()
	})

	it("should not create store book without required properties with collection as admin", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					collection: constants.davUser.authors[0].collections[0].uuid
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 2)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.TitleMissing)
			assert.equal(error.response.data.errors[1].code, ErrorCodes.LanguageMissing)
			return
		}

		assert.fail()
	})

	it("should not create store book with properties with wrong types", async () => {
		try {
			await axios({
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 3)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.CollectionWrongType)
			assert.equal(error.response.data.errors[1].code, ErrorCodes.TitleWrongType)
			assert.equal(error.response.data.errors[2].code, ErrorCodes.LanguageWrongType)
			return
		}

		assert.fail()
	})

	it("should not create store book with optional properties with wrong types", async () => {
		try {
			await axios({
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 7)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.CollectionWrongType)
			assert.equal(error.response.data.errors[1].code, ErrorCodes.TitleWrongType)
			assert.equal(error.response.data.errors[2].code, ErrorCodes.DescriptionWrongType)
			assert.equal(error.response.data.errors[3].code, ErrorCodes.LanguageWrongType)
			assert.equal(error.response.data.errors[4].code, ErrorCodes.PriceWrongType)
			assert.equal(error.response.data.errors[5].code, ErrorCodes.IsbnWrongType)
			assert.equal(error.response.data.errors[6].code, ErrorCodes.CategoriesWrongType)
			return
		}

		assert.fail()
	})

	it("should not create store book with properties with wrong types as admin", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					author: 123,
					title: false,
					language: true
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 3)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.AuthorWrongType)
			assert.equal(error.response.data.errors[1].code, ErrorCodes.TitleWrongType)
			assert.equal(error.response.data.errors[2].code, ErrorCodes.LanguageWrongType)
			return
		}

		assert.fail()
	})

	it("should not create store book with properties with wrong types with collection as admin", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					collection: true,
					title: 1234,
					language: false
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 3)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.CollectionWrongType)
			assert.equal(error.response.data.errors[1].code, ErrorCodes.TitleWrongType)
			assert.equal(error.response.data.errors[2].code, ErrorCodes.LanguageWrongType)
			return
		}

		assert.fail()
	})

	it("should not create store book with too short properties", async () => {
		try {
			await axios({
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.TitleTooShort)
			return
		}

		assert.fail()
	})

	it("should not create store book with too short optional properties", async () => {
		try {
			await axios({
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 2)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.TitleTooShort)
			assert.equal(error.response.data.errors[1].code, ErrorCodes.DescriptionTooShort)
			return
		}

		assert.fail()
	})

	it("should not create store book with too long properties", async () => {
		try {
			await axios({
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.TitleTooLong)
			return
		}

		assert.fail()
	})

	it("should not create store book with too long optional properties", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					collection: "a".repeat(220),
					title: "a".repeat(150),
					description: "a".repeat(6000),
					language: "de"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 2)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.TitleTooLong)
			assert.equal(error.response.data.errors[1].code, ErrorCodes.DescriptionTooLong)
			return
		}

		assert.fail()
	})

	it("should not create store book with not supported language", async () => {
		try {
			await axios({
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.LanguageNotSupported)
			return
		}

		assert.fail()
	})

	it("should not create store book with invalid price", async () => {
		try {
			await axios({
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.PriceInvalid)
			return
		}

		assert.fail()
	})

	it("should not create store book with invalid isbn", async () => {
		try {
			await axios({
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.IsbnInvalid)
			return
		}

		assert.fail()
	})

	it("should not create store book with too many categories", async () => {
		try {
			await axios({
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
					categories: ["tragedy", "dystopia", "adventure", "childrens"]
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.TooManyCategoriesForStoreBook)
			return
		}

		assert.fail()
	})

	it("should not create store book if the user is not an author", async () => {
		try {
			await axios({
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.UserIsNotAuthor)
			return
		}

		assert.fail()
	})

	it("should not create store book as admin without collection for author that does not belong to the user", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					author: constants.authorUser.author.uuid,
					title: "Hello World",
					language: "de"
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

	it("should not create store book as admin without collection for author that does not exist", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					author: "sjiodosdfhosdf",
					title: "Hello World",
					language: "en"
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

	it("should not create store book for collection that is not a collection", async () => {
		try {
			await axios({
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
			assert.equal(error.response.status, 403)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.ActionNotAllowed)
			return
		}

		assert.fail()
	})

	it("should not create store book for collection that does not belong to the author", async () => {
		try {
			await axios({
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
			assert.equal(error.response.status, 403)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.ActionNotAllowed)
			return
		}

		assert.fail()
	})

	it("should not create store book for collection that does not exist", async () => {
		try {
			await axios({
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
			assert.equal(error.response.status, 404)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.StoreBookCollectionDoesNotExist)
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
			response = await axios({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				params: {
					fields: "*"
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

		assert.equal(response.status, 201)
		assert.equal(Object.keys(response.data).length, 10)
		assert.isNotNull(response.data.uuid)
		assert.equal(response.data.title, title)
		assert.isNull(response.data.description)
		assert.equal(response.data.language, language)
		assert.equal(response.data.price, 0)
		assert.isNull(response.data.isbn)
		assert.equal(response.data.status, "unpublished")
		assert.isNull(response.data.cover)
		assert.isNull(response.data.file)
		assert.equal(response.data.categories.length, 0)

		// Check if the data was correctly saved in the database
		// Get the collection
		let collectionObjResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: collection.uuid
		})

		assert.equal(collectionObjResponse.status, 200)

		let storeBookUuids = []
		for (let book of collection.books) storeBookUuids.push(book.uuid)
		storeBookUuids.push(response.data.uuid)

		assert.equal(collectionObjResponse.data.tableObject.GetPropertyValue("books"), storeBookUuids.join(','))

		// Get the store book
		let storeBookObjResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: response.data.uuid
		})

		assert.equal(storeBookObjResponse.status, 200)
		assert.equal(storeBookObjResponse.data.tableObject.Uuid, response.data.uuid)
		assert.equal(storeBookObjResponse.data.tableObject.GetPropertyValue("collection"), collection.uuid)
		assert.isNotNull(storeBookObjResponse.data.tableObject.GetPropertyValue("releases"))
		assert.equal(storeBookObjResponse.data.tableObject.GetPropertyValue("language"), language)

		// Get the store book release
		let storeBookReleaseUuid = storeBookObjResponse.data.tableObject.GetPropertyValue("releases")

		let storeBookReleaseObjResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: storeBookReleaseUuid
		})

		assert.equal(storeBookReleaseObjResponse.status, 200)
		assert.equal(storeBookReleaseObjResponse.data.tableObject.Uuid, storeBookReleaseUuid)
		assert.equal(storeBookReleaseObjResponse.data.tableObject.GetPropertyValue("title"), title)
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
			response = await axios({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				params: {
					fields: "*"
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

		assert.equal(response.status, 201)
		assert.equal(Object.keys(response.data).length, 10)
		assert.isNotNull(response.data.uuid)
		assert.equal(response.data.title, title)
		assert.equal(response.data.description, description)
		assert.equal(response.data.language, language)
		assert.equal(response.data.price, price)
		assert.equal(response.data.isbn, isbn)
		assert.equal(response.data.status, "unpublished")
		assert.isNull(response.data.cover)
		assert.isNull(response.data.file)
		assert.equal(response.data.categories.length, categories.length)

		for (let categoryKey of categories) {
			assert.isTrue(response.data.categories.includes(categoryKey))
		}

		// Check if the data was correctly saved in the database
		// Get the collection
		let collectionObjResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: collection.uuid
		})

		assert.equal(collectionObjResponse.status, 200)

		let storeBookUuids = []
		for (let book of collection.books) storeBookUuids.push(book.uuid)
		storeBookUuids.push(response.data.uuid)

		assert.equal(collectionObjResponse.data.tableObject.GetPropertyValue("books"), storeBookUuids.join(','))

		// Get the store book
		let storeBookObjResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: response.data.uuid
		})

		assert.equal(storeBookObjResponse.status, 200)
		assert.equal(storeBookObjResponse.data.tableObject.Uuid, response.data.uuid)
		assert.equal(storeBookObjResponse.data.tableObject.GetPropertyValue("collection"), collection.uuid)
		assert.isNotNull(storeBookObjResponse.data.tableObject.GetPropertyValue("releases"))
		assert.equal(storeBookObjResponse.data.tableObject.GetPropertyValue("language"), language)

		// Get the store book release
		let storeBookReleaseUuid = storeBookObjResponse.data.tableObject.GetPropertyValue("releases")

		let storeBookReleaseObjResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: storeBookReleaseUuid
		})

		assert.equal(storeBookReleaseObjResponse.status, 200)
		assert.equal(storeBookReleaseObjResponse.data.tableObject.Uuid, storeBookReleaseUuid)
		assert.equal(storeBookReleaseObjResponse.data.tableObject.GetPropertyValue("title"), title)
		assert.equal(storeBookReleaseObjResponse.data.tableObject.GetPropertyValue("description"), description)
		assert.equal(storeBookReleaseObjResponse.data.tableObject.GetPropertyValue("price"), price.toString())
		assert.equal(storeBookReleaseObjResponse.data.tableObject.GetPropertyValue("isbn"), isbn)
		assert.equal(storeBookReleaseObjResponse.data.tableObject.GetPropertyValue("categories"), categoryUuids.join(','))
	})

	it("should create store book and new collection name", async () => {
		resetStoreBooksAndCollections = true
		let collection = constants.authorUser.author.collections[2]
		let title = "Hallo Welt"
		let description = "Test-Beschreibung"
		let language = "de"
		let price = 1000
		let isbn = "9781066407663"
		let response

		// Create the store book
		try {
			response = await axios({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				params: {
					fields: "*"
				},
				data: {
					collection: collection.uuid,
					title,
					description,
					language,
					price,
					isbn
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 201)
		assert.equal(Object.keys(response.data).length, 10)
		assert.isNotNull(response.data.uuid)
		assert.equal(response.data.title, title)
		assert.equal(response.data.description, description)
		assert.equal(response.data.language, language)
		assert.equal(response.data.price, price)
		assert.equal(response.data.isbn, isbn)
		assert.equal(response.data.status, "unpublished")
		assert.isNull(response.data.cover)
		assert.isNull(response.data.file)
		assert.equal(response.data.categories.length, 0)

		// Check if the data was correctly saved in the database
		// Get the collection
		let collectionObjResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: collection.uuid
		})

		assert.equal(collectionObjResponse.status, 200)

		let newCollectionNames = collectionObjResponse.data.tableObject.GetPropertyValue("names")
		let newCollectionName = newCollectionNames.split(',').pop()
		assert.equal(newCollectionNames.split(',').length, collection.names.length + 1)

		// Get the collection name
		let collectionNameObjResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: newCollectionName
		})

		assert.equal(collectionNameObjResponse.status, 200)
		assert.equal(collectionNameObjResponse.data.tableObject.Uuid, newCollectionName)
		assert.equal(collectionNameObjResponse.data.tableObject.GetPropertyValue("name"), title)
		assert.equal(collectionNameObjResponse.data.tableObject.GetPropertyValue("language"), language)

		let storeBookUuids = []
		for (let book of collection.books) storeBookUuids.push(book.uuid)
		storeBookUuids.push(response.data.uuid)

		assert.equal(collectionObjResponse.data.tableObject.GetPropertyValue("books"), storeBookUuids.join(','))

		// Get the store book
		let storeBookObjResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: response.data.uuid
		})

		assert.equal(storeBookObjResponse.status, 200)
		assert.equal(storeBookObjResponse.data.tableObject.Uuid, response.data.uuid)
		assert.equal(storeBookObjResponse.data.tableObject.GetPropertyValue("collection"), collection.uuid)
		assert.isNotNull(storeBookObjResponse.data.tableObject.GetPropertyValue("releases"))
		assert.equal(storeBookObjResponse.data.tableObject.GetPropertyValue("language"), language)

		// Get the store book release
		let storeBookReleaseUuid = storeBookObjResponse.data.tableObject.GetPropertyValue("releases")

		let storeBookReleaseObjResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: storeBookReleaseUuid
		})

		assert.equal(storeBookReleaseObjResponse.status, 200)
		assert.equal(storeBookReleaseObjResponse.data.tableObject.Uuid, storeBookReleaseUuid)
		assert.equal(storeBookReleaseObjResponse.data.tableObject.GetPropertyValue("title"), title)
		assert.equal(storeBookReleaseObjResponse.data.tableObject.GetPropertyValue("description"), description)
		assert.equal(storeBookReleaseObjResponse.data.tableObject.GetPropertyValue("price"), price.toString())
		assert.equal(storeBookReleaseObjResponse.data.tableObject.GetPropertyValue("isbn"), isbn)
	})

	it("should create store book and collection as admin", async () => {
		resetStoreBooksAndCollections = true
		resetAuthors = true
		let author = constants.davUser.authors[0]
		let title = "Hallo Welt"
		let description = "Test-Beschreibung"
		let language = "de"
		let price = 333
		let isbn = "9780064407674"
		let categories = [constants.categories[0].key, constants.categories[1].key]
		let categoryUuids = [constants.categories[0].uuid, constants.categories[1].uuid]
		let response

		// Create the store book
		try {
			response = await axios({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				params: {
					fields: "*"
				},
				data: {
					author: author.uuid,
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

		assert.equal(response.status, 201)
		assert.equal(Object.keys(response.data).length, 10)
		assert.isNotNull(response.data.uuid)
		assert.equal(response.data.title, title)
		assert.equal(response.data.description, description)
		assert.equal(response.data.language, language)
		assert.equal(response.data.price, price)
		assert.equal(response.data.isbn, isbn)
		assert.equal(response.data.status, "unpublished")
		assert.isNull(response.data.cover)
		assert.isNull(response.data.file)
		assert.equal(response.data.categories.length, categories.length)

		for (let categoryKey of categories) {
			assert.isTrue(response.data.categories.includes(categoryKey))
		}

		// Check if the data was correctly saved in the database
		// Get the author
		let authorObjResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: author.uuid
		})

		assert.equal(authorObjResponse.status, 200)

		// Get the store book
		let storeBookObjResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: response.data.uuid
		})

		assert.equal(storeBookObjResponse.status, 200)
		assert.equal(storeBookObjResponse.data.tableObject.Uuid, response.data.uuid)
		assert.isNotNull(storeBookObjResponse.data.tableObject.GetPropertyValue("collection"))
		assert.isNotNull(storeBookObjResponse.data.tableObject.GetPropertyValue("releases"))
		assert.equal(storeBookObjResponse.data.tableObject.GetPropertyValue("language"), language)

		// Get the store book release
		let storeBookReleaseUuid = storeBookObjResponse.data.tableObject.GetPropertyValue("releases")

		let storeBookReleaseObjResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: storeBookReleaseUuid
		})

		assert.equal(storeBookReleaseObjResponse.status, 200)
		assert.equal(storeBookReleaseObjResponse.data.tableObject.Uuid, storeBookReleaseUuid)
		assert.equal(storeBookReleaseObjResponse.data.tableObject.GetPropertyValue("title"), title)
		assert.equal(storeBookReleaseObjResponse.data.tableObject.GetPropertyValue("description"), description)
		assert.equal(storeBookReleaseObjResponse.data.tableObject.GetPropertyValue("price"), price.toString())
		assert.equal(storeBookReleaseObjResponse.data.tableObject.GetPropertyValue("isbn"), isbn)
		assert.equal(storeBookReleaseObjResponse.data.tableObject.GetPropertyValue("categories"), categoryUuids.join(','))

		// Get the collection
		let collectionUuid = storeBookObjResponse.data.tableObject.GetPropertyValue("collection")

		let collectionObjResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: collectionUuid
		})

		assert.equal(collectionObjResponse.status, 200)

		let collectionNameUuid = collectionObjResponse.data.tableObject.GetPropertyValue("names")
		assert.equal(collectionObjResponse.data.tableObject.Uuid, collectionUuid)
		assert.equal(collectionObjResponse.data.tableObject.GetPropertyValue("author"), author.uuid)
		assert.isNotNull(collectionNameUuid)
		assert.equal(collectionObjResponse.data.tableObject.GetPropertyValue("books"), response.data.uuid)

		// Get the collection name
		let collectionNameObjResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: collectionNameUuid
		})

		assert.equal(collectionNameObjResponse.status, 200)
		assert.equal(collectionNameObjResponse.data.tableObject.Uuid, collectionNameUuid)
		assert.equal(collectionNameObjResponse.data.tableObject.GetPropertyValue("name"), title)
		assert.equal(collectionNameObjResponse.data.tableObject.GetPropertyValue("language"), language)

		// Check the collections of the author
		let collectionUuids = []
		for (let collection of author.collections) collectionUuids.push(collection.uuid)
		collectionUuids.push(collectionUuid)

		assert.equal(authorObjResponse.data.tableObject.GetPropertyValue("collections"), collectionUuids.join(','))
	})

	it("should create store book and collection", async () => {
		resetStoreBooksAndCollections = true
		resetAuthors = true
		let author = constants.authorUser.author
		let title = "Hello World"
		let description = "test description"
		let language = "en"
		let price = 120
		let response

		// Create the store book
		try {
			response = await axios({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				params: {
					fields: "*"
				},
				data: {
					title,
					description,
					language,
					price
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 201)
		assert.equal(Object.keys(response.data).length, 10)
		assert.isNotNull(response.data.uuid)
		assert.equal(response.data.title, title)
		assert.equal(response.data.description, description)
		assert.equal(response.data.language, language)
		assert.equal(response.data.price, price)
		assert.isNull(response.data.isbn)
		assert.equal(response.data.status, "unpublished")
		assert.isNull(response.data.cover)
		assert.isNull(response.data.file)
		assert.equal(response.data.categories.length, 0)

		// Check if the data was correctly saved in the database
		// Get the author
		let authorObjResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: author.uuid
		})

		assert.equal(authorObjResponse.status, 200)

		// Get the store book
		let storeBookObjResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: response.data.uuid
		})

		assert.equal(storeBookObjResponse.status, 200)
		assert.equal(storeBookObjResponse.data.tableObject.Uuid, response.data.uuid)
		assert.isNotNull(storeBookObjResponse.data.tableObject.GetPropertyValue("collection"))
		assert.isNotNull(storeBookObjResponse.data.tableObject.GetPropertyValue("releases"))
		assert.equal(storeBookObjResponse.data.tableObject.GetPropertyValue("language"), language)

		// Get the store book release
		let storeBookReleaseUuid = storeBookObjResponse.data.tableObject.GetPropertyValue("releases")

		let storeBookReleaseObjResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: storeBookReleaseUuid
		})

		assert.equal(storeBookReleaseObjResponse.status, 200)
		assert.equal(storeBookReleaseObjResponse.data.tableObject.Uuid, storeBookReleaseUuid)
		assert.equal(storeBookReleaseObjResponse.data.tableObject.GetPropertyValue("title"), title)
		assert.equal(storeBookReleaseObjResponse.data.tableObject.GetPropertyValue("description"), description)
		assert.equal(storeBookReleaseObjResponse.data.tableObject.GetPropertyValue("price"), price.toString())

		// Get the collection
		let collectionUuid = storeBookObjResponse.data.tableObject.GetPropertyValue("collection")

		let collectionObjResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: collectionUuid
		})

		assert.equal(collectionObjResponse.status, 200)

		let collectionNameUuid = collectionObjResponse.data.tableObject.GetPropertyValue("names")
		assert.equal(collectionObjResponse.data.tableObject.Uuid, collectionUuid)
		assert.equal(collectionObjResponse.data.tableObject.GetPropertyValue("author"), author.uuid)
		assert.isNotNull(collectionNameUuid)
		assert.equal(collectionObjResponse.data.tableObject.GetPropertyValue("books"), response.data.uuid)

		// Get the collection name
		let collectionNameObjResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: collectionNameUuid
		})

		assert.equal(collectionNameObjResponse.status, 200)
		assert.equal(collectionNameObjResponse.data.tableObject.Uuid, collectionNameUuid)
		assert.equal(collectionNameObjResponse.data.tableObject.GetPropertyValue("name"), title)
		assert.equal(collectionNameObjResponse.data.tableObject.GetPropertyValue("language"), language)

		// Check the collections of the author
		let collectionUuids = []
		for (let collection of author.collections) collectionUuids.push(collection.uuid)
		collectionUuids.push(collectionUuid)

		assert.equal(authorObjResponse.data.tableObject.GetPropertyValue("collections"), collectionUuids.join(','))
	})
})