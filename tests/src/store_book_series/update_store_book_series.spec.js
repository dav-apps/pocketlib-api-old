import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import { TableObjectsController } from 'dav-js'
import constants from '../constants.js'
import * as utils from '../utils.js'
import * as ErrorCodes from '../errorCodes.js'

const updateStoreBookSeriesEndpointUrl = `${constants.apiBaseUrl}/store/series/{0}`
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
			assert.equal(401, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.AuthorizationHeaderMissing, error.response.data.errors[0].code)
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
			assert.equal(404, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.SessionDoesNotExist, error.response.data.errors[0].code)
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
			assert.equal(415, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.ContentTypeNotSupported, error.response.data.errors[0].code)
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
			assert.equal(403, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.ActionNotAllowed, error.response.data.errors[0].code)
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
			assert.equal(404, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.StoreBookSeriesDoesNotExist, error.response.data.errors[0].code)
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
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.CollectionsWrongType, error.response.data.errors[0].code)
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
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.CollectionsWrongType, error.response.data.errors[0].code)
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
			assert.equal(403, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.ActionNotAllowed, error.response.data.errors[0].code)
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
				data: {
					collections
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(200, response.status)
		assert.equal(series.uuid, response.data.uuid)
		assert.equal(author.uuid, response.data.author)
		assert.equal(series.names.length, response.data.names.length)
		assert.equal(collections.length, response.data.collections.length)
		assert.equal(collections[0], response.data.collections[0])
		assert.equal(collections[1], response.data.collections[1])

		let i = 0
		for (let seriesName of series.names) {
			assert.equal(seriesName.name, response.data.names[i].name)
			assert.equal(seriesName.language, response.data.names[i].language)
			i++
		}

		// Check if the store book series was updated on the server
		let objResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: series.uuid
		})

		if (objResponse.status != 200) {
			assert.fail()
		}

		assert.equal(series.uuid, objResponse.data.Uuid)
		assert.equal(author.uuid, objResponse.data.GetPropertyValue("author"))

		let nameUuids = []
		for (let name of series.names) nameUuids.push(name.uuid)
		assert.equal(nameUuids.join(','), objResponse.data.GetPropertyValue("names"))

		assert.equal(collections.join(','), objResponse.data.GetPropertyValue("collections"))
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
				data: {
					collections
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(200, response.status)
		assert.equal(series.uuid, response.data.uuid)
		assert.equal(author.uuid, response.data.author)
		assert.equal(series.names.length, response.data.names.length)
		assert.equal(collections.length, response.data.collections.length)
		assert.equal(collections[0], response.data.collections[0])
		assert.equal(collections[1], response.data.collections[1])

		let i = 0
		for (let seriesName of series.names) {
			assert.equal(seriesName.name, response.data.names[i].name)
			assert.equal(seriesName.language, response.data.names[i].language)
			i++
		}

		// Check if the store book series was updated on the server
		let objResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: series.uuid
		})

		if (objResponse.status != 200) {
			assert.fail()
		}

		assert.equal(series.uuid, objResponse.data.Uuid)
		assert.equal(author.uuid, objResponse.data.GetPropertyValue("author"))

		let nameUuids = []
		for (let name of series.names) nameUuids.push(name.uuid)
		assert.equal(nameUuids.join(','), objResponse.data.GetPropertyValue("names"))

		assert.equal(collections.join(','), objResponse.data.GetPropertyValue("collections"))
	})
})