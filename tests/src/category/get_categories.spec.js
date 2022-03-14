import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'

const getCategoriesEndpointUrl = `${constants.apiBaseUrl}/store/categories`

describe("GetCategories endpoint", async () => {
	it("should return categories", async () => {
		let response

		try {
			response = await axios({
				method: 'get',
				url: getCategoriesEndpointUrl
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)

		let i = 0
		for (let category of constants.categories) {
			assert.equal(response.data.categories[i].uuid, category.uuid)
			assert.equal(response.data.categories[i].key, category.key)

			let j = 0
			for (let categoryName of category.names) {
				assert.equal(response.data.categories[i].names[j].name, categoryName.name)
				assert.equal(response.data.categories[i].names[j].language, categoryName.language)

				j++
			}

			i++
		}
	})
})