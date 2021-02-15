import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'

const getCategoriesEndpointUrl = `${constants.apiBaseUrl}/api/1/call/store/categories`

describe("GetCategories endpoint", async () => {
	it("should return categories", async () => {
		let response

		try {
			response = await axios.default({
				method: 'get',
				url: getCategoriesEndpointUrl,
				headers: {
					Authorization: constants.testUser.accessToken
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(200, response.status)

		let i = 0
		for (let category of constants.categories) {
			assert.equal(category.uuid, response.data.categories[i].uuid)
			assert.equal(category.key, response.data.categories[i].key)

			let j = 0
			for (let categoryName of category.names) {
				assert.equal(categoryName.name, response.data.categories[i].names[j].name)
				assert.equal(categoryName.language, response.data.categories[i].names[j].language)

				j++
			}

			i++
		}
	})
})