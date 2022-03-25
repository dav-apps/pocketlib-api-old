import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import { TableObjectsController } from 'dav-js'
import constants from '../constants.js'
import * as utils from '../utils.js'
import * as ErrorCodes from '../errorCodes.js'

const createStoreBookCollectionEndpointUrl = `${constants.apiBaseUrl}/store/book/collection`
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
			assert.equal(error.response.status, 401)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.AuthorizationHeaderMissing)
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
			assert.equal(error.response.status, 404)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.SessionDoesNotExist)
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
			assert.equal(error.response.status, 415)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.ContentTypeNotSupported)
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
			assert.equal(error.response.status, 403)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.ActionNotAllowed)
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 2)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.NameMissing)
			assert.equal(error.response.data.errors[1].code, ErrorCodes.LanguageMissing)
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 2)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.NameWrongType)
			assert.equal(error.response.data.errors[1].code, ErrorCodes.LanguageWrongType)
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.NameTooShort)
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.NameTooLong)
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.LanguageNotSupported)
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 3)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.AuthorMissing)
			assert.equal(error.response.data.errors[1].code, ErrorCodes.NameMissing)
			assert.equal(error.response.data.errors[2].code, ErrorCodes.LanguageMissing)
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 3)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.AuthorWrongType)
			assert.equal(error.response.data.errors[1].code, ErrorCodes.NameWrongType)
			assert.equal(error.response.data.errors[2].code, ErrorCodes.LanguageWrongType)
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.NameTooShort)
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.NameTooLong)
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.LanguageNotSupported)
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
			assert.equal(error.response.status, 403)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.ActionNotAllowed)
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
			assert.equal(error.response.status, 404)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.AuthorDoesNotExist)
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.UserIsNotAuthor)
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

		assert.equal(response.status, 201)
		assert.isNotNull(response.data.uuid)
		assert.equal(response.data.names.length, 1)
		assert.equal(response.data.names[0].name, name)
		assert.equal(response.data.names[0].language, language)

		// Check if the data was correctly saved on the server
		// Get the store book collection
		let collectionResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: response.data.uuid
		})

		assert.equal(collectionResponse.status, 200)
		assert.equal(collectionResponse.data.tableObject.GetPropertyValue("author"), constants.authorUser.author.uuid)
		assert.isNotNull(collectionResponse.data.tableObject.GetPropertyValue("names"))

		// Get the store book collection name
		let collectionNameResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: collectionResponse.data.tableObject.GetPropertyValue("names")
		})

		assert.equal(collectionNameResponse.status, 200)
		assert.equal(collectionNameResponse.data.tableObject.Uuid, collectionResponse.data.tableObject.GetPropertyValue("names"))
		assert.equal(collectionNameResponse.data.tableObject.GetPropertyValue("name"), name)
		assert.equal(collectionNameResponse.data.tableObject.GetPropertyValue("language"), language)

		// Get the author
		let authorResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: constants.authorUser.author.uuid
		})

		assert.equal(authorResponse.status, 200)

		let collections = []
		for (let collection of constants.authorUser.author.collections) collections.push(collection.uuid)
		collections.push(collectionResponse.data.tableObject.Uuid)

		assert.equal(authorResponse.data.tableObject.GetPropertyValue("collections"), collections.join(','))
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

		assert.equal(response.status, 201)
		assert.isNotNull(response.data.uuid)
		assert.equal(response.data.names.length, 1)
		assert.equal(response.data.names[0].name, name)
		assert.equal(response.data.names[0].language, language)

		// Check if the data was correctly saved on the server
		// Get the store book collection
		let collectionResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: response.data.uuid
		})

		assert.equal(collectionResponse.status, 200)
		assert.equal(collectionResponse.data.tableObject.GetPropertyValue("author"), author.uuid)
		assert.isNotNull(collectionResponse.data.tableObject.GetPropertyValue("names"))

		// Get the store book collection name
		let collectionNameResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: collectionResponse.data.tableObject.GetPropertyValue("names")
		})

		assert.equal(collectionNameResponse.status, 200)
		assert.equal(collectionNameResponse.data.tableObject.Uuid, collectionResponse.data.tableObject.GetPropertyValue("names"))
		assert.equal(collectionNameResponse.data.tableObject.GetPropertyValue("name"), name)
		assert.equal(collectionNameResponse.data.tableObject.GetPropertyValue("language"), language)

		// Get the author
		let authorResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: author.uuid
		})

		assert.equal(authorResponse.status, 200)

		let collections = []
		for (let collection of author.collections) collections.push(collection.uuid)
		collections.push(collectionResponse.data.tableObject.Uuid)

		assert.equal(authorResponse.data.tableObject.GetPropertyValue("collections"), collections.join(','))
	})
})