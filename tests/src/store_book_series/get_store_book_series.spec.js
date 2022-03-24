import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'
import * as ErrorCodes from '../errorCodes.js'

const getStoreBookSeriesEndpointUrl = `${constants.apiBaseUrl}/store/book/series/{0}`

describe("GetStoreBookSeries endpoint", () => {
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

	it("should return store book series", async () => {
		let series = constants.davUser.authors[2].series[0]
		let response

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
		assert.equal(response.data.uuid, series.uuid)
		assert.equal(response.data.name, series.names[0].name)
		assert.equal(response.data.language, series.names[0].language)
	})

	it("should return store book series with language for which the series has no name for", async () => {
		let series = constants.authorUser.author.series[0]
		let response

		try {
			response = await axios({
				method: 'get',
				url: getStoreBookSeriesEndpointUrl.replace('{0}', series.uuid),
				params: {
					fields: "*",
					language: "dk"
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(response.data.uuid, series.uuid)
		assert.equal(response.data.name, series.names[0].name)
		assert.equal(response.data.language, series.names[0].language)
	})
})