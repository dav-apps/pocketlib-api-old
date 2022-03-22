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

const setStoreBookCoverEndpointUrl = `${constants.apiBaseUrl}/store/book/{0}/cover`
var resetStoreBooks = false
var resetStoreBookReleases = false
var resetStoreBookCoverItems = false
var resetStoreBookCovers = false

afterEach(async () => {
	if (resetStoreBooks) {
		await utils.resetStoreBooks()
		resetStoreBooks = false
	}

	if (resetStoreBookReleases) {
		await utils.resetStoreBookReleases()
		resetStoreBookReleases = false
	}

	if (resetStoreBookCoverItems) {
		await utils.resetStoreBookCoverItems()
		resetStoreBookCoverItems = false
	}

	if (resetStoreBookCovers) {
		await utils.resetStoreBookCovers()
		resetStoreBookCovers = false
	}
})

describe("SetStoreBookCover endpoint", () => {
	it("should not set store book cover without access token", async () => {
		try {
			await axios({
				method: 'put',
				url: setStoreBookCoverEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid)
			})
		} catch (error) {
			assert.equal(error.response.status, 401)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.AuthorizationHeaderMissing)
			return
		}

		assert.fail()
	})

	it("should not set store book cover with access token for session that does not exist", async () => {
		try {
			await axios({
				method: 'put',
				url: setStoreBookCoverEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: "blablabla",
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

	it("should not set store book cover with access token for another app", async () => {
		try {
			await axios({
				method: 'put',
				url: setStoreBookCoverEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
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

	it("should not set store book cover without supported image content type", async () => {
		try {
			await axios({
				method: 'put',
				url: setStoreBookCoverEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
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

	it("should not set store book cover for store book that does not exist", async () => {
		try {
			await axios({
				method: 'put',
				url: setStoreBookCoverEndpointUrl.replace('{0}', "blablabla"),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'image/png'
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

	it("should not set store book cover for store book that does not belong to the author", async () => {
		try {
			await axios({
				method: 'put',
				url: setStoreBookCoverEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: constants.davUser.accessToken,
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

	it("should set store book cover for published store book by creating new release", async () => {
		resetStoreBooks = true
		resetStoreBookReleases = true
		resetStoreBookCoverItems = true
		resetStoreBookCovers = true
		await testCreateNewRelease(constants.authorUser.author.collections[1].books[1], constants.authorUser.accessToken)
	})

	it("should set store book cover for hidden store book by creating new release", async () => {
		resetStoreBooks = true
		resetStoreBookReleases = true
		resetStoreBookCoverItems = true
		resetStoreBookCovers = true
		await testCreateNewRelease(constants.authorUser.author.collections[0].books[1], constants.authorUser.accessToken)
	})

	it("should set store book cover for unpublished store book by updating existing release", async () => {
		resetStoreBookCoverItems = true
		resetStoreBookCovers = true
		await testUpdateExistingRelease(constants.authorUser.author.collections[1].books[0], constants.authorUser.accessToken)
	})

	it("should set store book cover for published store book of admin by creating new release", async () => {
		resetStoreBooks = true
		resetStoreBookReleases = true
		resetStoreBookCoverItems = true
		resetStoreBookCovers = true
		await testCreateNewRelease(constants.davUser.authors[0].collections[0].books[0], constants.davUser.accessToken)
	})

	it("should set store book cover for hidden store book of admin by creating new release", async () => {
		resetStoreBooks = true
		resetStoreBookReleases = true
		resetStoreBookCoverItems = true
		resetStoreBookCovers = true
		await testCreateNewRelease(constants.davUser.authors[0].collections[1].books[0], constants.davUser.accessToken)
	})

	it("should set store book cover for unpublished store book of admin by updating existing release", async () => {
		resetStoreBookCoverItems = true
		resetStoreBookCovers = true
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

		// Upload the cover
		let filePath = path.resolve(__dirname, '../files/cover.png')
		let fileContent = fs.readFileSync(filePath)
		let fileType = "image/png"
		let fileExt = "png"

		try {
			await axios({
				method: 'put',
				url: setStoreBookCoverEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: accessToken,
					'Content-Type': fileType
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

		let coverItemUuid = storeBookReleaseResponse.data.tableObject.GetPropertyValue("cover_item")
		assert.isNotNull(coverItemUuid)
		assert.notEqual(coverItemUuid, storeBook.releases[0].coverItem.uuid)

		// Get the cover item
		let coverItemResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: coverItemUuid
		})

		assert.equal(coverItemResponse.status, 200)
		assert.equal(coverItemResponse.data.tableObject.Uuid, coverItemUuid)
		assert.equal(coverItemResponse.data.tableObject.GetPropertyValue("aspect_ratio"), "1:1")
		assert.isNotNull(coverItemResponse.data.tableObject.GetPropertyValue("blurhash"))

		let coverUuid = coverItemResponse.data.tableObject.GetPropertyValue("cover")
		assert.isNotNull(coverUuid)

		// Get the cover
		let coverResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: coverUuid
		})

		assert.equal(coverResponse.status, 200)
		assert.equal(coverResponse.data.tableObject.GetPropertyValue("type"), fileType)
		assert.equal(coverResponse.data.tableObject.GetPropertyValue("ext"), fileExt)

		// Get the cover file
		let coverFileResponse = await TableObjectsController.GetTableObjectFile({
			accessToken,
			uuid: coverUuid
		})

		assert.equal(coverFileResponse.status, 200)
		assert.equal(coverFileResponse.data, fileContent)
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

		// Upload the cover
		let filePath = path.resolve(__dirname, '../files/cover.png')
		let fileContent = fs.readFileSync(filePath)
		let fileType = "image/png"
		let fileExt = "png"

		try {
			await axios({
				method: 'put',
				url: setStoreBookCoverEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: accessToken,
					'Content-Type': fileType
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

		let coverItemUuid = storeBookReleaseResponse.data.tableObject.GetPropertyValue("cover_item")
		assert.isNotNull(coverItemUuid)

		if (storeBook.releases[0].coverItem) {
			assert.equal(coverItemUuid, storeBook.releases[0].coverItem.uuid)
		}

		// Get the cover item
		let coverItemResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: coverItemUuid
		})

		assert.equal(coverItemResponse.status, 200)
		assert.equal(coverItemResponse.data.tableObject.Uuid, coverItemUuid)
		assert.equal(coverItemResponse.data.tableObject.GetPropertyValue("aspect_ratio"), "1:1")
		assert.isNotNull(coverItemResponse.data.tableObject.GetPropertyValue("blurhash"))

		let coverUuid = coverItemResponse.data.tableObject.GetPropertyValue("cover")

		if (storeBook.releases[0].coverItem) {
			assert.equal(storeBook.releases[0].coverItem.cover.uuid, coverUuid)
		}

		// Get the cover
		let coverResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: coverUuid
		})

		assert.equal(coverResponse.status, 200)
		assert.equal(coverResponse.data.tableObject.GetPropertyValue("type"), fileType)
		assert.equal(coverResponse.data.tableObject.GetPropertyValue("ext"), fileExt)

		// Get the cover file
		let coverFileResponse = await TableObjectsController.GetTableObjectFile({
			accessToken,
			uuid: coverUuid
		})

		assert.equal(coverFileResponse.status, 200)
		assert.equal(coverFileResponse.data, fileContent)
	}
})