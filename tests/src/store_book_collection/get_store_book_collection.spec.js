import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'
import * as ErrorCodes from '../errorCodes.js'

const getStoreBookCollectionEndpointUrl = `${constants.apiBaseUrl}/store/book/collection/{0}`

describe("GetStoreBookCollection endpoint", () => {
	it("should not return collection if the store book collection does not exist", async () => {
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

	it("should return collection", async () => {
		let response
		let author = constants.authorUser.author
		let collection = author.collections[0]

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
		assert.equal(response.data.uuid, collection.uuid)
		assert.equal(response.data.author, author.uuid)
	})
})