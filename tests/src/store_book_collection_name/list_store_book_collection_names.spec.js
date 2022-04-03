import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'
import * as ErrorCodes from '../errorCodes.js'

const listStoreBookCollectionNamesEndpointUrl = `${constants.apiBaseUrl}/store_book_collections/{0}/names`

describe("ListStoreBookCollectionNames endpoint", () => {
	it("should not return collection names of collection that does not exist", async () => {
		try {
			await axios({
				method: 'get',
				url: listStoreBookCollectionNamesEndpointUrl.replace('{0}', "sadjkdjhfskjfdkjhsdf")
			})
		} catch (error) {
			assert.equal(error.response.status, 404)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.StoreBookCollectionDoesNotExist)
			return
		}

		assert.fail()
	})

	it("should return collection names", async () => {
		let storeBookCollection = constants.authorUser.author.collections[0]
		let response

		try {
			response = await axios({
				method: 'get',
				url: listStoreBookCollectionNamesEndpointUrl.replace('{0}', storeBookCollection.uuid),
				params: {
					fields: "*"
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 2)
		assert.equal(response.data.items.length, storeBookCollection.names.length)

		for (let name of storeBookCollection.names) {
			let responseName = response.data.items.find(n => n.uuid == name.uuid)

			assert.isNotNull(responseName)
			assert.equal(responseName.uuid, name.uuid)
			assert.equal(responseName.name, name.name)
			assert.equal(responseName.language, name.language)
		}
	})
})