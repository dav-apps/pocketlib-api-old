import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import { TableObjectsController } from 'dav-js'
import constants from '../constants.js'
import * as utils from '../utils.js'
import * as ErrorCodes from '../errorCodes.js'

const setStoreBookSeriesNameEndpointUrl = `${constants.apiBaseUrl}/store/book/series/{0}/name/{1}`
var resetStoreBookSeriesAndStoreBookSeriesNames = false

afterEach(async () => {
	if (resetStoreBookSeriesAndStoreBookSeriesNames) {
		await utils.resetStoreBookSeries()
		await utils.resetStoreBookSeriesNames()
		resetStoreBookSeriesAndStoreBookSeriesNames = false
	}
})

describe("SetStoreBookSeriesName endpoint", () => {
	it("should not set series name witout access token", async () => {
		try {
			await axios({
				method: 'put',
				url: setStoreBookSeriesNameEndpointUrl.replace('{0}', constants.authorUser.author.series[0].uuid).replace('{1}', "en"),
				headers: {
					'Content-Type': 'application/json'
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 401)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.AuthorizationHeaderMissing)
			return
		}

		assert.fail()
	})

	it("should not set series name with access token for session that does not exist", async () => {
		try {
			await axios({
				method: 'put',
				url: setStoreBookSeriesNameEndpointUrl.replace('{0}', constants.authorUser.author.series[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: "sdfhsdfsodfsfd",
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

	it("should not set series name without Content-Type json", async () => {
		try {
			await axios({
				method: 'put',
				url: setStoreBookSeriesNameEndpointUrl.replace('{0}', constants.authorUser.author.series[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/xml'
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

	it("should not set series name with access token for another app", async () => {
		try {
			await axios({
				method: 'put',
				url: setStoreBookSeriesNameEndpointUrl.replace('{0}', constants.authorUser.author.series[0].uuid).replace('{1}', "en"),
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

	it("should not set series name for series of another user", async () => {
		try {
			await axios({
				method: 'put',
				url: setStoreBookSeriesNameEndpointUrl.replace('{0}', constants.authorUser.author.series[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: constants.davUser.accessToken,
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

	it("should not set series name without required properties", async () => {
		try {
			await axios({
				method: 'put',
				url: setStoreBookSeriesNameEndpointUrl.replace('{0}', constants.authorUser.author.series[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.NameMissing)
			return
		}

		assert.fail()
	})

	it("should not set series name with properties with wrong types", async () => {
		try {
			await axios({
				method: 'put',
				url: setStoreBookSeriesNameEndpointUrl.replace('{0}', constants.authorUser.author.series[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					name: false
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.NameWrongType)
			return
		}

		assert.fail()
	})

	it("should not set series name with too short properties", async () => {
		try {
			await axios({
				method: 'put',
				url: setStoreBookSeriesNameEndpointUrl.replace('{0}', constants.authorUser.author.series[0].uuid).replace('{1}', "en"),
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

	it("should not set series name with too long properties", async () => {
		try {
			await axios({
				method: 'put',
				url: setStoreBookSeriesNameEndpointUrl.replace('{0}', constants.authorUser.author.series[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					name: "a".repeat(150)
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

	it("should not set series name for not supported language", async () => {
		try {
			await axios({
				method: 'put',
				url: setStoreBookSeriesNameEndpointUrl.replace('{0}', constants.authorUser.author.series[0].uuid).replace('{1}', "bla"),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					name: "Hello World"
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

	it("should create series name", async () => {
		resetStoreBookSeriesAndStoreBookSeriesNames = true

		// Create the series name
		let response
		let series = constants.authorUser.author.series[0]
		let language = "fr"
		let name = "Hello World"
		let accessToken = constants.authorUser.accessToken

		try {
			response = await axios({
				method: 'put',
				url: setStoreBookSeriesNameEndpointUrl.replace('{0}', series.uuid).replace('{1}', language),
				headers: {
					Authorization: accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					name
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(response.data.name, name)
		assert.equal(response.data.language, language)

		// Check if the data was correctly saved on the server
		// Get the series
		let seriesResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: series.uuid
		})

		assert.equal(seriesResponse.status, 200)

		let responseSeriesNames = seriesResponse.data.tableObject.GetPropertyValue("names")
		let responseSeriesNameUuids = responseSeriesNames.split(',')

		let seriesNameUuids = []
		series.names.forEach(name => seriesNameUuids.push(name.uuid))
		seriesNameUuids.push(responseSeriesNameUuids[responseSeriesNameUuids.length - 1])
		let seriesNames = seriesNameUuids.join(',')

		assert.equal(responseSeriesNameUuids.length, seriesNameUuids.length)
		assert.equal(responseSeriesNames, seriesNames)

		// Get the series name
		let newSeriesNameUuid = responseSeriesNameUuids[responseSeriesNameUuids.length - 1]

		let seriesNameResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: newSeriesNameUuid
		})

		assert.equal(seriesNameResponse.status, 200)
		assert.equal(seriesNameResponse.data.tableObject.Uuid, newSeriesNameUuid)
		assert.equal(seriesNameResponse.data.tableObject.GetPropertyValue("name"), name)
		assert.equal(seriesNameResponse.data.tableObject.GetPropertyValue("language"), language)
	})

	it("should update series name", async () => {
		resetStoreBookSeriesAndStoreBookSeriesNames = true

		// Update the series name
		let response
		let series = constants.authorUser.author.series[0]
		let language = "en"
		let name = "Hello World"
		let seriesNameUuid = series.names[0].uuid
		let accessToken = constants.authorUser.accessToken

		try {
			response = await axios({
				method: 'put',
				url: setStoreBookSeriesNameEndpointUrl.replace('{0}', series.uuid).replace('{1}', language),
				headers: {
					Authorization: accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					name
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(response.data.name, name)
		assert.equal(response.data.language, language)

		// Check if the data was correctly updated on the server
		// Get the series
		let seriesResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: series.uuid
		})

		assert.equal(seriesResponse.status, 200)

		let responseSeriesNames = seriesResponse.data.tableObject.GetPropertyValue("names")
		let responseSeriesNameUuids = responseSeriesNames.split(',')

		let seriesNameUuids = []
		series.names.forEach(name => seriesNameUuids.push(name.uuid))
		let seriesNames = seriesNameUuids.join(',')

		assert.equal(responseSeriesNameUuids.length, seriesNameUuids.length)
		assert.equal(responseSeriesNames, seriesNames)

		// Get the series name
		let seriesNameResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: seriesNameUuid
		})

		assert.equal(seriesNameResponse.status, 200)
		assert.equal(seriesNameResponse.data.tableObject.Uuid, seriesNameUuid)
		assert.equal(seriesNameResponse.data.tableObject.GetPropertyValue("name"), name)
		assert.equal(seriesNameResponse.data.tableObject.GetPropertyValue("language"), language)
	})

	it("should create series name for series of admin", async () => {
		resetStoreBookSeriesAndStoreBookSeriesNames = true

		// Create the series name
		let response
		let series = constants.davUser.authors[2].series[0]
		let language = "fr"
		let name = "Hallo Welt"
		let accessToken = constants.davUser.accessToken

		try {
			response = await axios({
				method: 'put',
				url: setStoreBookSeriesNameEndpointUrl.replace('{0}', series.uuid).replace('{1}', language),
				headers: {
					Authorization: accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					name
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(response.data.name, name)
		assert.equal(response.data.language, language)

		// Check if the data was correctly saved on the server
		// Get the series
		let seriesResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: series.uuid
		})

		assert.equal(seriesResponse.status, 200)

		let responseSeriesNames = seriesResponse.data.tableObject.GetPropertyValue("names")
		let responseSeriesNameUuids = responseSeriesNames.split(',')

		let seriesNameUuids = []
		series.names.forEach(name => seriesNameUuids.push(name.uuid))
		seriesNameUuids.push(responseSeriesNameUuids[responseSeriesNameUuids.length - 1])
		let seriesNames = seriesNameUuids.join(',')

		assert.equal(responseSeriesNameUuids.length, seriesNameUuids.length)
		assert.equal(responseSeriesNames, seriesNames)

		// Get the series name
		let newSeriesNameUuid = responseSeriesNameUuids[responseSeriesNameUuids.length - 1]

		let seriesNameResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: newSeriesNameUuid
		})

		assert.equal(seriesNameResponse.status, 200)
		assert.equal(seriesNameResponse.data.tableObject.Uuid, newSeriesNameUuid)
		assert.equal(seriesNameResponse.data.tableObject.GetPropertyValue("name"), name)
		assert.equal(seriesNameResponse.data.tableObject.GetPropertyValue("language"), language)
	})

	it("should update series name for series of admin", async () => {
		resetStoreBookSeriesAndStoreBookSeriesNames = true

		// Update the series name
		let response
		let series = constants.davUser.authors[2].series[0]
		let language = "en"
		let name = "Hello World"
		let seriesNameUuid = series.names[0].uuid
		let accessToken = constants.davUser.accessToken

		try {
			response = await axios({
				method: 'put',
				url: setStoreBookSeriesNameEndpointUrl.replace('{0}', series.uuid).replace('{1}', language),
				headers: {
					Authorization: accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					name
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(response.data.name, name)
		assert.equal(response.data.language, language)

		// Check if the data was correctly updated on the server
		// Get the series
		let seriesResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: series.uuid
		})

		assert.equal(seriesResponse.status, 200)
		let responseSeriesNames = seriesResponse.data.tableObject.GetPropertyValue("names")
		let responseSeriesNameUuids = responseSeriesNames.split(',')

		let seriesNameUuids = []
		series.names.forEach(name => seriesNameUuids.push(name.uuid))
		let seriesNames = seriesNameUuids.join(',')

		assert.equal(responseSeriesNameUuids.length, seriesNameUuids.length)
		assert.equal(responseSeriesNames, seriesNames)

		// Get the series name
		let seriesNameResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: seriesNameUuid
		})

		assert.equal(seriesNameResponse.status, 200)
		assert.equal(seriesNameResponse.data.tableObject.Uuid, seriesNameUuid)
		assert.equal(seriesNameResponse.data.tableObject.GetPropertyValue("name"), name)
		assert.equal(seriesNameResponse.data.tableObject.GetPropertyValue("language"), language)
	})
})