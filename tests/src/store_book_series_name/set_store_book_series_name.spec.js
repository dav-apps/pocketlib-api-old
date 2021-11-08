import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import { TableObjectsController } from 'dav-js'
import constants from '../constants.js'
import * as utils from '../utils.js'
import * as ErrorCodes from '../errorCodes.js'

const setStoreBookSeriesNameEndpointUrl = `${constants.apiBaseUrl}/store/series/{0}/name/{1}`
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
			assert.equal(401, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.AuthorizationHeaderMissing, error.response.data.errors[0].code)
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
			assert.equal(404, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.SessionDoesNotExist, error.response.data.errors[0].code)
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
			assert.equal(415, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.ContentTypeNotSupported, error.response.data.errors[0].code)
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
			assert.equal(403, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.ActionNotAllowed, error.response.data.errors[0].code)
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
			assert.equal(403, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.ActionNotAllowed, error.response.data.errors[0].code)
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
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.NameMissing, error.response.data.errors[0].code)
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
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.NameWrongType, error.response.data.errors[0].code)
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
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.NameTooShort, error.response.data.errors[0].code)
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
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.NameTooLong, error.response.data.errors[0].code)
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
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.LanguageNotSupported, error.response.data.errors[0].code)
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

		assert.equal(200, response.status)
		assert.equal(name, response.data.name)
		assert.equal(language, response.data.language)

		// Check if the data was correctly saved on the server
		// Get the series
		let seriesResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: series.uuid
		})

		if (seriesResponse.status != 200) {
			assert.fail()
		}

		let responseSeriesNames = seriesResponse.data.GetPropertyValue("names")
		let responseSeriesNameUuids = responseSeriesNames.split(',')

		let seriesNameUuids = []
		series.names.forEach(name => seriesNameUuids.push(name.uuid))
		seriesNameUuids.push(responseSeriesNameUuids[responseSeriesNameUuids.length - 1])
		let seriesNames = seriesNameUuids.join(',')

		assert.equal(seriesNameUuids.length, responseSeriesNameUuids.length)
		assert.equal(seriesNames, responseSeriesNames)

		// Get the series name
		let newSeriesNameUuid = responseSeriesNameUuids[responseSeriesNameUuids.length - 1]

		let seriesNameResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: newSeriesNameUuid
		})

		if (seriesNameResponse.status != 200) {
			assert.fail()
		}

		assert.equal(newSeriesNameUuid, seriesNameResponse.data.Uuid)
		assert.equal(name, seriesNameResponse.data.GetPropertyValue("name"))
		assert.equal(language, seriesNameResponse.data.GetPropertyValue("language"))
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

		assert.equal(200, response.status)
		assert.equal(name, response.data.name)
		assert.equal(language, response.data.language)

		// Check if the data was correctly updated on the server
		// Get the series
		let seriesResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: series.uuid
		})

		if (seriesResponse.status != 200) {
			assert.fail()
		}

		let responseSeriesNames = seriesResponse.data.GetPropertyValue("names")
		let responseSeriesNameUuids = responseSeriesNames.split(',')

		let seriesNameUuids = []
		series.names.forEach(name => seriesNameUuids.push(name.uuid))
		let seriesNames = seriesNameUuids.join(',')

		assert.equal(seriesNameUuids.length, responseSeriesNameUuids.length)
		assert.equal(seriesNames, responseSeriesNames)

		// Get the series name
		let seriesNameResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: seriesNameUuid
		})

		if (seriesNameResponse.status != 200) {
			assert.fail()
		}

		assert.equal(seriesNameUuid, seriesNameResponse.data.Uuid)
		assert.equal(name, seriesNameResponse.data.GetPropertyValue("name"))
		assert.equal(language, seriesNameResponse.data.GetPropertyValue("language"))
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

		assert.equal(200, response.status)
		assert.equal(name, response.data.name)
		assert.equal(language, response.data.language)

		// Check if the data was correctly saved on the server
		// Get the series
		let seriesResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: series.uuid
		})

		if (seriesResponse.status != 200) {
			assert.fail()
		}

		let responseSeriesNames = seriesResponse.data.GetPropertyValue("names")
		let responseSeriesNameUuids = responseSeriesNames.split(',')

		let seriesNameUuids = []
		series.names.forEach(name => seriesNameUuids.push(name.uuid))
		seriesNameUuids.push(responseSeriesNameUuids[responseSeriesNameUuids.length - 1])
		let seriesNames = seriesNameUuids.join(',')

		assert.equal(seriesNameUuids.length, responseSeriesNameUuids.length)
		assert.equal(seriesNames, responseSeriesNames)

		// Get the series name
		let newSeriesNameUuid = responseSeriesNameUuids[responseSeriesNameUuids.length - 1]

		let seriesNameResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: newSeriesNameUuid
		})

		if (seriesNameResponse.status != 200) {
			assert.fail()
		}

		assert.equal(newSeriesNameUuid, seriesNameResponse.data.Uuid)
		assert.equal(name, seriesNameResponse.data.GetPropertyValue("name"))
		assert.equal(language, seriesNameResponse.data.GetPropertyValue("language"))
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

		assert.equal(200, response.status)
		assert.equal(name, response.data.name)
		assert.equal(language, response.data.language)

		// Check if the data was correctly updated on the server
		// Get the series
		let seriesResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: series.uuid
		})

		if (seriesResponse.status != 200) {
			assert.fail()
		}

		let responseSeriesNames = seriesResponse.data.GetPropertyValue("names")
		let responseSeriesNameUuids = responseSeriesNames.split(',')

		let seriesNameUuids = []
		series.names.forEach(name => seriesNameUuids.push(name.uuid))
		let seriesNames = seriesNameUuids.join(',')

		assert.equal(seriesNameUuids.length, responseSeriesNameUuids.length)
		assert.equal(seriesNames, responseSeriesNames)

		// Get the series name
		let seriesNameResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: seriesNameUuid
		})

		if (seriesNameResponse.status != 200) {
			assert.fail()
		}

		assert.equal(seriesNameUuid, seriesNameResponse.data.Uuid)
		assert.equal(name, seriesNameResponse.data.GetPropertyValue("name"))
		assert.equal(language, seriesNameResponse.data.GetPropertyValue("language"))
	})
})