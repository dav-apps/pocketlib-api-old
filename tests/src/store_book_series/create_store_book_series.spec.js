import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import { TableObjectsController } from 'dav-js'
import constants from '../constants.js'
import * as utils from '../utils.js'
import * as ErrorCodes from '../errorCodes.js'

const createStoreBookSeriesEndpointUrl = `${constants.apiBaseUrl}/store_book_series`
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
			assert.equal(error.response.status, 401)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.AuthorizationHeaderMissing)
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
			assert.equal(error.response.status, 404)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.SessionDoesNotExist)
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
			assert.equal(error.response.status, 415)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.ContentTypeNotSupported)
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
			assert.equal(error.response.status, 403)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.ActionNotAllowed)
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 2)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.NameMissing)
			assert.equal(error.response.data.errors[1].code, ErrorCodes.LanguageMissing)
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 2)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.NameWrongType)
			assert.equal(error.response.data.errors[1].code, ErrorCodes.LanguageWrongType)
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 3)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.NameWrongType)
			assert.equal(error.response.data.errors[1].code, ErrorCodes.LanguageWrongType)
			assert.equal(error.response.data.errors[2].code, ErrorCodes.CollectionsWrongType)
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.NameTooShort)
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.NameTooLong)
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.LanguageNotSupported)
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 3)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.AuthorMissing)
			assert.equal(error.response.data.errors[1].code, ErrorCodes.NameMissing)
			assert.equal(error.response.data.errors[2].code, ErrorCodes.LanguageMissing)
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 3)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.AuthorWrongType)
			assert.equal(error.response.data.errors[1].code, ErrorCodes.NameWrongType)
			assert.equal(error.response.data.errors[2].code, ErrorCodes.LanguageWrongType)
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 4)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.AuthorWrongType)
			assert.equal(error.response.data.errors[1].code, ErrorCodes.NameWrongType)
			assert.equal(error.response.data.errors[2].code, ErrorCodes.LanguageWrongType)
			assert.equal(error.response.data.errors[3].code, ErrorCodes.CollectionsWrongType)
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.NameTooShort)
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.NameTooLong)
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.LanguageNotSupported)
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
			assert.equal(error.response.status, 403)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.ActionNotAllowed)
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
			assert.equal(error.response.status, 404)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.AuthorDoesNotExist)
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.UserIsNotAuthor)
			return
		}

		assert.fail()
	})

	it("should not create store book series with collections that do not belong to the author", async () => {
		try {
			await axios({
				method: 'post',
				url: createStoreBookSeriesEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					name: "TestSeries",
					language: "en",
					collections: [
						constants.davUser.authors[0].collections[0].uuid
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
				params: {
					fields: "*"
				},
				data: {
					name,
					language
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 201)
		assert.equal(Object.keys(response.data).length, 2)
		assert.isNotNull(response.data.uuid)
		assert.equal(response.data.name.value, name)
		assert.equal(response.data.name.language, language)

		// Check if the data was correctly saved on the server
		// Get the store book series
		let seriesResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: response.data.uuid
		})

		assert.equal(seriesResponse.status, 200)
		assert.equal(seriesResponse.data.tableObject.GetPropertyValue("author"), constants.authorUser.author.uuid)
		assert.isNotNull(seriesResponse.data.tableObject.GetPropertyValue("names"))

		// Get the store book series name
		let seriesNameResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: seriesResponse.data.tableObject.GetPropertyValue("names")
		})

		assert.equal(seriesNameResponse.status, 200)
		assert.equal(seriesNameResponse.data.tableObject.Uuid, seriesResponse.data.tableObject.GetPropertyValue("names"))
		assert.equal(seriesNameResponse.data.tableObject.GetPropertyValue("name"), name)
		assert.equal(seriesNameResponse.data.tableObject.GetPropertyValue("language"), language)

		// Get the author
		let authorResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: constants.authorUser.author.uuid
		})

		assert.equal(authorResponse.status, 200)

		let series = []
		for (let s of constants.authorUser.author.series) series.push(s.uuid)
		series.push(seriesResponse.data.tableObject.Uuid)

		assert.equal(authorResponse.data.tableObject.GetPropertyValue("series"), series.join(','))
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
				params: {
					fields: "*"
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

		assert.equal(response.status, 201)
		assert.equal(Object.keys(response.data).length, 2)
		assert.isNotNull(response.data.uuid)
		assert.equal(response.data.name.value, name)
		assert.equal(response.data.name.language, language)

		// Check if the data was correctly saved on the server
		// Get the store book series
		let seriesResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: response.data.uuid
		})

		assert.equal(seriesResponse.status, 200)
		assert.equal(seriesResponse.data.tableObject.GetPropertyValue("author"), constants.authorUser.author.uuid)
		assert.isNotNull(seriesResponse.data.tableObject.GetPropertyValue("names"))
		assert.equal(seriesResponse.data.tableObject.GetPropertyValue("collections"), collections.join(','))

		// Get the store book series name
		let seriesNameResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: seriesResponse.data.tableObject.GetPropertyValue("names")
		})

		assert.equal(seriesNameResponse.status, 200)
		assert.equal(seriesNameResponse.data.tableObject.Uuid, seriesResponse.data.tableObject.GetPropertyValue("names"))
		assert.equal(seriesNameResponse.data.tableObject.GetPropertyValue("name"), name)
		assert.equal(seriesNameResponse.data.tableObject.GetPropertyValue("language"), language)

		// Get the author
		let authorResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: constants.authorUser.author.uuid
		})

		assert.equal(authorResponse.status, 200)

		let series = []
		for (let s of constants.authorUser.author.series) series.push(s.uuid)
		series.push(seriesResponse.data.tableObject.Uuid)

		assert.equal(authorResponse.data.tableObject.GetPropertyValue("series"), series.join(','))
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
				params: {
					fields: "*"
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

		assert.equal(response.status, 201)
		assert.equal(Object.keys(response.data).length, 2)
		assert.isNotNull(response.data.uuid)
		assert.equal(response.data.name.value, name)
		assert.equal(response.data.name.language, language)

		// Check if the data was correctly saved on the server
		// Get the store book series
		let seriesResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: response.data.uuid
		})

		assert.equal(seriesResponse.status, 200)
		assert.equal(seriesResponse.data.tableObject.GetPropertyValue("author"), author)
		assert.isNotNull(seriesResponse.data.tableObject.GetPropertyValue("names"))

		// Get the store book series name
		let seriesNameResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: seriesResponse.data.tableObject.GetPropertyValue("names")
		})

		assert.equal(seriesNameResponse.status, 200)
		assert.equal(seriesNameResponse.data.tableObject.Uuid, seriesResponse.data.tableObject.GetPropertyValue("names"))
		assert.equal(seriesNameResponse.data.tableObject.GetPropertyValue("name"), name)
		assert.equal(seriesNameResponse.data.tableObject.GetPropertyValue("language"), language)

		// Get the author
		let authorResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: author
		})

		assert.equal(authorResponse.status, 200)

		let series = []
		for (let s of constants.davUser.authors[0].series) series.push(s.uuid)
		series.push(seriesResponse.data.tableObject.Uuid)

		assert.equal(authorResponse.data.tableObject.GetPropertyValue("series"), series.join(','))
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
				params: {
					fields: "*"
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

		assert.equal(response.status, 201)
		assert.equal(Object.keys(response.data).length, 2)
		assert.isNotNull(response.data.uuid)
		assert.equal(response.data.name.value, name)
		assert.equal(response.data.name.language, language)

		// Check if the data was correctly saved on the server
		// Get the store book series
		let seriesResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: response.data.uuid
		})

		assert.equal(seriesResponse.status, 200)
		assert.equal(seriesResponse.data.tableObject.GetPropertyValue("author"), author)
		assert.isNotNull(seriesResponse.data.tableObject.GetPropertyValue("names"))
		assert.equal(seriesResponse.data.tableObject.GetPropertyValue("collections"), collections.join(','))

		// Get the store book series name
		let seriesNameResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: seriesResponse.data.tableObject.GetPropertyValue("names")
		})

		assert.equal(seriesNameResponse.status, 200)
		assert.equal(seriesNameResponse.data.tableObject.Uuid, seriesResponse.data.tableObject.GetPropertyValue("names"))
		assert.equal(seriesNameResponse.data.tableObject.GetPropertyValue("name"), name)
		assert.equal(seriesNameResponse.data.tableObject.GetPropertyValue("language"), language)

		// Get the author
		let authorResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: author
		})

		let series = []
		for (let s of constants.davUser.authors[0].series) series.push(s.uuid)
		series.push(seriesResponse.data.tableObject.Uuid)

		assert.equal(authorResponse.data.tableObject.GetPropertyValue("series"), series.join(','))
	})
})