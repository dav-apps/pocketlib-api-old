import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'

const getCategoriesEndpointUrl = `${constants.apiBaseUrl}/categories`

describe("GetCategories endpoint", () => {
	it("should return categories", async () => {
		let response

		try {
			response = await axios({
				method: 'get',
				url: getCategoriesEndpointUrl,
				params: {
					fields: "*"
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 2)
		assert.equal(response.data.items.length, constants.categories.length)

		for (let category of constants.categories) {
			let responseCategory = response.data.items.find(c => c.uuid == category.uuid)

			assert.isNotNull(responseCategory)
			assert.equal(responseCategory.uuid, category.uuid)
			assert.equal(responseCategory.key, category.key)

			let categoryName = category.names.find(n => n.language == "en")

			assert.isNotNull(categoryName)
			assert.equal(responseCategory.name.language, "en")
			assert.equal(responseCategory.name.value, categoryName.name)
		}
	})

	it("should return categories with specified language", async () => {
		let language = "de"
		let response

		try {
			response = await axios({
				method: 'get',
				url: getCategoriesEndpointUrl,
				params: {
					fields: "*",
					languages: language
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 2)
		assert.equal(response.data.items.length, constants.categories.length)

		for (let category of constants.categories) {
			let responseCategory = response.data.items.find(c => c.uuid == category.uuid)

			assert.isNotNull(responseCategory)
			assert.equal(responseCategory.uuid, category.uuid)
			assert.equal(responseCategory.key, category.key)

			let categoryName = category.names.find(n => n.language == language)

			if (categoryName == null) {
				assert.equal(responseCategory.name.language, "en")

				categoryName = category.names.find(n => n.language == "en")
				
				assert.isNotNull(categoryName)
				assert.equal(responseCategory.name.value, categoryName.name)
			} else {
				assert.equal(responseCategory.name.language, language)
				assert.equal(responseCategory.name.value, categoryName.name)
			}
		}
	})
})