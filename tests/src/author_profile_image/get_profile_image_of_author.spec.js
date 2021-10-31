import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'
import * as utils from '../utils.js'
import * as ErrorCodes from '../errorCodes.js'

const getProfileImageOfAuthorEndpoint = `${constants.apiBaseUrl}/author/{0}/profile_image`
var resetAuthorProfileImages = false

afterEach(async () => {
	if (resetAuthorProfileImages) {
		await utils.resetAuthorProfileImages()
		resetAuthorProfileImages = false
	}
})

describe("GetProfileImageOfAuthor endpoint", async () => {
	it("should not return profile image if the author has no profile image", async () => {
		try {
			await axios({
				method: 'get',
				url: getProfileImageOfAuthorEndpoint.replace('{0}', constants.davUser.authors[1].uuid),
				headers: {
					Authorization: constants.authorUser.accessToken
				}
			})
		} catch (error) {
			assert.equal(404, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.AuthorProfileImageDoesNotExist, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not return profile image if the author does not exist", async () => {
		try {
			await axios({
				method: 'get',
				url: getProfileImageOfAuthorEndpoint.replace('{0}', "adasdasdasdasad"),
				headers: {
					Authorization: constants.davUser.accessToken
				}
			})
		} catch (error) {
			assert.equal(404, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.AuthorDoesNotExist, error.response.data.errors[0].code)
			return
		}
	})

	it("should return profile image", async () => {
		resetAuthorProfileImages = true
		let author = constants.davUser.authors[0]
		let profileImageContent = "Lorem ipsum dolor sit amet"
		let profileImageType = "image/jpeg"

		// Set the profile image
		await setProfileImageOfAuthor(constants.davUser.accessToken, author.uuid, profileImageType, profileImageContent)

		// Try to get the profile image
		let response

		try {
			response = await axios({
				method: 'get',
				url: getProfileImageOfAuthorEndpoint.replace('{0}', author.uuid)
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(200, response.status)
		assert.equal(profileImageType, response.headers['content-type'])
		assert.equal(profileImageContent, response.data)
	})

	it("should return profile image of author of user", async () => {
		resetAuthorProfileImages = true
		let author = constants.authorUser.author
		let profileImageContent = "Lorem ipsum dolor sit amet"
		let profileImageType = "image/jpeg"

		// Set the profile image
		await setProfileImageOfAuthorOfUser(constants.authorUser.accessToken, profileImageType, profileImageContent)

		// Try to get the profile image
		let response

		try {
			response = await axios({
				method: 'get',
				url: getProfileImageOfAuthorEndpoint.replace('{0}', author.uuid)
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(200, response.status)
		assert.equal(profileImageType, response.headers['content-type'])
		assert.equal(profileImageContent, response.data)
	})
})

async function setProfileImageOfAuthor(accessToken, uuid, type, content) {
	try {
		await axios({
			method: 'put',
			url: getProfileImageOfAuthorEndpoint.replace('{0}', uuid),
			headers: {
				Authorization: accessToken,
				'Content-Type': type
			},
			data: content
		})
	} catch (error) {
		assert.fail()
	}
}

async function setProfileImageOfAuthorOfUser(accessToken, type, content) {
	try {
		await axios({
			method: 'put',
			url: `${constants.apiBaseUrl}/author/profile_image`,
			headers: {
				Authorization: accessToken,
				'Content-Type': type
			},
			data: content
		})
	} catch (error) {
		assert.fail()
	}
}