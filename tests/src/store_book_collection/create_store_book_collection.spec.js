import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import { TableObjectsController } from 'dav-js'
import constants from '../constants.js'
import * as utils from '../utils.js'
import * as ErrorCodes from '../errorCodes.js'

const createStoreBookCollectionEndpointUrl = `${constants.apiBaseUrl}/store/collection`
var resetStoreBookCollectionsAndAuthors = false

afterEach(async () => {
	if (resetStoreBookCollectionsAndAuthors) {
		await utils.resetStoreBookCollections()
		await utils.resetStoreBookCollectionNames()
		await utils.resetAuthors()
		resetStoreBookCollectionsAndAuthors = false
	}
})

describe("CreateStoreBookCollection endpoint", () => {
	it("should not create store book collection without access token", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookCollectionEndpointUrl,
				headers: {
					'Content-Type': 'application/json'
				}
			})
		} catch (error) {
			assert.equal(401, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.AuthorizationHeaderMissing, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not create store book collection with access token for session that does not exist", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookCollectionEndpointUrl,
				headers: {
					Authorization: "adasdasd.asdasd.asdasdsda.3",
					'Content-Type': 'application/json'
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

	it("should not create store book collection without Content-Type json", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookCollectionEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken
				}
			})
		} catch (error) {
			assert.equal(415, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.ContentTypeNotSupported, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not create store book collection with access token for another app", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookCollectionEndpointUrl,
				headers: {
					Authorization: constants.testUserTestAppAccessToken,
					'Content-Type': 'application/json'
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

	it("should not create store book collection without required properties", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookCollectionEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(2, error.response.data.errors.length)
			assert.equal(ErrorCodes.NameMissing, error.response.data.errors[0].code)
			assert.equal(ErrorCodes.LanguageMissing, error.response.data.errors[1].code)
			return
		}

		assert.fail()
	})

	it("should not create store book collection with properties with wrong types", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookCollectionEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					name: 12,
					language: true
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(2, error.response.data.errors.length)
			assert.equal(ErrorCodes.NameWrongType, error.response.data.errors[0].code)
			assert.equal(ErrorCodes.LanguageWrongType, error.response.data.errors[1].code)
			return
		}

		assert.fail()
	})

	it("should not create store book collection with too short properties", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookCollectionEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					name: "a",
					language: "en"
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.NameTooShort, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not create store book collection with too long properties", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookCollectionEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					name: "a".repeat(200),
					language: "de"
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.NameTooLong, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not create store book collection with not supported language", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookCollectionEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					name: "Hello World",
					language: "bla"
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

	it("should not create store book collection as admin without required properties", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookCollectionEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(3, error.response.data.errors.length)
			assert.equal(ErrorCodes.AuthorMissing, error.response.data.errors[0].code)
			assert.equal(ErrorCodes.NameMissing, error.response.data.errors[1].code)
			assert.equal(ErrorCodes.LanguageMissing, error.response.data.errors[2].code)
			return
		}

		assert.fail()
	})

	it("should not create store book collection as admin with properties with wrong types", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookCollectionEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					author: false,
					name: 20,
					language: 23.4
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(3, error.response.data.errors.length)
			assert.equal(ErrorCodes.AuthorWrongType, error.response.data.errors[0].code)
			assert.equal(ErrorCodes.NameWrongType, error.response.data.errors[1].code)
			assert.equal(ErrorCodes.LanguageWrongType, error.response.data.errors[2].code)
			return
		}

		assert.fail()
	})

	it("should not create store book collection as admin with too short properties", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookCollectionEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					author: "a",
					name: "a",
					language: "en"
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.NameTooShort, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not create store book collection as admin with too long properties", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookCollectionEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					author: "a".repeat(210),
					name: "a".repeat(200),
					language: "de"
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.NameTooLong, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not create store book collection as admin with not supported language", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookCollectionEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					author: "asdads",
					name: "Hello World",
					language: "bla"
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

	it("should not create store book collection as admin for author that does not belong to the user", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookCollectionEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					author: constants.authorUser.author.uuid,
					name: "Hello World",
					language: "en"
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

	it("should not create store book collection as admin for author that does not exist", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookCollectionEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					author: "blabla",
					name: "Hello World",
					language: "en"
				}
			})
		} catch (error) {
			assert.equal(404, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.AuthorDoesNotExist, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not create store book collection if the user is not an author or admin", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookCollectionEndpointUrl,
				headers: {
					Authorization: constants.testUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					name: "Hello World",
					language: "de"
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.UserIsNotAuthor, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should create store book collection", async () => {
		resetStoreBookCollectionsAndAuthors = true
		let response
		let name = "TestBook"
		let language = "de"

		// Create the store book collection
		try {
			response = await axios({
				method: 'post',
				url: createStoreBookCollectionEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					name,
					language
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(201, response.status)
		assert(response.data.uuid != null)
		assert.equal(constants.authorUser.author.uuid, response.data.author)
		assert.equal(1, response.data.names.length)
		assert.equal(name, response.data.names[0].name)
		assert.equal(language, response.data.names[0].language)
		assert.equal(0, response.data.books.length)

		// Check if the data was correctly saved on the server
		// Get the store book collection
		let collectionResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: response.data.uuid
		})

		if (collectionResponse.status != 200) {
			assert.fail()
		}

		assert.equal(constants.authorUser.author.uuid, collectionResponse.data.GetPropertyValue("author"))
		assert(collectionResponse.data.GetPropertyValue("names") != null)

		// Get the store book collection name
		let collectionNameResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: collectionResponse.data.GetPropertyValue("names")
		})

		if (collectionNameResponse.status != 200) {
			assert.fail()
		}

		assert.equal(collectionResponse.data.GetPropertyValue("names"), collectionNameResponse.data.Uuid)
		assert.equal(name, collectionNameResponse.data.GetPropertyValue("name"))
		assert.equal(language, collectionNameResponse.data.GetPropertyValue("language"))

		// Get the author
		let authorResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: constants.authorUser.author.uuid
		})

		if (authorResponse.status != 200) {
			assert.fail()
		}

		let collections = []
		for (let collection of constants.authorUser.author.collections) collections.push(collection.uuid)
		collections.push(collectionResponse.data.Uuid)

		assert.equal(collections.join(','), authorResponse.data.GetPropertyValue("collections"))
	})

	it("should create store book collection as admin", async () => {
		resetStoreBookCollectionsAndAuthors = true
		let response
		let author = constants.davUser.authors[0]
		let name = "TestBook"
		let language = "en"

		// Create the store book collection
		try {
			response = await axios({
				method: 'post',
				url: createStoreBookCollectionEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					author: author.uuid,
					name,
					language
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(201, response.status)
		assert(response.data.uuid != null)
		assert.equal(author.uuid, response.data.author)
		assert.equal(1, response.data.names.length)
		assert.equal(name, response.data.names[0].name)
		assert.equal(language, response.data.names[0].language)
		assert.equal(0, response.data.books.length)

		// Check if the data was correctly saved on the server
		// Get the store book collection
		let collectionResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: response.data.uuid
		})

		if (collectionResponse.status != 200) {
			assert.fail()
		}

		assert.equal(author.uuid, collectionResponse.data.GetPropertyValue("author"))
		assert(collectionResponse.data.GetPropertyValue("names") != null)

		// Get the store book collection name
		let collectionNameResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: collectionResponse.data.GetPropertyValue("names")
		})

		if (collectionNameResponse.status != 200) {
			assert.fail()
		}

		assert.equal(collectionResponse.data.GetPropertyValue("names"), collectionNameResponse.data.Uuid)
		assert.equal(name, collectionNameResponse.data.GetPropertyValue("name"))
		assert.equal(language, collectionNameResponse.data.GetPropertyValue("language"))

		// Get the author
		let authorResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: author.uuid
		})

		if (authorResponse.status != 200) {
			assert.fail()
		}

		let collections = []
		for (let collection of author.collections) collections.push(collection.uuid)
		collections.push(collectionResponse.data.Uuid)

		assert.equal(collections.join(','), authorResponse.data.GetPropertyValue("collections"))
	})
})