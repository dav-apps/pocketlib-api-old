import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'

const listStoreBookCollectionsEndpointUrl = `${constants.apiBaseUrl}/store_book_collections`

describe("GetCollectionsOfAuthor endpoint", () => {
	it("should return collections of author", async () => {
		await testGetCollectionsOfAuthor(constants.authorUser.author)
	})

	it("should return collections of author of admin", async () => {
		await testGetCollectionsOfAuthor(constants.davUser.authors[0])
	})

	it("should return collections of author with specified language", async () => {
		await testGetCollectionsOfAuthorWithLanguage(constants.authorUser.author, "de")
	})

	it("should return collections of author of admin with specified language", async () => {
		await testGetCollectionsOfAuthorWithLanguage(constants.davUser.authors[0], "de")
	})

	async function testGetCollectionsOfAuthor(author) {
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
			assert.equal(Object.keys(responseCollection).length, 3)
			assert.equal(responseCollection.uuid, collection.uuid)
			assert.equal(responseCollection.author, author.uuid)

			let collectionName = collection.names.find(n => n.language == "en")

			assert.isNotNull(collectionName)
			assert.equal(responseCollection.name.language, "en")
			assert.equal(responseCollection.name.value, collectionName.name)
		}
	}

	async function testGetCollectionsOfAuthorWithLanguage(author, language) {
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
			assert.equal(Object.keys(responseCollection).length, 3)
			assert.equal(responseCollection.uuid, collection.uuid)
			assert.equal(responseCollection.author, author.uuid)

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