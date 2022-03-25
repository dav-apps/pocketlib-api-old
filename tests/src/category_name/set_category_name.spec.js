import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import { TableObjectsController } from 'dav-js'
import constants from '../constants.js'
import * as utils from '../utils.js'
import * as ErrorCodes from '../errorCodes.js'

const setCategoryNameEndpointUrl = `${constants.apiBaseUrl}/store/category/{0}/name/{1}`
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
			await axios({
				method: 'put',
				url: setCategoryNameEndpointUrl.replace('{0}', constants.categories[0].uuid).replace('{1}', "en"),
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

	it("should not set category name with access token for session that does not exist", async () => {
		try {
			await axios({
				method: 'put',
				url: setCategoryNameEndpointUrl.replace('{0}', constants.categories[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: "asdasdasdas",
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

	it("should not set category name without Content-Type json", async () => {
		try {
			await axios({
				method: 'put',
				url: setCategoryNameEndpointUrl.replace('{0}', constants.categories[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: constants.davUser.accessToken,
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

	it("should not set category name with access token for another app", async () => {
		try {
			await axios({
				method: 'put',
				url: setCategoryNameEndpointUrl.replace('{0}', constants.categories[0].uuid).replace('{1}', "en"),
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

	it("should not set category name if the user is not an admin", async () => {
		try {
			await axios({
				method: 'put',
				url: setCategoryNameEndpointUrl.replace('{0}', constants.categories[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: constants.authorUser.accessToken,
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

	it("should not set category name without required properties", async () => {
		try {
			await axios({
				method: 'put',
				url: setCategoryNameEndpointUrl.replace('{0}', constants.categories[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: constants.davUser.accessToken,
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

	it("should not set category name with properties with wrong types", async () => {
		try {
			await axios({
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.NameWrongType)
			return
		}

		assert.fail()
	})

	it("should not set category name with too short properties", async () => {
		try {
			await axios({
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.NameTooShort)
			return
		}

		assert.fail()
	})

	it("should not set category name with too long properties", async () => {
		try {
			await axios({
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.NameTooLong)
			return
		}

		assert.fail()
	})

	it("should not set category name for not supported language", async () => {
		try {
			await axios({
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.LanguageNotSupported)
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
			response = await axios({
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

		assert.equal(response.status, 200)
		assert.equal(response.data.name, name)
		assert.equal(response.data.language, language)

		// Check if the data was correctly saved on the server
		// Get the category table object
		let categoryObjResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: category.uuid
		})

		assert.equal(categoryObjResponse.status, 200)

		let responseCategoryNames = categoryObjResponse.data.tableObject.GetPropertyValue("names")
		let responseCategoryNameUuids = responseCategoryNames.split(',')

		let categoryNameUuids = []
		category.names.forEach(name => categoryNameUuids.push(name.uuid))
		categoryNameUuids.push(responseCategoryNameUuids[responseCategoryNameUuids.length - 1])
		let categoryNames = categoryNameUuids.join(',')

		assert.equal(responseCategoryNameUuids.length, categoryNameUuids.length)
		assert.equal(responseCategoryNames, categoryNames)

		// Get the category name table object
		let newCategoryNameUuid = responseCategoryNameUuids[responseCategoryNameUuids.length - 1]

		let categoryNameObjResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: newCategoryNameUuid
		})

		assert.equal(categoryNameObjResponse.status, 200)
		assert.equal(categoryNameObjResponse.data.tableObject.Uuid, newCategoryNameUuid)
		assert.equal(categoryNameObjResponse.data.tableObject.GetPropertyValue("name"), name)
		assert.equal(categoryNameObjResponse.data.tableObject.GetPropertyValue("language"), language)
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
			response = await axios({
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

		assert.equal(response.status, 200)
		assert.equal(response.data.name, name)
		assert.equal(response.data.language, language)

		// Check if the data was correctly updated on the server
		// Get the category
		let categoryObjResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: category.uuid
		})

		assert.equal(categoryObjResponse.status, 200)

		let responseCategoryNames = categoryObjResponse.data.tableObject.GetPropertyValue("names")
		let responseCategoryNameUuids = responseCategoryNames.split(',')

		let categoryNameUuids = []
		category.names.forEach(name => categoryNameUuids.push(name.uuid))
		let categoryNames = categoryNameUuids.join(',')

		assert.equal(responseCategoryNameUuids.length, categoryNameUuids.length)
		assert.equal(responseCategoryNames, categoryNames)

		// Get the category name table object
		let categoryNameObjResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: categoryNameUuid
		})

		assert.equal(categoryNameObjResponse.status, 200)
		assert.equal(categoryNameObjResponse.data.tableObject.Uuid, categoryNameUuid)
		assert.equal(categoryNameObjResponse.data.tableObject.GetPropertyValue("name"), name)
		assert.equal(categoryNameObjResponse.data.tableObject.GetPropertyValue("language"), language)
	})
})