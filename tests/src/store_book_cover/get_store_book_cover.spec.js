import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'
import * as ErrorCodes from '../errorCodes.js'

const getStoreBookCoverEndpointUrl = `${constants.apiBaseUrl}/store/book/{0}/cover`

describe("GetStoreBookCover endpoint", () => {
	it("should not return store book cover if the store book has no cover", async () => {
		try {
			await axios({
				method: 'get',
				url: getStoreBookCoverEndpointUrl.replace('{0}', constants.davUser.authors[0].collections[0].books[1].uuid),
				headers: {
					Authorization: constants.davUser.accessToken
				}
			})
		} catch (error) {
			assert.equal(404, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.StoreBookCoverDoesNotExist, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not return store book cover if the store book does not exist", async () => {
		try {
			await axios({
				method: 'get',
				url: getStoreBookCoverEndpointUrl.replace('{0}', "asdasdasdsad"),
				headers: {
					Authorization: constants.authorUser.accessToken
				}
			})
		} catch (error) {
			assert.equal(404, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.StoreBookDoesNotExist, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should return cover of unpublished store book", async () => {
		let storeBook = constants.authorUser.author.collections[1].books[0]
		await testShouldReturnCover(storeBook)
	})

	it("should return cover of store book in review", async () => {
		let storeBook = constants.authorUser.author.collections[0].books[0]
		await testShouldReturnCover(storeBook)
	})

	it("should return cover of published store book", async () => {
		let storeBook = constants.authorUser.author.collections[1].books[1]
		await testShouldReturnCover(storeBook)
	})

	it("should return cover of hidden store book", async () => {
		let storeBook = constants.authorUser.author.collections[0].books[1]
		await testShouldReturnCover(storeBook)
	})
})

async function testShouldReturnCover(storeBook) {
	let response

	try {
		response = await axios({
			method: 'get',
			url: getStoreBookCoverEndpointUrl.replace('{0}', storeBook.uuid)
		})
	} catch (error) {
		assert.fail()
	}

	assert.equal(200, response.status)
	assert.equal(storeBook.cover.type, response.headers['content-type'])
	assert(response.data.length > 0)
}