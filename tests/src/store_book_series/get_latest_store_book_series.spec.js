import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'
import * as ErrorCodes from '../errorCodes.js'

const getLatestStoreBookSeriesEndpointUrl = `${constants.apiBaseUrl}/store/series/latest`

describe("GetLatestStoreBookSeries endpoint", () => {
	it("should not return latest store book series with not supported languages", async () => {
		try {
			await axios({
				method: 'get',
				url: getLatestStoreBookSeriesEndpointUrl,
				params: {
					languages: "test,bla"
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

	it("should return latest store book series", async () => {
		let response
		let languages = ["de", "en"]

		try {
			response = await axios({
				method: 'get',
				url: getLatestStoreBookSeriesEndpointUrl,
				params: {
					languages: languages.join(',')
				}
			})
		} catch (error) {
			assert.fail()
		}

		// Find all valid store book series
		let series = []
		for (let s of getValidStoreBookSeries(constants.authorUser.author, languages)) {
			series.push(s)
		}

		for (let author of constants.davUser.authors) {
			for (let s of getValidStoreBookSeries(author, languages)) {
				series.push(s)
			}
		}

		assert.equal(200, response.status)
		assert.equal(series.length, response.data.series.length)

		for (let responseSeries of response.data.series) {
			let s = series.find(s => s.series.uuid == responseSeries.uuid)
			if (s == null) assert.fail()

			assert.equal(s.series.uuid, responseSeries.uuid)

			let name = s.series.names.find(n => n.language == responseSeries.language)
			assert(name != null)
			assert.equal(name.name, responseSeries.name)

			assert.equal(s.books.length, responseSeries.books.length)

			for (let responseBook of responseSeries.books) {
				let b = s.books.find(b => b.uuid == responseBook.uuid)
				if (b == null) assert.fail()

				assert.equal(b.uuid, responseBook.uuid)
				assert.equal(b.title, responseBook.title)
				assert.equal(b.language, responseBook.language)
				assert.equal(b.coverAspectRatio, responseBook.cover_aspect_ratio)
				assert.equal(b.coverBlurhash, responseBook.cover_blurhash)
			}
		}
	})

	function getValidStoreBookSeries(author, languages) {
		let series = []
		
		for (let s of author.series) {
			let seriesLanguages = []
			for (let name of s.names) {
				if (languages.includes(name.language)) {
					seriesLanguages.push(name.language)
				}
			}

			let languageBooks = {}
			for (let lang of seriesLanguages) {
				languageBooks[lang] = []
			}

			for (let collectionUuid of s.collections) {
				let collection = author.collections.find(c => c.uuid == collectionUuid)
				if (collection == null) continue

				for (let book of collection.books) {
					if (book.status == "published" && seriesLanguages.includes(book.language)) {
						languageBooks[book.language].push(book)
					}
				}
			}

			for (let key of Object.keys(languageBooks)) {
				if (languageBooks[key].length == s.collections.length) {
					series.push({
						series: s,
						books: languageBooks[key]
					})
					break
				}
			}
		}

		return series
	}
})