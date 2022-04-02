import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'
import * as ErrorCodes from '../errorCodes.js'

const getStoreBookCollectionEndpointUrl = `${constants.apiBaseUrl}/store_book_collections/{0}`

describe("GetStoreBookCollection endpoint", () => {
	it("should not return store book collection if the store book collection does not exist", async () => {
		try {
			await axios({
				method: 'get',
				url: getStoreBookCollectionEndpointUrl.replace('{0}', "asdasdasd"),
				headers: {
					Authorization: constants.authorUser.accessToken
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

	it("should return store book collection", async () => {
		let author = constants.davUser.authors[0]
		let collection = author.collections[0]
		let response

		try {
			response = await axios({
				method: 'get',
				url: getStoreBookCollectionEndpointUrl.replace('{0}', collection.uuid),
				params: {
					fields: "*"
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 2)
		assert.equal(response.data.uuid, collection.uuid)

		if (collection.names.length == 0) {
			assert.isNull(response.data.name)
		} else {
			let collectionName = collection.names.find(n => n.language == "en")

			assert.isNotNull(collectionName)
			assert.equal(response.data.name.language, "en")
			assert.equal(response.data.name.value, collectionName.name)
		}
	})

	it("should return store book collection with specified language", async () => {
		let author = constants.authorUser.author
		let collection = author.collections[0]
		let response
		let language = "de"

		try {
			response = await axios({
				method: 'get',
				url: getStoreBookCollectionEndpointUrl.replace('{0}', collection.uuid),
				params: {
					fields: "*",
					languages: language
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 2)
		assert.equal(response.data.uuid, collection.uuid)

		if (collection.names.length == 0) {
			assert.isNull(response.data.name)
		} else {
			let collectionName = collection.names.find(n => n.language == language)

			if (collectionName == null) {
				assert.equal(response.data.name.language, "en")

				collectionName = collection.names.find(n => n.language == "en")

				assert.isNotNull(collectionName)
				assert.equal(response.data.name.value, collectionName.name)
			} else {
				assert.equal(response.data.name.language, language)
				assert.equal(response.data.name.value, collectionName.name)
			}
		}
	})
})