import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'
import * as ErrorCodes from '../errorCodes.js'

const getStoreBookFileEndpointUrl = `${constants.apiBaseUrl}/store/book/{0}/file`

describe("GetStoreBookFile endpoint", () => {
	it("should not return store book file without access token", async () => {
		try {
			await axios({
				method: 'get',
				url: getStoreBookFileEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[1].uuid)
			})
		} catch (error) {
			assert.equal(error.response.status, 401)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.AuthorizationHeaderMissing)
			return
		}

		assert.fail()
	})

	it("should not return store book file with access token for session that does not exist", async () => {
		try {
			await axios({
				method: 'get',
				url: getStoreBookFileEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[1].uuid),
				headers: {
					Authorization: "bkaasdasdfdasd"
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

	it("should not return store book file with access token for another app", async () => {
		try {
			await axios({
				method: 'get',
				url: getStoreBookFileEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[1].uuid),
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

	it("should not return store book file if the store book has no file", async () => {
		try {
			await axios({
				method: 'get',
				url: getStoreBookFileEndpointUrl.replace('{0}', constants.davUser.authors[0].collections[0].books[2].uuid),
				headers: {
					Authorization: constants.davUser.accessToken
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 404)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.StoreBookFileItemDoesNotExist)
			return
		}

		assert.fail()
	})

	it("should not return store book file if the store book does not exist", async () => {
		try {
			await axios({
				method: 'get',
				url: getStoreBookFileEndpointUrl.replace('{0}', "asdasdasdsda"),
				headers: {
					Authorization: constants.authorUser.accessToken
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

	it("should return file of unpublished store book if the user is the author", async () => {
		let accessToken = constants.authorUser.accessToken
		let storeBook = constants.authorUser.author.collections[1].books[0]

		await testShouldReturnFile(accessToken, storeBook)
	})

	it("should return file of unpublished store book if the user is an admin", async () => {
		let accessToken = constants.davUser.accessToken
		let storeBook = constants.authorUser.author.collections[1].books[0]

		await testShouldReturnFile(accessToken, storeBook)
	})

	it("should not return file of unpublished store book if the user is not the author", async () => {
		let accessToken = constants.testUser.accessToken
		let storeBook = constants.authorUser.author.collections[1].books[0]

		await testShouldNotReturnFile(accessToken, storeBook)
	})

	it("should not return file of unpublished store book if the user is on dav Pro", async () => {
		let accessToken = constants.klausUser.accessToken
		let storeBook = constants.authorUser.author.collections[1].books[0]

		await testShouldNotReturnFile(accessToken, storeBook)
	})

	it("should return file of store book in review if the user is the author", async () => {
		let accessToken = constants.authorUser.accessToken
		let storeBook = constants.authorUser.author.collections[0].books[0]

		await testShouldReturnFile(accessToken, storeBook)
	})

	it("should return file of store book in review if the user is an admin", async () => {
		let accessToken = constants.davUser.accessToken
		let storeBook = constants.authorUser.author.collections[0].books[0]

		await testShouldReturnFile(accessToken, storeBook)
	})

	it("should not return file of store book in review if the user is not the author", async () => {
		let accessToken = constants.testUser.accessToken
		let storeBook = constants.authorUser.author.collections[0].books[0]

		await testShouldNotReturnFile(accessToken, storeBook)
	})

	it("should not return file of store book in review if the user is on dav Pro", async () => {
		let accessToken = constants.klausUser.accessToken
		let storeBook = constants.authorUser.author.collections[0].books[0]

		await testShouldNotReturnFile(accessToken, storeBook)
	})

	it("should return file of published store book if the user is the author", async () => {
		let accessToken = constants.authorUser.accessToken
		let storeBook = constants.authorUser.author.collections[1].books[1]

		await testShouldReturnFile(accessToken, storeBook)
	})

	it("should return file of published store book if the user is an admin", async () => {
		let accessToken = constants.davUser.accessToken
		let storeBook = constants.authorUser.author.collections[1].books[1]

		await testShouldReturnFile(accessToken, storeBook)
	})

	it("should not return file of published store book if the user is not the author", async () => {
		let accessToken = constants.testUser.accessToken
		let storeBook = constants.authorUser.author.collections[1].books[1]

		await testShouldNotReturnFile(accessToken, storeBook)
	})

	it("should not return file of published store book if the user is on dav Pro", async () => {
		let accessToken = constants.klausUser.accessToken
		let storeBook = constants.authorUser.author.collections[1].books[1]

		await testShouldNotReturnFile(accessToken, storeBook)
	})

	it("should return file of published store book if the user is on dav Pro and has the StoreBook in the library", async () => {
		let accessToken = constants.klausUser.accessToken
		let storeBook = constants.davUser.authors[0].collections[0].books[0]

		await testShouldReturnFile(accessToken, storeBook)
	})

	it("should return file of hidden store book if the user is the author", async () => {
		let accessToken = constants.authorUser.accessToken
		let storeBook = constants.authorUser.author.collections[0].books[1]

		await testShouldReturnFile(accessToken, storeBook)
	})

	it("should return file of hidden store book if the user is an admin", async () => {
		let accessToken = constants.davUser.accessToken
		let storeBook = constants.authorUser.author.collections[0].books[1]

		await testShouldReturnFile(accessToken, storeBook)
	})

	it("should not return file of hidden store book if the user is not the author", async () => {
		let accessToken = constants.testUser.accessToken
		let storeBook = constants.authorUser.author.collections[0].books[1]

		await testShouldNotReturnFile(accessToken, storeBook)
	})

	it("should not return file of hidden store book if the user is on dav Pro", async () => {
		let accessToken = constants.klausUser.accessToken
		let storeBook = constants.authorUser.author.collections[0].books[1]

		await testShouldNotReturnFile(accessToken, storeBook)
	})
})

async function testShouldReturnFile(accessToken, storeBook) {
	let response

	try {
		response = await axios({
			method: 'get',
			url: getStoreBookFileEndpointUrl.replace('{0}', storeBook.uuid),
			headers: {
				Authorization: accessToken
			}
		})
	} catch (error) {
		assert.fail()
	}

	assert.equal(response.status, 200)
	assert.equal(response.headers['content-type'], storeBook.releases[storeBook.releases.length - 1].fileItem.file.type)
	assert.isTrue(response.data.length > 0)
}

async function testShouldNotReturnFile(accessToken, storeBook) {
	try {
		await axios({
			method: 'get',
			url: getStoreBookFileEndpointUrl.replace('{0}', storeBook.uuid),
			headers: {
				Authorization: accessToken
			}
		})
	} catch (error) {
		assert.equal(error.response.status, 403)
		assert.equal(error.response.data.errors.length, 1)
		assert.equal(error.response.data.errors[0].code, ErrorCodes.ActionNotAllowed)
		return
	}

	assert.fail()
}