import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'
import * as utils from '../utils.js'

const updateAuthorEndpointUrl = `${constants.apiBaseUrl}/api/1/call/author`
var resetAuthors = false

afterEach(async () => {
	if(resetAuthors){
		await utils.resetAuthors()
		resetAuthors = false
	}
})

describe("UpdateAuthorOfUser endpoint", () => {
	it("should not update author without jwt", async () => {
		try{
			await axios.default({
				method: 'put',
				url: updateAuthorEndpointUrl
			})
		}catch(error){
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(2101, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not update author with invalid jwt", async () => {
		try{
			await axios.default({
				method: 'put',
				url: updateAuthorEndpointUrl,
				headers: {
					Authorization: "blablabla",
					'Content-Type': 'application/json'
				}
			})
		}catch(error){
			assert.equal(401, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(1302, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not update author without content type json", async () => {
		try{
			await axios.default({
				method: 'put',
				url: updateAuthorEndpointUrl,
				headers: {
					Authorization: constants.authorUser.jwt
				}
			})
		}catch(error){
			assert.equal(415, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(1104, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not update author if jwt is for another app", async () => {
		try{
			await axios.default({
				method: 'put',
				url: updateAuthorEndpointUrl,
				headers: {
					Authorization: constants.davClassLibraryTestUserTestAppJWT,
					'Content-Type': 'application/json'
				}
			})
		}catch(error){
			assert.equal(403, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(1102, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not update author if the user is an admin", async () => {
		try{
			await axios.default({
				method: 'put',
				url: updateAuthorEndpointUrl,
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				}
			})
		}catch(error){
			assert.equal(403, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(1102, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not update author if the user is not an author", async () => {
		try{
			await axios.default({
				method: 'put',
				url: updateAuthorEndpointUrl,
				headers: {
					Authorization: constants.davClassLibraryTestUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: "Blabla"
				}
			})
		}catch(error){
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(1105, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not update author with properties with wrong types", async () => {
		try{
			await axios.default({
				method: 'put',
				url: updateAuthorEndpointUrl,
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: 23,
					last_name: true,
					website_url: 234,
					facebook_username: false,
					instagram_username: 12.3,
					twitter_username: true
				}
			})
		}catch(error){
			assert.equal(400, error.response.status)
			assert.equal(6, error.response.data.errors.length)
			assert.equal(2201, error.response.data.errors[0].code)
			assert.equal(2202, error.response.data.errors[1].code)
			assert.equal(2216, error.response.data.errors[2].code)
			assert.equal(2217, error.response.data.errors[3].code)
			assert.equal(2218, error.response.data.errors[4].code)
			assert.equal(2219, error.response.data.errors[5].code)
			return
		}

		assert.fail()
	})

	it("should not update author with too short properties", async () => {
		try{
			await axios.default({
				method: 'put',
				url: updateAuthorEndpointUrl,
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: "a",
					last_name: "a"
				}
			})
		}catch(error){
			assert.equal(400, error.response.status)
			assert.equal(2, error.response.data.errors.length)
			assert.equal(2301, error.response.data.errors[0].code)
			assert.equal(2302, error.response.data.errors[1].code)
			return
		}

		assert.fail()
	})

	it("should not update author with too long properties", async () => {
		try{
			await axios.default({
				method: 'put',
				url: updateAuthorEndpointUrl,
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: "a".repeat(30),
					last_name: "a".repeat(30)
				}
			})
		}catch(error){
			assert.equal(400, error.response.status)
			assert.equal(2, error.response.data.errors.length)
			assert.equal(2401, error.response.data.errors[0].code)
			assert.equal(2402, error.response.data.errors[1].code)
			return
		}

		assert.fail()
	})

	it("should not update author with invalid properties", async () => {
		try {
			await axios.default({
				method: 'put',
				url: updateAuthorEndpointUrl,
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					website_url: "hello world",
					facebook_username: "lö< # +",
					instagram_username: "a<x-€",
					twitter_username: "<<>>--äa. +ß@20ß23ik"
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(4, error.response.data.errors.length)
			assert.equal(2503, error.response.data.errors[0].code)
			assert.equal(2504, error.response.data.errors[1].code)
			assert.equal(2505, error.response.data.errors[2].code)
			assert.equal(2506, error.response.data.errors[3].code)
			return
		}

		assert.fail()
	})

	it("should update first_name of author", async () => {
		resetAuthors = true
		let author = constants.authorUser.author
		let firstName = "Updated name"
		let response

		try{
			response = await axios.default({
				method: 'put',
				url: updateAuthorEndpointUrl,
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: firstName
				}
			})
		}catch(error){
			assert.fail()
		}

		assert.equal(200, response.status)
		assert.equal(author.uuid, response.data.uuid)
		assert.equal(firstName, response.data.first_name)
		assert.equal(author.lastName, response.data.last_name)
		assert.equal(author.websiteUrl, response.data.website_url)
		assert.equal(utils.buildFacebookUrl(author.facebookUsername), response.data.facebook_url)
		assert.equal(utils.buildInstagramUrl(author.instagramUsername), response.data.instagram_url)
		assert.equal(utils.buildTwitterUrl(author.twitterUsername), response.data.twitter_url)
		assert.equal(author.bios.length, response.data.bios.length)
		assert.equal(author.collections.length, response.data.collections.length)
		assert.isTrue(response.data.profile_image)
		assert.equal(author.profileImageBlurhash, response.data.profile_image_blurhash)

		for(let i = 0; i < author.bios.length; i++){
			let bio = author.bios[i]
			let responseBio = response.data.bios[i]

			assert.isUndefined(responseBio.uuid)
			assert.equal(bio.bio, responseBio.bio)
			assert.equal(bio.language, responseBio.language)
		}

		for(let i = 0; i < author.collections.length; i++){
			let collection = author.collections[i]
			let responseCollection = response.data.collections[i]

			assert.equal(collection.uuid, responseCollection.uuid)

			for(let j = 0; j < collection.names.length; j++){
				let name = collection.names[j]
				let responseName = responseCollection.names[j]

				assert.isUndefined(responseName.uuid)
				assert.equal(name.name, responseName.name)
				assert.equal(name.language, responseName.language)
			}
		}

		// Check if the data was updated correctly on the server
		let objResponse

		try{
			objResponse = await utils.getTableObject(author.uuid, constants.authorUser.jwt)
		}catch(error){
			assert.fail()
		}

		assert.equal(author.uuid, objResponse.data.uuid)
		assert.equal(firstName, objResponse.data.properties.first_name)
		assert.equal(author.lastName, objResponse.data.properties.last_name)
	})

	it("should update last_name of author", async () => {
		resetAuthors = true
		let author = constants.authorUser.author
		let lastName = "Updated name"
		let response

		try{
			response = await axios.default({
				method: 'put',
				url: updateAuthorEndpointUrl,
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					last_name: lastName
				}
			})
		}catch(error){
			assert.fail()
		}

		assert.equal(200, response.status)
		assert.equal(author.uuid, response.data.uuid)
		assert.equal(author.firstName, response.data.first_name)
		assert.equal(lastName, response.data.last_name)
		assert.equal(author.websiteUrl, response.data.website_url)
		assert.equal(utils.buildFacebookUrl(author.facebookUsername), response.data.facebook_url)
		assert.equal(utils.buildInstagramUrl(author.instagramUsername), response.data.instagram_url)
		assert.equal(utils.buildTwitterUrl(author.twitterUsername), response.data.twitter_url)
		assert.equal(author.bios.length, response.data.bios.length)
		assert.equal(author.collections.length, response.data.collections.length)
		assert.isTrue(response.data.profile_image)
		assert.equal(author.profileImageBlurhash, response.data.profile_image_blurhash)

		for(let i = 0; i < author.bios.length; i++){
			let bio = author.bios[i]
			let responseBio = response.data.bios[i]

			assert.isUndefined(responseBio.uuid)
			assert.equal(bio.bio, responseBio.bio)
			assert.equal(bio.language, responseBio.language)
		}

		for(let i = 0; i < author.collections.length; i++){
			let collection = author.collections[i]
			let responseCollection = response.data.collections[i]

			assert.equal(collection.uuid, responseCollection.uuid)

			for(let j = 0; j < collection.names.length; j++){
				let name = collection.names[j]
				let responseName = responseCollection.names[j]

				assert.isUndefined(responseName.uuid)
				assert.equal(name.name, responseName.name)
				assert.equal(name.language, responseName.language)
			}
		}

		// Check if the data was updated correctly on the server
		let objResponse

		try{
			objResponse = await utils.getTableObject(author.uuid, constants.authorUser.jwt)
		}catch(error){
			assert.fail()
		}

		assert.equal(author.uuid, objResponse.data.uuid)
		assert.equal(author.firstName, objResponse.data.properties.first_name)
		assert.equal(lastName, objResponse.data.properties.last_name)
	})

	it("should update website_url, facebook_username, instagram_username and twitter_username of author", async () => {
		resetAuthors = true
		let author = constants.authorUser.author
		let websiteUrl = "https://example.com"
		let facebookUsername = "facebookusernametest"
		let instagramUsername = "instagramusernametest"
		let twitterUsername = "twitterusernametest"
		let response

		try{
			response = await axios.default({
				method: 'put',
				url: updateAuthorEndpointUrl,
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					website_url: websiteUrl,
					facebook_username: `https://facebook.com/${facebookUsername}/`,
					instagram_username: `instagram.com/${instagramUsername}`,
					twitter_username: `https://www.twitter.com/${twitterUsername}/`
				}
			})
		}catch(error){
			assert.fail()
		}

		assert.equal(200, response.status)
		assert.equal(author.uuid, response.data.uuid)
		assert.equal(author.firstName, response.data.first_name)
		assert.equal(author.lastName, response.data.last_name)
		assert.equal(websiteUrl, response.data.website_url)
		assert.equal(utils.buildFacebookUrl(facebookUsername), response.data.facebook_url)
		assert.equal(utils.buildInstagramUrl(instagramUsername), response.data.instagram_url)
		assert.equal(utils.buildTwitterUrl(twitterUsername), response.data.twitter_url)
		assert.equal(author.bios.length, response.data.bios.length)
		assert.equal(author.collections.length, response.data.collections.length)
		assert.isTrue(response.data.profile_image)
		assert.equal(author.profileImageBlurhash, response.data.profile_image_blurhash)

		for(let i = 0; i < author.bios.length; i++){
			let bio = author.bios[i]
			let responseBio = response.data.bios[i]

			assert.isUndefined(responseBio.uuid)
			assert.equal(bio.bio, responseBio.bio)
			assert.equal(bio.language, responseBio.language)
		}

		for(let i = 0; i < author.collections.length; i++){
			let collection = author.collections[i]
			let responseCollection = response.data.collections[i]

			assert.equal(collection.uuid, responseCollection.uuid)

			for(let j = 0; j < collection.names.length; j++){
				let name = collection.names[j]
				let responseName = responseCollection.names[j]

				assert.isUndefined(responseName.uuid)
				assert.equal(name.name, responseName.name)
				assert.equal(name.language, responseName.language)
			}
		}

		// Check if the data was updated correctly on the server
		let objResponse

		try {
			objResponse = await utils.getTableObject(author.uuid, constants.authorUser.jwt)
		} catch (error) {
			assert.fail()
		}

		assert.equal(author.uuid, objResponse.data.uuid)
		assert.equal(websiteUrl, objResponse.data.properties.website_url)
		assert.equal(facebookUsername, objResponse.data.properties.facebook_username)
		assert.equal(instagramUsername, objResponse.data.properties.instagram_username)
		assert.equal(twitterUsername, objResponse.data.properties.twitter_username)

		// Remove the website_url and usernames with empty strings
		try {
			response = await axios.default({
				method: 'put',
				url: updateAuthorEndpointUrl,
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
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

		assert.equal(200, response.status)
		assert.equal(author.uuid, response.data.uuid)
		assert.isNull(response.data.website_url)
		assert.isNull(response.data.facebook_url)
		assert.isNull(response.data.instagram_url)
		assert.isNull(response.data.twitter_url)
	})

	it("should update all properties of author", async () => {
		resetAuthors = true
		let author = constants.authorUser.author
		let firstName = "New first name"
		let lastName = "New last name"
		let websiteUrl = "www.example-test.de/index.html"
		let facebookUsername = "facebookusernametesttest"
		let instagramUsername = "instagramusernametesttest"
		let twitterUsername = "twitterusernametesttest"
		let response

		try{
			response = await axios.default({
				method: 'put',
				url: updateAuthorEndpointUrl,
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: firstName,
					last_name: lastName,
					website_url: websiteUrl,
					facebook_username: `${facebookUsername}`,
					instagram_username: `https://www.instagram.com/${instagramUsername}`,
					twitter_username: `https://twitter.com/${twitterUsername}`
				}
			})
		}catch(error){
			assert.fail()
		}

		assert.equal(200, response.status)
		assert.equal(author.uuid, response.data.uuid)
		assert.equal(firstName, response.data.first_name)
		assert.equal(lastName, response.data.last_name)
		assert.equal(websiteUrl, response.data.website_url)
		assert.equal(utils.buildFacebookUrl(facebookUsername), response.data.facebook_url)
		assert.equal(utils.buildInstagramUrl(instagramUsername), response.data.instagram_url)
		assert.equal(utils.buildTwitterUrl(twitterUsername), response.data.twitter_url)
		assert.equal(author.bios.length, response.data.bios.length)
		assert.equal(author.collections.length, response.data.collections.length)
		assert.isTrue(response.data.profile_image)
		assert.equal(author.profileImageBlurhash, response.data.profile_image_blurhash)

		for(let i = 0; i < author.bios.length; i++){
			let bio = author.bios[i]
			let responseBio = response.data.bios[i]

			assert.isUndefined(responseBio.uuid)
			assert.equal(bio.bio, responseBio.bio)
			assert.equal(bio.language, responseBio.language)
		}

		for(let i = 0; i < author.collections.length; i++){
			let collection = author.collections[i]
			let responseCollection = response.data.collections[i]

			assert.equal(collection.uuid, responseCollection.uuid)

			for(let j = 0; j < collection.names.length; j++){
				let name = collection.names[j]
				let responseName = responseCollection.names[j]

				assert.isUndefined(responseName.uuid)
				assert.equal(name.name, responseName.name)
				assert.equal(name.language, responseName.language)
			}
		}

		// Check if the data was updated correctly on the server
		let objResponse

		try{
			objResponse = await utils.getTableObject(author.uuid, constants.authorUser.jwt)
		}catch(error){
			assert.fail()
		}

		assert.equal(author.uuid, objResponse.data.uuid)
		assert.equal(firstName, objResponse.data.properties.first_name)
		assert.equal(lastName, objResponse.data.properties.last_name)
		assert.equal(websiteUrl, objResponse.data.properties.website_url)
		assert.equal(facebookUsername, objResponse.data.properties.facebook_username)
		assert.equal(instagramUsername, objResponse.data.properties.instagram_username)
		assert.equal(twitterUsername, objResponse.data.properties.twitter_username)
	})
})