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

const uploadAuthorProfileImageEndpointUrl = `${constants.apiBaseUrl}/authors/{0}/profile_image`
let resetAuthorsAndAuthorProfileImages = false

afterEach(async () => {
	if (resetAuthorsAndAuthorProfileImages) {
		await utils.resetAuthors()
		await utils.resetAuthorProfileImageItems()
		await utils.resetAuthorProfileImages()
		resetAuthorsAndAuthorProfileImages = false
	}
})

describe("UploadAuthorProfileImage endpoint", () => {
	it("should not set profile image without access token", async () => {
		try {
			await axios({
				method: 'put',
				url: uploadAuthorProfileImageEndpointUrl.replace('{0}', constants.davUser.authors[0].uuid),
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

	it("should not set profile image with access token for session that does not exist", async () => {
		try {
			await axios({
				method: 'put',
				url: uploadAuthorProfileImageEndpointUrl.replace('{0}', constants.davUser.authors[0].uuid),
				headers: {
					Authorization: "asdasdsdaasddas",
					'Content-Type': 'image/png'
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

	it("should not set profile image with access token for another app", async () => {
		try {
			await axios({
				method: 'put',
				url: uploadAuthorProfileImageEndpointUrl.replace('{0}', constants.davUser.authors[0].uuid),
				headers: {
					Authorization: constants.testUserTestAppAccessToken,
					'Content-Type': 'image/jpeg'
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

	it("should not set profile image without supported image content type", async () => {
		try {
			await axios({
				method: 'put',
				url: uploadAuthorProfileImageEndpointUrl.replace('{0}', constants.davUser.authors[0].uuid),
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

	it("should not set profile image of author if the user is not an author", async () => {
		try {
			await axios({
				method: 'put',
				url: uploadAuthorProfileImageEndpointUrl.replace('{0}', "mine"),
				headers: {
					Authorization: constants.testUser.accessToken,
					'Content-Type': 'image/png'
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

	it("should not set profile image of author if the user is an admin", async () => {
		try {
			await axios({
				method: 'put',
				url: uploadAuthorProfileImageEndpointUrl.replace('{0}', "mine"),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'image/png'
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

	it("should not set profile image if the user is not an admin", async () => {
		try {
			await axios({
				method: 'put',
				url: uploadAuthorProfileImageEndpointUrl.replace('{0}', constants.davUser.authors[0].uuid),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'image/png'
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

	it("should not set profile image of author that does not exist", async () => {
		try {
			await axios({
				method: 'put',
				url: uploadAuthorProfileImageEndpointUrl.replace('{0}', "asdasdasdads"),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'image/png'
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 404)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.AuthorDoesNotExist)
			return
		}

		assert.fail()
	})

	it("should not set profile image if the author does not belong to the user", async () => {
		try {
			await axios({
				method: 'put',
				url: uploadAuthorProfileImageEndpointUrl.replace('{0}', constants.authorUser.author.uuid),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'image/png'
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

	it("should create and update profile image of author", async () => {
		resetAuthorsAndAuthorProfileImages = true
		let author = constants.davUser.authors[1]
		let accessToken = constants.davUser.accessToken

		// Get the author table object
		let getAuthorObjResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: author.uuid
		})

		assert.equal(getAuthorObjResponse.status, 200)

		// The author should not have a profile image item
		assert.isNull(getAuthorObjResponse.data.tableObject.GetPropertyValue("profile_image_item"))

		// Upload the profile image
		let filePath = path.resolve(__dirname, '../files/cover.png')
		let firstFileContent = fs.readFileSync(filePath)
		let firstFileType = "image/png"
		let firstFileExt = "png"

		try {
			await axios({
				method: 'put',
				url: uploadAuthorProfileImageEndpointUrl.replace('{0}', author.uuid),
				headers: {
					Authorization: accessToken,
					'Content-Type': firstFileType
				},
				data: firstFileContent
			})
		} catch (error) {
			assert.fail()
		}

		// Get the author table object
		let getAuthorObjResponse2 = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: author.uuid
		})

		assert.equal(getAuthorObjResponse2.status, 200)

		// The author should now have a profile image item
		let profileImageItemUuid = getAuthorObjResponse2.data.tableObject.GetPropertyValue("profile_image_item")
		assert.isNotNull(profileImageItemUuid)

		// Get the profile image item table object
		let getProfileImageItemResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: profileImageItemUuid
		})

		assert.equal(getProfileImageItemResponse.status, 200)
		assert.isNotNull(getProfileImageItemResponse.data.tableObject.GetPropertyValue("blurhash"))

		let profileImageUuid = getProfileImageItemResponse.data.tableObject.GetPropertyValue("profile_image")
		assert.isNotNull(profileImageUuid)

		// Get the profile image table object file
		let getProfileImageFileObjResponse = await TableObjectsController.GetTableObjectFile({
			accessToken,
			uuid: profileImageUuid
		})

		assert.equal(getProfileImageFileObjResponse.status, 200)
		assert.equal(getProfileImageFileObjResponse.data, firstFileContent)

		// Get the profile image table object
		let getProfileImageObjResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: profileImageUuid
		})

		assert.equal(getProfileImageObjResponse.status, 200)
		assert.equal(getProfileImageObjResponse.data.tableObject.GetPropertyValue("type"), firstFileType)
		assert.equal(getProfileImageObjResponse.data.tableObject.GetPropertyValue("ext"), firstFileExt)

		// Update the profile image
		let secondFileType = "image/jpeg"
		let secondFileExt = "jpg"
		let secondFileContent = "Labore dicta cupiditate culpa cum harum. Corporis voluptatem debitis eos nam nisi esse in vitae. Molestiae rerum nesciunt sunt sed et dolorum."

		try {
			await axios({
				method: 'put',
				url: uploadAuthorProfileImageEndpointUrl.replace('{0}', author.uuid),
				headers: {
					Authorization: accessToken,
					'Content-Type': secondFileType
				},
				data: secondFileContent
			})
		} catch (error) {
			assert.fail()
		}

		// Get the profile image item table object
		let getProfileImageItemResponse2 = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: profileImageItemUuid
		})

		assert.equal(getProfileImageItemResponse2.status, 200)

		// The profile image item should have the same profile image, but no profile image blurhash
		assert.equal(getProfileImageItemResponse2.data.tableObject.GetPropertyValue("profile_image"), profileImageUuid)
		assert.isNull(getProfileImageItemResponse2.data.tableObject.GetPropertyValue("blurhash"))

		// Get the profile image table object file
		let getProfileImageFileObjResponse2 = await TableObjectsController.GetTableObjectFile({
			accessToken,
			uuid: profileImageUuid
		})

		assert.equal(getProfileImageFileObjResponse2.status, 200)
		assert.equal(getProfileImageFileObjResponse2.data, secondFileContent)

		// Get the profile image table object
		let getProfileImageObjResponse2 = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: profileImageUuid
		})

		assert.equal(getProfileImageObjResponse2.status, 200)
		assert.equal(getProfileImageObjResponse2.data.tableObject.GetPropertyValue("type"), secondFileType)
		assert.equal(getProfileImageObjResponse2.data.tableObject.GetPropertyValue("ext"), secondFileExt)
	})

	it("should create and update profile image of author of user", async () => {
		resetAuthorsAndAuthorProfileImages = true
		let author = constants.authorUser.author
		let accessToken = constants.authorUser.accessToken

		// Get the author table object
		let getAuthorObjResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: author.uuid
		})

		assert.equal(getAuthorObjResponse.status, 200)

		// The author should have a profile image item
		assert.isNotNull(getAuthorObjResponse.data.tableObject.GetPropertyValue("profile_image_item"))

		// Upload the profile image (1)
		let filePath = path.resolve(__dirname, '../files/cover.png')
		let firstFileContent = fs.readFileSync(filePath)
		let firstFileType = "image/png"
		let firstFileExt = "png"

		try {
			await axios({
				method: 'put',
				url: uploadAuthorProfileImageEndpointUrl.replace('{0}', "mine"),
				headers: {
					Authorization: accessToken,
					'Content-Type': firstFileType
				},
				data: firstFileContent
			})
		} catch (error) {
			assert.fail()
		}

		// Get the author table object
		let getAuthorObjResponse2 = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: author.uuid
		})

		assert.equal(getAuthorObjResponse2.status, 200)

		// The author should now have a profile image item
		let profileImageItemUuid = getAuthorObjResponse2.data.tableObject.GetPropertyValue("profile_image_item")
		assert.isNotNull(profileImageItemUuid)

		// Get the profile image item table object
		let getProfileImageItemResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: profileImageItemUuid
		})

		assert.equal(getProfileImageItemResponse.status, 200)
		assert.isNotNull(getProfileImageItemResponse.data.tableObject.GetPropertyValue("blurhash"))

		let profileImageUuid = getProfileImageItemResponse.data.tableObject.GetPropertyValue("profile_image")
		assert.isNotNull(profileImageUuid)

		// Get the profile image table object file
		let getProfileImageFileObjResponse = await TableObjectsController.GetTableObjectFile({
			accessToken,
			uuid: profileImageUuid
		})

		assert.equal(getProfileImageFileObjResponse.status, 200)
		assert.equal(getProfileImageFileObjResponse.data, firstFileContent)

		// Get the profile image table object
		let getProfileImageObjResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: profileImageUuid
		})

		assert.equal(getProfileImageObjResponse.status, 200)
		assert.equal(getProfileImageObjResponse.data.tableObject.GetPropertyValue("type"), firstFileType)
		assert.equal(getProfileImageObjResponse.data.tableObject.GetPropertyValue("ext"), firstFileExt)

		// Update the profile image
		let secondFileType = "image/jpeg"
		let secondFileExt = "jpg"
		let secondFileContent = "Labore dicta cupiditate culpa cum harum. Corporis voluptatem debitis eos nam nisi esse in vitae. Molestiae rerum nesciunt sunt sed et dolorum."

		try {
			await axios({
				method: 'put',
				url: uploadAuthorProfileImageEndpointUrl.replace('{0}', "mine"),
				headers: {
					Authorization: accessToken,
					'Content-Type': secondFileType
				},
				data: secondFileContent
			})
		} catch (error) {
			assert.fail()
		}

		// Get the profile image item table object
		let getProfileImageItemResponse2 = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: profileImageItemUuid
		})

		assert.equal(getProfileImageItemResponse2.status, 200)

		// The profile image item should have the same profile image, but no profile image blurhash
		assert.equal(getProfileImageItemResponse2.data.tableObject.GetPropertyValue("profile_image"), profileImageUuid)
		assert.isNull(getProfileImageItemResponse2.data.tableObject.GetPropertyValue("blurhash"))

		// Get the profile image table object file
		let getProfileImageFileObjResponse2 = await TableObjectsController.GetTableObjectFile({
			accessToken,
			uuid: profileImageUuid
		})

		assert.equal(getProfileImageFileObjResponse2.status, 200)
		assert.equal(getProfileImageFileObjResponse2.data, secondFileContent)

		// Get the profile image table object
		let getProfileImageObjResponse2 = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: profileImageUuid
		})

		assert.equal(getProfileImageObjResponse2.status, 200)
		assert.equal(getProfileImageObjResponse2.data.tableObject.GetPropertyValue("type"), secondFileType)
		assert.equal(getProfileImageObjResponse2.data.tableObject.GetPropertyValue("ext"), secondFileExt)
	})
})