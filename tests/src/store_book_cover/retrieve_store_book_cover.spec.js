import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'
import * as ErrorCodes from '../errorCodes.js'

const retrieveStoreBookCoverEndpointUrl = `${constants.apiBaseUrl}/store_books/{0}/cover`

describe("RetrieveStoreBookCover endpoint", () => {
	it("should not return store book cover if the store book has no cover", async () => {
		try {
			await axios({
				method: 'get',
				url: retrieveStoreBookCoverEndpointUrl.replace('{0}', constants.davUser.authors[0].collections[0].books[1].uuid),
				headers: {
					Authorization: constants.davUser.accessToken
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 404)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.StoreBookCoverItemDoesNotExist)
			return
		}

		assert.fail()
	})

	it("should not return store book cover if the store book does not exist", async () => {
		try {
			await axios({
				method: 'get',
				url: retrieveStoreBookCoverEndpointUrl.replace('{0}', "asdasdasdsad"),
				headers: {
					Authorization: constants.authorUser.accessToken
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 404)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.StoreBookDoesNotExist)
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
	let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
	let coverItem = storeBookRelease.coverItem

	try {
		response = await axios({
			method: 'get',
			url: retrieveStoreBookCoverEndpointUrl.replace('{0}', storeBook.uuid),
			params: {
				fields: "*"
			}
		})
	} catch (error) {
		assert.fail()
	}

	assert.equal(response.status, 200)
	assert.equal(Object.keys(response.data).length, 4)
	assert.equal(response.data.uuid, coverItem.uuid)
	assert.isNotNull(response.data.url)
	assert.equal(response.data.aspect_ratio, coverItem.aspectRatio)
	assert.equal(response.data.blurhash, coverItem.blurhash)
}