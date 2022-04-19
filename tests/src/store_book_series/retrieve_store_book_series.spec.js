import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'
import * as ErrorCodes from '../errorCodes.js'

const retrieveStoreBookSeriesEndpointUrl = `${constants.apiBaseUrl}/store_book_series/{0}`

describe("GetStoreBookSeries endpoint", () => {
	it("should not return store book series that does not exist", async () => {
		try {
			await axios({
				method: 'get',
				url: retrieveStoreBookSeriesEndpointUrl.replace('{0}', "dfjsdjfsodjsfdo")
			})
		} catch (error) {
			assert.equal(error.response.status, 404)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.StoreBookSeriesDoesNotExist)
			return
		}

		assert.fail()
	})

	it("should return store book series", async () => {
		let author = constants.davUser.authors[2]
		let series = author.series[0]
		let response

		try {
			response = await axios({
				method: 'get',
				url: retrieveStoreBookSeriesEndpointUrl.replace('{0}', series.uuid),
				params: {
					fields: "*",
					language: "en"
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 4)
		assert.equal(response.data.uuid, series.uuid)
		assert.equal(response.data.author, author.uuid)
		assert.equal(response.data.name, series.name)
		assert.equal(response.data.language, series.language)
	})
})