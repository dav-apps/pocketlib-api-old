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

const setStoreBookFileEndpointUrl = `${constants.apiBaseUrl}/api/1/call/store/book/{0}/file`
var resetStoreBooksAndStoreBookFiles = false

afterEach(async () => {
	if (resetStoreBooksAndStoreBookFiles) {
		await utils.resetStoreBooks()
		await utils.resetStoreBookFiles()
		resetStoreBooksAndStoreBookFiles = false
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
			assert.equal(401, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.AuthorizationHeaderMissing, error.response.data.errors[0].code)
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
			assert.equal(404, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.SessionDoesNotExist, error.response.data.errors[0].code)
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
			assert.equal(403, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.ActionNotAllowed, error.response.data.errors[0].code)
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
			assert.equal(415, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.ContentTypeNotSupported, error.response.data.errors[0].code)
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
			assert.equal(404, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.StoreBookDoesNotExist, error.response.data.errors[0].code)
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
			assert.equal(403, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.ActionNotAllowed, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not set store book file for published store book", async () => {
		try {
			await axios({
				method: 'put',
				url: setStoreBookFileEndpointUrl.replace('{0}', constants.authorUser.author.collections[1].books[1].uuid),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/pdf'
				},
				data: "Hello World"
			})
		} catch (error) {
			assert.equal(422, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.CannotUpdateFileOfPublishedStoreBook, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not set store book cover for hidden store book", async () => {
		try {
			await axios({
				method: 'put',
				url: setStoreBookFileEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[1].uuid),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/pdf'
				},
				data: "Hello World"
			})
		} catch (error) {
			assert.equal(422, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.CannotUpdateFileOfPublishedStoreBook, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should create and update store book file", async () => {
		resetStoreBooksAndStoreBookFiles = true
		await testCreateAndUpdateStoreBookFile(constants.authorUser.author.collections[2].books[0], constants.authorUser.accessToken)
	})

	it("should not set store book file for published store book of admin", async () => {
		try {
			await axios({
				method: 'put',
				url: setStoreBookFileEndpointUrl.replace('{0}', constants.davUser.authors[0].collections[0].books[0].uuid),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/pdf'
				},
				data: "Hello World"
			})
		} catch (error) {
			assert.equal(422, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.CannotUpdateFileOfPublishedStoreBook, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not set store book file for hidden store book of admin", async () => {
		try {
			await axios({
				method: 'put',
				url: setStoreBookFileEndpointUrl.replace('{0}', constants.davUser.authors[0].collections[1].books[0].uuid),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/pdf'
				},
				data: "Hello World"
			})
		} catch (error) {
			assert.equal(422, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.CannotUpdateFileOfPublishedStoreBook, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should create and update store book file of store book of an admin", async () => {
		resetStoreBooksAndStoreBookFiles = true
		await testCreateAndUpdateStoreBookFile(constants.davUser.authors[0].collections[0].books[2], constants.davUser.accessToken)
	})

	async function testCreateAndUpdateStoreBookFile(storeBook, accessToken) {
		// Get the store book table object
		let getStoreBookObjResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: storeBook.uuid
		})

		if (getStoreBookObjResponse.status != 200) {
			assert.fail()
		}

		// The store book should not have a file
		assert.isNull(getStoreBookObjResponse.data.GetPropertyValue("file"))

		// Upload the file (1)
		let fileName = "animal_farm.pdf"
		let filePath = path.resolve(__dirname, `../files/${fileName}`)
		let firstFileContent = fs.readFileSync(filePath)
		let firstFileType = "application/pdf"
		let firstFileExt = "pdf"

		try {
			await axios({
				method: 'put',
				url: setStoreBookFileEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: accessToken,
					'Content-Type': firstFileType,
					'Content-Disposition': `attachment; filename="${fileName}"`
				},
				data: firstFileContent
			})
		} catch (error) {
			assert.fail()
		}

		// Get the store book table object
		let getStoreBookObjResponse2 = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: storeBook.uuid
		})

		if (getStoreBookObjResponse2.status != 200) {
			assert.fail()
		}

		// The store book should now have a file
		let fileUuid = getStoreBookObjResponse2.data.GetPropertyValue("file")
		assert.isNotNull(fileUuid)
		assert.equal(fileName, getStoreBookObjResponse2.data.GetPropertyValue("file_name"))

		// Get the file table object file (1)
		let getFileFileObjResponse = await TableObjectsController.GetTableObjectFile({
			accessToken,
			uuid: fileUuid
		})

		if (getFileFileObjResponse.status != 200) {
			assert.fail()
		}

		assert.equal(getFileFileObjResponse.data, firstFileContent)

		// Get the file table object (1)
		let getFileObjResponse = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: fileUuid
		})

		if (getFileObjResponse.status != 200) {
			assert.fail()
		}

		assert.equal(firstFileType, getFileObjResponse.data.GetPropertyValue("type"))
		assert.equal(firstFileExt, getFileObjResponse.data.GetPropertyValue("ext"))

		// Update the file (2)
		let secondFileName = "test.epub"
		let secondFileType = "application/epub+zip"
		let secondFileExt = "epub"
		let secondFileContent = "Labore dicta cupiditate culpa cum harum. Corporis voluptatem debitis eos nam nisi esse in vitae. Molestiae rerum nesciunt sunt sed et dolorum."

		try {
			await axios({
				method: 'put',
				url: setStoreBookFileEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: accessToken,
					'Content-Type': secondFileType,
					'Content-Disposition': `attachment; filename="${secondFileName}"`
				},
				data: secondFileContent
			})
		} catch (error) {
			assert.fail()
		}

		// Get the file table object file (2)
		let getFileFileObjResponse2 = await TableObjectsController.GetTableObjectFile({
			accessToken,
			uuid: fileUuid
		})

		if (getFileFileObjResponse2.status != 200) {
			assert.fail()
		}

		assert.equal(getFileFileObjResponse2.data, secondFileContent)

		// Get the file table object (2)
		let getFileObjResponse2 = await TableObjectsController.GetTableObject({
			accessToken,
			uuid: fileUuid
		})

		if (getFileObjResponse2.status != 200) {
			assert.fail()
		}

		assert.equal(secondFileType, getFileObjResponse2.data.GetPropertyValue("type"))
		assert.equal(secondFileExt, getFileObjResponse2.data.GetPropertyValue("ext"))
	}
})