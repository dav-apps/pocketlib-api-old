import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'
import * as ErrorCodes from '../errorCodes.js'

const getStoreBookSeriesEndpointUrl = `${constants.apiBaseUrl}/store/book/series/{0}/books`

describe("GetStoreBookSeries endpoint", () => {
	it("should not return store book series with not supported languages", async () => {
		try {
			await axios({
				method: 'get',
				url: getStoreBookSeriesEndpointUrl.replace('{0}', constants.authorUser.author.series[0].uuid),
				params: {
					languages: "bla,test"
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

	it("should not return store book series that does not exist", async () => {
		try {
			await axios({
				method: 'get',
				url: getStoreBookSeriesEndpointUrl.replace('{0}', "dfjsdjfsodjsfdo")
			})
		} catch (error) {
			assert.equal(error.response.status, 404)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.StoreBookSeriesDoesNotExist)
			return
		}

		assert.fail()
	})

	it("should not return store book series that has no books for the given languages", async () => {
		try {
			await axios({
				method: 'get',
				url: getStoreBookSeriesEndpointUrl.replace('{0}', constants.davUser.authors[2].series[0].uuid),
				params: {
					languages: "de"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 412)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.StoreBookSeriesIsIncomplete)
			return
		}

		assert.fail()
	})

	it("should not return store book series if it has not published books for each collection in one of the given languages", async () => {
		try {
			await axios({
				method: 'get',
				url: getStoreBookSeriesEndpointUrl.replace('{0}', constants.authorUser.author.series[0].uuid),
				params: {
					languages: "en,de"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 412)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.StoreBookSeriesIsIncomplete)
			return
		}

		assert.fail()
	})

	it("should return store book series", async () => {
		let response
		let series = constants.davUser.authors[2].series[0]
		let books = [
			constants.davUser.authors[2].collections[0].books[0],
			constants.davUser.authors[2].collections[1].books[0],
		]

		try {
			response = await axios({
				method: 'get',
				url: getStoreBookSeriesEndpointUrl.replace('{0}', series.uuid),
				params: {
					fields: "*",
					language: "en"
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(response.data.books.length, books.length)

		for (let i = 0; i < books.length; i++) {
			let storeBook = books[i]
			let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
			let responseBook = response.data.books[i]

			assert.equal(responseBook.uuid, storeBook.uuid)
			assert.equal(responseBook.title, storeBookRelease.title)
			assert.equal(responseBook.description, storeBookRelease.description)
			assert.equal(responseBook.language, storeBook.language)
			assert.equal(responseBook.price, storeBook.price ?? 0)
			assert.equal(responseBook.isbn, storeBook.isbn)
			assert.equal(responseBook.cover_aspect_ratio, storeBookRelease.coverItem?.aspectRatio)
			assert.equal(responseBook.cover_blurhash, storeBookRelease.coverItem?.blurhash)
		}
	})
})