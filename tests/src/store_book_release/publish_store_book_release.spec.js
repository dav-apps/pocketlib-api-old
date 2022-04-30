import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import { TableObjectsController } from 'dav-js'
import constants from '../constants.js'
import * as utils from '../utils.js'
import * as ErrorCodes from '../errorCodes.js'

const publishStoreBookReleaseEndpointUrl = `${constants.apiBaseUrl}/store_book_releases/{0}/publish`
var resetStoreBookReleases = false

afterEach(async () => {
	if(resetStoreBookReleases) {
		await utils.resetStoreBookReleases()
		resetStoreBookReleases = false
	}
})

describe("PublishStoreBookRelease endpoint", () => {
	it("should not publish store book release without access token", async () => {
		try {
			await axios({
				method: 'put',
				url: publishStoreBookReleaseEndpointUrl.replace('{0}', constants.authorUser.author.collections[3].books[0].releases[1].uuid)
			})
		} catch (error) {
			assert.equal(error.response.status, 401)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.AuthorizationHeaderMissing)
			return
		}

		assert.fail()
	})

	it("should not publish store book release with access token for session that does not exist", async () => {
		try {
			await axios({
				method: 'put',
				url: publishStoreBookReleaseEndpointUrl.replace('{0}', constants.authorUser.author.collections[3].books[0].releases[1].uuid),
				headers: {
					Authorization: "asdsadasdsda",
					"Content-Type": "application/json"
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

	it("should not publish store book release with access token for another app", async () => {
		try {
			await axios({
				method: 'put',
				url: publishStoreBookReleaseEndpointUrl.replace('{0}', constants.authorUser.author.collections[3].books[0].releases[1].uuid),
				headers: {
					Authorization: constants.testUserTestAppAccessToken,
					"Content-Type": "application/json"
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

	it("should not publish store book release if the user is not the author", async () => {
		try {
			await axios({
				method: 'put',
				url: publishStoreBookReleaseEndpointUrl.replace('{0}', constants.davUser.authors[0].collections[0].books[0].releases[1].uuid),
				headers: {
					Authorization: constants.authorUser.accessToken,
					"Content-Type": "application/json"
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

	it("should not publish store book release without Content-Type json", async () => {
		try {
			await axios({
				method: 'put',
				url: publishStoreBookReleaseEndpointUrl.replace('{0}', constants.authorUser.author.collections[3].books[0].releases[1].uuid),
				headers: {
					Authorization: constants.authorUser.accessToken
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

	it("should not publish store book release that does not exist", async () => {
		try {
			await axios({
				method: 'put',
				url: publishStoreBookReleaseEndpointUrl.replace('{0}', "asdopasjdksad"),
				headers: {
					Authorization: constants.davUser.accessToken,
					"Content-Type": "application/json"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 404)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.StoreBookReleaseDoesNotExist)
			return
		}

		assert.fail()
	})

	it("should not publish store book release that is already published", async () => {
		try {
			await axios({
				method: 'put',
				url: publishStoreBookReleaseEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[1].releases[1].uuid),
				headers: {
					Authorization: constants.authorUser.accessToken,
					"Content-Type": "application/json"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 412)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.StoreBookReleaseAlreadyPublished)
			return
		}

		assert.fail()
	})

	it("should not publish store book release of unpublished store book", async () => {
		try {
			await axios({
				method: 'put',
				url: publishStoreBookReleaseEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].releases[0].uuid),
				headers: {
					Authorization: constants.authorUser.accessToken,
					"Content-Type": 'application/json'
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 412)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.StoreBookNotPublished)
			return
		}

		assert.fail()
	})

	it("should not publish store book release without required properties", async () => {
		try {
			await axios({
				method: 'put',
				url: publishStoreBookReleaseEndpointUrl.replace('{0}', constants.authorUser.author.collections[3].books[0].releases[1].uuid),
				headers: {
					Authorization: constants.authorUser.accessToken,
					"Content-Type": "application/json"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.ReleaseNameMissing)
			return
		}

		assert.fail()
	})

	it("should not publish store book release with properties with wrong types", async () => {
		try {
			await axios({
				method: 'put',
				url: publishStoreBookReleaseEndpointUrl.replace('{0}', constants.authorUser.author.collections[3].books[0].releases[1].uuid),
				headers: {
					Authorization: constants.authorUser.accessToken,
					"Content-Type": "application/json"
				},
				data: {
					release_name: 1243
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.ReleaseNameWrongType)
			return
		}

		assert.fail()
	})

	it("should not publish store book release with optional properties with wrong types", async () => {
		try {
			await axios({
				method: 'put',
				url: publishStoreBookReleaseEndpointUrl.replace('{0}', constants.authorUser.author.collections[3].books[0].releases[1].uuid),
				headers: {
					Authorization: constants.authorUser.accessToken,
					"Content-Type": "application/json"
				},
				data: {
					release_name: true,
					release_notes: 123
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 2)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.ReleaseNameWrongType)
			assert.equal(error.response.data.errors[1].code, ErrorCodes.ReleaseNotesWrongType)
			return
		}

		assert.fail()
	})

	it("should not publish store book release with too short properties", async () => {
		try {
			await axios({
				method: 'put',
				url: publishStoreBookReleaseEndpointUrl.replace('{0}', constants.authorUser.author.collections[3].books[0].releases[1].uuid),
				headers: {
					Authorization: constants.authorUser.accessToken,
					"Content-Type": "application/json"
				},
				data: {
					release_name: "a"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.ReleaseNameTooShort)
			return
		}

		assert.fail()
	})

	it("should not publish store book release with too long properties", async () => {
		try {
			await axios({
				method: 'put',
				url: publishStoreBookReleaseEndpointUrl.replace('{0}', constants.authorUser.author.collections[3].books[0].releases[1].uuid),
				headers: {
					Authorization: constants.authorUser.accessToken,
					"Content-Type": "application/json"
				},
				data: {
					release_name: "a".repeat(200)
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.ReleaseNameTooLong)
			return
		}

		assert.fail()
	})
	
	it("should not publish store book release with too long optional properties", async () => {
		try {
			await axios({
				method: 'put',
				url: publishStoreBookReleaseEndpointUrl.replace('{0}', constants.authorUser.author.collections[3].books[0].releases[1].uuid),
				headers: {
					Authorization: constants.authorUser.accessToken,
					"Content-Type": "application/json"
				},
				data: {
					release_name: "a".repeat(200),
					release_notes: "a".repeat(6000)
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 2)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.ReleaseNameTooLong)
			assert.equal(error.response.data.errors[1].code, ErrorCodes.ReleaseNotesTooLong)
			return
		}

		assert.fail()
	})

	it("should publish store book release", async () => {
		resetStoreBookReleases = true
		let storeBook = constants.authorUser.author.collections[3].books[0]
		let release = storeBook.releases[1]
		let coverItem = constants.authorUser.author.coverItems.find(c => c.uuid == release.coverItem)
		let fileItem = constants.authorUser.author.fileItems.find(f => f.uuid == release.fileItem)
		let releaseName = "Test release"
		let response

		try {
			response = await axios({
				method: 'put',
				url: publishStoreBookReleaseEndpointUrl.replace('{0}', release.uuid),
				headers: {
					Authorization: constants.authorUser.accessToken,
					"Content-Type": "application/json"
				},
				params: {
					fields: "*"
				},
				data: {
					release_name: releaseName
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 13)
		assert.equal(response.data.uuid, release.uuid)
		assert.equal(response.data.store_book, storeBook.uuid)
		assert.equal(response.data.release_name, releaseName)
		assert.isNull(response.data.release_notes)
		assert.isNotNull(response.data.published_at)
		assert.equal(response.data.title, release.title)
		assert.equal(response.data.description, release.description)
		assert.equal(response.data.price, release.price ?? 0)
		assert.equal(response.data.isbn, release.isbn)
		assert.equal(response.data.status, "published")
		if (response.data.cover) assert.isNotNull(response.data.cover.url)
		assert.equal(response.data.cover?.aspect_ratio, coverItem?.aspectRatio)
		assert.equal(response.data.cover?.blurhash, coverItem?.blurhash)
		assert.equal(response.data.file?.file_name, fileItem?.fileName)

		if (release.categories) {
			assert.equal(response.data.categories.length, release.categories.length)

			for (let key of response.data.categories) {
				assert.isNotNull(constants.categories.find(c => c.key == key))
			}
		} else {
			assert.equal(response.data.categories.length, 0)
		}

		// Check if the data was correctly updated in the database
		// Get the release
		let releaseObjResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: release.uuid
		})

		assert.equal(releaseObjResponse.status, 200)
		assert.equal(releaseObjResponse.data.tableObject.Uuid, release.uuid)
		assert.equal(releaseObjResponse.data.tableObject.GetPropertyValue("status"), "published")
		assert.isNotNull(releaseObjResponse.data.tableObject.GetPropertyValue("published_at"))
		assert.equal(releaseObjResponse.data.tableObject.GetPropertyValue("release_name"), releaseName)
	})

	it("should publish store book release with optional properties", async () => {
		resetStoreBookReleases = true
		let storeBook = constants.authorUser.author.collections[3].books[0]
		let release = storeBook.releases[1]
		let coverItem = constants.authorUser.author.coverItems.find(c => c.uuid == release.coverItem)
		let fileItem = constants.authorUser.author.fileItems.find(f => f.uuid == release.fileItem)
		let releaseName = "Test release"
		let releaseNotes = "Test release notes"
		let response

		try {
			response = await axios({
				method: 'put',
				url: publishStoreBookReleaseEndpointUrl.replace('{0}', release.uuid),
				headers: {
					Authorization: constants.authorUser.accessToken,
					"Content-Type": "application/json"
				},
				params: {
					fields: "*"
				},
				data: {
					release_name: releaseName,
					release_notes: releaseNotes
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 13)
		assert.equal(response.data.uuid, release.uuid)
		assert.equal(response.data.store_book, storeBook.uuid)
		assert.equal(response.data.release_name, releaseName)
		assert.equal(response.data.release_notes, releaseNotes)
		assert.isNotNull(response.data.published_at)
		assert.equal(response.data.title, release.title)
		assert.equal(response.data.description, release.description)
		assert.equal(response.data.price, release.price ?? 0)
		assert.equal(response.data.isbn, release.isbn)
		assert.equal(response.data.status, "published")
		if (response.data.cover) assert.isNotNull(response.data.cover.url)
		assert.equal(response.data.cover?.aspect_ratio, coverItem?.aspectRatio)
		assert.equal(response.data.cover?.blurhash, coverItem?.blurhash)
		assert.equal(response.data.file?.file_name, fileItem?.fileName)

		if (release.categories) {
			assert.equal(response.data.categories.length, release.categories.length)

			for (let key of response.data.categories) {
				assert.isNotNull(constants.categories.find(c => c.key == key))
			}
		} else {
			assert.equal(response.data.categories.length, 0)
		}

		// Check if the data was correctly updated in the database
		// Get the release
		let releaseObjResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: release.uuid
		})

		assert.equal(releaseObjResponse.status, 200)
		assert.equal(releaseObjResponse.data.tableObject.Uuid, release.uuid)
		assert.equal(releaseObjResponse.data.tableObject.GetPropertyValue("status"), "published")
		assert.isNotNull(releaseObjResponse.data.tableObject.GetPropertyValue("published_at"))
		assert.equal(releaseObjResponse.data.tableObject.GetPropertyValue("release_name"), releaseName)
		assert.equal(releaseObjResponse.data.tableObject.GetPropertyValue("release_notes"), releaseNotes)
	})

	it("should publish store book release as admin", async () => {
		resetStoreBookReleases = true
		let storeBook = constants.davUser.authors[0].collections[0].books[0]
		let release = storeBook.releases[1]
		let coverItem = constants.davUser.authors[0].coverItems.find(c => c.uuid == release.coverItem)
		let fileItem = constants.davUser.authors[0].fileItems.find(f => f.uuid == release.fileItem)
		let releaseName = "Price update"
		let response

		try {
			response = await axios({
				method: 'put',
				url: publishStoreBookReleaseEndpointUrl.replace('{0}', release.uuid),
				headers: {
					Authorization: constants.davUser.accessToken,
					"Content-Type": "application/json"
				},
				params: {
					fields: "*"
				},
				data: {
					release_name: releaseName
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 13)
		assert.equal(response.data.uuid, release.uuid)
		assert.equal(response.data.store_book, storeBook.uuid)
		assert.equal(response.data.release_name, releaseName)
		assert.isNull(response.data.release_notes)
		assert.isNotNull(response.data.published_at)
		assert.equal(response.data.title, release.title)
		assert.equal(response.data.description, release.description)
		assert.equal(response.data.price, release.price ?? 0)
		assert.equal(response.data.isbn, release.isbn)
		assert.equal(response.data.status, "published")
		if (response.data.cover) assert.isNotNull(response.data.cover.url)
		assert.equal(response.data.cover?.aspect_ratio, coverItem?.aspectRatio)
		assert.equal(response.data.cover?.blurhash, coverItem?.blurhash)
		assert.equal(response.data.file?.file_name, fileItem?.fileName)

		if (release.categories) {
			assert.equal(response.data.categories.length, release.categories.length)

			for (let key of response.data.categories) {
				assert.isNotNull(constants.categories.find(c => c.key == key))
			}
		} else {
			assert.equal(response.data.categories.length, 0)
		}

		// Check if the data was correctly updated in the database
		// Get the release
		let releaseObjResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: release.uuid
		})

		assert.equal(releaseObjResponse.status, 200)
		assert.equal(releaseObjResponse.data.tableObject.Uuid, release.uuid)
		assert.equal(releaseObjResponse.data.tableObject.GetPropertyValue("status"), "published")
		assert.isNotNull(releaseObjResponse.data.tableObject.GetPropertyValue("published_at"))
		assert.equal(releaseObjResponse.data.tableObject.GetPropertyValue("release_name"), releaseName)
	})

	it("should publish store book release as admin with optional properties", async () => {
		resetStoreBookReleases = true
		let storeBook = constants.davUser.authors[0].collections[0].books[0]
		let release = storeBook.releases[1]
		let coverItem = constants.davUser.authors[0].coverItems.find(c => c.uuid == release.coverItem)
		let fileItem = constants.davUser.authors[0].fileItems.find(f => f.uuid == release.fileItem)
		let releaseName = "Price update"
		let releaseNotes = "Increase the price to 19,84 €"
		let response

		try {
			response = await axios({
				method: 'put',
				url: publishStoreBookReleaseEndpointUrl.replace('{0}', release.uuid),
				headers: {
					Authorization: constants.davUser.accessToken,
					"Content-Type": "application/json"
				},
				params: {
					fields: "*"
				},
				data: {
					release_name: releaseName,
					release_notes: releaseNotes
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 13)
		assert.equal(response.data.uuid, release.uuid)
		assert.equal(response.data.store_book, storeBook.uuid)
		assert.equal(response.data.release_name, releaseName)
		assert.equal(response.data.release_notes, releaseNotes)
		assert.isNotNull(response.data.published_at)
		assert.equal(response.data.title, release.title)
		assert.equal(response.data.description, release.description)
		assert.equal(response.data.price, release.price ?? 0)
		assert.equal(response.data.isbn, release.isbn)
		assert.equal(response.data.status, "published")
		if (response.data.cover) assert.isNotNull(response.data.cover.url)
		assert.equal(response.data.cover?.aspect_ratio, coverItem?.aspectRatio)
		assert.equal(response.data.cover?.blurhash, coverItem?.blurhash)
		assert.equal(response.data.file?.file_name, fileItem?.fileName)

		if (release.categories) {
			assert.equal(response.data.categories.length, release.categories.length)

			for (let key of response.data.categories) {
				assert.isNotNull(constants.categories.find(c => c.key == key))
			}
		} else {
			assert.equal(response.data.categories.length, 0)
		}

		// Check if the data was correctly updated in the database
		// Get the release
		let releaseObjResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: release.uuid
		})

		assert.equal(releaseObjResponse.status, 200)
		assert.equal(releaseObjResponse.data.tableObject.Uuid, release.uuid)
		assert.equal(releaseObjResponse.data.tableObject.GetPropertyValue("status"), "published")
		assert.isNotNull(releaseObjResponse.data.tableObject.GetPropertyValue("published_at"))
		assert.equal(releaseObjResponse.data.tableObject.GetPropertyValue("release_name"), releaseName)
		assert.equal(releaseObjResponse.data.tableObject.GetPropertyValue("release_notes"), releaseNotes)
	})
})