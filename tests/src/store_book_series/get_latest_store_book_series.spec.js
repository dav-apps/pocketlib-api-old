import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'
import * as ErrorCodes from '../errorCodes.js'

const getLatestStoreBookSeriesEndpointUrl = `${constants.apiBaseUrl}/store/book/series/latest`

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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.LanguageNotSupported)
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
					fields: "*",
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

		assert.equal(response.status, 200)
		assert.equal(response.data.series.length, series.length)

		for (let responseSeries of response.data.series) {
			let s = series.find(s => s.series.uuid == responseSeries.uuid)
			if (s == null) assert.fail()

			assert.equal(responseSeries.uuid, s.series.uuid)

			let name = s.series.names.find(n => n.language == responseSeries.language)
			assert.isNotNull(name)
			assert.equal(responseSeries.name, name.name)
			assert.equal(responseSeries.books.length, s.books.length)

			for (let responseBook of responseSeries.books) {
				let storeBook = s.books.find(b => b.uuid == responseBook.uuid)
				assert.isNotNull(storeBook)
				
				let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
				assert.isNotNull(storeBookRelease)

				assert.equal(responseBook.uuid, storeBook.uuid)
				assert.equal(responseBook.title, storeBookRelease.title)
				assert.equal(responseBook.description, storeBookRelease.description)
				assert.equal(responseBook.language, storeBook.language)
				assert.equal(responseBook.price, storeBook.price ?? 0)
				assert.equal(responseBook.isbn, storeBook.isbn)
				assert.equal(responseBook.cover_aspect_ratio, storeBookRelease.coverItem?.aspectRatio)
				assert.equal(responseBook.cover_blurhash, storeBookRelease.coverItem?.blurhash)
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