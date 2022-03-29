import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import { TableObjectsController } from 'dav-js'
import constants from '../constants.js'
import * as utils from '../utils.js'
import * as ErrorCodes from '../errorCodes.js'

const setBioOfAuthorEndpointUrl = `${constants.apiBaseUrl}/author/{0}/bio/{1}`
var resetAuthorsAndAuthorBios = false

afterEach(async () => {
	if (resetAuthorsAndAuthorBios) {
		await utils.resetAuthors()
		await utils.resetAuthorBios()
		resetAuthorsAndAuthorBios = false
	}
})

describe("SetBioOfAuthor endpoint", () => {
	it("should not set bio without access token", async () => {
		try {
			await axios({
				method: 'put',
				url: setBioOfAuthorEndpointUrl.replace('{0}', constants.davUser.authors[0].uuid).replace('{1}', "en"),
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

	it("should not set bio with access token for session that does not exist", async () => {
		try {
			await axios({
				method: 'put',
				url: setBioOfAuthorEndpointUrl.replace('{0}', constants.davUser.authors[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: "a",
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

	it("should not set bio without Content-Type json", async () => {
		try {
			await axios({
				method: 'put',
				url: setBioOfAuthorEndpointUrl.replace('{0}', constants.davUser.authors[0].uuid).replace('{1}', "en"),
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

	it("should not set bio with access token for another app", async () => {
		try {
			await axios({
				method: 'put',
				url: setBioOfAuthorEndpointUrl.replace('{0}', constants.davUser.authors[0].uuid).replace('{1}', "en"),
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

	it("should not set bio if the author does not belong to the user", async () => {
		try {
			await axios({
				method: 'put',
				url: setBioOfAuthorEndpointUrl.replace('{0}', constants.authorUser.author.uuid).replace('{1}', "en"),
				headers: {
					Authorization: constants.davUser.accessToken,
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

	it("should not set bio if the user is not an admin", async () => {
		try {
			await axios({
				method: 'put',
				url: setBioOfAuthorEndpointUrl.replace('{0}', constants.davUser.authors[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: constants.testUser.accessToken,
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

	it("should not set bio of author of user if the user is not an author", async () => {
		try {
			await axios({
				method: 'put',
				url: setBioOfAuthorEndpointUrl.replace('{0}', "mine").replace('{1}', "en"),
				headers: {
					Authorization: constants.testUser.accessToken,
					'Content-Type': 'application/json'
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

	it("should not set bio of author of user if the user is an admin", async () => {
		try {
			await axios({
				method: 'put',
				url: setBioOfAuthorEndpointUrl.replace('{0}', "mine").replace('{1}', "en"),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
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

	it("should not set bio without required properties", async () => {
		try {
			await axios({
				method: 'put',
				url: setBioOfAuthorEndpointUrl.replace('{0}', constants.davUser.authors[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.BioMissing)
			return
		}

		assert.fail()
	})

	it("should not set bio with properties with wrong types", async () => {
		try {
			await axios({
				method: 'put',
				url: setBioOfAuthorEndpointUrl.replace('{0}', constants.davUser.authors[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					bio: 12
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.BioWrongType)
			return
		}

		assert.fail()
	})

	it("should not set bio with too short properties", async () => {
		try {
			await axios({
				method: 'put',
				url: setBioOfAuthorEndpointUrl.replace('{0}', constants.davUser.authors[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					bio: "a"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.BioTooShort)
			return
		}

		assert.fail()
	})

	it("should not set bio with too long properties", async () => {
		try {
			await axios({
				method: 'put',
				url: setBioOfAuthorEndpointUrl.replace('{0}', constants.davUser.authors[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					bio: "a".repeat(2100)
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.BioTooLong)
			return
		}

		assert.fail()
	})

	it("should not set bio for not supported language", async () => {
		try {
			await axios({
				method: 'put',
				url: setBioOfAuthorEndpointUrl.replace('{0}', constants.davUser.authors[0].uuid).replace('{1}', "bl"),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					bio: "Hello World!!"
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

	it("should create bio for author", async () => {
		resetAuthorsAndAuthorBios = true
		let response
		let author = constants.davUser.authors[0]
		let language = "fr"
		let bio = "Hello World"

		try {
			response = await axios({
				method: 'put',
				url: setBioOfAuthorEndpointUrl.replace('{0}', author.uuid).replace('{1}', language),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				params: {
					fields: "*"
				},
				data: {
					bio
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 3)
		assert.isNotNull(response.data.uuid)
		assert.equal(response.data.bio, bio)
		assert.equal(response.data.language, language)

		// Check if the data was correctly saved on the server
		// Get the author
		let authorResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: author.uuid
		})

		assert.equal(authorResponse.status, 200)

		let responseAuthorBios = authorResponse.data.tableObject.GetPropertyValue("bios")
		let responseAuthorBioUuids = responseAuthorBios.split(',')

		let authorBioUuids = []
		author.bios.forEach(bio => authorBioUuids.push(bio.uuid))
		authorBioUuids.push(responseAuthorBioUuids[responseAuthorBioUuids.length - 1])
		let authorBios = authorBioUuids.join(',')

		assert.equal(responseAuthorBioUuids.length, authorBioUuids.length)
		assert.equal(responseAuthorBios, authorBios)

		// Get the AuthorBio
		let newAuthorBioUuid = responseAuthorBioUuids[responseAuthorBioUuids.length - 1]

		let authorBioResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: newAuthorBioUuid
		})

		assert.equal(authorBioResponse.status, 200)
		assert.equal(authorBioResponse.data.tableObject.Uuid, newAuthorBioUuid)
		assert.equal(authorBioResponse.data.tableObject.GetPropertyValue("bio"), bio)
		assert.equal(authorBioResponse.data.tableObject.GetPropertyValue("language"), language)
	})

	it("should update bio of author", async () => {
		resetAuthorsAndAuthorBios = true
		let response
		let author = constants.davUser.authors[0]
		let authorBio = author.bios[0]
		let authorBioUuid = authorBio.uuid
		let language = authorBio.language
		let bio = "Updated bio"

		try {
			response = await axios({
				method: 'put',
				url: setBioOfAuthorEndpointUrl.replace('{0}', author.uuid).replace('{1}', language),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				params: {
					fields: "*"
				},
				data: {
					bio
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 3)
		assert.isNotNull(response.data.uuid)
		assert.equal(response.data.bio, bio)
		assert.equal(response.data.language, language)

		// Check if the data was correctly updated on the server
		// Get the author
		let authorResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: author.uuid
		})

		assert.equal(authorResponse.status, 200)

		let responseAuthorBios = authorResponse.data.tableObject.GetPropertyValue("bios")
		let responseAuthorBioUuids = responseAuthorBios.split(',')

		let authorBioUuids = []
		author.bios.forEach(bio => authorBioUuids.push(bio.uuid))
		let authorBios = authorBioUuids.join(',')

		assert.equal(responseAuthorBioUuids.length, authorBioUuids.length)
		assert.equal(responseAuthorBios, authorBios)

		// Get the AuthorBio
		let authorBioResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: authorBioUuid
		})

		assert.equal(authorBioResponse.status, 200)
		assert.equal(authorBioResponse.data.tableObject.Uuid, authorBioUuid)
		assert.equal(authorBioResponse.data.tableObject.GetPropertyValue("bio"), bio)
		assert.equal(authorBioResponse.data.tableObject.GetPropertyValue("language"), language)
	})

	it("should create bio for author of user", async () => {
		resetAuthorsAndAuthorBios = true
		let response
		let language = "fr"
		let bio = "Hello World!!!"

		try {
			response = await axios({
				method: 'put',
				url: setBioOfAuthorEndpointUrl.replace('{0}', "mine").replace('{1}', language),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				params: {
					fields: "*"
				},
				data: {
					bio
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 3)
		assert.isNotNull(response.data.uuid)
		assert.equal(response.data.bio, bio)
		assert.equal(response.data.language, language)

		// Check if the data was correctly saved on the server
		// Get the author
		let authorResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: constants.authorUser.author.uuid
		})

		assert.equal(authorResponse.status, 200)

		let responseAuthorBios = authorResponse.data.tableObject.GetPropertyValue("bios")
		let responseAuthorBioUuids = responseAuthorBios.split(',')

		let authorBioUuids = []
		constants.authorUser.author.bios.forEach(bio => authorBioUuids.push(bio.uuid))
		authorBioUuids.push(responseAuthorBioUuids[responseAuthorBioUuids.length - 1])
		let authorBios = authorBioUuids.join(',')

		assert.equal(authorBioUuids.length, responseAuthorBioUuids.length)
		assert.equal(authorBios, responseAuthorBios)

		// Get the AuthorBio
		let newAuthorBioUuid = responseAuthorBioUuids[responseAuthorBioUuids.length - 1]

		let authorBioResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: newAuthorBioUuid
		})

		assert.equal(authorBioResponse.status, 200)
		assert.equal(authorBioResponse.data.tableObject.Uuid, newAuthorBioUuid)
		assert.equal(authorBioResponse.data.tableObject.GetPropertyValue("bio"), bio)
		assert.equal(authorBioResponse.data.tableObject.GetPropertyValue("language"), language)
	})

	it("should update bio of author of user", async () => {
		resetAuthorsAndAuthorBios = true
		let response
		let authorBio = constants.authorUser.author.bios[0]
		let authorBioUuid = authorBio.uuid
		let language = authorBio.language
		let bio = "Updated bio!"

		try {
			response = await axios({
				method: 'put',
				url: setBioOfAuthorEndpointUrl.replace('{0}', "mine").replace('{1}', language),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				params: {
					fields: "*"
				},
				data: {
					bio
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 3)
		assert.isNotNull(response.data.uuid)
		assert.equal(response.data.bio, bio)
		assert.equal(response.data.language, language)

		// Check if the data was correctly updated on the server
		// Get the author
		let authorResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: constants.authorUser.author.uuid
		})

		assert.equal(authorResponse.status, 200)

		let responseAuthorBios = authorResponse.data.tableObject.GetPropertyValue("bios")
		let responseAuthorBioUuids = responseAuthorBios.split(',')

		let authorBioUuids = []
		constants.authorUser.author.bios.forEach(bio => authorBioUuids.push(bio.uuid))
		let authorBios = authorBioUuids.join(',')

		assert.equal(responseAuthorBioUuids.length, authorBioUuids.length)
		assert.equal(responseAuthorBios, authorBios)

		// Get the AuthorBio
		let authorBioResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: authorBioUuid
		})

		assert.equal(authorBioResponse.status, 200)
		assert.equal(authorBioUuid, authorBioResponse.data.tableObject.Uuid)
		assert.equal(bio, authorBioResponse.data.tableObject.GetPropertyValue("bio"))
		assert.equal(language, authorBioResponse.data.tableObject.GetPropertyValue("language"))
	})
})