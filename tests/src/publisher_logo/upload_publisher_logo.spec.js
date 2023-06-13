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

const uploadPublisherLogoEndpointUrl = `${constants.apiBaseUrl}/publishers/{0}/logo`
let resetPublishersAndPublisherLogos = false

afterEach(async () => {
	if (resetPublishersAndPublisherLogos) {
		await utils.resetPublishers()
		await utils.resetPublisherLogos()
	}
})

describe("UploadPublisherLogo endpoint", () => {
	it("should not set logo without access token", async () => {
		try {
			await axios({
				method: "put",
				url: uploadPublisherLogoEndpointUrl.replace(
					"{0}",
					constants.davUser.publishers[0].uuid
				),
				headers: {
					"Content-Type": "application/json"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 401)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(
				error.response.data.errors[0],
				ErrorCodes.AuthorizationHeaderMissing
			)
			return
		}

		assert.fail()
	})

	it("should not set logo with access token for session that does not exist", async () => {
		try {
			await axios({
				method: "put",
				url: uploadPublisherLogoEndpointUrl.replace(
					"{0}",
					constants.davUser.publishers[0].uuid
				),
				headers: {
					Authorization: "asdasdasdasd",
					"Content-Type": "image/png"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 404)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(
				error.response.data.errors[0],
				ErrorCodes.SessionDoesNotExist
			)
			return
		}

		assert.fail()
	})

	it("should not set logo with access token for another app", async () => {
		try {
			await axios({
				method: "put",
				url: uploadPublisherLogoEndpointUrl.replace(
					"{0}",
					constants.davUser.publishers[0].uuid
				),
				headers: {
					Authorization: constants.testUserTestAppAccessToken,
					"Content-Type": "image/jpeg"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 403)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(
				error.response.data.errors[0],
				ErrorCodes.ActionNotAllowed
			)
			return
		}

		assert.fail()
	})

	it("should not set logo without supported image content type", async () => {
		try {
			await axios({
				method: "put",
				url: uploadPublisherLogoEndpointUrl.replace(
					"{0}",
					constants.davUser.publishers[0].uuid
				),
				headers: {
					Authorization: constants.davUser.accessToken
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 415)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(
				error.response.data.errors[0],
				ErrorCodes.ContentTypeNotSupported
			)
			return
		}

		assert.fail()
	})

	it("should not set logo of publisher if the user is not a publisher", async () => {
		try {
			await axios({
				method: "put",
				url: uploadPublisherLogoEndpointUrl.replace("{0}", "mine"),
				headers: {
					Authorization: constants.testUser.accessToken,
					"Content-Type": "image/png"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(
				error.response.data.errors[0],
				ErrorCodes.UserIsNotPublisher
			)
			return
		}

		assert.fail()
	})

	it("should not set logo of publisher if the user is an admin", async () => {
		try {
			await axios({
				method: "put",
				url: uploadPublisherLogoEndpointUrl.replace("{0}", "mine"),
				headers: {
					Authorization: constants.davUser.accessToken,
					"Content-Type": "image/png"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0], ErrorCodes.UserIsAdmin)
			return
		}

		assert.fail()
	})

	it("should not set logo if the user is not an admin", async () => {
		try {
			await axios({
				method: "put",
				url: uploadPublisherLogoEndpointUrl.replace(
					"{0}",
					constants.davUser.publishers[0].uuid
				),
				headers: {
					Authorization: constants.authorUser.accessToken,
					"Content-Type": "image/png"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 403)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(
				error.response.data.errors[0],
				ErrorCodes.ActionNotAllowed
			)
			return
		}

		assert.fail()
	})

	it("should not set logo of publisher that does not exist", async () => {
		try {
			await axios({
				method: "put",
				url: uploadPublisherLogoEndpointUrl.replace(
					"{0}",
					"sjkfdjhksdfjhksfd"
				),
				headers: {
					Authorization: constants.davUser.accessToken,
					"Content-Type": "image/png"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 404)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(
				error.response.data.errors[0],
				ErrorCodes.PublisherDoesNotExist
			)
			return
		}

		assert.fail()
	})

	it("should not set logo if the publisher does not belong to the user", async () => {
		try {
			await axios({
				method: "put",
				url: uploadPublisherLogoEndpointUrl.replace(
					"{0}",
					constants.authorUser.publisher.uuid
				),
				headers: {
					Authorization: constants.davUser.accessToken,
					"Content-Type": "image/png"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 403)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(
				error.response.data.errors[0],
				ErrorCodes.ActionNotAllowed
			)
			return
		}

		assert.fail()
	})

	it("should create and update logo of publisher", async () => {
		resetPublishersAndPublisherLogos = true
		let publisher = constants.davUser.publishers[1]
		let accessToken = constants.davUser.accessToken

		// Get the publisher table object
		let getPublisherObjResponse = await TableObjectsController.GetTableObject(
			{
				accessToken,
				uuid: publisher.uuid
			}
		)

		assert.equal(getPublisherObjResponse.status, 200)

		// The publisher should not have a logo
		assert.isNull(
			getPublisherObjResponse.data.tableObject.GetPropertyValue("logo")
		)

		// Upload the logo
		let filePath = path.resolve(__dirname, "../files/cover.png")
		let firstFileContent = fs.readFileSync(filePath)
		let firstFileType = "image/png"
		let firstFileExt = "png"

		try {
			await axios({
				method: "put",
				url: uploadPublisherLogoEndpointUrl.replace("{0}", publisher.uuid),
				headers: {
					Authorization: accessToken,
					"Content-Type": firstFileType
				},
				data: firstFileContent
			})
		} catch (error) {
			assert.fail()
		}

		// Get the publisher table object
		let getPublisherObjResponse2 =
			await TableObjectsController.GetTableObject({
				accessToken,
				uuid: publisher.uuid
			})

		assert.equal(getPublisherObjResponse2.status, 200)

		// The publisher should now have a logo
		let logoUuid =
			getPublisherObjResponse2.data.tableObject.GetPropertyValue("logo")
		assert.isNotNull(logoUuid)

		// Get the logo table object file
		let getLogoFileObjResponse =
			await TableObjectsController.GetTableObjectFile({
				accessToken,
				uuid: logoUuid
			})

		assert.equal(getLogoFileObjResponse.status, 200)
		assert.equal(getLogoFileObjResponse.data, firstFileContent)

		// Get the logo table object
		let getLogoObjResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: logoUuid
		})

		assert.equal(getLogoObjResponse.status, 200)
		assert.equal(
			getLogoObjResponse.data.tableObject.GetPropertyValue("type"),
			firstFileType
		)
		assert.equal(
			getLogoObjResponse.data.tableObject.GetPropertyValue("ext"),
			firstFileExt
		)
		assert.isNotNull(
			getLogoObjResponse.data.tableObject.GetPropertyValue("blurhash")
		)

		// Update the logo
		let secondFileType = "image/jpeg"
		let secondFileExt = "jpg"
		let secondFileContent =
			"Labore dicta cupiditate culpa cum harum. Corporis voluptatem debitis eos nam nisi esse in vitae. Molestiae rerum nesciunt sunt sed et dolorum."

		try {
			await axios({
				method: "put",
				url: uploadPublisherLogoEndpointUrl.replace("{0}", publisher.uuid),
				headers: {
					Authorization: accessToken,
					"Content-Type": secondFileType
				},
				data: secondFileContent
			})
		} catch (error) {
			assert.fail()
		}

		// Get the publisher table object
		let getPublisherObjResponse3 =
			await TableObjectsController.GetTableObject({
				accessToken,
				uuid: publisher.uuid
			})

		assert.equal(getPublisherObjResponse3.status, 200)

		// The publisher should have the same logo
		assert.equal(
			getPublisherObjResponse3.data.tableObject.GetPropertyValue("logo"),
			logoUuid
		)

		// Get the logo table object file
		let getLogoFileObjResponse2 =
			await TableObjectsController.GetTableObjectFile({
				accessToken,
				uuid: logoUuid
			})

		assert.equal(getLogoFileObjResponse2.status, 200)
		assert.equal(getLogoFileObjResponse2.data, secondFileContent)

		// Get the logo table object
		let getLogoObjResponse2 = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: logoUuid
		})

		assert.equal(getLogoObjResponse2.status, 200)
		assert.equal(
			getLogoObjResponse2.data.tableObject.GetPropertyValue("type"),
			secondFileType
		)
		assert.equal(
			getLogoObjResponse2.data.tableObject.GetPropertyValue("ext"),
			secondFileExt
		)
		assert.isNull(
			getLogoObjResponse2.data.tableObject.GetPropertyValue("blurhash")
		)
	})

	it("should create and update logo of publisher of user", async () => {
		resetPublishersAndPublisherLogos = true
		let publisher = constants.authorUser.publisher
		let accessToken = constants.authorUser.accessToken

		// Get the publisher table object
		let getPublisherObjResponse = await TableObjectsController.GetTableObject(
			{
				accessToken,
				uuid: publisher.uuid
			}
		)

		assert.equal(getPublisherObjResponse.status, 200)

		// The publisher should have a logo
		let logoUuid =
			getPublisherObjResponse.data.tableObject.GetPropertyValue("logo")
		assert.isNotNull(logoUuid)

		// Upload the logo (1)
		let filePath = path.resolve(__dirname, "../files/cover.png")
		let firstFileContent = fs.readFileSync(filePath)
		let firstFileType = "image/png"
		let firstFileExt = "png"

		try {
			await axios({
				method: "put",
				url: uploadPublisherLogoEndpointUrl.replace("{0}", "mine"),
				headers: {
					Authorization: accessToken,
					"Content-Type": firstFileType
				},
				data: firstFileContent
			})
		} catch (error) {
			assert.fail()
		}

		// Get the publisher table object
		let getPublisherObjResponse2 =
			await TableObjectsController.GetTableObject({
				accessToken,
				uuid: publisher.uuid
			})

		assert.equal(getPublisherObjResponse2.status, 200)

		// The publisher should still have the same logo
		let logoUuid2 =
			getPublisherObjResponse2.data.tableObject.GetPropertyValue("logo")
		assert.equal(logoUuid, logoUuid2)

		// Get the logo table object file
		let getLogoFileObjResponse =
			await TableObjectsController.GetTableObjectFile({
				accessToken,
				uuid: logoUuid
			})

		assert.equal(getLogoFileObjResponse.status, 200)
		assert.equal(getLogoFileObjResponse.data, firstFileContent)

		// Get the logo table object
		let getLogoObjResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: logoUuid
		})

		assert.equal(getLogoObjResponse.status, 200)
		assert.equal(
			getLogoObjResponse.data.tableObject.GetPropertyValue("type"),
			firstFileType
		)
		assert.equal(
			getLogoObjResponse.data.tableObject.GetPropertyValue("ext"),
			firstFileExt
		)
		assert.isNotNull(
			getLogoObjResponse.data.tableObject.GetPropertyValue("blurhash")
		)

		// Update the logo
		let secondFileType = "image/jpeg"
		let secondFileExt = "jpg"
		let secondFileContent =
			"Labore dicta cupiditate culpa cum harum. Corporis voluptatem debitis eos nam nisi esse in vitae. Molestiae rerum nesciunt sunt sed et dolorum."

		try {
			await axios({
				method: "put",
				url: uploadPublisherLogoEndpointUrl.replace("{0}", "mine"),
				headers: {
					Authorization: accessToken,
					"Content-Type": secondFileType
				},
				data: secondFileContent
			})
		} catch (error) {
			assert.fail()
		}

		// Get the publisher table object
		let getPublisherObjResponse3 =
			await TableObjectsController.GetTableObject({
				accessToken,
				uuid: publisher.uuid
			})

		assert.equal(getPublisherObjResponse3.status, 200)

		// The publisher should have the same logo
		assert.equal(
			getPublisherObjResponse3.data.tableObject.GetPropertyValue("logo"),
			logoUuid
		)

		// Get the logo table object file
		let getLogoFileObjResponse2 =
			await TableObjectsController.GetTableObjectFile({
				accessToken,
				uuid: logoUuid
			})

		assert.equal(getLogoFileObjResponse2.status, 200)
		assert.equal(getLogoFileObjResponse2.data, secondFileContent)

		// Get the logo table object
		let getLogoObjResponse2 = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: logoUuid
		})

		assert.equal(getLogoObjResponse2.status, 200)
		assert.equal(
			getLogoObjResponse2.data.tableObject.GetPropertyValue("type"),
			secondFileType
		)
		assert.equal(
			getLogoObjResponse2.data.tableObject.GetPropertyValue("ext"),
			secondFileExt
		)
		assert.isNull(
			getLogoObjResponse2.data.tableObject.GetPropertyValue("blurhash")
		)
	})
})