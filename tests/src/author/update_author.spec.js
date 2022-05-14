import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import { TableObjectsController } from 'dav-js'
import constants from '../constants.js'
import * as utils from '../utils.js'
import * as ErrorCodes from '../errorCodes.js'

const updateAuthorEndpointUrl = `${constants.apiBaseUrl}/authors/{0}`
var resetAuthors = false

afterEach(async () => {
	if (resetAuthors) {
		await utils.resetAuthors()
		resetAuthors = false
	}
})

describe("UpdateAuthor endpoint", () => {
	it("should not update author without access token", async () => {
		try {
			await axios({
				method: 'put',
				url: updateAuthorEndpointUrl.replace('{0}', constants.davUser.authors[0].uuid),
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

	it("should not update author with access token for session that does not exist", async () => {
		try {
			await axios({
				method: 'put',
				url: updateAuthorEndpointUrl.replace('{0}', constants.davUser.authors[0].uuid),
				headers: {
					Authorization: 'asodasfobasf',
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

	it("should not update author without Content-Type json", async () => {
		try {
			await axios({
				method: 'put',
				url: updateAuthorEndpointUrl.replace('{0}', constants.davUser.authors[0].uuid),
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

	it("should not update author with access token for another app", async () => {
		try {
			await axios({
				method: 'put',
				url: updateAuthorEndpointUrl.replace('{0}', constants.davUser.authors[0].uuid),
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

	it("should not update author if the user is not an admin", async () => {
		try {
			await axios({
				method: 'put',
				url: updateAuthorEndpointUrl.replace('{0}', constants.davUser.authors[0].uuid),
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

	it("should not update author if the author does not belong to the user", async () => {
		try {
			await axios({
				method: 'put',
				url: updateAuthorEndpointUrl.replace('{0}', constants.authorUser.author.uuid),
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

	it("should not update author of user if the user is an admin", async () => {
		try {
			await axios({
				method: 'put',
				url: updateAuthorEndpointUrl.replace('{0}', "mine"),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: "Blabla"
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

	it("should not update author of user if the user is not an author", async () => {
		try {
			await axios({
				method: 'put',
				url: updateAuthorEndpointUrl.replace('{0}', "mine"),
				headers: {
					Authorization: constants.testUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: "Blabla"
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

	it("should not update author with properties with wrong types", async () => {
		try {
			await axios({
				method: 'put',
				url: updateAuthorEndpointUrl.replace('{0}', constants.davUser.authors[0].uuid),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: true,
					last_name: 21,
					website_url: false,
					facebook_username: 12.34,
					instagram_username: 54,
					twitter_username: true
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 6)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.FirstNameWrongType)
			assert.equal(error.response.data.errors[1].code, ErrorCodes.LastNameWrongType)
			assert.equal(error.response.data.errors[2].code, ErrorCodes.WebsiteUrlWrongType)
			assert.equal(error.response.data.errors[3].code, ErrorCodes.FacebookUsernameWrongType)
			assert.equal(error.response.data.errors[4].code, ErrorCodes.InstagramUsernameWrongType)
			assert.equal(error.response.data.errors[5].code, ErrorCodes.TwitterUsernameWrongType)
			return
		}

		assert.fail()
	})

	it("should not update author with too short properties", async () => {
		try {
			await axios({
				method: 'put',
				url: updateAuthorEndpointUrl.replace('{0}', constants.davUser.authors[0].uuid),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: "a",
					last_name: "b"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 2)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.FirstNameTooShort)
			assert.equal(error.response.data.errors[1].code, ErrorCodes.LastNameTooShort)
			return
		}

		assert.fail()
	})

	it("should not update author with too long properties", async () => {
		try {
			await axios({
				method: 'put',
				url: updateAuthorEndpointUrl.replace('{0}', constants.davUser.authors[0].uuid),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: "a".repeat(30),
					last_name: "b".repeat(30)
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 2)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.FirstNameTooLong)
			assert.equal(error.response.data.errors[1].code, ErrorCodes.LastNameTooLong)
			return
		}

		assert.fail()
	})

	it("should not update author with invalid properties", async () => {
		try {
			await axios({
				method: 'put',
				url: updateAuthorEndpointUrl.replace('{0}', constants.davUser.authors[0].uuid),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					website_url: "asdasd",
					facebook_username: "alns<#+. asd",
					instagram_username: "a<x-",
					twitter_username: "<<>>---++ä+ä+ß20ß23ik"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 4)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.WebsiteUrlInvalid)
			assert.equal(error.response.data.errors[1].code, ErrorCodes.FacebookUsernameInvalid)
			assert.equal(error.response.data.errors[2].code, ErrorCodes.InstagramUsernameInvalid)
			assert.equal(error.response.data.errors[3].code, ErrorCodes.TwitterUsernameInvalid)
			return
		}

		assert.fail()
	})

	it("should update first_name of author", async () => {
		resetAuthors = true
		let author = constants.davUser.authors[0]
		let firstName = "Updated name"
		let response

		try {
			response = await axios({
				method: 'put',
				url: updateAuthorEndpointUrl.replace('{0}', author.uuid),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				params: {
					fields: "*"
				},
				data: {
					first_name: firstName
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 10)
		assert.equal(response.data.uuid, author.uuid)
		assert.isNull(response.data.publisher)
		assert.equal(response.data.first_name, firstName)
		assert.equal(response.data.last_name, author.lastName)
		assert.equal(response.data.website_url, author.websiteUrl)
		assert.equal(response.data.facebook_username, author.facebookUsername)
		assert.equal(response.data.instagram_username, author.instagramUsername)
		assert.equal(response.data.twitter_username, author.twitterUsername)
		assert.equal(response.data.profile_image?.blurhash, author.profileImageItem.blurhash)

		if (author.bios.length == 0) {
			assert.isNull(response.data.bios)
		} else {
			let authorBio = author.bios.find(b => b.language == "en")

			assert.isNotNull(authorBio)
			assert.equal(response.data.bio.language, "en")
			assert.equal(response.data.bio.value, authorBio.bio)
		}

		// Check if the data was updated correctly on the server
		let objResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: author.uuid
		})

		assert.equal(objResponse.status, 200)
		assert.equal(objResponse.data.tableObject.Uuid, author.uuid)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("first_name"), firstName)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("last_name"), author.lastName)
	})

	it("should update first_name of author with specified language", async () => {
		resetAuthors = true
		let author = constants.davUser.authors[0]
		let firstName = "Updated name"
		let language = "de"
		let response

		try {
			response = await axios({
				method: 'put',
				url: updateAuthorEndpointUrl.replace('{0}', author.uuid),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				params: {
					fields: "*",
					languages: language
				},
				data: {
					first_name: firstName
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 10)
		assert.equal(response.data.uuid, author.uuid)
		assert.isNull(response.data.publisher)
		assert.equal(response.data.first_name, firstName)
		assert.equal(response.data.last_name, author.lastName)
		assert.equal(response.data.website_url, author.websiteUrl)
		assert.equal(response.data.facebook_username, author.facebookUsername)
		assert.equal(response.data.instagram_username, author.instagramUsername)
		assert.equal(response.data.twitter_username, author.twitterUsername)
		assert.equal(response.data.profile_image?.blurhash, author.profileImageItem.blurhash)

		if (author.bios.length == 0) {
			assert.isNull(response.data.bios)
		} else {
			let authorBio = author.bios.find(b => b.language == language)

			if (authorBio == null) {
				assert.equal(response.data.bio.language, "en")

				authorBio = author.bios.find(b => b.language == "en")

				assert.isNotNull(authorBio)
				assert.equal(response.data.bio.value, authorBio.bio)
			} else {
				assert.equal(response.data.bio.language, language)
				assert.equal(response.data.bio.value, authorBio.bio)
			}
		}

		// Check if the data was updated correctly on the server
		let objResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: author.uuid
		})

		assert.equal(objResponse.status, 200)
		assert.equal(objResponse.data.tableObject.Uuid, author.uuid)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("first_name"), firstName)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("last_name"), author.lastName)
	})

	it("should update last_name of author", async () => {
		resetAuthors = true
		let author = constants.davUser.authors[0]
		let lastName = "Updated name"
		let response

		try {
			response = await axios({
				method: 'put',
				url: updateAuthorEndpointUrl.replace('{0}', author.uuid),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				params: {
					fields: "*"
				},
				data: {
					last_name: lastName
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 10)
		assert.equal(response.data.uuid, author.uuid)
		assert.isNull(response.data.publisher)
		assert.equal(response.data.first_name, author.firstName)
		assert.equal(response.data.last_name, lastName)
		assert.equal(response.data.website_url, author.websiteUrl)
		assert.equal(response.data.facebook_username, author.facebookUsername)
		assert.equal(response.data.instagram_username, author.instagramUsername)
		assert.equal(response.data.twitter_username, author.twitterUsername)
		assert.equal(response.data.profile_image?.blurhash, author.profileImageItem.blurhash)

		if (author.bios.length == 0) {
			assert.isNull(response.data.bios)
		} else {
			let authorBio = author.bios.find(b => b.language == "en")

			assert.isNotNull(authorBio)
			assert.equal(response.data.bio.language, "en")
			assert.equal(response.data.bio.value, authorBio.bio)
		}

		// Check if the data was updated correctly on the server
		let objResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: author.uuid
		})

		assert.equal(objResponse.status, 200)
		assert.equal(objResponse.data.tableObject.Uuid, author.uuid)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("first_name"), author.firstName)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("last_name"), lastName)
	})

	it("should update website_url, facebook_username, instagram_username and twitter_username of author", async () => {
		resetAuthors = true
		let author = constants.davUser.authors[0]
		let websiteUrl = "https://example.com"
		let facebookUsername = "facebookusernametest"
		let instagramUsername = "instagramusernametest"
		let twitterUsername = "twitterusernametest"
		let response

		try {
			response = await axios({
				method: 'put',
				url: updateAuthorEndpointUrl.replace('{0}', author.uuid),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				params: {
					fields: "*"
				},
				data: {
					website_url: websiteUrl,
					facebook_username: `http://facebook.com/${facebookUsername}`,
					instagram_username: `www.instagram.com/${instagramUsername}/`,
					twitter_username: `@${twitterUsername}`
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 10)
		assert.equal(response.data.uuid, author.uuid)
		assert.isNull(response.data.publisher)
		assert.equal(response.data.first_name, author.firstName)
		assert.equal(response.data.last_name, author.lastName)
		assert.equal(response.data.website_url, websiteUrl)
		assert.equal(response.data.facebook_username, facebookUsername)
		assert.equal(response.data.instagram_username, instagramUsername)
		assert.equal(response.data.twitter_username, twitterUsername)
		assert.equal(response.data.profile_image?.blurhash, author.profileImageItem.blurhash)

		if (author.bios.length == 0) {
			assert.isNull(response.data.bios)
		} else {
			let authorBio = author.bios.find(b => b.language == "en")

			assert.isNotNull(authorBio)
			assert.equal(response.data.bio.language, "en")
			assert.equal(response.data.bio.value, authorBio.bio)
		}

		// Check if the data was updated correctly on the server
		let objResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: author.uuid
		})

		assert.equal(objResponse.status, 200)
		assert.equal(objResponse.data.tableObject.Uuid, author.uuid)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("website_url"), websiteUrl)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("facebook_username"), facebookUsername)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("instagram_username"), instagramUsername)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("twitter_username"), twitterUsername)

		// Remove the website_url and usernames with empty strings
		try {
			response = await axios({
				method: 'put',
				url: updateAuthorEndpointUrl.replace('{0}', author.uuid),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				params: {
					fields: "*"
				},
				data: {
					website_url: "",
					facebook_username: "",
					instagram_username: "",
					twitter_username: ""
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 10)
		assert.equal(response.data.uuid, author.uuid)
		assert.isNull(response.data.website_url)
		assert.isNull(response.data.facebook_username)
		assert.isNull(response.data.instagram_username)
		assert.isNull(response.data.twitter_username)
	})

	it("should update all properties of author", async () => {
		resetAuthors = true
		let author = constants.davUser.authors[0]
		let firstName = "updated first name"
		let lastName = "updated last name"
		let websiteUrl = "https://test.example-test.de"
		let facebookUsername = "facebookusernametesttest"
		let instagramUsername = "instagramusernametesttest"
		let twitterUsername = "twitterusernametesttest"
		let response

		try {
			response = await axios({
				method: 'put',
				url: updateAuthorEndpointUrl.replace('{0}', author.uuid),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				params: {
					fields: "*"
				},
				data: {
					first_name: firstName,
					last_name: lastName,
					website_url: websiteUrl,
					facebook_username: `@${facebookUsername}`,
					instagram_username: `http://instagram.com/${instagramUsername}`,
					twitter_username: `twitter.com/${twitterUsername}`
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 10)
		assert.equal(response.data.uuid, author.uuid)
		assert.isNull(response.data.publisher)
		assert.equal(response.data.first_name, firstName)
		assert.equal(response.data.last_name, lastName)
		assert.equal(response.data.website_url, websiteUrl)
		assert.equal(response.data.facebook_username, facebookUsername)
		assert.equal(response.data.instagram_username, instagramUsername)
		assert.equal(response.data.twitter_username, twitterUsername)
		assert.equal(response.data.profile_image?.blurhash, author.profileImageItem.blurhash)

		// Check if the data was updated correctly on the server
		let objResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: author.uuid
		})

		assert.equal(objResponse.status, 200)
		assert.equal(objResponse.data.tableObject.Uuid, author.uuid)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("first_name"), firstName)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("last_name"), lastName)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("website_url"), websiteUrl)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("facebook_username"), facebookUsername)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("instagram_username"), instagramUsername)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("twitter_username"), twitterUsername)
	})

	it("should update first_name of author of user", async () => {
		resetAuthors = true
		let author = constants.authorUser.author
		let firstName = "Updated name"
		let response

		try {
			response = await axios({
				method: 'put',
				url: updateAuthorEndpointUrl.replace('{0}', "mine"),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				params: {
					fields: "*"
				},
				data: {
					first_name: firstName
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 10)
		assert.equal(response.data.uuid, author.uuid)
		assert.isNull(response.data.publisher)
		assert.equal(response.data.first_name, firstName)
		assert.equal(response.data.last_name, author.lastName)
		assert.equal(response.data.website_url, author.websiteUrl)
		assert.equal(response.data.facebook_username, author.facebookUsername)
		assert.equal(response.data.instagram_username, author.instagramUsername)
		assert.equal(response.data.twitter_username, author.twitterUsername)
		assert.equal(response.data.profile_image?.blurhash, author.profileImageItem.blurhash)

		if (author.bios.length == 0) {
			assert.isNull(response.data.bios)
		} else {
			let authorBio = author.bios.find(b => b.language == "en")

			assert.isNotNull(authorBio)
			assert.equal(response.data.bio.language, "en")
			assert.equal(response.data.bio.value, authorBio.bio)
		}

		// Check if the data was updated correctly on the server
		let objResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: author.uuid
		})

		assert.equal(objResponse.status, 200)
		assert.equal(objResponse.data.tableObject.Uuid, author.uuid)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("first_name"), firstName)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("last_name"), author.lastName)
	})

	it("should update first_name of author of user with specified language", async () => {
		resetAuthors = true
		let author = constants.authorUser.author
		let firstName = "Updated name"
		let language = "de"
		let response

		try {
			response = await axios({
				method: 'put',
				url: updateAuthorEndpointUrl.replace('{0}', "mine"),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				params: {
					fields: "*",
					languages: language
				},
				data: {
					first_name: firstName
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 10)
		assert.equal(response.data.uuid, author.uuid)
		assert.isNull(response.data.publisher)
		assert.equal(response.data.first_name, firstName)
		assert.equal(response.data.last_name, author.lastName)
		assert.equal(response.data.website_url, author.websiteUrl)
		assert.equal(response.data.facebook_username, author.facebookUsername)
		assert.equal(response.data.instagram_username, author.instagramUsername)
		assert.equal(response.data.twitter_username, author.twitterUsername)
		assert.equal(response.data.profile_image?.blurhash, author.profileImageItem.blurhash)

		if (author.bios.length == 0) {
			assert.isNull(response.data.bios)
		} else {
			let authorBio = author.bios.find(b => b.language == language)

			if (authorBio == null) {
				assert.equal(response.data.bio.language, "en")

				authorBio = author.bios.find(b => b.language == "en")

				assert.isNotNull(authorBio)
				assert.equal(response.data.bio.value, authorBio.bio)
			} else {
				assert.equal(response.data.bio.language, language)
				assert.equal(response.data.bio.value, authorBio.bio)
			}
		}

		// Check if the data was updated correctly on the server
		let objResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: author.uuid
		})

		assert.equal(objResponse.status, 200)
		assert.equal(objResponse.data.tableObject.Uuid, author.uuid)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("first_name"), firstName)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("last_name"), author.lastName)
	})

	it("should update last_name of author of user", async () => {
		resetAuthors = true
		let author = constants.authorUser.author
		let lastName = "Updated name"
		let response

		try {
			response = await axios({
				method: 'put',
				url: updateAuthorEndpointUrl.replace('{0}', "mine"),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				params: {
					fields: "*"
				},
				data: {
					last_name: lastName
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 10)
		assert.equal(response.data.uuid, author.uuid)
		assert.isNull(response.data.publisher)
		assert.equal(response.data.first_name, author.firstName)
		assert.equal(response.data.last_name, lastName)
		assert.equal(response.data.website_url, author.websiteUrl)
		assert.equal(response.data.facebook_username, author.facebookUsername)
		assert.equal(response.data.instagram_username, author.instagramUsername)
		assert.equal(response.data.twitter_username, author.twitterUsername)
		assert.equal(response.data.profile_image?.blurhash, author.profileImageItem.blurhash)

		if (author.bios.length == 0) {
			assert.isNull(response.data.bios)
		} else {
			let authorBio = author.bios.find(b => b.language == "en")

			assert.isNotNull(authorBio)
			assert.equal(response.data.bio.language, "en")
			assert.equal(response.data.bio.value, authorBio.bio)
		}

		// Check if the data was updated correctly on the server
		let objResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: author.uuid
		})

		assert.equal(objResponse.status, 200)
		assert.equal(objResponse.data.tableObject.Uuid, author.uuid)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("first_name"), author.firstName)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("last_name"), lastName)
	})

	it("should update website_url, facebook_username, instagram_username and twitter_username of author of user", async () => {
		resetAuthors = true
		let author = constants.authorUser.author
		let websiteUrl = "https://example.com"
		let facebookUsername = "facebookusernametest"
		let instagramUsername = "instagramusernametest"
		let twitterUsername = "twitterusernametest"
		let response

		try {
			response = await axios({
				method: 'put',
				url: updateAuthorEndpointUrl.replace('{0}', "mine"),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				params: {
					fields: "*"
				},
				data: {
					website_url: websiteUrl,
					facebook_username: `http://facebook.com/${facebookUsername}`,
					instagram_username: `www.instagram.com/${instagramUsername}/`,
					twitter_username: `@${twitterUsername}`
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 10)
		assert.equal(response.data.uuid, author.uuid)
		assert.isNull(response.data.publisher)
		assert.equal(response.data.first_name, author.firstName)
		assert.equal(response.data.last_name, author.lastName)
		assert.equal(response.data.website_url, websiteUrl)
		assert.equal(response.data.facebook_username, facebookUsername)
		assert.equal(response.data.instagram_username, instagramUsername)
		assert.equal(response.data.twitter_username, twitterUsername)
		assert.equal(response.data.profile_image?.blurhash, author.profileImageItem.blurhash)

		if (author.bios.length == 0) {
			assert.isNull(response.data.bios)
		} else {
			let authorBio = author.bios.find(b => b.language == "en")

			assert.isNotNull(authorBio)
			assert.equal(response.data.bio.language, "en")
			assert.equal(response.data.bio.value, authorBio.bio)
		}

		// Check if the data was updated correctly on the server
		let objResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: author.uuid
		})

		assert.equal(objResponse.status, 200)
		assert.equal(objResponse.data.tableObject.Uuid, author.uuid)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("website_url"), websiteUrl)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("facebook_username"), facebookUsername)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("instagram_username"), instagramUsername)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("twitter_username"), twitterUsername)

		// Remove the website_url and usernames with empty strings
		try {
			response = await axios({
				method: 'put',
				url: updateAuthorEndpointUrl.replace('{0}', "mine"),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				params: {
					fields: "*"
				},
				data: {
					website_url: "",
					facebook_username: "",
					instagram_username: "",
					twitter_username: ""
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 10)
		assert.equal(response.data.uuid, author.uuid)
		assert.isNull(response.data.website_url)
		assert.isNull(response.data.facebook_username)
		assert.isNull(response.data.instagram_username)
		assert.isNull(response.data.twitter_username)
	})

	it("should update all properties of author of user", async () => {
		resetAuthors = true
		let author = constants.authorUser.author
		let firstName = "updated first name"
		let lastName = "updated last name"
		let websiteUrl = "https://test.example-test.de"
		let facebookUsername = "facebookusernametesttest"
		let instagramUsername = "instagramusernametesttest"
		let twitterUsername = "twitterusernametesttest"
		let response

		try {
			response = await axios({
				method: 'put',
				url: updateAuthorEndpointUrl.replace('{0}', "mine"),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				params: {
					fields: "*"
				},
				data: {
					first_name: firstName,
					last_name: lastName,
					website_url: websiteUrl,
					facebook_username: `@${facebookUsername}`,
					instagram_username: `http://instagram.com/${instagramUsername}`,
					twitter_username: `twitter.com/${twitterUsername}`
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 10)
		assert.equal(response.data.uuid, author.uuid)
		assert.isNull(response.data.publisher)
		assert.equal(response.data.first_name, firstName)
		assert.equal(response.data.last_name, lastName)
		assert.equal(response.data.website_url, websiteUrl)
		assert.equal(response.data.facebook_username, facebookUsername)
		assert.equal(response.data.instagram_username, instagramUsername)
		assert.equal(response.data.twitter_username, twitterUsername)
		assert.equal(response.data.profile_image?.blurhash, author.profileImageItem.blurhash)

		// Check if the data was updated correctly on the server
		let objResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: author.uuid
		})

		assert.equal(objResponse.status, 200)
		assert.equal(objResponse.data.tableObject.Uuid, author.uuid)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("first_name"), firstName)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("last_name"), lastName)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("website_url"), websiteUrl)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("facebook_username"), facebookUsername)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("instagram_username"), instagramUsername)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("twitter_username"), twitterUsername)
	})
})