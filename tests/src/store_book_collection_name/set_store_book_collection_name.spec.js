import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import { TableObjectsController } from 'dav-js'
import constants from '../constants.js'
import * as utils from '../utils.js'
import * as ErrorCodes from '../errorCodes.js'

const setStoreBookCollectionNameEndpointUrl = `${constants.apiBaseUrl}/store/book/collection/{0}/name/{1}`
var resetStoreBookCollectionsAndStoreBookCollectionNames = false

afterEach(async () => {
	if (resetStoreBookCollectionsAndStoreBookCollectionNames) {
		await utils.resetStoreBookCollections()
		await utils.resetStoreBookCollectionNames()
		resetStoreBookCollectionsAndStoreBookCollectionNames = false
	}
})

describe("SetStoreBookCollectionName endpoint", () => {
	it("should not set collection name without access token", async () => {
		try {
			await axios({
				method: 'put',
				url: setStoreBookCollectionNameEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].uuid).replace('{1}', "en"),
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

	it("should not set collection name with access token for session that does not exist", async () => {
		try {
			await axios({
				method: 'put',
				url: setStoreBookCollectionNameEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: "asdasdadsasdasdasd",
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

	it("should not set collection name without Content-Type json", async () => {
		try {
			await axios({
				method: 'put',
				url: setStoreBookCollectionNameEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': "application/xml"
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

	it("should not set collection name with access token for another app", async () => {
		try {
			await axios({
				method: 'put',
				url: setStoreBookCollectionNameEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].uuid).replace('{1}', "en"),
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

	it("should not set collection name for collection of another user", async () => {
		try {
			await axios({
				method: 'put',
				url: setStoreBookCollectionNameEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: constants.davUser.accessToken,
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

	it("should not set collection name without required properties", async () => {
		try {
			await axios({
				method: 'put',
				url: setStoreBookCollectionNameEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.NameMissing)
			return
		}

		assert.fail()
	})

	it("should not set collection name with properties with wrong types", async () => {
		try {
			await axios({
				method: 'put',
				url: setStoreBookCollectionNameEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					name: 23
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.NameWrongType)
			return
		}

		assert.fail()
	})

	it("should not set collection name with too short properties", async () => {
		try {
			await axios({
				method: 'put',
				url: setStoreBookCollectionNameEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					name: "a"
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

	it("should not set collection name with too long properties", async () => {
		try {
			await axios({
				method: 'put',
				url: setStoreBookCollectionNameEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					name: "a".repeat(150)
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

	it("should not set collection name for not supported language", async () => {
		try {
			await axios({
				method: 'put',
				url: setStoreBookCollectionNameEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].uuid).replace('{1}', "bla"),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					name: "Hello World"
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

	it("should create collection name", async () => {
		resetStoreBookCollectionsAndStoreBookCollectionNames = true

		// Create the collection name
		let response
		let collection = constants.authorUser.author.collections[0]
		let language = "fr"
		let name = "Hello World"
		let accessToken = constants.authorUser.accessToken

		try {
			response = await axios({
				method: 'put',
				url: setStoreBookCollectionNameEndpointUrl.replace('{0}', collection.uuid).replace('{1}', language),
				headers: {
					Authorization: accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					name
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(response.data.name, name)
		assert.equal(response.data.language, language)

		// Check if the data was correctly saved on the server
		// Get the collection
		let collectionResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: collection.uuid
		})

		assert.equal(collectionResponse.status, 200)

		let responseCollectionNames = collectionResponse.data.tableObject.GetPropertyValue("names")
		let responseCollectionNameUuids = responseCollectionNames.split(',')

		let collectionNameUuids = []
		collection.names.forEach(name => collectionNameUuids.push(name.uuid))
		collectionNameUuids.push(responseCollectionNameUuids[responseCollectionNameUuids.length - 1])
		let collectionNames = collectionNameUuids.join(',')

		assert.equal(responseCollectionNameUuids.length, collectionNameUuids.length)
		assert.equal(responseCollectionNames, collectionNames)

		// Get the collection name
		let newCollectionNameUuid = responseCollectionNameUuids[responseCollectionNameUuids.length - 1]

		let collectionNameResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: newCollectionNameUuid
		})

		assert.equal(collectionNameResponse.status, 200)
		assert.equal(collectionNameResponse.data.tableObject.Uuid, newCollectionNameUuid)
		assert.equal(collectionNameResponse.data.tableObject.GetPropertyValue("name"), name)
		assert.equal(collectionNameResponse.data.tableObject.GetPropertyValue("language"), language)
	})

	it("should update collection name", async () => {
		resetStoreBookCollectionsAndStoreBookCollectionNames = true

		// Update the collection name
		let response
		let collection = constants.authorUser.author.collections[0]
		let language = "en"
		let name = "Hello World"
		let collectionNameUuid = collection.names[0].uuid
		let accessToken = constants.authorUser.accessToken

		try {
			response = await axios({
				method: 'put',
				url: setStoreBookCollectionNameEndpointUrl.replace('{0}', collection.uuid).replace('{1}', language),
				headers: {
					Authorization: accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					name
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(response.data.name, name)
		assert.equal(response.data.language, language)

		// Check if the data was correctly updated on the server
		// Get the collection
		let collectionResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: collection.uuid
		})

		assert.equal(collectionResponse.status, 200)

		let responseCollectionNames = collectionResponse.data.tableObject.GetPropertyValue("names")
		let responseCollectionNameUuids = responseCollectionNames.split(',')

		let collectionNameUuids = []
		collection.names.forEach(name => collectionNameUuids.push(name.uuid))
		let collectionNames = collectionNameUuids.join(',')

		assert.equal(responseCollectionNameUuids.length, collectionNameUuids.length)
		assert.equal(responseCollectionNames, collectionNames)

		// Get the collection name
		let collectionNameResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: collectionNameUuid
		})

		assert.equal(collectionNameResponse.status, 200)
		assert.equal(collectionNameResponse.data.tableObject.Uuid, collectionNameUuid)
		assert.equal(collectionNameResponse.data.tableObject.GetPropertyValue("name"), name)
		assert.equal(collectionNameResponse.data.tableObject.GetPropertyValue("language"), language)
	})

	it("should create collection name for collection of admin", async () => {
		resetStoreBookCollectionsAndStoreBookCollectionNames = true

		// Create the collection name
		let response
		let collection = constants.davUser.authors[0].collections[0]
		let language = "fr"
		let name = "Updated name"
		let accessToken = constants.davUser.accessToken

		try {
			response = await axios({
				method: 'put',
				url: setStoreBookCollectionNameEndpointUrl.replace('{0}', collection.uuid).replace('{1}', language),
				headers: {
					Authorization: accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					name
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(response.data.name, name)
		assert.equal(response.data.language, language)

		// Check if the data was correctly saved on the server
		// Get the collection
		let collectionResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: collection.uuid
		})

		assert.equal(collectionResponse.status, 200)

		let responseCollectionNames = collectionResponse.data.tableObject.GetPropertyValue("names")
		let responseCollectionNameUuids = responseCollectionNames.split(',')

		let collectionNameUuids = []
		collection.names.forEach(name => collectionNameUuids.push(name.uuid))
		collectionNameUuids.push(responseCollectionNameUuids[responseCollectionNameUuids.length - 1])
		let collectionNames = collectionNameUuids.join(',')

		assert.equal(responseCollectionNameUuids.length, collectionNameUuids.length)
		assert.equal(responseCollectionNames, collectionNames)

		// Get the collection name
		let newCollectionNameUuid = responseCollectionNameUuids[responseCollectionNameUuids.length - 1]

		let collectionNameResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: newCollectionNameUuid
		})

		assert.equal(collectionNameResponse.status, 200)
		assert.equal(collectionNameResponse.data.tableObject.Uuid, newCollectionNameUuid)
		assert.equal(collectionNameResponse.data.tableObject.GetPropertyValue("name"), name)
		assert.equal(collectionNameResponse.data.tableObject.GetPropertyValue("language"), language)
	})

	it("should update collection name for collection of admin", async () => {
		resetStoreBookCollectionsAndStoreBookCollectionNames = true

		// Update the collection name
		let response
		let collection = constants.davUser.authors[0].collections[0]
		let language = "en"
		let name = "Hallo Welt"
		let collectionNameUuid = collection.names[0].uuid
		let accessToken = constants.davUser.accessToken

		try {
			response = await axios({
				method: 'put',
				url: setStoreBookCollectionNameEndpointUrl.replace('{0}', collection.uuid).replace('{1}', language),
				headers: {
					Authorization: accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					name
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(response.data.name, name)
		assert.equal(response.data.language, language)

		// Check if the data was correctly updated on the server
		// Get the collection
		let collectionResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: collection.uuid
		})

		assert.equal(collectionResponse.status, 200)

		let responseCollectionNames = collectionResponse.data.tableObject.GetPropertyValue("names")
		let responseCollectionNameUuids = responseCollectionNames.split(',')

		let collectionNameUuids = []
		collection.names.forEach(name => collectionNameUuids.push(name.uuid))
		let collectionNames = collectionNameUuids.join(',')

		assert.equal(responseCollectionNameUuids.length, collectionNameUuids.length)
		assert.equal(responseCollectionNames, collectionNames)

		// Get the collection name
		let collectionNameResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: collectionNameUuid
		})

		assert.equal(collectionNameResponse.status, 200)
		assert.equal(collectionNameResponse.data.tableObject.Uuid, collectionNameUuid)
		assert.equal(collectionNameResponse.data.tableObject.GetPropertyValue("name"), name)
		assert.equal(collectionNameResponse.data.tableObject.GetPropertyValue("language"), language)
	})
})