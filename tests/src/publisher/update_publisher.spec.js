import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import { TableObjectsController } from 'dav-js'
import constants from '../constants.js'
import * as utils from '../utils.js'
import * as ErrorCodes from '../errorCodes.js'

const updatePublisherEndpointUrl = `${constants.apiBaseUrl}/publishers/{0}`
var resetPublishers = false

afterEach(async () => {
	if (resetPublishers) {
		await utils.resetPublishers()
		resetPublishers = false
	}
})

describe("UpdatePublisher endpoint", () => {
	it("should not update publisher without access token", async () => {
		try {
			await axios({
				method: 'put',
				url: updatePublisherEndpointUrl.replace('{0}', constants.davUser.publishers[0].uuid),
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

	it("should not update publisher with access token for session that does not exist", async () => {
		try {
			await axios({
				method: 'put',
				url: updatePublisherEndpointUrl.replace('{0}', constants.davUser.publishers[0].uuid),
				headers: {
					Authorization: "asdasd",
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

	it("should not update publisher without Content-Type json", async () => {
		try {
			await axios({
				method: 'put',
				url: updatePublisherEndpointUrl.replace('{0}', constants.davUser.publishers[0].uuid),
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

	it("should not update publisher with access token for another app", async () => {
		try {
			await axios({
				method: 'put',
				url: updatePublisherEndpointUrl.replace('{0}', constants.davUser.publishers[0].uuid),
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

	it("should not update publisher if the user is not an admin", async () => {
		try {
			await axios({
				method: 'put',
				url: updatePublisherEndpointUrl.replace('{0}', constants.davUser.publishers[0].uuid),
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

	it("should not update publisher if the publisher does not belong to the user", async () => {
		try {
			await axios({
				method: 'put',
				url: updatePublisherEndpointUrl.replace('{0}', constants.authorUser.publisher.uuid),
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

	it("should not update publisher of user if the user is an admin", async () => {
		try {
			await axios({
				method: 'put',
				url: updatePublisherEndpointUrl.replace('{0}', "mine"),
				headers: {
					Authorization: constants.davUser.accessToken,
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

	it("should not update publisher of user if the user is not a publisher", async () => {
		try {
			await axios({
				method: 'put',
				url: updatePublisherEndpointUrl.replace('{0}', "mine"),
				headers: {
					Authorization: constants.testUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					name: "Test"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.UserIsNotPublisher)
			return
		}

		assert.fail()
	})

	it("should not update publisher with properties with wrong types", async () => {
		try {
			await axios({
				method: 'put',
				url: updatePublisherEndpointUrl.replace('{0}', constants.davUser.publishers[0].uuid),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					name: 234,
					description: true,
					website_url: false,
					facebook_username: 1.234,
					instagram_username: true,
					twitter_username: []
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 6)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.NameWrongType)
			assert.equal(error.response.data.errors[1].code, ErrorCodes.DescriptionWrongType)
			assert.equal(error.response.data.errors[2].code, ErrorCodes.WebsiteUrlWrongType)
			assert.equal(error.response.data.errors[3].code, ErrorCodes.FacebookUsernameWrongType)
			assert.equal(error.response.data.errors[4].code, ErrorCodes.InstagramUsernameWrongType)
			assert.equal(error.response.data.errors[5].code, ErrorCodes.TwitterUsernameWrongType)
			return
		}

		assert.fail()
	})

	it("should not update publisher with too short properties", async () => {
		try {
			await axios({
				method: 'put',
				url: updatePublisherEndpointUrl.replace('{0}', constants.davUser.publishers[0].uuid),
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

	it("should not update publisher with too long properties", async () => {
		try {
			await axios({
				method: 'put',
				url: updatePublisherEndpointUrl.replace('{0}', constants.davUser.publishers[0].uuid),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					name: "a".repeat(200)
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

	it("should not update publisher with invalid properties", async () => {
		try {
			await axios({
				method: 'put',
				url: updatePublisherEndpointUrl.replace('{0}', constants.davUser.publishers[0].uuid),
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

	it("should update name of publisher", async () => {
		resetPublishers = true
		let publisher = constants.davUser.publishers[0]
		let name = "Updated name"
		let response

		try {
			response = await axios({
				method: 'put',
				url: updatePublisherEndpointUrl.replace('{0}', publisher.uuid),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				params: {
					fields: "*"
				},
				data: {
					name
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 8)
		assert.equal(response.data.uuid, publisher.uuid)
		assert.equal(response.data.name, name)
		assert.equal(response.data.description, publisher.description)
		assert.equal(response.data.website_url, publisher.websiteUrl)
		assert.equal(response.data.facebook_username, publisher.facebookUsername)
		assert.equal(response.data.instagram_username, publisher.instagramUsername)
		assert.equal(response.data.twitter_username, publisher.twitterUsername)
		if (publisher.logoItem) assert.isNotNull(response.data.logo?.url)
		assert.equal(response.data.logo?.blurhash, publisher.logoItem?.blurhash)

		// Check if the data was updated correctly on the server
		let objResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: publisher.uuid
		})

		assert.equal(objResponse.status, 200)
		assert.equal(objResponse.data.tableObject.Uuid, publisher.uuid)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("name"), name)
	})

	it("should update description of publisher", async () => {
		resetPublishers = true
		let publisher = constants.davUser.publishers[0]
		let description = "Updated description"
		let response

		try {
			response = await axios({
				method: 'put',
				url: updatePublisherEndpointUrl.replace('{0}', publisher.uuid),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				params: {
					fields: "*"
				},
				data: {
					description
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 8)
		assert.equal(response.data.uuid, publisher.uuid)
		assert.equal(response.data.name, publisher.name)
		assert.equal(response.data.description, description)
		assert.equal(response.data.website_url, publisher.websiteUrl)
		assert.equal(response.data.facebook_username, publisher.facebookUsername)
		assert.equal(response.data.instagram_username, publisher.instagramUsername)
		assert.equal(response.data.twitter_username, publisher.twitterUsername)
		if (publisher.logoItem) assert.isNotNull(response.data.logo?.url)
		assert.equal(response.data.logo?.blurhash, publisher.logoItem?.blurhash)

		// Check if the data was updated correctly on the server
		let objResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: publisher.uuid
		})

		assert.equal(objResponse.status, 200)
		assert.equal(objResponse.data.tableObject.Uuid, publisher.uuid)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("description"), description)
	})

	it("should update website_url, facebook_username, instagram_username and twitter_username of publisher", async () => {
		resetPublishers = true
		let publisher = constants.davUser.publishers[0]
		let websiteUrl = "https://example.com"
		let facebookUsername = "facebookusernametest"
		let instagramUsername = "instagramusernametest"
		let twitterUsername = "twitterusernametest"
		let response

		try {
			response = await axios({
				method: 'put',
				url: updatePublisherEndpointUrl.replace('{0}', publisher.uuid),
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
		assert.equal(Object.keys(response.data).length, 8)
		assert.equal(response.data.uuid, publisher.uuid)
		assert.equal(response.data.name, publisher.name)
		assert.equal(response.data.description, publisher.description)
		assert.equal(response.data.website_url, websiteUrl)
		assert.equal(response.data.facebook_username, facebookUsername)
		assert.equal(response.data.instagram_username, instagramUsername)
		assert.equal(response.data.twitter_username, twitterUsername)
		if (publisher.logoItem) assert.isNotNull(response.data.logo?.url)
		assert.equal(response.data.logo?.blurhash, publisher.logoItem?.blurhash)

		// Check if the data was updated correctly on the server
		let objResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: publisher.uuid
		})

		assert.equal(objResponse.status, 200)
		assert.equal(objResponse.data.tableObject.Uuid, publisher.uuid)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("website_url"), websiteUrl)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("facebook_username"), facebookUsername)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("instagram_username"), instagramUsername)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("twitter_username"), twitterUsername)

		// Remove the website_url and usernames with empty string
		try {
			response = await axios({
				method: 'put',
				url: updatePublisherEndpointUrl.replace('{0}', publisher.uuid),
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
		assert.equal(Object.keys(response.data).length, 8)
		assert.equal(response.data.uuid, publisher.uuid)
		assert.isNull(response.data.website_url)
		assert.isNull(response.data.facebook_username)
		assert.isNull(response.data.instagram_username)
		assert.isNull(response.data.twitter_username)
	})

	it("should update all properties of publisher", async () => {
		resetPublishers = true
		let publisher = constants.davUser.publishers[0]
		let name = "Updated name"
		let description = "Updated description"
		let websiteUrl = "https://test.example-test.de"
		let facebookUsername = "facebookusernametesttest"
		let instagramUsername = "instagramusernametesttest"
		let twitterUsername = "twitterusernametesttest"
		let response

		try {
			response = await axios({
				method: 'put',
				url: updatePublisherEndpointUrl.replace('{0}', publisher.uuid),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				params: {
					fields: "*"
				},
				data: {
					name,
					description,
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
		assert.equal(Object.keys(response.data).length, 8)
		assert.equal(response.data.uuid, publisher.uuid)
		assert.equal(response.data.name, name)
		assert.equal(response.data.description, description)
		assert.equal(response.data.website_url, websiteUrl)
		assert.equal(response.data.facebook_username, facebookUsername)
		assert.equal(response.data.instagram_username, instagramUsername)
		assert.equal(response.data.twitter_username, twitterUsername)
		if (publisher.logoItem) assert.isNotNull(response.data.logo?.url)
		assert.equal(response.data.logo?.blurhash, publisher.logoItem?.blurhash)

		// Check if the data was updated correctly on the server
		let objResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: publisher.uuid
		})

		assert.equal(objResponse.status, 200)
		assert.equal(objResponse.data.tableObject.Uuid, publisher.uuid)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("name"), name)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("description"), description)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("website_url"), websiteUrl)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("facebook_username"), facebookUsername)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("instagram_username"), instagramUsername)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("twitter_username"), twitterUsername)
	})

	it("should update name of publisher of user", async () => {
		resetPublishers = true
		let publisher = constants.authorUser.publisher
		let name = "Updated name"
		let response

		try {
			response = await axios({
				method: 'put',
				url: updatePublisherEndpointUrl.replace('{0}', "mine"),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				params: {
					fields: "*"
				},
				data: {
					name
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 8)
		assert.equal(response.data.uuid, publisher.uuid)
		assert.equal(response.data.name, name)
		assert.equal(response.data.description, publisher.description)
		assert.equal(response.data.website_url, publisher.websiteUrl)
		assert.equal(response.data.facebook_username, publisher.facebookUsername)
		assert.equal(response.data.instagram_username, publisher.instagramUsername)
		assert.equal(response.data.twitter_username, publisher.twitterUsername)
		if (publisher.logoItem) assert.isNotNull(response.data.logo?.url)
		assert.equal(response.data.logo?.blurhash, publisher.logoItem?.blurhash)

		// Check if the data was updated correctly on the server
		let objResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: publisher.uuid
		})

		assert.equal(objResponse.status, 200)
		assert.equal(objResponse.data.tableObject.Uuid, publisher.uuid)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("name"), name)
	})

	it("should update description of publisher of user", async () => {
		resetPublishers = true
		let publisher = constants.authorUser.publisher
		let description = "Updated description"
		let response

		try {
			response = await axios({
				method: 'put',
				url: updatePublisherEndpointUrl.replace('{0}', "mine"),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				params: {
					fields: "*"
				},
				data: {
					description
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 8)
		assert.equal(response.data.uuid, publisher.uuid)
		assert.equal(response.data.name, publisher.name)
		assert.equal(response.data.description, description)
		assert.equal(response.data.website_url, publisher.websiteUrl)
		assert.equal(response.data.facebook_username, publisher.facebookUsername)
		assert.equal(response.data.instagram_username, publisher.instagramUsername)
		assert.equal(response.data.twitter_username, publisher.twitterUsername)
		if (publisher.logoItem) assert.isNotNull(response.data.logo?.url)
		assert.equal(response.data.logo?.blurhash, publisher.logoItem?.blurhash)

		// Check if the data was updated correctly on the server
		let objResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: publisher.uuid
		})

		assert.equal(objResponse.status, 200)
		assert.equal(objResponse.data.tableObject.Uuid, publisher.uuid)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("description"), description)
	})

	it("should update website_url, facebook_username, instagram_username and twitter_username of publisher of user", async () => {
		resetPublishers = true
		let publisher = constants.authorUser.publisher
		let websiteUrl = "https://example.com"
		let facebookUsername = "facebookusernametest"
		let instagramUsername = "instagramusernametest"
		let twitterUsername = "twitterusernametest"
		let response

		try {
			response = await axios({
				method: 'put',
				url: updatePublisherEndpointUrl.replace('{0}', "mine"),
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
		assert.equal(Object.keys(response.data).length, 8)
		assert.equal(response.data.uuid, publisher.uuid)
		assert.equal(response.data.name, publisher.name)
		assert.equal(response.data.description, publisher.description)
		assert.equal(response.data.website_url, websiteUrl)
		assert.equal(response.data.facebook_username, facebookUsername)
		assert.equal(response.data.instagram_username, instagramUsername)
		assert.equal(response.data.twitter_username, twitterUsername)
		if (publisher.logoItem) assert.isNotNull(response.data.logo?.url)
		assert.equal(response.data.logo?.blurhash, publisher.logoItem?.blurhash)

		// Check if the data was updated correctly on the server
		let objResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: publisher.uuid
		})

		assert.equal(objResponse.status, 200)
		assert.equal(objResponse.data.tableObject.Uuid, publisher.uuid)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("website_url"), websiteUrl)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("facebook_username"), facebookUsername)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("instagram_username"), instagramUsername)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("twitter_username"), twitterUsername)

		// Remove the website_url and usernames with empty string
		try {
			response = await axios({
				method: 'put',
				url: updatePublisherEndpointUrl.replace('{0}', "mine"),
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
		assert.equal(Object.keys(response.data).length, 8)
		assert.equal(response.data.uuid, publisher.uuid)
		assert.isNull(response.data.website_url)
		assert.isNull(response.data.facebook_username)
		assert.isNull(response.data.instagram_username)
		assert.isNull(response.data.twitter_username)
	})

	it("should update all properties of publisher of user", async () => {
		resetPublishers = true
		let publisher = constants.authorUser.publisher
		let name = "Updated name"
		let description = "Updated description"
		let websiteUrl = "https://test.example-test.de"
		let facebookUsername = "facebookusernametesttest"
		let instagramUsername = "instagramusernametesttest"
		let twitterUsername = "twitterusernametesttest"
		let response

		try {
			response = await axios({
				method: 'put',
				url: updatePublisherEndpointUrl.replace('{0}', "mine"),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				params: {
					fields: "*"
				},
				data: {
					name,
					description,
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
		assert.equal(Object.keys(response.data).length, 8)
		assert.equal(response.data.uuid, publisher.uuid)
		assert.equal(response.data.name, name)
		assert.equal(response.data.description, description)
		assert.equal(response.data.website_url, websiteUrl)
		assert.equal(response.data.facebook_username, facebookUsername)
		assert.equal(response.data.instagram_username, instagramUsername)
		assert.equal(response.data.twitter_username, twitterUsername)
		if (publisher.logoItem) assert.isNotNull(response.data.logo?.url)
		assert.equal(response.data.logo?.blurhash, publisher.logoItem?.blurhash)

		// Check if the data was updated correctly on the server
		let objResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: publisher.uuid
		})

		assert.equal(objResponse.status, 200)
		assert.equal(objResponse.data.tableObject.Uuid, publisher.uuid)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("name"), name)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("description"), description)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("website_url"), websiteUrl)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("facebook_username"), facebookUsername)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("instagram_username"), instagramUsername)
		assert.equal(objResponse.data.tableObject.GetPropertyValue("twitter_username"), twitterUsername)
	})
})