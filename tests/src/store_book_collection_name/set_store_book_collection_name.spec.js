import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import { TableObjectsController } from 'dav-js'
import constants from '../constants.js'
import * as utils from '../utils.js'
import * as ErrorCodes from '../errorCodes.js'

const setStoreBookCollectionNameEndpointUrl = `${constants.apiBaseUrl}/store/collection/{0}/name/{1}`
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
			assert.equal(401, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.AuthorizationHeaderMissing, error.response.data.errors[0].code)
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
			assert.equal(404, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.SessionDoesNotExist, error.response.data.errors[0].code)
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
			assert.equal(415, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.ContentTypeNotSupported, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not set collection name if jwt is for another app", async () => {
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
			assert.equal(403, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.ActionNotAllowed, error.response.data.errors[0].code)
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
			assert.equal(403, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.ActionNotAllowed, error.response.data.errors[0].code)
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
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.NameMissing, error.response.data.errors[0].code)
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
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.NameWrongType, error.response.data.errors[0].code)
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
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.NameTooShort, error.response.data.errors[0].code)
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
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.NameTooLong, error.response.data.errors[0].code)
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
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.LanguageNotSupported, error.response.data.errors[0].code)
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

		assert.equal(200, response.status)
		assert.equal(name, response.data.name)
		assert.equal(language, response.data.language)

		// Check if the data was correctly saved on the server
		// Get the collection
		let collectionResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: collection.uuid
		})

		if (collectionResponse.status != 200) {
			assert.fail()
		}

		let responseCollectionNames = collectionResponse.data.GetPropertyValue("names")
		let responseCollectionNameUuids = responseCollectionNames.split(',')

		let collectionNameUuids = []
		collection.names.forEach(name => collectionNameUuids.push(name.uuid))
		collectionNameUuids.push(responseCollectionNameUuids[responseCollectionNameUuids.length - 1])
		let collectionNames = collectionNameUuids.join(',')

		assert.equal(collectionNameUuids.length, responseCollectionNameUuids.length)
		assert.equal(collectionNames, responseCollectionNames)

		// Get the collection name
		let newCollectionNameUuid = responseCollectionNameUuids[responseCollectionNameUuids.length - 1]

		let collectionNameResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: newCollectionNameUuid
		})

		if (collectionNameResponse.status != 200) {
			assert.fail()
		}

		assert.equal(newCollectionNameUuid, collectionNameResponse.data.Uuid)
		assert.equal(name, collectionNameResponse.data.GetPropertyValue("name"))
		assert.equal(language, collectionNameResponse.data.GetPropertyValue("language"))
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

		assert.equal(200, response.status)
		assert.equal(name, response.data.name)
		assert.equal(language, response.data.language)

		// Check if the data was correctly updated on the server
		// Get the collection
		let collectionResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: collection.uuid
		})

		if (collectionResponse.status != 200) {
			assert.fail()
		}

		let responseCollectionNames = collectionResponse.data.GetPropertyValue("names")
		let responseCollectionNameUuids = responseCollectionNames.split(',')

		let collectionNameUuids = []
		collection.names.forEach(name => collectionNameUuids.push(name.uuid))
		let collectionNames = collectionNameUuids.join(',')

		assert.equal(collectionNameUuids.length, responseCollectionNameUuids.length)
		assert.equal(collectionNames, responseCollectionNames)

		// Get the collection name
		let collectionNameResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: collectionNameUuid
		})

		if (collectionNameResponse.status != 200) {
			assert.fail()
		}

		assert.equal(collectionNameUuid, collectionNameResponse.data.Uuid)
		assert.equal(name, collectionNameResponse.data.GetPropertyValue("name"))
		assert.equal(language, collectionNameResponse.data.GetPropertyValue("language"))
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

		assert.equal(200, response.status)
		assert.equal(name, response.data.name)
		assert.equal(language, response.data.language)

		// Check if the data was correctly saved on the server
		// Get the collection
		let collectionResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: collection.uuid
		})

		if (collectionResponse.status != 200) {
			assert.fail()
		}

		let responseCollectionNames = collectionResponse.data.GetPropertyValue("names")
		let responseCollectionNameUuids = responseCollectionNames.split(',')

		let collectionNameUuids = []
		collection.names.forEach(name => collectionNameUuids.push(name.uuid))
		collectionNameUuids.push(responseCollectionNameUuids[responseCollectionNameUuids.length - 1])
		let collectionNames = collectionNameUuids.join(',')

		assert.equal(collectionNameUuids.length, responseCollectionNameUuids.length)
		assert.equal(collectionNames, responseCollectionNames)

		// Get the collection name
		let newCollectionNameUuid = responseCollectionNameUuids[responseCollectionNameUuids.length - 1]

		let collectionNameResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: newCollectionNameUuid
		})

		if (collectionNameResponse.status != 200) {
			assert.fail()
		}

		assert.equal(newCollectionNameUuid, collectionNameResponse.data.Uuid)
		assert.equal(name, collectionNameResponse.data.GetPropertyValue("name"))
		assert.equal(language, collectionNameResponse.data.GetPropertyValue("language"))
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

		assert.equal(200, response.status)
		assert.equal(name, response.data.name)
		assert.equal(language, response.data.language)

		// Check if the data was correctly updated on the server
		// Get the collection
		let collectionResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: collection.uuid
		})

		if (collectionResponse.status != 200) {
			assert.fail()
		}

		let responseCollectionNames = collectionResponse.data.GetPropertyValue("names")
		let responseCollectionNameUuids = responseCollectionNames.split(',')

		let collectionNameUuids = []
		collection.names.forEach(name => collectionNameUuids.push(name.uuid))
		let collectionNames = collectionNameUuids.join(',')

		assert.equal(collectionNameUuids.length, responseCollectionNameUuids.length)
		assert.equal(collectionNames, responseCollectionNames)

		// Get the collection name
		let collectionNameResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: collectionNameUuid
		})

		if (collectionNameResponse.status != 200) {
			assert.fail()
		}

		assert.equal(collectionNameUuid, collectionNameResponse.data.Uuid)
		assert.equal(name, collectionNameResponse.data.GetPropertyValue("name"))
		assert.equal(language, collectionNameResponse.data.GetPropertyValue("language"))
	})
})