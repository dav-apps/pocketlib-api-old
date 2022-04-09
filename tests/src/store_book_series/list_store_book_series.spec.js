import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'
import * as ErrorCodes from '../errorCodes.js'

const listStoreBookSeriesEndpointUrl = `${constants.apiBaseUrl}/store_book_series`

describe("GetLatestStoreBookSeries endpoint", () => {
	it("should not return latest store book series with not supported languages", async () => {
		try {
			await axios({
				method: 'get',
				url: listStoreBookSeriesEndpointUrl,
				params: {
					languages: "test,bla"
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

	it("should return latest store book series", async () => {
		let response

		try {
			response = await axios({
				method: 'get',
				url: listStoreBookSeriesEndpointUrl,
				params: {
					fields: "*",
					latest: true
				}
			})
		} catch (error) {
			assert.fail()
		}

		// Find all valid store book series
		let seriesList = []
		
		for (let series of getValidStoreBookSeries(constants.authorUser.author, "en")) {
			seriesList.push({
				author: authorUser.author.uuid,
				series
			})
		}

		for (let author of constants.davUser.authors) {
			for (let series of getValidStoreBookSeries(author, "en")) {
				seriesList.push({
					author: author.uuid,
					series
				})
			}
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 2)
		assert.equal(response.data.items.length, seriesList.length)

		for (let seriesItem of seriesList) {
			let series = seriesItem.series
			let responseSeries = response.data.items.find(s => s.uuid == series.uuid)

			assert.isNotNull(responseSeries)
			assert.equal(Object.keys(responseSeries).length, 3)
			assert.equal(responseSeries.uuid, series.uuid)
			assert.equal(responseSeries.author, seriesItem.author)

			let seriesName = series.names.find(n => n.language == "en")

			assert.isNotNull(seriesName)
			assert.equal(responseSeries.name.language, "en")
			assert.equal(responseSeries.name.value, seriesName.name)
		}
	})

	it("should return store book series of author", async () => {
		let author = constants.authorUser.author
		let response

		try {
			response = await axios({
				method: 'get',
				url: listStoreBookSeriesEndpointUrl,
				params: {
					fields: "*",
					author: author.uuid
				}
			})
		} catch (error) {
			assert.fail()
		}

		// Find all valid store book series
		let seriesList = author.series

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 2)
		assert.equal(response.data.items.length, seriesList.length)

		for (let series of seriesList) {
			let responseSeries = response.data.items.find(s => s.uuid == series.uuid)

			assert.isNotNull(responseSeries)
			assert.equal(Object.keys(responseSeries).length, 3)
			assert.equal(responseSeries.uuid, series.uuid)
			assert.equal(responseSeries.author, author.uuid)

			let seriesName = series.names.find(n => n.language == "en")

			assert.isNotNull(seriesName)
			assert.equal(responseSeries.name.language, "en")
			assert.equal(responseSeries.name.value, seriesName.name)
		}
	})

	it("should return store book series of author with specified language", async () => {
		let author = constants.authorUser.author
		let language = "de"
		let response

		try {
			response = await axios({
				method: 'get',
				url: listStoreBookSeriesEndpointUrl,
				params: {
					fields: "*",
					languages: language,
					author: author.uuid
				}
			})
		} catch (error) {
			assert.fail()
		}

		// Find all valid store book series
		let seriesList = author.series

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 2)
		assert.equal(response.data.items.length, seriesList.length)

		for (let series of seriesList) {
			let responseSeries = response.data.items.find(s => s.uuid == series.uuid)

			assert.isNotNull(responseSeries)
			assert.equal(Object.keys(responseSeries).length, 3)
			assert.equal(responseSeries.uuid, series.uuid)
			assert.equal(responseSeries.author, author.uuid)

			let seriesName = series.names.find(n => n.language == language)

			if (seriesName == null) {
				assert.equal(responseSeries.name.language, "en")

				seriesName = series.names.find(s => s.language == "en")

				assert.isNotNull(seriesName)
				assert.equal(responseSeries.name.value, seriesName.name)
			} else {
				assert.equal(responseSeries.name.language, language)
				assert.equal(responseSeries.name.value, seriesName.name)
			}
		}
	})

	function getValidStoreBookSeries(author, languages) {
		let series = []

		for (let s of author.series) {
			let storeBookCount = 0

			for (let collectionUuid of s.collections) {
				let collection = author.collections.find(c => c.uuid == collectionUuid)
				if (collection == null) continue

				for (let storeBook of collection.books) {
					if (storeBook.status != "published") continue
					if (!languages.includes(storeBook.language)) continue

					let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
					if (storeBookRelease.status != "published") continue

					storeBookCount++
					break
				}
			}

			if (storeBookCount == s.collections.length) {
				series.push(s)
			}
		}

		return series
	}
})