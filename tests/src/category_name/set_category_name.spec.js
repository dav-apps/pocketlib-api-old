import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import { TableObjectsController } from 'dav-js'
import constants from '../constants.js'
import * as utils from '../utils.js'
import * as ErrorCodes from '../errorCodes.js'

const setCategoryNameEndpointUrl = `${constants.apiBaseUrl}/api/1/call/store/category/{0}/name/{1}`
var resetCategoriesAndCategoryNames = false

afterEach(async () => {
	if (resetCategoriesAndCategoryNames) {
		await utils.resetCategories()
		await utils.resetCategoryNames()
		resetCategoriesAndCategoryNames = false
	}
})

describe("SetCategoryName endpoint", () => {
	it("should not set category name without access token", async () => {
		try {
			await axios.default({
				method: 'put',
				url: setCategoryNameEndpointUrl.replace('{0}', constants.categories[0].uuid).replace('{1}', "en"),
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

	it("should not set category name with access token for session that does not exist", async () => {
		try {
			await axios.default({
				method: 'put',
				url: setCategoryNameEndpointUrl.replace('{0}', constants.categories[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: "asdasdasdas",
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

	it("should not set category name without Content-Type json", async () => {
		try {
			await axios.default({
				method: 'put',
				url: setCategoryNameEndpointUrl.replace('{0}', constants.categories[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: constants.davUser.accessToken,
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

	it("should not set category name with access token for another app", async () => {
		try {
			await axios.default({
				method: 'put',
				url: setCategoryNameEndpointUrl.replace('{0}', constants.categories[0].uuid).replace('{1}', "en"),
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

	it("should not set category name if the user is not an admin", async () => {
		try {
			await axios.default({
				method: 'put',
				url: setCategoryNameEndpointUrl.replace('{0}', constants.categories[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: constants.authorUser.accessToken,
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

	it("should not set category name without required properties", async () => {
		try {
			await axios.default({
				method: 'put',
				url: setCategoryNameEndpointUrl.replace('{0}', constants.categories[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: constants.davUser.accessToken,
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

	it("should not set category name with properties with wrong types", async () => {
		try {
			await axios.default({
				method: 'put',
				url: setCategoryNameEndpointUrl.replace('{0}', constants.categories[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: constants.davUser.accessToken,
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

	it("should not set category name with too short properties", async () => {
		try {
			await axios.default({
				method: 'put',
				url: setCategoryNameEndpointUrl.replace('{0}', constants.categories[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: constants.davUser.accessToken,
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

	it("should not set category name with too long properties", async () => {
		try {
			await axios.default({
				method: 'put',
				url: setCategoryNameEndpointUrl.replace('{0}', constants.categories[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: constants.davUser.accessToken,
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

	it("should not set category name for not supported language", async () => {
		try {
			await axios.default({
				method: 'put',
				url: setCategoryNameEndpointUrl.replace('{0}', constants.categories[0].uuid).replace('{1}', "bla"),
				headers: {
					Authorization: constants.davUser.accessToken,
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

	it("should create category name", async () => {
		resetCategoriesAndCategoryNames = true

		// Create the category name
		let response
		let category = constants.categories[1]
		let language = "fr"
		let name = "Hello World!"
		let accessToken = constants.davUser.accessToken

		try {
			response = await axios.default({
				method: 'put',
				url: setCategoryNameEndpointUrl.replace('{0}', category.uuid).replace('{1}', language),
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
		// Get the category table object
		let categoryObjResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: category.uuid
		})

		if (categoryObjResponse.status != 200) {
			assert.fail()
		}

		let responseCategoryNames = categoryObjResponse.data.GetPropertyValue("names")
		let responseCategoryNameUuids = responseCategoryNames.split(',')

		let categoryNameUuids = []
		category.names.forEach(name => categoryNameUuids.push(name.uuid))
		categoryNameUuids.push(responseCategoryNameUuids[responseCategoryNameUuids.length - 1])
		let categoryNames = categoryNameUuids.join(',')

		assert.equal(categoryNameUuids.length, responseCategoryNameUuids.length)
		assert.equal(categoryNames, responseCategoryNames)

		// Get the category name table object
		let newCategoryNameUuid = responseCategoryNameUuids[responseCategoryNameUuids.length - 1]

		let categoryNameObjResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: newCategoryNameUuid
		})

		if (categoryNameObjResponse.status != 200) {
			assert.fail()
		}

		assert.equal(newCategoryNameUuid, categoryNameObjResponse.data.Uuid)
		assert.equal(name, categoryNameObjResponse.data.GetPropertyValue("name"))
		assert.equal(language, categoryNameObjResponse.data.GetPropertyValue("language"))
	})

	it("should update category name", async () => {
		resetCategoriesAndCategoryNames = true

		// Update the category name
		let response
		let category = constants.categories[1]
		let language = "en"
		let name = "Updated name"
		let categoryNameUuid = category.names[0].uuid
		let accessToken = constants.davUser.accessToken

		try {
			response = await axios.default({
				method: 'put',
				url: setCategoryNameEndpointUrl.replace('{0}', category.uuid).replace('{1}', language),
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
		// Get the category
		let categoryObjResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: category.uuid
		})

		if (categoryObjResponse.status != 200) {
			assert.fail()
		}

		let responseCategoryNames = categoryObjResponse.data.GetPropertyValue("names")
		let responseCategoryNameUuids = responseCategoryNames.split(',')

		let categoryNameUuids = []
		category.names.forEach(name => categoryNameUuids.push(name.uuid))
		let categoryNames = categoryNameUuids.join(',')

		assert.equal(categoryNameUuids.length, responseCategoryNameUuids.length)
		assert.equal(categoryNames, responseCategoryNames)

		// Get the category name table object
		let categoryNameObjResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: categoryNameUuid
		})

		if (categoryNameObjResponse.status != 200) {
			assert.fail()
		}

		assert.equal(categoryNameUuid, categoryNameObjResponse.data.Uuid)
		assert.equal(name, categoryNameObjResponse.data.GetPropertyValue("name"))
		assert.equal(language, categoryNameObjResponse.data.GetPropertyValue("language"))
	})
})