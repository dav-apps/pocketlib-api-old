import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import { TableObjectsController } from 'dav-js'
import constants from '../constants.js'
import * as utils from '../utils.js'
import * as ErrorCodes from '../errorCodes.js'

const createStoreBookSeriesEndpointUrl = `${constants.apiBaseUrl}/store/series`
var resetStoreBookSeriesAndAuthors = false

afterEach(async () => {
	if (resetStoreBookSeriesAndAuthors) {
		await utils.resetStoreBookSeries()
		await utils.resetAuthors()
		resetStoreBookSeriesAndAuthors = false
	}
})

describe("CreateStoreBookSeries endpoint", () => {
	it("should not create store book series without access token", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookSeriesEndpointUrl,
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

	it("should not create store book series with access token for session that does not exist", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookSeriesEndpointUrl,
				headers: {
					Authorization: "adasdasd.asdasd.asdasdsda.3",
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

	it("should not create store book series without Content-Type json", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookSeriesEndpointUrl,
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

	it("should not create store book series with access token for another app", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookSeriesEndpointUrl,
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

	it("should not create store book series without required properties", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookSeriesEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(2, error.response.data.errors.length)
			assert.equal(ErrorCodes.NameMissing, error.response.data.errors[0].code)
			assert.equal(ErrorCodes.LanguageMissing, error.response.data.errors[1].code)
			return
		}

		assert.fail()
	})

	it("should not create store book series with properties with wrong types", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookSeriesEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					name: 12,
					language: true
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(2, error.response.data.errors.length)
			assert.equal(ErrorCodes.NameWrongType, error.response.data.errors[0].code)
			assert.equal(ErrorCodes.LanguageWrongType, error.response.data.errors[1].code)
			return
		}

		assert.fail()
	})

	it("should not create store book series with optional properties with wrong types", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookSeriesEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					name: true,
					language: 1234,
					collections: [
						true,
						false,
						123
					]
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(3, error.response.data.errors.length)
			assert.equal(ErrorCodes.NameWrongType, error.response.data.errors[0].code)
			assert.equal(ErrorCodes.LanguageWrongType, error.response.data.errors[1].code)
			assert.equal(ErrorCodes.CollectionsWrongType, error.response.data.errors[2].code)
			return
		}

		assert.fail()
	})

	it("should not create store book series with too short properties", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookSeriesEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					name: "a",
					language: "en"
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

	it("should not create store book series with too long properties", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookSeriesEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					name: "a".repeat(200),
					language: "en"
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

	it("should not create store book series with not supported language", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookSeriesEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					name: "Hello World",
					language: "bla"
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

	it("should not create store book series as admin without required properties", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookSeriesEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(3, error.response.data.errors.length)
			assert.equal(ErrorCodes.AuthorMissing, error.response.data.errors[0].code)
			assert.equal(ErrorCodes.NameMissing, error.response.data.errors[1].code)
			assert.equal(ErrorCodes.LanguageMissing, error.response.data.errors[2].code)
			return
		}

		assert.fail()
	})

	it("should not create store book series as admin with properties with wrong types", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookSeriesEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					author: false,
					name: 20,
					language: false
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(3, error.response.data.errors.length)
			assert.equal(ErrorCodes.AuthorWrongType, error.response.data.errors[0].code)
			assert.equal(ErrorCodes.NameWrongType, error.response.data.errors[1].code)
			assert.equal(ErrorCodes.LanguageWrongType, error.response.data.errors[2].code)
			return
		}

		assert.fail()
	})

	it("should not create store book series as admin with optional properties with wrong types", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookSeriesEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					author: 20,
					name: true,
					language: 12.4,
					collections: 12356
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(4, error.response.data.errors.length)
			assert.equal(ErrorCodes.AuthorWrongType, error.response.data.errors[0].code)
			assert.equal(ErrorCodes.NameWrongType, error.response.data.errors[1].code)
			assert.equal(ErrorCodes.LanguageWrongType, error.response.data.errors[2].code)
			assert.equal(ErrorCodes.CollectionsWrongType, error.response.data.errors[3].code)
			return
		}

		assert.fail()
	})

	it("should not create store book series as admin with too short properties", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookSeriesEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					author: "a",
					name: "a",
					language: "en"
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

	it("should not create store book series as admin with too long properties", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookSeriesEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					author: "a".repeat(210),
					name: "a".repeat(200),
					language: "en"
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

	it("should not create store book series as admin with not supported language", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookSeriesEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					author: "sadasgasd",
					name: "Hello World",
					language: "bla"
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

	it("should not create store book series as admin for author that does not belong to the user", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookSeriesEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					author: constants.authorUser.author.uuid,
					name: "Hello World",
					language: "en"
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

	it("should not create store book series as admin for author that does not exist", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookSeriesEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					author: "blabla",
					name: "Hello World",
					language: "en"
				}
			})
		} catch (error) {
			assert.equal(404, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.AuthorDoesNotExist, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not create store book series if the user is not an author or admin", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookSeriesEndpointUrl,
				headers: {
					Authorization: constants.testUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					name: "Hello World",
					language: "de"
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.UserIsNotAuthor, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should create store book series", async () => {
		resetStoreBookSeriesAndAuthors = true
		let response
		let name = "TestSeries"
		let language = "de"

		// Create the store book series
		try {
			response = await axios({
				method: 'post',
				url: createStoreBookSeriesEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					name,
					language
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(201, response.status)
		assert(response.data.uuid != null)
		assert.equal(1, response.data.names.length)
		assert.equal(name, response.data.names[0].name)
		assert.equal(language, response.data.names[0].language)
		assert.equal(0, response.data.collections.length)

		// Check if the data was correctly saved on the server
		// Get the store book series
		let seriesResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: response.data.uuid
		})

		if (seriesResponse.status != 200) {
			assert.fail()
		}

		assert.equal(constants.authorUser.author.uuid, seriesResponse.data.GetPropertyValue("author"))
		assert(seriesResponse.data.GetPropertyValue("names") != null)

		// Get the store book series name
		let seriesNameResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: seriesResponse.data.GetPropertyValue("names")
		})

		if (seriesNameResponse.status != 200) {
			assert.fail()
		}

		assert.equal(seriesResponse.data.GetPropertyValue("names"), seriesNameResponse.data.Uuid)
		assert.equal(name, seriesNameResponse.data.GetPropertyValue("name"))
		assert.equal(language, seriesNameResponse.data.GetPropertyValue("language"))

		// Get the author
		let authorResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: constants.authorUser.author.uuid
		})

		if (authorResponse.status != 200) {
			assert.fail()
		}

		let series = []
		for (let s of constants.authorUser.author.series) series.push(s.uuid)
		series.push(seriesResponse.data.Uuid)

		assert.equal(series.join(','), authorResponse.data.GetPropertyValue("series"))
	})

	it("should create store book series with optional properties", async () => {
		resetStoreBookSeriesAndAuthors = true
		let response
		let name = "TestSeries"
		let language = "de"
		let collections = [
			constants.authorUser.author.collections[0].uuid,
			constants.authorUser.author.collections[1].uuid
		]

		// Create the store book series
		try {
			response = await axios({
				method: 'post',
				url: createStoreBookSeriesEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					name,
					language,
					collections
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(201, response.status)
		assert(response.data.uuid != null)
		assert.equal(1, response.data.names.length)
		assert.equal(name, response.data.names[0].name)
		assert.equal(language, response.data.names[0].language)
		assert.equal(collections.length, response.data.collections.length)
		assert.equal(collections[0], response.data.collections[0])
		assert.equal(collections[1], response.data.collections[1])

		// Check if the data was correctly saved on the server
		// Get the store book series
		let seriesResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: response.data.uuid
		})

		if (seriesResponse.status != 200) {
			assert.fail()
		}

		assert.equal(constants.authorUser.author.uuid, seriesResponse.data.GetPropertyValue("author"))
		assert(seriesResponse.data.GetPropertyValue("names") != null)
		assert.equal(collections.join(','), seriesResponse.data.GetPropertyValue("collections"))

		// Get the store book series name
		let seriesNameResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: seriesResponse.data.GetPropertyValue("names")
		})

		if (seriesNameResponse.status != 200) {
			assert.fail()
		}

		assert.equal(seriesResponse.data.GetPropertyValue("names"), seriesNameResponse.data.Uuid)
		assert.equal(name, seriesNameResponse.data.GetPropertyValue("name"))
		assert.equal(language, seriesNameResponse.data.GetPropertyValue("language"))

		// Get the author
		let authorResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: constants.authorUser.author.uuid
		})

		if (authorResponse.status != 200) {
			assert.fail()
		}

		let series = []
		for (let s of constants.authorUser.author.series) series.push(s.uuid)
		series.push(seriesResponse.data.Uuid)

		assert.equal(series.join(','), authorResponse.data.GetPropertyValue("series"))
	})

	it("should create store book series as admin", async () => {
		resetStoreBookSeriesAndAuthors = true
		let response
		let author = constants.davUser.authors[0].uuid
		let name = "TestSeries"
		let language = "en"

		// Create the store book series
		try {
			response = await axios({
				method: 'post',
				url: createStoreBookSeriesEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					author,
					name,
					language
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(201, response.status)
		assert(response.data.uuid != null)
		assert.equal(author, response.data.author)
		assert.equal(1, response.data.names.length)
		assert.equal(name, response.data.names[0].name)
		assert.equal(language, response.data.names[0].language)
		assert.equal(0, response.data.collections.length)

		// Check if the data was correctly saved on the server
		// Get the store book series
		let seriesResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: response.data.uuid
		})

		if (seriesResponse.status != 200) {
			assert.fail()
		}

		assert.equal(author, seriesResponse.data.GetPropertyValue("author"))
		assert(seriesResponse.data.GetPropertyValue("names") != null)

		// Get the store book series name
		let seriesNameResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: seriesResponse.data.GetPropertyValue("names")
		})

		if (seriesNameResponse.status != 200) {
			assert.fail()
		}

		assert.equal(seriesResponse.data.GetPropertyValue("names"), seriesNameResponse.data.Uuid)
		assert.equal(name, seriesNameResponse.data.GetPropertyValue("name"))
		assert.equal(language, seriesNameResponse.data.GetPropertyValue("language"))

		// Get the author
		let authorResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: author
		})

		if (authorResponse.status != 200) {
			assert.fail()
		}

		let series = []
		for (let a of constants.davUser.authors) for (let s of a.series) series.push(s.uuid)
		series.push(seriesResponse.data.Uuid)

		assert.equal(series.join(','), authorResponse.data.GetPropertyValue("series"))
	})

	it("should create store book series as admin with optional properties", async () => {
		resetStoreBookSeriesAndAuthors = true
		let response
		let author = constants.davUser.authors[0].uuid
		let name = "TestSeries"
		let language = "en"
		let collections = [
			constants.davUser.authors[0].collections[0].uuid,
			constants.davUser.authors[0].collections[1].uuid
		]

		// Create the store book series
		try {
			response = await axios({
				method: 'post',
				url: createStoreBookSeriesEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					author,
					name,
					language,
					collections
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(201, response.status)
		assert(response.data.uuid != null)
		assert.equal(author, response.data.author)
		assert.equal(1, response.data.names.length)
		assert.equal(name, response.data.names[0].name)
		assert.equal(language, response.data.names[0].language)
		assert.equal(collections.length, response.data.collections.length)
		assert.equal(collections[0], response.data.collections[0])
		assert.equal(collections[1], response.data.collections[1])

		// Check if the data was correctly saved on the server
		// Get the store book series
		let seriesResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: response.data.uuid
		})

		if (seriesResponse.status != 200) {
			assert.fail()
		}

		assert.equal(author, seriesResponse.data.GetPropertyValue("author"))
		assert(seriesResponse.data.GetPropertyValue("names") != null)
		assert.equal(collections.join(','), seriesResponse.data.GetPropertyValue("collections"))

		// Get the store book series name
		let seriesNameResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: seriesResponse.data.GetPropertyValue("names")
		})

		if (seriesNameResponse.status != 200) {
			assert.fail()
		}

		assert.equal(seriesResponse.data.GetPropertyValue("names"), seriesNameResponse.data.Uuid)
		assert.equal(name, seriesNameResponse.data.GetPropertyValue("name"))
		assert.equal(language, seriesNameResponse.data.GetPropertyValue("language"))

		// Get the author
		let authorResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: author
		})

		let series = []
		for (let a of constants.davUser.authors) for (let s of a.series) series.push(s.uuid)
		series.push(seriesResponse.data.Uuid)

		assert.equal(series.join(','), authorResponse.data.GetPropertyValue("series"))
	})
})