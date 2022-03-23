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

const setStoreBookFileEndpointUrl = `${constants.apiBaseUrl}/store/book/{0}/file`
var resetStoreBooks = false
var resetStoreBookReleases = false
var resetStoreBookFileItems = false
var resetStoreBookFiles = false

afterEach(async () => {
	if (resetStoreBooks) {
		await utils.resetStoreBooks()
		resetStoreBooks = false
	}

	if (resetStoreBookReleases) {
		await utils.resetStoreBookReleases()
		resetStoreBookReleases = false
	}

	if (resetStoreBookFileItems) {
		await utils.resetStoreBookFileItems()
		resetStoreBookFileItems = false
	}

	if (resetStoreBookFiles) {
		await utils.resetStoreBookFiles()
		resetStoreBookFiles = false
	}
})

describe("SetStoreBookFile endpoint", () => {
	it("should not set store book file without access token", async () => {
		try {
			await axios({
				method: 'put',
				url: setStoreBookFileEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid)
			})
		} catch (error) {
			assert.equal(error.response.status, 401)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.AuthorizationHeaderMissing)
			return
		}

		assert.fail()
	})

	it("should not set store book file with access token for session that does not exist", async () => {
		try {
			await axios({
				method: 'put',
				url: setStoreBookFileEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: "blablabla",
					'Content-Type': 'application/pdf'
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

	it("should not set store book file with access token for another app", async () => {
		try {
			await axios({
				method: 'put',
				url: setStoreBookFileEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: constants.testUserTestAppAccessToken,
					'Content-Type': 'application/epub+zip'
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

	it("should not set store book file without supported ebook content type", async () => {
		try {
			await axios({
				method: 'put',
				url: setStoreBookFileEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
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

	it("should not set store book file for store book that does not exist", async () => {
		try {
			await axios({
				method: 'put',
				url: setStoreBookFileEndpointUrl.replace('{0}', "blablabla"),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/pdf'
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 404)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.StoreBookDoesNotExist)
			return
		}

		assert.fail()
	})

	it("should not set store book file for store book that does not belong to the author", async () => {
		try {
			await axios({
				method: 'put',
				url: setStoreBookFileEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/epub+zip'
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

	it("should set store book file for published store book by creating new release", async () => {
		resetStoreBooks = true
		resetStoreBookReleases = true
		resetStoreBookFileItems = true
		resetStoreBookFiles = true
		await testCreateNewRelease(constants.authorUser.author.collections[1].books[1], constants.authorUser.accessToken)
	})

	it("should set store book file for hidden store book by creating new release", async () => {
		resetStoreBooks = true
		resetStoreBookReleases = true
		resetStoreBookFileItems = true
		resetStoreBookFiles = true
		await testCreateNewRelease(constants.authorUser.author.collections[0].books[1], constants.authorUser.accessToken)
	})

	it("should set store book file for unpublished store book by updating existing release", async () => {
		resetStoreBookFileItems = true
		resetStoreBookFiles = true
		await testUpdateExistingRelease(constants.authorUser.author.collections[1].books[0], constants.authorUser.accessToken)
	})

	it("should set store book file for published store book of admin by creating new release", async () => {
		resetStoreBooks = true
		resetStoreBookReleases = true
		resetStoreBookFileItems = true
		resetStoreBookFiles = true
		await testCreateNewRelease(constants.davUser.authors[0].collections[0].books[0], constants.davUser.accessToken)
	})

	it("should set store book file for hidden store book of admin by creating new release", async () => {
		resetStoreBooks = true
		resetStoreBookReleases = true
		resetStoreBookFileItems = true
		resetStoreBookFiles = true
		await testCreateNewRelease(constants.davUser.authors[0].collections[1].books[0], constants.davUser.accessToken)
	})

	it("should set store book file for unpublished store book of admin by updating existing release", async () => {
		resetStoreBookFileItems = true
		resetStoreBookFiles = true
		await testUpdateExistingRelease(constants.davUser.authors[0].collections[0].books[2], constants.davUser.accessToken)
	})

	async function testCreateNewRelease(storeBook, accessToken) {
		// Get the store book
		let storeBookResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: storeBook.uuid
		})

		assert.equal(storeBookResponse.status, 200)

		// Get the uuid of the last release
		let releases = storeBookResponse.data.tableObject.GetPropertyValue("releases").split(",")
		let lastRelease = releases.pop()

		// Upload the file
		let fileName = "animal_farm.pdf"
		let filePath = path.resolve(__dirname, `../files/${fileName}`)
		let fileContent = fs.readFileSync(filePath)
		let fileType = "application/pdf"
		let fileExt = "pdf"

		try {
			await axios({
				method: 'put',
				url: setStoreBookFileEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: accessToken,
					'Content-Type': fileType,
					'Content-Disposition': `attachment; filename="${fileName}"`
				},
				data: fileContent
			})
		} catch (error) {
			assert.fail()
		}

		// Get the store book (2)
		let storeBookResponse2 = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: storeBook.uuid
		})

		assert.equal(storeBookResponse2.status, 200)

		// Get the uuid of the last release
		let releases2 = storeBookResponse2.data.tableObject.GetPropertyValue("releases").split(",")
		let lastRelease2 = releases2.pop()

		// Check if there is a new release
		assert.notEqual(lastRelease2, lastRelease)

		// Get the store book release
		let storeBookReleaseResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: lastRelease2
		})

		assert.equal(storeBookReleaseResponse.status, 200)
		assert.equal(storeBookReleaseResponse.data.tableObject.GetPropertyValue("status") ?? "unpublished", "unpublished")

		let fileItemUuid = storeBookReleaseResponse.data.tableObject.GetPropertyValue("file_item")
		assert.isNotNull(fileItemUuid)
		assert.notEqual(fileItemUuid, storeBook.releases[0].fileItem.uuid)

		// Get the file item
		let fileItemResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: fileItemUuid
		})

		assert.equal(fileItemResponse.status, 200)
		assert.equal(fileItemResponse.data.tableObject.Uuid, fileItemUuid)
		assert.equal(fileItemResponse.data.tableObject.GetPropertyValue("file_name"), fileName)

		let fileUuid = fileItemResponse.data.tableObject.GetPropertyValue("file")
		assert.isNotNull(fileUuid)

		// Get the file
		let fileObjResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: fileUuid
		})

		assert.equal(fileObjResponse.status, 200)
		assert.equal(fileObjResponse.data.tableObject.GetPropertyValue("type"), fileType)
		assert.equal(fileObjResponse.data.tableObject.GetPropertyValue("ext"), fileExt)

		// Download the file
		let fileResponse = await TableObjectsController.GetTableObjectFile({
			accessToken,
			uuid: fileUuid
		})

		assert.equal(fileResponse.status, 200)
		assert.equal(fileResponse.data, fileContent)
	}

	async function testUpdateExistingRelease(storeBook, accessToken) {
		// Get the store book
		let storeBookResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: storeBook.uuid
		})

		assert.equal(storeBookResponse.status, 200)

		// Get the uuid of the last release
		let releases = storeBookResponse.data.tableObject.GetPropertyValue("releases").split(",")
		let lastRelease = releases.pop()

		// Upload the file
		let fileName = "animal_farm.pdf"
		let filePath = path.resolve(__dirname, `../files/${fileName}`)
		let fileContent = fs.readFileSync(filePath)
		let fileType = "application/pdf"
		let fileExt = "pdf"

		try {
			await axios({
				method: 'put',
				url: setStoreBookFileEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: accessToken,
					'Content-Type': fileType,
					'Content-Disposition': `attachment; filename="${fileName}"`
				},
				data: fileContent
			})
		} catch (error) {
			assert.fail()
		}

		// Get the store book (2)
		let storeBookResponse2 = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: storeBook.uuid
		})

		assert.equal(storeBookResponse2.status, 200)

		// Get the uuid of the last release
		let releases2 = storeBookResponse2.data.tableObject.GetPropertyValue("releases").split(",")
		let lastRelease2 = releases2.pop()

		// Check if this is the same release
		assert.equal(lastRelease2, lastRelease)

		// Get the store book release
		let storeBookReleaseResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: lastRelease2
		})

		assert.equal(storeBookReleaseResponse.status, 200)

		let fileItemUuid = storeBookReleaseResponse.data.tableObject.GetPropertyValue("file_item")
		assert.isNotNull(fileItemUuid)

		if (storeBook.releases[0].fileItem) {
			assert.equal(fileItemUuid, storeBook.releases[0].fileItem.uuid)
		}

		// Get the file item
		let fileItemResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: fileItemUuid
		})

		assert.equal(fileItemResponse.status, 200)
		assert.equal(fileItemResponse.data.tableObject.Uuid, fileItemUuid)
		assert.equal(fileItemResponse.data.tableObject.GetPropertyValue("file_name"), fileName)

		let fileUuid = fileItemResponse.data.tableObject.GetPropertyValue("file")

		if (storeBook.releases[0].fileItem) {
			assert.equal(storeBook.releases[0].fileItem.file.uuid, fileUuid)
		}

		// Get the file
		let fileObjResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: fileUuid
		})

		assert.equal(fileObjResponse.status, 200)
		assert.equal(fileObjResponse.data.tableObject.GetPropertyValue("type"), fileType)
		assert.equal(fileObjResponse.data.tableObject.GetPropertyValue("ext"), fileExt)

		// Download the file
		let fileResponse = await TableObjectsController.GetTableObjectFile({
			accessToken,
			uuid: fileUuid
		})

		assert.equal(fileResponse.status, 200)
		assert.equal(fileResponse.data, fileContent)
	}
})