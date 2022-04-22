import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'
import * as ErrorCodes from '../errorCodes.js'

const retrieveStoreBookReleaseEndpointUrl = `${constants.apiBaseUrl}/store_book_releases/{0}`

describe("RetrieveStoreBookRelease endpoint", () => {
	it("should not return store book release without access token", async () => {
		try {
			await axios({
				method: 'get',
				url: retrieveStoreBookReleaseEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].releases[0].uuid)
			})
		} catch (error) {
			assert.equal(error.response.status, 401)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.AuthorizationHeaderMissing)
			return
		}

		assert.fail()
	})

	it("should not return store book release with access token for session that does not exist", async () => {
		try {
			await axios({
				method: 'get',
				url: retrieveStoreBookReleaseEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].releases[0].uuid),
				headers: {
					Authorization: "asdsadsdaasd"
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

	it("should not return store book release with access token for another app", async () => {
		try {
			await axios({
				method: 'get',
				url: retrieveStoreBookReleaseEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].releases[0].uuid),
				headers: {
					Authorization: constants.testUserTestAppAccessToken
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

	it("should not return store book release if the user is not the author", async () => {
		try {
			await axios({
				method: 'get',
				url: retrieveStoreBookReleaseEndpointUrl.replace('{0}', constants.davUser.authors[0].collections[0].books[0].releases[0].uuid),
				headers: {
					Authorization: constants.authorUser.accessToken
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

	it("should return store book release", async () => {
		let storeBook = constants.authorUser.author.collections[0].books[0]
		let release = storeBook.releases[0]
		let response

		try {
			response = await axios({
				method: 'get',
				url: retrieveStoreBookReleaseEndpointUrl.replace('{0}', release.uuid),
				headers: {
					Authorization: constants.authorUser.accessToken
				},
				params: {
					fields: "*"
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 12)
		assert.equal(response.data.uuid, release.uuid)
		assert.equal(response.data.store_book, storeBook.uuid)
		assert.equal(response.data.release_name, release.releaseName)
		assert.equal(response.data.release_notes, release.releaseNotes)
		assert.equal(response.data.title, release.title)
		assert.equal(response.data.description, release.description)
		assert.equal(response.data.price, release.price ?? 0)
		assert.equal(response.data.isbn, release.isbn)
		assert.equal(response.data.status, release.status)
		if (response.data.cover) assert.isNotNull(response.data.cover.url)
		assert.equal(response.data.cover?.aspect_ratio, release.coverItem?.aspectRatio)
		assert.equal(response.data.cover?.blurhash, release.coverItem?.blurhash)
		assert.equal(response.data.file?.file_name, release.fileItem?.fileName)

		if (release.categories) {
			assert.equal(response.data.categories.length, release.categories.length)

			for (let key of response.data.categories) {
				assert.isNotNull(constants.categories.find(c => c.key == key))
			}
		} else {
			assert.equal(response.data.categories.length, 0)
		}
	})

	it("should return store book release of admin", async () => {
		let storeBook = constants.davUser.authors[2].collections[0].books[0]
		let release = storeBook.releases[0]
		let response

		try {
			response = await axios({
				method: 'get',
				url: retrieveStoreBookReleaseEndpointUrl.replace('{0}', release.uuid),
				headers: {
					Authorization: constants.davUser.accessToken
				},
				params: {
					fields: "*"
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 12)
		assert.equal(response.data.uuid, release.uuid)
		assert.equal(response.data.store_book, storeBook.uuid)
		assert.equal(response.data.release_name, release.releaseName)
		assert.equal(response.data.release_notes, release.releaseNotes)
		assert.equal(response.data.title, release.title)
		assert.equal(response.data.description, release.description)
		assert.equal(response.data.price, release.price ?? 0)
		assert.equal(response.data.isbn, release.isbn)
		assert.equal(response.data.status, release.status)
		if (response.data.cover) assert.isNotNull(response.data.cover.url)
		assert.equal(response.data.cover?.aspect_ratio, release.coverItem?.aspectRatio)
		assert.equal(response.data.cover?.blurhash, release.coverItem?.blurhash)
		assert.equal(response.data.file?.file_name, release.fileItem?.fileName)

		if (release.categories) {
			assert.equal(response.data.categories.length, release.categories.length)

			for (let key of response.data.categories) {
				assert.isNotNull(constants.categories.find(c => c.key == key))
			}
		} else {
			assert.equal(response.data.categories.length, 0)
		}
	})
})