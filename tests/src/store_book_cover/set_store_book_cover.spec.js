import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import path from 'path'
import url from 'url'
const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
import fs from 'fs'
import { TableObjectsController } from 'dav-npm'
import constants from '../constants.js'
import * as utils from '../utils.js'
import * as ErrorCodes from '../errorCodes.js'

const setStoreBookCoverEndpointUrl = `${constants.apiBaseUrl}/api/1/call/store/book/{0}/cover`
var resetStoreBooksAndStoreBookCovers = false

afterEach(async () => {
	if (resetStoreBooksAndStoreBookCovers) {
		await utils.resetStoreBooks()
		await utils.resetStoreBookCovers()
		resetStoreBooksAndStoreBookCovers = false
	}
})

describe("SetStoreBookCover endpoint", () => {
	it("should not set store book cover without access token", async () => {
		try {
			await axios.default({
				method: 'put',
				url: setStoreBookCoverEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid)
			})
		} catch (error) {
			assert.equal(401, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.AuthorizationHeaderMissing, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not set store book cover with access token for session that does not exist", async () => {
		try {
			await axios.default({
				method: 'put',
				url: setStoreBookCoverEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: "blablabla",
					'Content-Type': 'image/png'
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

	it("should not set store book cover with access token for another app", async () => {
		try {
			await axios.default({
				method: 'put',
				url: setStoreBookCoverEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
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

	it("should not set store book cover without supported image content type", async () => {
		try {
			await axios.default({
				method: 'put',
				url: setStoreBookCoverEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
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

	it("should not set store book cover for store book that does not exist", async () => {
		try {
			await axios.default({
				method: 'put',
				url: setStoreBookCoverEndpointUrl.replace('{0}', "blablabla"),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'image/png'
				}
			})
		} catch (error) {
			assert.equal(404, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.StoreBookDoesNotExist, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not set store book cover for store book that does not belong to the author", async () => {
		try {
			await axios.default({
				method: 'put',
				url: setStoreBookCoverEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: constants.davUser.accessToken,
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

	it("should set store book cover for published store book", async () => {
		resetStoreBooksAndStoreBookCovers = true
		await testUpdateStoreBookCover(constants.authorUser.author.collections[1].books[1], constants.authorUser.accessToken)
	})

	it("should set store book cover for hidden store book", async () => {
		resetStoreBooksAndStoreBookCovers = true
		await testUpdateStoreBookCover(constants.authorUser.author.collections[0].books[1], constants.authorUser.accessToken)
	})

	it("should create and update store book cover", async () => {
		resetStoreBooksAndStoreBookCovers = true
		await testCreateAndUpdateStoreBookCover(constants.authorUser.author.collections[2].books[0], constants.authorUser.accessToken)
	})

	it("should set store book cover for published store book of admin", async () => {
		resetStoreBooksAndStoreBookCovers = true
		await testUpdateStoreBookCover(constants.davUser.authors[0].collections[0].books[0], constants.davUser.accessToken)
	})

	it("should set store book cover for hidden store book of admin", async () => {
		resetStoreBooksAndStoreBookCovers = true
		await testCreateAndUpdateStoreBookCover(constants.davUser.authors[0].collections[1].books[0], constants.davUser.accessToken)
	})

	it("should create and update store book cover of store book of an admin", async () => {
		resetStoreBooksAndStoreBookCovers = true
		await testCreateAndUpdateStoreBookCover(constants.davUser.authors[0].collections[0].books[1], constants.davUser.accessToken)
	})

	async function testCreateAndUpdateStoreBookCover(storeBook, accessToken) {
		// Get the store book table object (1)
		let getStoreBookObjResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: storeBook.uuid
		})

		if (getStoreBookObjResponse.status != 200) {
			assert.fail()
		}

		// The store book should not have a cover
		assert.isNull(getStoreBookObjResponse.data.GetPropertyValue("cover_aspect_ratio"))
		assert.isNull(getStoreBookObjResponse.data.GetPropertyValue("cover_blurhash"))
		assert.isNull(getStoreBookObjResponse.data.GetPropertyValue("cover"))

		// Upload the cover (1)
		let filePath = path.resolve(__dirname, '../files/cover.png')
		let firstFileContent = fs.readFileSync(filePath)
		let firstFileType = "image/png"
		let firstFileExt = "png"

		try {
			await axios.default({
				method: 'put',
				url: setStoreBookCoverEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: accessToken,
					'Content-Type': firstFileType
				},
				data: firstFileContent
			})
		} catch (error) {
			assert.fail()
		}

		// Get the store book table object (2)
		let getStoreBookObjResponse2 = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: storeBook.uuid
		})

		if (getStoreBookObjResponse2.status != 200) {
			assert.fail()
		}

		// The store book should now have a cover and a cover_blurhash
		let coverUuid = getStoreBookObjResponse2.data.GetPropertyValue("cover")
		assert.isNotNull(coverUuid)
		assert.equal("1:1", getStoreBookObjResponse2.data.GetPropertyValue("cover_aspect_ratio"))
		assert.isNotNull(getStoreBookObjResponse2.data.GetPropertyValue("cover_blurhash"))

		// Get the cover table object file (1)
		let getCoverFileObjResponse = await TableObjectsController.GetTableObjectFile({
			accessToken,
			uuid: coverUuid
		})

		if (getCoverFileObjResponse.status != 200) {
			assert.fail()
		}

		assert.equal(getCoverFileObjResponse.data, firstFileContent)

		// Get the cover table object (1)
		let getCoverObjResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: coverUuid
		})

		if (getCoverObjResponse.status != 200) {
			assert.fail()
		}

		assert.equal(firstFileType, getCoverObjResponse.data.GetPropertyValue("type"))
		assert.equal(firstFileExt, getCoverObjResponse.data.GetPropertyValue("ext"))

		// Update the cover (2)
		let secondFileType = "image/jpeg"
		let secondFileExt = "jpg"
		let secondFileContent = "Labore dicta cupiditate culpa cum harum. Corporis voluptatem debitis eos nam nisi esse in vitae. Molestiae rerum nesciunt sunt sed et dolorum."

		try {
			await axios.default({
				method: 'put',
				url: setStoreBookCoverEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: accessToken,
					'Content-Type': secondFileType
				},
				data: secondFileContent
			})
		} catch (error) {
			assert.fail()
		}

		// Get the store book table object (3)
		let getStoreBookObjResponse3 = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: storeBook.uuid
		})

		if (getStoreBookObjResponse3.status != 200) {
			assert.fail()
		}

		// The cover_aspect_ratio and cover_blurhash of the store book should be null
		assert.equal(coverUuid, getStoreBookObjResponse3.data.GetPropertyValue("cover"))
		assert.isNull(getStoreBookObjResponse3.data.GetPropertyValue("cover_aspect_ratio"))
		assert.isNull(getStoreBookObjResponse3.data.GetPropertyValue("cover_blurhash"))

		// Get the cover table object file (2)
		let getCoverFileObjResponse2 = await TableObjectsController.GetTableObjectFile({
			accessToken,
			uuid: coverUuid
		})

		if (getCoverFileObjResponse2.status != 200) {
			assert.fail()
		}

		assert.equal(getCoverFileObjResponse2.data, secondFileContent)

		// Get the cover table object (2)
		let getCoverObjResponse2 = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: coverUuid
		})

		if (getCoverObjResponse2.status != 200) {
			assert.fail()
		}

		assert.equal(secondFileType, getCoverObjResponse2.data.GetPropertyValue("type"))
		assert.equal(secondFileExt, getCoverObjResponse2.data.GetPropertyValue("ext"))
	}

	async function testUpdateStoreBookCover(storeBook, accessToken) {
		// Get the store book table object (1)
		let getStoreBookObjResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: storeBook.uuid
		})

		if (getStoreBookObjResponse.status != 200) {
			assert.fail()
		}

		// The store book should have a cover
		let coverUuid = getStoreBookObjResponse.data.GetPropertyValue("cover")
		assert.isNotNull(coverUuid)

		// Upload the cover (1)
		let filePath = path.resolve(__dirname, '../files/cover.png')
		let firstFileContent = fs.readFileSync(filePath)
		let firstFileType = "image/png"
		let firstFileExt = "png"

		try {
			await axios.default({
				method: 'put',
				url: setStoreBookCoverEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: accessToken,
					'Content-Type': firstFileType
				},
				data: firstFileContent
			})
		} catch (error) {
			assert.fail()
		}

		// Get the store book table object (2)
		let getStoreBookObjResponse2 = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: storeBook.uuid
		})

		if (getStoreBookObjResponse2.status != 200) {
			assert.fail()
		}

		// The store book should have the cover and a cover_blurhash
		assert.equal(coverUuid, getStoreBookObjResponse2.data.GetPropertyValue("cover"))
		assert.equal("1:1", getStoreBookObjResponse2.data.GetPropertyValue("cover_aspect_ratio"))
		assert.isNotNull(getStoreBookObjResponse2.data.GetPropertyValue("cover_blurhash"))

		// Get the cover table object file (1)
		let getCoverFileObjResponse = await TableObjectsController.GetTableObjectFile({
			accessToken,
			uuid: coverUuid
		})

		if (getCoverFileObjResponse.status != 200) {
			assert.fail()
		}

		assert.equal(getCoverFileObjResponse.data, firstFileContent)

		// Get the cover table object (1)
		let getCoverObjResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: coverUuid
		})

		if (getCoverObjResponse.status != 200) {
			assert.fail()
		}

		assert.equal(firstFileType, getCoverObjResponse.data.GetPropertyValue("type"))
		assert.equal(firstFileExt, getCoverObjResponse.data.GetPropertyValue("ext"))

		// Update the cover (2)
		let secondFileType = "image/jpeg"
		let secondFileExt = "jpg"
		let secondFileContent = "Labore dicta cupiditate culpa cum harum. Corporis voluptatem debitis eos nam nisi esse in vitae. Molestiae rerum nesciunt sunt sed et dolorum."

		try {
			await axios.default({
				method: 'put',
				url: setStoreBookCoverEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: accessToken,
					'Content-Type': secondFileType
				},
				data: secondFileContent
			})
		} catch (error) {
			assert.fail()
		}

		// Get the store book table object (3)
		let getStoreBookObjResponse3 = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: storeBook.uuid
		})

		if (getStoreBookObjResponse3.status != 200) {
			assert.fail()
		}

		// The cover_aspect_ratio and cover_blurhash of the store book should be null
		assert.equal(coverUuid, getStoreBookObjResponse3.data.GetPropertyValue("cover"))
		assert.isNull(getStoreBookObjResponse3.data.GetPropertyValue("cover_aspect_ratio"))
		assert.isNull(getStoreBookObjResponse3.data.GetPropertyValue("cover_blurhash"))

		// Get the cover table object file (2)
		let getCoverFileObjResponse2 = await TableObjectsController.GetTableObjectFile({
			accessToken,
			uuid: coverUuid
		})

		if (getCoverFileObjResponse2.status != 200) {
			assert.fail()
		}

		assert.equal(getCoverFileObjResponse2.data, secondFileContent)

		// Get the cover table object (2)
		let getCoverObjResponse2 = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: coverUuid
		})

		if (getCoverObjResponse2.status != 200) {
			assert.fail()
		}

		assert.equal(secondFileType, getCoverObjResponse2.data.GetPropertyValue("type"))
		assert.equal(secondFileExt, getCoverObjResponse2.data.GetPropertyValue("ext"))
	}
})