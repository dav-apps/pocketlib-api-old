import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'
import * as ErrorCodes from '../errorCodes.js'

const getStoreBookSeriesEndpointUrl = `${constants.apiBaseUrl}/store/series/{0}`

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
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.LanguageNotSupported, error.response.data.errors[0].code)
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
			assert.equal(404, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.StoreBookSeriesDoesNotExist, error.response.data.errors[0].code)
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
			assert.equal(412, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.StoreBookSeriesIsIncomplete, error.response.data.errors[0].code)
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
			assert.equal(412, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.StoreBookSeriesIsIncomplete, error.response.data.errors[0].code)
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
					language: "en"
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(200, response.status)
		assert.equal(series.uuid, response.data.uuid)
		assert.equal(series.names[0].name, response.data.name)
		assert.equal(series.names[0].language, response.data.language)
		assert.equal(2, response.data.books.length)
		assert.equal(books[0].uuid, response.data.books[0].uuid)
		assert.equal(books[0].title, response.data.books[0].title)
		assert.equal(books[0].language, response.data.books[0].language)
	})
})