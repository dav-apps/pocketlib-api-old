import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'
import * as ErrorCodes from '../errorCodes.js'

const listStoreBookCollectionsEndpointUrl = `${constants.apiBaseUrl}/store_book_collections`

describe("GetCollectionsOfAuthor endpoint", () => {
	it("should not return collections of author that does not exist", async () => {
		try {
			await axios({
				method: 'get',
				url: listStoreBookCollectionsEndpointUrl,
				params: {
					author: "asdasdsda"
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

	it("should return collections of author", async () => {
		await testGetCollections(constants.authorUser.author)
	})

	it("should return collections of author of admin", async () => {
		await testGetCollections(constants.davUser.authors[0])
	})

	it("should return collections of author with specified language", async () => {
		await testGetCollectionsWithLanguage(constants.authorUser.author, "de")
	})

	it("should return collections of author of admin with specified language", async () => {
		await testGetCollectionsWithLanguage(constants.davUser.authors[0], "de")
	})

	async function testGetCollections(author) {
		let response

		try {
			response = await axios({
				method: 'get',
				url: listStoreBookCollectionsEndpointUrl,
				params: {
					fields: "*",
					author: author.uuid
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 2)
		assert.equal(response.data.items.length, author.collections.length)

		for (let collection of author.collections) {
			let responseCollection = response.data.items.find(c => c.uuid == collection.uuid)

			assert.isNotNull(responseCollection)
			assert.equal(responseCollection.uuid, collection.uuid)

			let collectionName = collection.names.find(n => n.language == "en")

			assert.isNotNull(collectionName)
			assert.equal(responseCollection.name.language, "en")
			assert.equal(responseCollection.name.value, collectionName.name)
		}
	}

	async function testGetCollectionsWithLanguage(author, language) {
		let response

		try {
			response = await axios({
				method: 'get',
				url: listStoreBookCollectionsEndpointUrl,
				params: {
					fields: "*",
					languages: language,
					author: author.uuid
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 2)
		assert.equal(response.data.items.length, author.collections.length)

		for (let collection of author.collections) {
			let responseCollection = response.data.items.find(c => c.uuid == collection.uuid)

			assert.isNotNull(responseCollection)
			assert.equal(responseCollection.uuid, collection.uuid)

			let collectionName = collection.names.find(n => n.language == language)

			if (collectionName == null) {
				assert.equal(responseCollection.name.language, "en")

				collectionName = collection.names.find(n => n.language == "en")

				assert.isNotNull(collectionName)
				assert.equal(responseCollection.name.value, collectionName.name)
			} else {
				assert.equal(responseCollection.name.language, language)
				assert.equal(responseCollection.name.value, collectionName.name)
			}
		}
	}
})