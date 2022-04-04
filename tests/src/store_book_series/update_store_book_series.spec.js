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

describe("UpdateStoreBookSeries endpoint", async () => {
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
				},
				data: {
					collections: []
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
					collections: "sdsdfsdfsdf"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.CollectionsWrongType)
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
					collections: [
						1234,
						"dfsdsfdsdf"
					]
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.CollectionsWrongType)
			return
		}

		assert.fail()
	})

	it("should not update store book series with collections that do not belong to the author", async () => {
		try {
			await axios({
				method: 'put',
				url: updateStoreBookSeriesEndpointUrl.replace('{0}', constants.davUser.authors[2].series[0].uuid),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					collections: [
						constants.authorUser.author.collections[0].uuid
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

	it("should update store book series", async () => {
		resetStoreBookSeries = true
		let response
		let author = constants.authorUser.author
		let series = author.series[0]
		let collections = [
			constants.authorUser.author.collections[1].uuid,
			constants.authorUser.author.collections[2].uuid
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
					collections
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 2)
		assert.equal(response.data.uuid, series.uuid)
		
		if (series.names.length == 0) {
			assert.isNull(response.data.name)
		} else {
			let seriesName = series.names.find(n => n.language == "en")

			assert.isNotNull(seriesName)
			assert.equal(response.data.name.language, "en")
			assert.equal(response.data.name.value, seriesName.name)
		}

		// Check if the store book series was updated on the server
		let objResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: series.uuid
		})

		assert.equal(objResponse.status, 200)
		assert.equal(objResponse.data.tableObject.Uuid, series.uuid)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("author"), author.uuid)

		let nameUuids = []
		for (let name of series.names) nameUuids.push(name.uuid)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("names"), nameUuids.join(','))

		assert.equal(objResponse.data.tableObject.GetPropertyValue("collections"), collections.join(','))
	})

	it("should update store book series with specified language", async () => {
		resetStoreBookSeries = true
		let response
		let language = "de"
		let author = constants.authorUser.author
		let series = author.series[0]
		let collections = [
			constants.authorUser.author.collections[1].uuid,
			constants.authorUser.author.collections[2].uuid
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
					fields: "*",
					languages: language
				},
				data: {
					collections
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 2)
		assert.equal(response.data.uuid, series.uuid)

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

		// Check if the store book series was updated on the server
		let objResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: series.uuid
		})

		assert.equal(objResponse.status, 200)
		assert.equal(objResponse.data.tableObject.Uuid, series.uuid)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("author"), author.uuid)

		let nameUuids = []
		for (let name of series.names) nameUuids.push(name.uuid)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("names"), nameUuids.join(','))

		assert.equal(objResponse.data.tableObject.GetPropertyValue("collections"), collections.join(','))
	})

	it("should update store book series as admin", async () => {
		resetStoreBookSeries = true
		let response
		let author = constants.davUser.authors[2]
		let series = author.series[0]
		let collections = [
			author.collections[1].uuid,
			author.collections[0].uuid
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
					collections
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 2)
		assert.equal(response.data.uuid, series.uuid)

		if (series.names.length == 0) {
			assert.isNull(response.data.name)
		} else {
			let seriesName = series.names.find(n => n.language == "en")

			assert.isNotNull(seriesName)
			assert.equal(response.data.name.language, "en")
			assert.equal(response.data.name.value, seriesName.name)
		}

		// Check if the store book series was updated on the server
		let objResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: series.uuid
		})

		assert.equal(objResponse.status, 200)
		assert.equal(objResponse.data.tableObject.Uuid, series.uuid)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("author"), author.uuid)

		let nameUuids = []
		for (let name of series.names) nameUuids.push(name.uuid)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("names"), nameUuids.join(','))

		assert.equal(objResponse.data.tableObject.GetPropertyValue("collections"), collections.join(','))
	})

	it("should update store book series as admin with specified language", async () => {
		resetStoreBookSeries = true
		let response
		let language = "de"
		let author = constants.davUser.authors[2]
		let series = author.series[0]
		let collections = [
			author.collections[1].uuid,
			author.collections[0].uuid
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
					collections
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 2)
		assert.equal(response.data.uuid, series.uuid)

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

		// Check if the store book series was updated on the server
		let objResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: series.uuid
		})

		assert.equal(objResponse.status, 200)
		assert.equal(objResponse.data.tableObject.Uuid, series.uuid)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("author"), author.uuid)

		let nameUuids = []
		for (let name of series.names) nameUuids.push(name.uuid)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("names"), nameUuids.join(','))

		assert.equal(objResponse.data.tableObject.GetPropertyValue("collections"), collections.join(','))
	})
})