import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'
import * as ErrorCodes from '../errorCodes.js'

const getBiosOfAuthorEndpointUrl = `${constants.apiBaseUrl}/author/{0}/bios`

describe("GetBiosOfAuthor endpoint", () => {
	it("should not get bios of author that does not exist", async () => {
		try {
			await axios({
				method: 'get',
				url: getBiosOfAuthorEndpointUrl.replace('{0}', "asdasasassad")
			})
		} catch (error) {
			assert.equal(error.response.status, 404)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.AuthorDoesNotExist)
			return
		}

		assert.fail()
	})

	it("should get bios of author", async () => {
		let author = constants.authorUser.author
		let response

		try {
			response = await axios({
				method: 'get',
				url: getBiosOfAuthorEndpointUrl.replace('{0}', author.uuid)
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data.bios).length, author.bios.length)

		for (let key of Object.keys(response.data.bios)) {
			let bio = author.bios.find(b => b.language == key)

			assert.isNotNull(bio)
			assert.equal(key, bio.language)
			assert.equal(response.data.bios[key], bio.bio)
		}
	})
})