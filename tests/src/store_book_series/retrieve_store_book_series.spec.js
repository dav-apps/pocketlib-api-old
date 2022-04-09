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
		assert.equal(Object.keys(response.data).length, 3)
		assert.equal(response.data.uuid, series.uuid)
		assert.equal(response.data.author, author.uuid)

		if (series.names.length == 0) {
			assert.isNull(response.data.name)
		} else {
			let seriesName = series.names.find(n => n.language == "en")

			assert.isNotNull(seriesName)
			assert.equal(response.data.name.language, "en")
			assert.equal(response.data.name.value, seriesName.name)
		}
	})

	it("should return store book series with specified language", async () => {
		let author = constants.authorUser.author
		let series = author.series[0]
		let language = "de"
		let response

		try {
			response = await axios({
				method: 'get',
				url: retrieveStoreBookSeriesEndpointUrl.replace('{0}', series.uuid),
				params: {
					fields: "*",
					languages: language
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 3)
		assert.equal(response.data.uuid, series.uuid)
		assert.equal(response.data.author, author.uuid)
		
		if (series.names.length == 0) {
			assert.isNull(response.data.name)
		} else {
			let seriesName = series.names.find(n => n.language == language)

			if (seriesName == null) {
				assert.equal(response.data.name.language, "en")

				seriesName = series.names.find(n => n.language == "en")

				assert.isNotNull(seriesName)
				assert.equal(response.data.name.value, seriesName.name)
			} else {
				assert.equal(response.data.name.language, language)
				assert.equal(response.data.name.value, seriesName.name)
			}
		}
	})
})