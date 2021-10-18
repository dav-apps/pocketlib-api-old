import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import path from 'path'
import url from 'url'
const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
import fs from 'fs'
import { TableObjectsController } from 'dav-js'
import constants from '../constants.js'
import * as utils from '../utils.js'
import * as ErrorCodes from '../errorCodes.js'

const setProfileImageOfAuthorOfUserEndpointUrl = `${constants.apiBaseUrl}/api/1/call/author/profile_image`
let resetAuthorsAndAuthorProfileImages = false

afterEach(async () => {
	if (resetAuthorsAndAuthorProfileImages) {
		await utils.resetAuthors()
		await utils.resetAuthorProfileImages()
		resetAuthorsAndAuthorProfileImages = false
	}
})

describe("SetProfileImageOfAuthorOfUser endpoint", () => {
	it("should not set profile image without access token", async () => {
		try {
			await axios({
				method: 'put',
				url: setProfileImageOfAuthorOfUserEndpointUrl
			})
		} catch (error) {
			assert.equal(401, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.AuthorizationHeaderMissing, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not set profile image with access token for session that does not exist", async () => {
		try {
			await axios({
				method: 'put',
				url: setProfileImageOfAuthorOfUserEndpointUrl,
				headers: {
					Authorization: "cblaasdasag",
					'Content-Type': "image/png"
				}
			})
		} catch (error) {
			assert.equal(404, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.SessionDoesNotExist, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not set profile image with access token for another app", async () => {
		try {
			await axios({
				method: 'put',
				url: setProfileImageOfAuthorOfUserEndpointUrl,
				headers: {
					Authorization: constants.testUserTestAppAccessToken,
					'Content-Type': 'image/jpeg'
				}
			})
		} catch (error) {
			assert.equal(403, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.ActionNotAllowed, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not set profile image without supported image content type", async () => {
		try {
			await axios({
				method: 'put',
				url: setProfileImageOfAuthorOfUserEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				}
			})
		} catch (error) {
			assert.equal(415, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.ContentTypeNotSupported, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not set profile image if the user is not an author", async () => {
		try {
			await axios({
				method: 'put',
				url: setProfileImageOfAuthorOfUserEndpointUrl,
				headers: {
					Authorization: constants.testUser.accessToken,
					'Content-Type': 'image/png'
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.UserIsNotAuthor, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not set profile image if the user is an admin", async () => {
		try {
			await axios({
				method: 'put',
				url: setProfileImageOfAuthorOfUserEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'image/png'
				}
			})
		} catch (error) {
			assert.equal(403, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.ActionNotAllowed, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should create and update profile image", async () => {
		resetAuthorsAndAuthorProfileImages = true
		let author = constants.authorUser.author
		let accessToken = constants.authorUser.accessToken

		// Get the author table object (1)
		let getAuthorObjResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: author.uuid
		})

		if (getAuthorObjResponse.status != 200) {
			assert.fail()
		}

		// The author should have a profile image but no profile image blurhash
		assert.equal(author.profileImage.uuid, getAuthorObjResponse.data.GetPropertyValue("profile_image"))
		assert.equal(author.profileImageBlurhash, getAuthorObjResponse.data.GetPropertyValue("profile_image_blurhash"))

		// Remove the profile image uuid from the author table object
		let updateAuthorObjResponse = await TableObjectsController.UpdateTableObject({
			accessToken,
			uuid: author.uuid,
			properties: {
				profile_image: "",
				profile_image_blurhash: ""
			}
		})

		if (updateAuthorObjResponse.status != 200) {
			assert.fail()
		}

		// The author now should not have a profile image
		assert.isNull(updateAuthorObjResponse.data.GetPropertyValue("profile_image"))
		assert.equal(null, updateAuthorObjResponse.data.GetPropertyValue("profile_image_blurhash"))

		// Upload the profile image (1)
		let filePath = path.resolve(__dirname, '../files/cover.png')
		let firstFileContent = fs.readFileSync(filePath)
		let firstFileType = "image/png"
		let firstFileExt = "png"

		try {
			await axios({
				method: 'put',
				url: setProfileImageOfAuthorOfUserEndpointUrl,
				headers: {
					Authorization: accessToken,
					'Content-Type': firstFileType
				},
				data: firstFileContent
			})
		} catch (error) {
			assert.fail()
		}

		// Get the author table object (2)
		let getAuthorObjResponse2 = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: author.uuid
		})

		if (getAuthorObjResponse2.status != 200) {
			assert.fail()
		}

		// The author should now have a profile image and a profile image blurhash
		let profileImageUuid = getAuthorObjResponse2.data.GetPropertyValue("profile_image")
		assert.isNotNull(profileImageUuid)
		assert.isNotNull(getAuthorObjResponse2.data.GetPropertyValue("profile_image_blurhash"))

		// Get the profile image table object file (1)
		let getProfileImageFileObjResponse = await TableObjectsController.GetTableObjectFile({
			accessToken,
			uuid: profileImageUuid
		})

		if (getProfileImageFileObjResponse.status != 200) {
			assert.fail()
		}

		assert.equal(getProfileImageFileObjResponse.data, firstFileContent)

		// Get the profile image table object (1)
		let getProfileImageObjResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: profileImageUuid
		})

		if (getProfileImageObjResponse.status != 200) {
			assert.fail()
		}

		assert.equal(firstFileType, getProfileImageObjResponse.data.GetPropertyValue("type"))
		assert.equal(firstFileExt, getProfileImageObjResponse.data.GetPropertyValue("ext"))

		// Update the profile image (2)
		let secondFileType = "image/jpeg"
		let secondFileExt = "jpg"
		let secondFileContent = "Labore dicta cupiditate culpa cum harum. Corporis voluptatem debitis eos nam nisi esse in vitae. Molestiae rerum nesciunt sunt sed et dolorum."

		try {
			await axios({
				method: 'put',
				url: setProfileImageOfAuthorOfUserEndpointUrl,
				headers: {
					Authorization: accessToken,
					'Content-Type': secondFileType
				},
				data: secondFileContent
			})
		} catch (error) {
			assert.fail()
		}

		// Get the author table object (3)
		let getAuthorObjResponse3 = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: author.uuid
		})

		if (getAuthorObjResponse3.status != 200) {
			assert.fail()
		}

		// The author should have the same profile image, but no profile image blurhash
		assert.equal(profileImageUuid, getAuthorObjResponse3.data.GetPropertyValue("profile_image"))
		assert.equal(null, getAuthorObjResponse3.data.GetPropertyValue("profile_image_blurhash"))

		// Get the profile image table object file (2)
		let getProfileImageFileObjResponse2 = await TableObjectsController.GetTableObjectFile({
			accessToken,
			uuid: profileImageUuid
		})

		if (getProfileImageFileObjResponse2.status != 200) {
			assert.fail()
		}

		assert.equal(getProfileImageFileObjResponse2.data, secondFileContent)

		// Get the profile image table object (2)
		let getProfileImageObjResponse2 = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: profileImageUuid
		})

		if (getProfileImageObjResponse2.status != 200) {
			assert.fail()
		}

		assert.equal(secondFileType, getProfileImageObjResponse2.data.GetPropertyValue("type"))
		assert.equal(secondFileExt, getProfileImageObjResponse2.data.GetPropertyValue("ext"))
	})
})