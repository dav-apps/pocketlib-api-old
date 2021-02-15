import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import { TableObjectsController } from 'dav-npm'
import constants from '../constants.js'
import * as utils from '../utils.js'

const createCategoryEndpointUrl = `${constants.apiBaseUrl}/api/1/call/store/category`
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
			await axios.default({
				method: 'post',
				url: createCategoryEndpointUrl,
				headers: {
					'Content-Type': 'application/json'
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(2101, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not create category with access token for session that does not exist", async () => {
		try {
			await axios.default({
				method: 'post',
				url: createCategoryEndpointUrl,
				headers: {
					Authorization: "asdasdasad",
					'Content-Type': 'application/json'
				}
			})
		} catch (error) {
			assert.equal(404, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(2802, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not create category without Content-Type json", async () => {
		try {
			await axios.default({
				method: 'post',
				url: createCategoryEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken
				}
			})
		} catch (error) {
			assert.equal(415, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(1104, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not create category with access token for another app", async () => {
		try {
			await axios.default({
				method: 'post',
				url: createCategoryEndpointUrl,
				headers: {
					Authorization: constants.testUserTestAppAccessToken,
					'Content-Type': 'application/json'
				}
			})
		} catch (error) {
			assert.equal(403, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(1102, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not create category if the user is not an admin", async () => {
		try {
			await axios.default({
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
			assert.equal(403, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(1102, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not create category without required properties", async () => {
		try {
			await axios.default({
				method: 'post',
				url: createCategoryEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(2111, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not create category with properties with wrong types", async () => {
		try {
			await axios.default({
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
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(2213, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not create category with too short properties", async () => {
		try {
			await axios.default({
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
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(2310, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not create category with too long properties", async () => {
		try {
			await axios.default({
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
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(2410, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not create category with invalid key", async () => {
		try {
			await axios.default({
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
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(2502, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not create category with key that is already used", async () => {
		try {
			await axios.default({
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
			assert.equal(422, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(2601, error.response.data.errors[0].code)
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
			response = await axios.default({
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

		assert.equal(201, response.status)
		assert(response.data.uuid != null)
		assert.equal(key, response.data.key)
		assert.equal(0, response.data.names)

		// Check if the data was correctly saved on the server
		// Get the Category table object
		let categoryObjResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: response.data.uuid
		})

		if (categoryObjResponse.status != 200) {
			assert.fail()
		}

		assert.equal(key, categoryObjResponse.data.GetPropertyValue("key"))
		assert.equal(null, categoryObjResponse.data.GetPropertyValue("names"))
	})
})