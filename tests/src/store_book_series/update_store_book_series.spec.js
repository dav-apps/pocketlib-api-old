import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import { TableObjectsController } from 'dav-js'
import constants from '../constants.js'
import * as utils from '../utils.js'
import * as ErrorCodes from '../errorCodes.js'

const updateStoreBookSeriesEndpointUrl = `${constants.apiBaseUrl}/store_book_series/{0}`
var resetStoreBookSeries = false

afterEach(async () => {
	if (resetStoreBookSeries) {
		await utils.resetStoreBookSeries()
		resetStoreBookSeries = false
	}
})

describe("UpdateStoreBookSeries endpoint", () => {
	it("should not update store book series without access token", async () => {
		try {
			await axios({
				method: 'put',
				url: updateStoreBookSeriesEndpointUrl.replace('{0}', constants.authorUser.author.series[0].uuid)
			})
		} catch (error) {
			assert.equal(error.response.status, 401)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.AuthorizationHeaderMissing)
			return
		}

		assert.fail()
	})

	it("should not update store book series with access token for session that does not exist", async () => {
		try {
			await axios({
				method: 'put',
				url: updateStoreBookSeriesEndpointUrl.replace('{0}', constants.authorUser.author.series[0].uuid),
				headers: {
					Authorization: "sjiodfjosdfjosdf",
					'Content-Type': 'application/json'
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 404)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.SessionDoesNotExist)
			return
		}

		assert.fail()
	})

	it("should not update store book series without Content-Type json", async () => {
		try {
			await axios({
				method: 'put',
				url: updateStoreBookSeriesEndpointUrl.replace('{0}', constants.authorUser.author.series[0].uuid),
				headers: {
					Authorization: constants.authorUser.accessToken
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 415)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.ContentTypeNotSupported)
			return
		}

		assert.fail()
	})

	it("should not update store book series with access token for another app", async () => {
		try {
			await axios({
				method: 'put',
				url: updateStoreBookSeriesEndpointUrl.replace('{0}', constants.authorUser.author.series[0].uuid),
				headers: {
					Authorization: constants.testUserTestAppAccessToken,
					'Content-Type': 'application/json'
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 403)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.ActionNotAllowed)
			return
		}

		assert.fail()
	})

	it("should not update store book series that does not exist", async () => {
		try {
			await axios({
				method: 'put',
				url: updateStoreBookSeriesEndpointUrl.replace('{0}', "sodfhsdf"),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 404)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.StoreBookSeriesDoesNotExist)
			return
		}

		assert.fail()
	})

	it("should not update store book series with properties with wrong types", async () => {
		try {
			await axios({
				method: 'put',
				url: updateStoreBookSeriesEndpointUrl.replace('{0}', constants.authorUser.author.series[0].uuid),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					name: 123,
					store_books: "sdsdfsdfsdf"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 2)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.NameWrongType)
			assert.equal(error.response.data.errors[1].code, ErrorCodes.StoreBooksWrongType)
			return
		}

		assert.fail()
	})

	it("should not update store book series with too short properties", async () => {
		try {
			await axios({
				method: 'put',
				url: updateStoreBookSeriesEndpointUrl.replace('{0}', constants.authorUser.author.series[0].uuid),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					name: "a"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.NameTooShort)
			return
		}

		assert.fail()
	})

	it("should not update store book series with too long properties", async () => {
		try {
			await axios({
				method: 'put',
				url: updateStoreBookSeriesEndpointUrl.replace('{0}', constants.authorUser.author.series[0].uuid),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					name: "a".repeat(200)
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.NameTooLong)
			return
		}

		assert.fail()
	})

	it("should not update store book series as admin with properties with wrong types", async () => {
		try {
			await axios({
				method: 'put',
				url: updateStoreBookSeriesEndpointUrl.replace('{0}', constants.davUser.authors[2].series[0].uuid),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					name: true,
					store_books: [
						1234,
						"dfsdsfdsdf"
					]
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 2)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.NameWrongType)
			assert.equal(error.response.data.errors[1].code, ErrorCodes.StoreBooksWrongType)
			return
		}

		assert.fail()
	})

	it("should not update store book series as admin with too short properties", async () => {
		try {
			await axios({
				method: 'put',
				url: updateStoreBookSeriesEndpointUrl.replace('{0}', constants.davUser.authors[2].series[0].uuid),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					name: "a"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.NameTooShort)
			return
		}

		assert.fail()
	})

	it("should not update store book series as admin with too long properties", async () => {
		try {
			await axios({
				method: 'put',
				url: updateStoreBookSeriesEndpointUrl.replace('{0}', constants.davUser.authors[2].series[0].uuid),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					name: "a".repeat(200)
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.NameTooLong)
			return
		}

		assert.fail()
	})

	it("should not update store book series with store books that do not belong to the author", async () => {
		try {
			await axios({
				method: 'put',
				url: updateStoreBookSeriesEndpointUrl.replace('{0}', constants.davUser.authors[2].series[0].uuid),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					store_books: [
						constants.authorUser.author.collections[0].books[0].uuid
					]
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 403)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.ActionNotAllowed)
			return
		}

		assert.fail()
	})

	it("should not update store book series with store books with different language", async () => {
		try {
			await axios({
				method: 'put',
				url: updateStoreBookSeriesEndpointUrl.replace('{0}', constants.authorUser.author.series[0].uuid),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					store_books: [
						constants.authorUser.author.collections[0].books[1].uuid
					]
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.LanguageOfStoreBookDoesNotMatchLanguageOfStoreBookSeries)
			return
		}

		assert.fail()
	})

	it("should update store book series", async () => {
		resetStoreBookSeries = true
		let response
		let author = constants.authorUser.author
		let series = author.series[0]
		let name = "Updated name"
		let storeBooks = [
			constants.authorUser.author.collections[1].books[0].uuid,
			constants.authorUser.author.collections[2].books[0].uuid
		]

		try {
			response = await axios({
				method: 'put',
				url: updateStoreBookSeriesEndpointUrl.replace('{0}', series.uuid),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				params: {
					fields: "*"
				},
				data: {
					name,
					store_books: storeBooks
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 4)
		assert.equal(response.data.uuid, series.uuid)
		assert.equal(response.data.author, author.uuid)
		assert.equal(response.data.name, name)
		assert.equal(response.data.language, series.language)

		// Check if the store book series was updated on the server
		let objResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: series.uuid
		})

		assert.equal(objResponse.status, 200)
		assert.equal(objResponse.data.tableObject.Uuid, series.uuid)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("author"), author.uuid)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("name"), name)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("store_books"), storeBooks.join(','))
	})

	it("should update store book series as admin", async () => {
		resetStoreBookSeries = true
		let response
		let author = constants.davUser.authors[2]
		let series = author.series[0]
		let name = "Updated name"
		let storeBooks = [
			author.collections[1].books[0].uuid,
			author.collections[0].books[0].uuid
		]

		try {
			response = await axios({
				method: 'put',
				url: updateStoreBookSeriesEndpointUrl.replace('{0}', series.uuid),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				params: {
					fields: "*"
				},
				data: {
					name,
					store_books: storeBooks
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 4)
		assert.equal(response.data.uuid, series.uuid)
		assert.equal(response.data.author, author.uuid)
		assert.equal(response.data.name, name)
		assert.equal(response.data.language, series.language)

		// Check if the store book series was updated on the server
		let objResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: series.uuid
		})

		assert.equal(objResponse.status, 200)
		assert.equal(objResponse.data.tableObject.Uuid, series.uuid)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("author"), author.uuid)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("name"), name)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("store_books"), storeBooks.join(','))
	})
})