import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'
import * as ErrorCodes from '../errorCodes.js'

const listAuthorBiosEndpointUrl = `${constants.apiBaseUrl}/authors/{0}/bios`

describe("ListAuthorBios endpoint", () => {
	it("should not return bios of author of user with access token for session that does not exist", async () => {
		try {
			await axios({
				method: 'get',
				url: listAuthorBiosEndpointUrl.replace('{0}', "mine"),
				headers: {
					Authorization: "asdasdasdasdasd"
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

	it("should not return bios of author of user with access token for another app", async () => {
		try {
			await axios({
				method: 'get',
				url: listAuthorBiosEndpointUrl.replace('{0}', "mine"),
				headers: {
					Authorization: constants.testUserTestAppAccessToken
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

	it("should not return bios of author of user if the user is an admin", async () => {
		try {
			await axios({
				method: 'get',
				url: listAuthorBiosEndpointUrl.replace('{0}', "mine"),
				headers: {
					Authorization: constants.davUser.accessToken
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.UserIsAdmin)
			return
		}

		assert.fail()
	})

	it("should not return bios of author of user if the user is not an author", async () => {
		try {
			await axios({
				method: 'get',
				url: listAuthorBiosEndpointUrl.replace('{0}', "mine"),
				headers: {
					Authorization: constants.testUser.accessToken
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

	it("should not return bios of author that does not exist", async () => {
		try {
			await axios({
				method: 'get',
				url: listAuthorBiosEndpointUrl.replace('{0}', "asdasasassad")
			})
		} catch (error) {
			assert.equal(error.response.status, 404)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.AuthorDoesNotExist)
			return
		}

		assert.fail()
	})

	it("should return bios of author", async () => {
		let author = constants.davUser.authors[0]
		let response

		try {
			response = await axios({
				method: 'get',
				url: listAuthorBiosEndpointUrl.replace('{0}', author.uuid),
				params: {
					fields: "*"
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 2)
		assert.equal(Object.keys(response.data.items).length, author.bios.length)

		for (let bio of author.bios) {
			let responseBio = response.data.items.find(b => b.uuid == bio.uuid)

			assert.isNotNull(responseBio)
			assert.equal(responseBio.uuid, bio.uuid)
			assert.equal(responseBio.bio, bio.bio)
			assert.equal(responseBio.language, bio.language)
		}
	})

	it("should return bios of author of user", async () => {
		let author = constants.authorUser.author
		let response

		try {
			response = await axios({
				method: 'get',
				url: listAuthorBiosEndpointUrl.replace('{0}', "mine"),
				headers: {
					Authorization: constants.authorUser.accessToken
				},
				params: {
					fields: "*"
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 2)
		assert.equal(Object.keys(response.data.items).length, author.bios.length)

		for (let bio of author.bios) {
			let responseBio = response.data.items.find(b => b.uuid == bio.uuid)

			assert.isNotNull(responseBio)
			assert.equal(responseBio.uuid, bio.uuid)
			assert.equal(responseBio.bio, bio.bio)
			assert.equal(responseBio.language, bio.language)
		}
	})
})