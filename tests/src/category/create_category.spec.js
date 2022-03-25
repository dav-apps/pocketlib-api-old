import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import { TableObjectsController } from 'dav-js'
import constants from '../constants.js'
import * as utils from '../utils.js'
import * as ErrorCodes from '../errorCodes.js'

const createCategoryEndpointUrl = `${constants.apiBaseUrl}/store/category`
var resetCategories = false

afterEach(async () => {
	if (resetCategories) {
		await utils.resetCategories()
		resetCategories = false
	}
})

describe("CreateCategory endpoint", () => {
	it("should not create category without access token", async () => {
		try {
			await axios({
				method: 'post',
				url: createCategoryEndpointUrl,
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

	it("should not create category with access token for session that does not exist", async () => {
		try {
			await axios({
				method: 'post',
				url: createCategoryEndpointUrl,
				headers: {
					Authorization: "asdasdasad",
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

	it("should not create category without Content-Type json", async () => {
		try {
			await axios({
				method: 'post',
				url: createCategoryEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken
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

	it("should not create category with access token for another app", async () => {
		try {
			await axios({
				method: 'post',
				url: createCategoryEndpointUrl,
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

	it("should not create category if the user is not an admin", async () => {
		try {
			await axios({
				method: 'post',
				url: createCategoryEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					name: "Test"
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

	it("should not create category without required properties", async () => {
		try {
			await axios({
				method: 'post',
				url: createCategoryEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.KeyMissing)
			return
		}

		assert.fail()
	})

	it("should not create category with properties with wrong types", async () => {
		try {
			await axios({
				method: 'post',
				url: createCategoryEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					key: 12
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.KeyWrongType)
			return
		}

		assert.fail()
	})

	it("should not create category with too short properties", async () => {
		try {
			await axios({
				method: 'post',
				url: createCategoryEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					key: "a"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.KeyTooShort)
			return
		}

		assert.fail()
	})

	it("should not create category with too long properties", async () => {
		try {
			await axios({
				method: 'post',
				url: createCategoryEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					key: "a".repeat(200)
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.KeyTooLong)
			return
		}

		assert.fail()
	})

	it("should not create category with invalid key", async () => {
		try {
			await axios({
				method: 'post',
				url: createCategoryEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					key: "hello world"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.KeyInvalid)
			return
		}

		assert.fail()
	})

	it("should not create category with key that is already used", async () => {
		try {
			await axios({
				method: 'post',
				url: createCategoryEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					key: constants.categories[0].key
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 422)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.KeyAlreadyInUse)
			return
		}

		assert.fail()
	})

	it("should create category", async () => {
		resetCategories = true
		let response
		let key = "test"

		// Create the category
		try {
			response = await axios({
				method: 'post',
				url: createCategoryEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					key
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 201)
		assert.isNotNull(response.data.uuid)
		assert.equal(response.data.key, key)

		// Check if the data was correctly saved on the server
		// Get the Category table object
		let categoryObjResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: response.data.uuid
		})

		assert.equal(categoryObjResponse.status, 200)
		assert.equal(categoryObjResponse.data.tableObject.GetPropertyValue("key"), key)
		assert.isNull(categoryObjResponse.data.tableObject.GetPropertyValue("names"))
	})
})