import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'
import * as ErrorCodes from '../errorCodes.js'

const listStoreBookReleasesEndpointUrl = `${constants.apiBaseUrl}/store_book_releases`

describe("ListStoreBookReleases endpoint", () => {
	it("should not return store book releases without access token", async () => {
		try {
			await axios({
				method: 'get',
				url: listStoreBookReleasesEndpointUrl
			})
		} catch (error) {
			assert.equal(error.response.status, 401)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.AuthorizationHeaderMissing)
			return
		}

		assert.fail()
	})

	it("should not return store book releases with access token for session that does not exist", async () => {
		try {
			await axios({
				method: 'get',
				url: listStoreBookReleasesEndpointUrl,
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

	it("should not return store book releases with access token for another app", async () => {
		try {
			await axios({
				method: 'get',
				url: listStoreBookReleasesEndpointUrl,
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

	it("should not return store book releases if the user is not the author", async () => {
		try {
			await axios({
				method: 'get',
				url: listStoreBookReleasesEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken
				},
				params: {
					store_book: constants.davUser.authors[0].collections[0].books[0].uuid
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

	it("should return store book releases", async () => {
		let storeBook = constants.authorUser.author.collections[0].books[1]
		let response

		try {
			response = await axios({
				method: 'get',
				url: listStoreBookReleasesEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken
				},
				params: {
					store_book: storeBook.uuid,
					fields: "*"
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 2)
		assert.equal(response.data.items.length, storeBook.releases.length)

		for (let responseRelease of response.data.items) {
			let release = storeBook.releases.find(r => r.uuid == responseRelease.uuid)
			let coverItem = null
			let fileItem = null

			if (release.coverItem != null) {
				coverItem = constants.authorUser.author.coverItems.find(c => c.uuid == release.coverItem)
			}
			if (release.fileItem != null) {
				fileItem = constants.authorUser.author.fileItems.find(f => f.uuid == release.fileItem)
			}

			assert.isNotNull(release)
			assert.equal(Object.keys(responseRelease).length, 12)
			assert.equal(responseRelease.uuid, release.uuid)
			assert.equal(responseRelease.store_book, storeBook.uuid)
			assert.equal(responseRelease.release_name, release.releaseName)
			assert.equal(responseRelease.release_notes, release.releaseNotes)
			assert.equal(responseRelease.title, release.title)
			assert.equal(responseRelease.description, release.description)
			assert.equal(responseRelease.price, release.price ?? 0)
			assert.equal(responseRelease.isbn, release.isbn)
			if (responseRelease.cover) assert.isNotNull(responseRelease.cover.url)
			assert.equal(responseRelease.cover?.aspect_ratio, coverItem?.aspectRatio)
			assert.equal(responseRelease.cover?.blurhash, coverItem?.blurhash)
			assert.equal(responseRelease.file?.file_name, fileItem?.fileName)

			if (release.categories) {
				assert.equal(responseRelease.categories.length, release.categories.length)
	
				for (let key of responseRelease.categories) {
					assert.isNotNull(constants.categories.find(c => c.key == key))
				}
			} else {
				assert.equal(responseRelease.categories.length, 0)
			}
		}
	})

	it("should return store book releases of admin", async () => {
		let storeBook = constants.davUser.authors[0].collections[0].books[0]
		let response

		try {
			response = await axios({
				method: 'get',
				url: listStoreBookReleasesEndpointUrl,
				headers: {
					Authorization: constants.davUser.accessToken
				},
				params: {
					store_book: storeBook.uuid,
					fields: "*"
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(Object.keys(response.data).length, 2)
		assert.equal(response.data.items.length, storeBook.releases.length)

		for (let responseRelease of response.data.items) {
			let release = storeBook.releases.find(r => r.uuid == responseRelease.uuid)
			let coverItem = null
			let fileItem = null

			if (release.coverItem != null) {
				coverItem = constants.davUser.authors[0].coverItems.find(c => c.uuid == release.coverItem)
			}
			if (release.fileItem != null) {
				fileItem = constants.davUser.authors[0].fileItems.find(f => f.uuid == release.fileItem)
			}

			assert.isNotNull(release)
			assert.equal(Object.keys(responseRelease).length, 12)
			assert.equal(responseRelease.uuid, release.uuid)
			assert.equal(responseRelease.store_book, storeBook.uuid)
			assert.equal(responseRelease.release_name, release.releaseName)
			assert.equal(responseRelease.release_notes, release.releaseNotes)
			assert.equal(responseRelease.title, release.title)
			assert.equal(responseRelease.description, release.description)
			assert.equal(responseRelease.price, release.price ?? 0)
			assert.equal(responseRelease.isbn, release.isbn)
			if (responseRelease.cover) assert.isNotNull(responseRelease.cover.url)
			assert.equal(responseRelease.cover?.aspect_ratio, coverItem?.aspectRatio)
			assert.equal(responseRelease.cover?.blurhash, coverItem?.blurhash)
			assert.equal(responseRelease.file?.file_name, fileItem?.fileName)

			if (release.categories) {
				assert.equal(responseRelease.categories.length, release.categories.length)
	
				for (let key of responseRelease.categories) {
					assert.isNotNull(constants.categories.find(c => c.key == key))
				}
			} else {
				assert.equal(responseRelease.categories.length, 0)
			}
		}
	})
})