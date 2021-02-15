import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import { TableObjectsController } from 'dav-npm'
import constants from '../constants.js'
import * as utils from '../utils.js'

const updateStoreBookEndpointUrl = `${constants.apiBaseUrl}/api/1/call/store/book/{0}`
var resetStoreBooks = false

afterEach(async () => {
	if (resetStoreBooks) {
		await utils.resetStoreBooks()
		resetStoreBooks = false
	}
})

describe("UpdateStoreBook endpoint", () => {
	it("should not update store book without access token", async () => {
		try {
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid)
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(2101, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not update store book with access token for session that does not exist", async () => {
		try {
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: "asdasdasdasdsda",
					'Content-Type': 'application/json'
				},
				data: {
					title: "Blabla"
				}
			})
		} catch (error) {
			assert.equal(404, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(2802, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not update store book without Content-Type json", async () => {
		try {
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: constants.authorUser.accessToken
				}
			})
		} catch (error) {
			assert.equal(415, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(1104, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not update store book that does not exist", async () => {
		try {
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', "blabla"),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					title: "Hello World",
					description: "Hello World"
				}
			})
		} catch (error) {
			assert.equal(404, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(2807, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not update store book with properties with wrong types", async () => {
		try {
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					title: 23,
					description: false,
					language: 2.2,
					price: "Hello World",
					isbn: 123,
					published: "Hello",
					categories: [123]
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(7, error.response.data.errors.length)
			assert.equal(2204, error.response.data.errors[0].code)
			assert.equal(2205, error.response.data.errors[1].code)
			assert.equal(2206, error.response.data.errors[2].code)
			assert.equal(2211, error.response.data.errors[3].code)
			assert.equal(2220, error.response.data.errors[4].code)
			assert.equal(2207, error.response.data.errors[5].code)
			assert.equal(2215, error.response.data.errors[6].code)
			return
		}

		assert.fail()
	})

	it("should not update store book with status with wrong type as admin", async () => {
		try {
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					status: 73
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(2214, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not update store book with too short properties", async () => {
		try {
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					title: "a",
					description: ""
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(2, error.response.data.errors.length)
			assert.equal(2304, error.response.data.errors[0].code)
			assert.equal(2305, error.response.data.errors[1].code)
			return
		}

		assert.fail()
	})

	it("should not update store book with too long properties", async () => {
		try {
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					title: "a".repeat(150),
					description: "a".repeat(2010)
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(2, error.response.data.errors.length)
			assert.equal(2404, error.response.data.errors[0].code)
			assert.equal(2405, error.response.data.errors[1].code)
			return
		}

		assert.fail()
	})

	it("should not update store book with not supported language", async () => {
		try {
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					language: "blablabla"
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(1107, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not update store book with invalid price", async () => {
		try {
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					price: -100
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(2501, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not update store book with invalid isbn", async () => {
		try {
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					isbn: "982934"
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(2507, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not update store book with not supported status as admin", async () => {
		try {
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', constants.davUser.authors[0].collections[0].books[0].uuid),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					status: "asdasd"
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(1113, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should update title of unpublished store book", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[0]

		await testShouldUpdateTitleOfStoreBook(collection, storeBook, constants.authorUser.accessToken)
	})

	it("should update title of store book in review", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[0]

		await testShouldUpdateTitleOfStoreBook(collection, storeBook, constants.authorUser.accessToken)
	})

	it("should update title of published store book", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[1]

		await testShouldUpdateTitleOfStoreBook(collection, storeBook, constants.authorUser.accessToken)
	})

	it("should update title of hidden store book", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[1]

		await testShouldUpdateTitleOfStoreBook(collection, storeBook, constants.authorUser.accessToken)
	})

	it("should update description of unpublished store book", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[0]

		await testShouldUpdateDescriptionOfStoreBook(collection, storeBook, constants.authorUser.accessToken)
	})

	it("should update description of store book in review", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[0]

		await testShouldUpdateDescriptionOfStoreBook(collection, storeBook, constants.authorUser.accessToken)
	})

	it("should update description of published store book", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[1]

		await testShouldUpdateDescriptionOfStoreBook(collection, storeBook, constants.authorUser.accessToken)
	})

	it("should update description of hidden store book", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[1]

		await testShouldUpdateDescriptionOfStoreBook(collection, storeBook, constants.authorUser.accessToken)
	})

	it("should update language of unpublished store book", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[0]

		await testShouldUpdateLanguageOfStoreBook(collection, storeBook, constants.authorUser.accessToken)
	})

	it("should update language of store book in review", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[0]

		await testShouldUpdateLanguageOfStoreBook(collection, storeBook, constants.authorUser.accessToken)
	})

	it("should not update language of published store book", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[1]

		await testShouldNotUpdateLanguageOfStoreBook(storeBook, constants.authorUser.accessToken)
	})

	it("should not update language of hidden store book", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[1]

		await testShouldNotUpdateLanguageOfStoreBook(storeBook, constants.authorUser.accessToken)
	})

	it("should update price of unpublished store book", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[0]

		await testShouldUpdatePriceOfStoreBook(collection, storeBook, constants.authorUser.accessToken)
	})

	it("should update price of store book in review", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[0]

		await testShouldUpdatePriceOfStoreBook(collection, storeBook, constants.authorUser.accessToken)
	})

	it("should not update price of published store book", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[1]

		await testShouldNotUpdatePriceOfStoreBook(storeBook, constants.authorUser.accessToken)
	})

	it("should not update price of hidden store book", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[1]

		await testShouldNotUpdatePriceOfStoreBook(storeBook, constants.authorUser.accessToken)
	})

	it("should update isbn of unpublished store book", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[0]

		await testShouldUpdateIsbnOfStoreBook(collection, storeBook, constants.authorUser.accessToken)
	})

	it("should update isbn of store book in review", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[0]

		await testShouldUpdateIsbnOfStoreBook(collection, storeBook, constants.authorUser.accessToken)
	})

	it("should not update isbn of published store book", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[1]

		await testShouldNotUpdateIsbnOfStoreBook(storeBook, constants.authorUser.accessToken)
	})

	it("should not update isbn of hidden store book", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[1]

		await testShouldNotUpdateIsbnOfStoreBook(storeBook, constants.authorUser.accessToken)
	})

	it("should update categories of unpublished store book", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[0]

		await testShouldUpdateCategoriesOfStoreBook(collection, storeBook, constants.authorUser.accessToken)
	})

	it("should update categories of store book in review", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[0]

		await testShouldUpdateCategoriesOfStoreBook(collection, storeBook, constants.authorUser.accessToken)
	})

	it("should update categories of published store book", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[1]

		await testShouldUpdateCategoriesOfStoreBook(collection, storeBook, constants.authorUser.accessToken)
	})

	it("should update categories of hidden store book", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[1]

		await testShouldUpdateCategoriesOfStoreBook(collection, storeBook, constants.authorUser.accessToken)
	})

	it("should update title of unpublished store book of admin", async () => {
		let collection = constants.davUser.authors[0].collections[1]
		let storeBook = collection.books[1]

		await testShouldUpdateTitleOfStoreBook(collection, storeBook, constants.davUser.accessToken)
	})

	it("should update title of store book in review of admin", async () => {
		let collection = constants.davUser.authors[0].collections[0]
		let storeBook = collection.books[1]

		await testShouldUpdateTitleOfStoreBook(collection, storeBook, constants.davUser.accessToken)
	})

	it("should update title of published store book of admin", async () => {
		let collection = constants.davUser.authors[0].collections[0]
		let storeBook = collection.books[0]

		await testShouldUpdateTitleOfStoreBook(collection, storeBook, constants.davUser.accessToken)
	})

	it("should update title of hidden store book of admin", async () => {
		let collection = constants.davUser.authors[0].collections[1]
		let storeBook = collection.books[1]

		await testShouldUpdateTitleOfStoreBook(collection, storeBook, constants.davUser.accessToken)
	})

	it("should update description of unpublished store book of admin", async () => {
		let collection = constants.davUser.authors[0].collections[1]
		let storeBook = collection.books[1]

		await testShouldUpdateDescriptionOfStoreBook(collection, storeBook, constants.davUser.accessToken)
	})

	it("should update description of store book in review of admin", async () => {
		let collection = constants.davUser.authors[0].collections[0]
		let storeBook = collection.books[1]

		await testShouldUpdateDescriptionOfStoreBook(collection, storeBook, constants.davUser.accessToken)
	})

	it("should update description of published store book of admin", async () => {
		let collection = constants.davUser.authors[0].collections[0]
		let storeBook = collection.books[0]

		await testShouldUpdateDescriptionOfStoreBook(collection, storeBook, constants.davUser.accessToken)
	})

	it("should update description of hidden store book of admin", async () => {
		let collection = constants.davUser.authors[0].collections[1]
		let storeBook = collection.books[1]

		await testShouldUpdateDescriptionOfStoreBook(collection, storeBook, constants.davUser.accessToken)
	})

	it("should update language of unpublished store book of admin", async () => {
		let collection = constants.davUser.authors[0].collections[1]
		let storeBook = collection.books[1]

		await testShouldUpdateLanguageOfStoreBook(collection, storeBook, constants.davUser.accessToken)
	})

	it("should update language of store book in review of admin", async () => {
		let collection = constants.davUser.authors[0].collections[0]
		let storeBook = collection.books[1]

		await testShouldUpdateLanguageOfStoreBook(collection, storeBook, constants.davUser.accessToken)
	})

	it("should not update language of published store book of admin", async () => {
		let collection = constants.davUser.authors[0].collections[0]
		let storeBook = collection.books[0]

		await testShouldNotUpdateLanguageOfStoreBook(storeBook, constants.davUser.accessToken)
	})

	it("should not update language of hidden store book of admin", async () => {
		let collection = constants.davUser.authors[0].collections[1]
		let storeBook = collection.books[0]

		await testShouldNotUpdateLanguageOfStoreBook(storeBook, constants.davUser.accessToken)
	})

	it("should update price of unpublished store book of admin", async () => {
		let collection = constants.davUser.authors[0].collections[1]
		let storeBook = collection.books[1]

		await testShouldUpdatePriceOfStoreBook(collection, storeBook, constants.davUser.accessToken)
	})

	it("should update price of store book in review of admin", async () => {
		let collection = constants.davUser.authors[0].collections[0]
		let storeBook = collection.books[1]

		await testShouldUpdatePriceOfStoreBook(collection, storeBook, constants.davUser.accessToken)
	})

	it("should not update price of published store book of admin", async () => {
		let collection = constants.davUser.authors[0].collections[0]
		let storeBook = collection.books[0]

		await testShouldNotUpdatePriceOfStoreBook(storeBook, constants.davUser.accessToken)
	})

	it("should not update price of hidden store book of admin", async () => {
		let collection = constants.davUser.authors[0].collections[1]
		let storeBook = collection.books[0]

		await testShouldNotUpdatePriceOfStoreBook(storeBook, constants.davUser.accessToken)
	})

	it("should update isbn of unpublished store book of admin", async () => {
		let collection = constants.davUser.authors[0].collections[1]
		let storeBook = collection.books[1]

		await testShouldUpdateIsbnOfStoreBook(collection, storeBook, constants.davUser.accessToken)
	})

	it("should update isbn of store book in review of admin", async () => {
		let collection = constants.davUser.authors[0].collections[0]
		let storeBook = collection.books[1]

		await testShouldUpdateIsbnOfStoreBook(collection, storeBook, constants.davUser.accessToken)
	})

	it("should not update isbn of published store book of admin", async () => {
		let collection = constants.davUser.authors[0].collections[0]
		let storeBook = collection.books[0]

		await testShouldNotUpdateIsbnOfStoreBook(storeBook, constants.davUser.accessToken)
	})

	it("should not update isbn of hidden store book of admin", async () => {
		let collection = constants.davUser.authors[0].collections[1]
		let storeBook = collection.books[0]

		await testShouldNotUpdateIsbnOfStoreBook(storeBook, constants.davUser.accessToken)
	})

	it("should update categories of unpublished store book of admin", async () => {
		let collection = constants.davUser.authors[0].collections[1]
		let storeBook = collection.books[1]

		await testShouldUpdateCategoriesOfStoreBook(collection, storeBook, constants.davUser.accessToken)
	})

	it("should update categories of store book in review of admin", async () => {
		let collection = constants.davUser.authors[0].collections[0]
		let storeBook = collection.books[1]

		await testShouldUpdateCategoriesOfStoreBook(collection, storeBook, constants.davUser.accessToken)
	})

	it("should update categories of published store book of admin", async () => {
		let collection = constants.davUser.authors[0].collections[0]
		let storeBook = collection.books[0]

		await testShouldUpdateCategoriesOfStoreBook(collection, storeBook, constants.davUser.accessToken)
	})

	it("should update categories of hidden store book of admin", async () => {
		let collection = constants.davUser.authors[0].collections[1]
		let storeBook = collection.books[0]

		await testShouldUpdateCategoriesOfStoreBook(collection, storeBook, constants.davUser.accessToken)
	})

	it("should update title of unpublished store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[0]

		await testShouldUpdateTitleOfStoreBook(collection, storeBook, constants.davUser.accessToken, constants.authorUser.accessToken)
	})

	it("should update title of store book in review of author as admin", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[0]

		await testShouldUpdateTitleOfStoreBook(collection, storeBook, constants.davUser.accessToken, constants.authorUser.accessToken)
	})

	it("should update title of published store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[1]

		await testShouldUpdateTitleOfStoreBook(collection, storeBook, constants.davUser.accessToken, constants.authorUser.accessToken)
	})

	it("should update title of hidden store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[1]

		await testShouldUpdateTitleOfStoreBook(collection, storeBook, constants.davUser.accessToken, constants.authorUser.accessToken)
	})

	it("should update description of unpublished store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[0]

		await testShouldUpdateDescriptionOfStoreBook(collection, storeBook, constants.davUser.accessToken, constants.authorUser.accessToken)
	})

	it("should update description of store book in review of author as admin", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[0]

		await testShouldUpdateDescriptionOfStoreBook(collection, storeBook, constants.davUser.accessToken, constants.authorUser.accessToken)
	})

	it("should update description of published store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[1]

		await testShouldUpdateDescriptionOfStoreBook(collection, storeBook, constants.davUser.accessToken, constants.authorUser.accessToken)
	})

	it("should update description of hidden store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[1]

		await testShouldUpdateDescriptionOfStoreBook(collection, storeBook, constants.davUser.accessToken, constants.authorUser.accessToken)
	})

	it("should update language of unpublished store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[0]

		await testShouldUpdateLanguageOfStoreBook(collection, storeBook, constants.davUser.accessToken, constants.authorUser.accessToken)
	})

	it("should update language of store book in review of author as admin", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[0]

		await testShouldUpdateLanguageOfStoreBook(collection, storeBook, constants.davUser.accessToken, constants.authorUser.accessToken)
	})

	it("should not update language of published store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[1]

		await testShouldNotUpdateLanguageOfStoreBook(storeBook, constants.davUser.accessToken)
	})

	it("should not update language of hidden store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[1]

		await testShouldNotUpdateLanguageOfStoreBook(storeBook, constants.davUser.accessToken)
	})

	it("should update price of unpublished store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[0]

		await testShouldUpdatePriceOfStoreBook(collection, storeBook, constants.davUser.accessToken, constants.authorUser.accessToken)
	})

	it("should update price of store book in review of author as admin", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[0]

		await testShouldUpdatePriceOfStoreBook(collection, storeBook, constants.davUser.accessToken, constants.authorUser.accessToken)
	})

	it("should not update price of published store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[1]

		await testShouldNotUpdatePriceOfStoreBook(storeBook, constants.davUser.accessToken)
	})

	it("should not update price of hidden store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[1]

		await testShouldNotUpdatePriceOfStoreBook(storeBook, constants.davUser.accessToken)
	})

	it("should update isbn of unpublished store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[0]

		await testShouldUpdateIsbnOfStoreBook(collection, storeBook, constants.davUser.accessToken, constants.authorUser.accessToken)
	})

	it("should update isbn of store book in review of author as admin", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[0]

		await testShouldUpdateIsbnOfStoreBook(collection, storeBook, constants.davUser.accessToken, constants.authorUser.accessToken)
	})

	it("should not update isbn of published store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[1]

		await testShouldNotUpdateIsbnOfStoreBook(storeBook, constants.davUser.accessToken)
	})

	it("should not update isbn of hidden store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[1]

		await testShouldNotUpdateIsbnOfStoreBook(storeBook, constants.davUser.accessToken)
	})

	it("should update status of unpublished store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[0]

		await testShouldUpdateStatusOfStoreBook(collection, storeBook, constants.davUser.accessToken, constants.authorUser.accessToken)
	})

	it("should update status of store book in review of author as admin", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[0]

		await testShouldUpdateStatusOfStoreBook(collection, storeBook, constants.davUser.accessToken, constants.authorUser.accessToken)
	})

	it("should update status of published store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[1]

		await testShouldUpdateStatusOfStoreBook(collection, storeBook, constants.davUser.accessToken, constants.authorUser.accessToken)
	})

	it("should update status of hidden store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[1]

		await testShouldUpdateStatusOfStoreBook(collection, storeBook, constants.davUser.accessToken, constants.authorUser.accessToken)
	})

	it("should update categories of unpublished store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[0]

		await testShouldUpdateCategoriesOfStoreBook(collection, storeBook, constants.davUser.accessToken, constants.authorUser.accessToken)
	})

	it("should update categories of store book in review of author as admin", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[0]

		await testShouldUpdateCategoriesOfStoreBook(collection, storeBook, constants.davUser.accessToken, constants.authorUser.accessToken)
	})

	it("should update categories of published store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[1]

		await testShouldUpdateCategoriesOfStoreBook(collection, storeBook, constants.davUser.accessToken, constants.authorUser.accessToken)
	})

	it("should update categories of hidden store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[1]

		await testShouldUpdateCategoriesOfStoreBook(collection, storeBook, constants.davUser.accessToken, constants.authorUser.accessToken)
	})

	it("should not publish store book without description", async () => {
		resetStoreBooks = true
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[0]

		// Remove the description property from the store book
		let response = await TableObjectsController.UpdateTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: storeBook.uuid,
			properties: {
				description: "",
				status: "unpublished"
			}
		})

		if (response.status != 200) {
			assert.fail()
		}

		// Try to publish the store book
		try {
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					published: true
				}
			})
		} catch (error) {
			assert.equal(422, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(1401, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not publish store book without cover", async () => {
		resetStoreBooks = true
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[0]

		// Remove the cover property from the store book
		let response = await TableObjectsController.UpdateTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: storeBook.uuid,
			properties: {
				cover: "",
				status: "unpublished"
			}
		})

		if (response.status != 200) {
			assert.fail()
		}

		// Try to publish the store book
		try {
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					published: true
				}
			})
		} catch (error) {
			assert.equal(422, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(1402, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not publish store book without file", async () => {
		resetStoreBooks = true
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[0]

		// Remove the file property from the store book
		let response = await TableObjectsController.UpdateTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: storeBook.uuid,
			properties: {
				file: "",
				status: "unpublished"
			}
		})

		if (response.status != 200) {
			assert.fail()
		}

		// Try to publish the store book
		try {
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					published: true
				}
			})
		} catch (error) {
			assert.equal(422, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(1403, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should publish store book", async () => {
		resetStoreBooks = true
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[0]

		// Set the store book to unpublished
		let updateResponse = await TableObjectsController.UpdateTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: storeBook.uuid,
			properties: {
				status: "unpublished"
			}
		})

		if (updateResponse.status != 200) {
			assert.fail()
		}

		// Try to publish the store book
		let response

		try {
			response = await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					published: true
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(200, response.status)
		assert.equal(storeBook.uuid, response.data.uuid)
		assert.equal(collection.uuid, response.data.collection)
		assert.equal(storeBook.title, response.data.title)
		assert.equal(storeBook.description, response.data.description)
		assert.equal(storeBook.language, response.data.language)
		assert.equal(storeBook.price ?? 0, response.data.price)
		assert.equal(storeBook.isbn, response.data.isbn)
		assert.equal("review", response.data.status)
		assert.isTrue(response.data.cover)
		assert.equal(storeBook.coverAspectRatio, response.data.cover_aspect_ratio)
		assert.equal(storeBook.coverBlurhash, response.data.cover_blurhash)
		assert.isTrue(response.data.file)
		assert.equal(storeBook.fileName, response.data.file_name)

		if (storeBook.categories) {
			assert.equal(storeBook.categories.length, response.data.categories.length)

			for (let key of response.data.categories) {
				assert(constants.categories.find(c => c.key == key) != null)
			}
		} else {
			assert.equal(0, response.data.categories.length)
		}

		assert.isFalse(response.data.in_library)
		assert.isFalse(response.data.purchased)

		// Check if the store book was updated on the server
		let objResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: storeBook.uuid
		})

		if (objResponse.status != 200) {
			assert.fail()
		}

		assert.equal(storeBook.uuid, objResponse.data.Uuid)
		assert.equal(storeBook.title, objResponse.data.GetPropertyValue("title"))
		assert.equal(storeBook.description, objResponse.data.GetPropertyValue("description"))
		assert.equal(storeBook.language, objResponse.data.GetPropertyValue("language"))
		assert.equal("review", objResponse.data.GetPropertyValue("status"))
	})

	it("should publish hidden store book", async () => {
		resetStoreBooks = true
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[1]

		// Try to publish the store book
		let response

		try {
			response = await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					published: true
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(200, response.status)
		assert.equal(storeBook.uuid, response.data.uuid)
		assert.equal(collection.uuid, response.data.collection)
		assert.equal(storeBook.title, response.data.title)
		assert.equal(storeBook.description, response.data.description)
		assert.equal(storeBook.language, response.data.language)
		assert.equal(storeBook.price ?? 0, response.data.price)
		assert.equal(storeBook.isbn, response.data.isbn)
		assert.equal("published", response.data.status)
		assert.equal(storeBook.cover != null, response.data.cover)
		assert.equal(storeBook.coverAspectRatio, response.data.cover_aspect_ratio)
		assert.equal(storeBook.coverBlurhash, response.data.cover_blurhash)
		assert.equal(storeBook.file != null, response.data.file)
		assert.equal(storeBook.fileName, response.data.file_name)

		if (storeBook.categories) {
			assert.equal(storeBook.categories.length, response.data.categories.length)

			for (let key of response.data.categories) {
				assert(constants.categories.find(c => c.key == key) != null)
			}
		} else {
			assert.equal(0, response.data.categories.length)
		}

		assert.isFalse(response.data.in_library)
		assert.isFalse(response.data.purchased)

		// Check if the store book was updated on the server
		let objResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: storeBook.uuid
		})

		if (objResponse.status != 200) {
			assert.fail()
		}

		assert.equal(storeBook.uuid, objResponse.data.Uuid)
		assert.equal(storeBook.title, objResponse.data.GetPropertyValue("title"))
		assert.equal(storeBook.description, objResponse.data.GetPropertyValue("description"))
		assert.equal(storeBook.language, objResponse.data.GetPropertyValue("language"))
		assert.equal("published", objResponse.data.GetPropertyValue("status"))
	})

	it("should unpublish store book", async () => {
		resetStoreBooks = true
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[1]
		let response

		try {
			response = await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					published: false
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(200, response.status)
		assert.equal(storeBook.uuid, response.data.uuid)
		assert.equal(collection.uuid, response.data.collection)
		assert.equal(storeBook.title, response.data.title)
		assert.equal(storeBook.description, response.data.description)
		assert.equal(storeBook.language, response.data.language)
		assert.equal(storeBook.price ?? 0, response.data.price)
		assert.equal(storeBook.isbn, response.data.isbn)
		assert.equal("hidden", response.data.status)
		assert.equal(storeBook.cover != null, response.data.cover)
		assert.equal(storeBook.coverAspectRatio, response.data.cover_aspect_ratio)
		assert.equal(storeBook.coverBlurhash, response.data.cover_blurhash)
		assert.equal(storeBook.file != null, response.data.file)
		assert.equal(storeBook.fileName, response.data.file_name)

		if (storeBook.categories) {
			assert.equal(storeBook.categories.length, response.data.categories.length)

			for (let key of response.data.categories) {
				assert(constants.categories.find(c => c.key == key) != null)
			}
		} else {
			assert.equal(0, response.data.categories.length)
		}

		assert.isFalse(response.data.in_library)
		assert.isFalse(response.data.purchased)

		// Check if the store book was updated on the server
		let objResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: storeBook.uuid
		})

		if (objResponse.status != 200) {
			assert.fail()
		}

		assert.equal(storeBook.uuid, objResponse.data.Uuid)
		assert.equal(storeBook.title, objResponse.data.GetPropertyValue("title"))
		assert.equal(storeBook.description, objResponse.data.GetPropertyValue("description"))
		assert.equal(storeBook.language, objResponse.data.GetPropertyValue("language"))
		assert.equal("hidden", objResponse.data.GetPropertyValue("status"))
	})

	it("should not publish store book of admin without description", async () => {
		resetStoreBooks = true
		let collection = constants.davUser.authors[0].collections[0]
		let storeBook = collection.books[0]

		// Remove the description property from the store book
		let response = await TableObjectsController.UpdateTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: storeBook.uuid,
			properties: {
				description: "",
				status: "unpublished"
			}
		})

		if (response.status != 200) {
			assert.fail()
		}

		// Try to publish the store book
		try {
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					published: true
				}
			})
		} catch (error) {
			assert.equal(422, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(1401, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not publish store book of admin without cover", async () => {
		resetStoreBooks = true
		let collection = constants.davUser.authors[0].collections[0]
		let storeBook = collection.books[0]

		// Remove the cover property from the store book
		let response = await TableObjectsController.UpdateTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: storeBook.uuid,
			properties: {
				cover: "",
				status: "unpublished"
			}
		})

		if (response.status != 200) {
			assert.fail()
		}

		// Try to publish the store book
		try {
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					published: true
				}
			})
		} catch (error) {
			assert.equal(422, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(1402, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not publish store book of admin without file", async () => {
		resetStoreBooks = true
		let collection = constants.davUser.authors[0].collections[0]
		let storeBook = collection.books[0]

		// Remove the cover property from the store book
		let response = await TableObjectsController.UpdateTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: storeBook.uuid,
			properties: {
				file: "",
				status: "unpublished"
			}
		})

		if (response.status != 200) {
			assert.fail()
		}

		// Try to publish the store book
		try {
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					published: true
				}
			})
		} catch (error) {
			assert.equal(422, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(1403, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should publish store book of admin", async () => {
		resetStoreBooks = true
		let collection = constants.davUser.authors[0].collections[0]
		let storeBook = collection.books[0]

		// Set the store book to unpublished
		let updateResponse = await TableObjectsController.UpdateTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: storeBook.uuid,
			properties: {
				status: "unpublished"
			}
		})

		if (updateResponse.status != 200) {
			assert.fail()
		}

		// Try to publish the store book
		let response

		try {
			response = await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					published: true
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(200, response.status)
		assert.equal(storeBook.uuid, response.data.uuid)
		assert.equal(collection.uuid, response.data.collection)
		assert.equal(storeBook.title, response.data.title)
		assert.equal(storeBook.description, response.data.description)
		assert.equal(storeBook.language, response.data.language)
		assert.equal(storeBook.price ?? 0, response.data.price)
		assert.equal(storeBook.isbn, response.data.isbn)
		assert.equal("review", response.data.status)
		assert.equal(storeBook.cover != null, response.data.cover)
		assert.equal(storeBook.coverAspectRatio, response.data.cover_aspect_ratio)
		assert.equal(storeBook.coverBlurhash, response.data.cover_blurhash)
		assert.equal(storeBook.file != null, response.data.file)
		assert.equal(storeBook.fileName, response.data.file_name)

		if (storeBook.categories) {
			assert.equal(storeBook.categories.length, response.data.categories.length)

			for (let key of response.data.categories) {
				assert(constants.categories.find(c => c.key == key) != null)
			}
		} else {
			assert.equal(0, response.data.categories.length)
		}

		assert.isFalse(response.data.in_library)
		assert.isFalse(response.data.purchased)

		// Check if the store book was updated on the server
		let objResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: storeBook.uuid
		})

		if (objResponse.status != 200) {
			assert.fail()
		}

		assert.equal(storeBook.uuid, objResponse.data.Uuid)
		assert.equal(storeBook.title, objResponse.data.GetPropertyValue("title"))
		assert.equal(storeBook.description, objResponse.data.GetPropertyValue("description"))
		assert.equal(storeBook.language, objResponse.data.GetPropertyValue("language"))
		assert.equal("review", objResponse.data.GetPropertyValue("status"))
	})

	it("should publish hidden store book of admin", async () => {
		resetStoreBooks = true
		let collection = constants.davUser.authors[0].collections[1]
		let storeBook = collection.books[0]

		// Try to publish the store book
		let response

		try {
			response = await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					published: true
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(200, response.status)
		assert.equal(storeBook.uuid, response.data.uuid)
		assert.equal(collection.uuid, response.data.collection)
		assert.equal(storeBook.title, response.data.title)
		assert.equal(storeBook.description, response.data.description)
		assert.equal(storeBook.language, response.data.language)
		assert.equal(storeBook.price ?? 0, response.data.price)
		assert.equal(storeBook.isbn, response.data.isbn)
		assert.equal("published", response.data.status)
		assert.equal(storeBook.cover != null, response.data.cover)
		assert.equal(storeBook.coverAspectRatio, response.data.cover_aspect_ratio)
		assert.equal(storeBook.coverBlurhash, response.data.cover_blurhash)
		assert.equal(storeBook.file != null, response.data.file)
		assert.equal(storeBook.fileName, response.data.file_name)

		if (storeBook.categories) {
			assert.equal(storeBook.categories.length, response.data.categories.length)

			for (let key of response.data.categories) {
				assert(constants.categories.find(c => c.key == key) != null)
			}
		} else {
			assert.equal(0, response.data.categories.length)
		}

		assert.isFalse(response.data.in_library)
		assert.isFalse(response.data.purchased)

		// Check if the store book was updated on the server
		let objResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: storeBook.uuid
		})

		if (objResponse.status != 200) {
			assert.fail()
		}

		assert.equal(storeBook.uuid, objResponse.data.Uuid)
		assert.equal(storeBook.title, objResponse.data.GetPropertyValue("title"))
		assert.equal(storeBook.description, objResponse.data.GetPropertyValue("description"))
		assert.equal(storeBook.language, objResponse.data.GetPropertyValue("language"))
		assert.equal("published", objResponse.data.GetPropertyValue("status"))
	})

	it("should unpublish store book of admin", async () => {
		resetStoreBooks = true
		let collection = constants.davUser.authors[0].collections[0]
		let storeBook = collection.books[0]
		let response

		try {
			response = await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					published: false
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(200, response.status)
		assert.equal(storeBook.uuid, response.data.uuid)
		assert.equal(collection.uuid, response.data.collection)
		assert.equal(storeBook.title, response.data.title)
		assert.equal(storeBook.description, response.data.description)
		assert.equal(storeBook.language, response.data.language)
		assert.equal(storeBook.price ?? 0, response.data.price)
		assert.equal(storeBook.isbn, response.data.isbn)
		assert.equal("hidden", response.data.status)
		assert.equal(storeBook.cover != null, response.data.cover)
		assert.equal(storeBook.coverAspectRatio, response.data.cover_aspect_ratio)
		assert.equal(storeBook.coverBlurhash, response.data.cover_blurhash)
		assert.equal(storeBook.file != null, response.data.file)
		assert.equal(storeBook.fileName, response.data.file_name)

		if (storeBook.categories) {
			assert.equal(storeBook.categories.length, response.data.categories.length)

			for (let key of response.data.categories) {
				assert(constants.categories.find(c => c.key == key) != null)
			}
		} else {
			assert.equal(0, response.data.categories.length)
		}

		assert.isFalse(response.data.in_library)
		assert.isFalse(response.data.purchased)

		// Check if the store book was updated on the server
		let objResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: storeBook.uuid
		})

		if (objResponse.status != 200) {
			assert.fail()
		}

		assert.equal(storeBook.uuid, objResponse.data.Uuid)
		assert.equal(storeBook.title, objResponse.data.GetPropertyValue("title"))
		assert.equal(storeBook.description, objResponse.data.GetPropertyValue("description"))
		assert.equal(storeBook.language, objResponse.data.GetPropertyValue("language"))
		assert.equal("hidden", objResponse.data.GetPropertyValue("status"))
	})
})

async function testShouldUpdateTitleOfStoreBook(collection, storeBook, accessToken, ownerAccessToken) {
	resetStoreBooks = true
	let title = "Updated title"
	let response

	try {
		response = await axios.default({
			method: 'put',
			url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
			headers: {
				Authorization: accessToken,
				'Content-Type': 'application/json'
			},
			data: {
				title
			}
		})
	} catch (error) {
		assert.fail()
	}

	assert.equal(200, response.status)
	assert.equal(storeBook.uuid, response.data.uuid)
	assert.equal(collection.uuid, response.data.collection)
	assert.equal(title, response.data.title)
	assert.equal(storeBook.description, response.data.description)
	assert.equal(storeBook.language, response.data.language)
	assert.equal(storeBook.price ?? 0, response.data.price)
	assert.equal(storeBook.isbn, response.data.isbn)
	assert.equal(storeBook.status ?? "unpublished", response.data.status)
	assert.equal(storeBook.cover != null, response.data.cover)
	assert.equal(storeBook.coverAspectRatio, response.data.cover_aspect_ratio)
	assert.equal(storeBook.coverBlurhash, response.data.cover_blurhash)
	assert.equal(storeBook.file != null, response.data.file)
	assert.equal(storeBook.fileName, response.data.file_name)

	if (storeBook.categories) {
		assert.equal(storeBook.categories.length, response.data.categories.length)

		for (let key of response.data.categories) {
			assert(constants.categories.find(c => c.key == key) != null)
		}
	} else {
		assert.equal(0, response.data.categories.length)
	}

	assert.isFalse(response.data.in_library)
	assert.isFalse(response.data.purchased)

	// Check if the store book was updated on the server
	let objResponse = await TableObjectsController.GetTableObject({
		accessToken: ownerAccessToken ?? accessToken,
		uuid: storeBook.uuid
	})

	if (objResponse.status != 200) {
		assert.fail()
	}

	assert.equal(storeBook.uuid, objResponse.data.Uuid)
	assert.equal(title, objResponse.data.GetPropertyValue("title"))
	assert.equal(storeBook.description, objResponse.data.GetPropertyValue("description"))
	assert.equal(storeBook.language, objResponse.data.GetPropertyValue("language"))
	assert.equal(storeBook.price, objResponse.data.GetPropertyValue("price"))
}

async function testShouldUpdateDescriptionOfStoreBook(collection, storeBook, accessToken, ownerAccessToken) {
	resetStoreBooks = true
	let description = "Updated description"
	let response

	try {
		response = await axios.default({
			method: 'put',
			url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
			headers: {
				Authorization: accessToken,
				'Content-Type': 'application/json'
			},
			data: {
				description
			}
		})
	} catch (error) {
		assert.fail()
	}

	assert.equal(200, response.status)
	assert.equal(storeBook.uuid, response.data.uuid)
	assert.equal(collection.uuid, response.data.collection)
	assert.equal(storeBook.title, response.data.title)
	assert.equal(description, response.data.description)
	assert.equal(storeBook.language, response.data.language)
	assert.equal(storeBook.price ?? 0, response.data.price)
	assert.equal(storeBook.isbn, response.data.isbn)
	assert.equal(storeBook.status ?? "unpublished", response.data.status)
	assert.equal(storeBook.cover != null, response.data.cover)
	assert.equal(storeBook.coverAspectRatio, response.data.cover_aspect_ratio)
	assert.equal(storeBook.coverBlurhash, response.data.cover_blurhash)
	assert.equal(storeBook.file != null, response.data.file)
	assert.equal(storeBook.fileName, response.data.file_name)

	if (storeBook.categories) {
		assert.equal(storeBook.categories.length, response.data.categories.length)

		for (let key of response.data.categories) {
			assert(constants.categories.find(c => c.key == key) != null)
		}
	} else {
		assert.equal(0, response.data.categories.length)
	}

	assert.isFalse(response.data.in_library)
	assert.isFalse(response.data.purchased)

	// Check if the store book was updated on the server
	let objResponse = await TableObjectsController.GetTableObject({
		accessToken: ownerAccessToken ?? accessToken,
		uuid: storeBook.uuid
	})

	if (objResponse.status != 200) {
		assert.fail()
	}

	assert.equal(storeBook.uuid, objResponse.data.Uuid)
	assert.equal(storeBook.title, objResponse.data.GetPropertyValue("title"))
	assert.equal(description, objResponse.data.GetPropertyValue("description"))
	assert.equal(storeBook.language, objResponse.data.GetPropertyValue("language"))
	assert.equal(storeBook.price, objResponse.data.GetPropertyValue("price"))
}

async function testShouldUpdateLanguageOfStoreBook(collection, storeBook, accessToken, ownerAccessToken) {
	resetStoreBooks = true
	let language = "fr"
	let response

	try {
		response = await axios.default({
			method: 'put',
			url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
			headers: {
				Authorization: accessToken,
				'Content-Type': 'application/json'
			},
			data: {
				language
			}
		})
	} catch (error) {
		assert.fail()
	}

	assert.equal(200, response.status)
	assert.equal(storeBook.uuid, response.data.uuid)
	assert.equal(collection.uuid, response.data.collection)
	assert.equal(storeBook.title, response.data.title)
	assert.equal(storeBook.description, response.data.description)
	assert.equal(language, response.data.language)
	assert.equal(storeBook.price || 0, response.data.price)
	assert.equal(storeBook.isbn, response.data.isbn)
	assert.equal(storeBook.status || "unpublished", response.data.status)
	assert.equal(storeBook.cover != null, response.data.cover)
	assert.equal(storeBook.coverAspectRatio, response.data.cover_aspect_ratio)
	assert.equal(storeBook.coverBlurhash, response.data.cover_blurhash)
	assert.equal(storeBook.file != null, response.data.file)
	assert.equal(storeBook.fileName, response.data.file_name)

	if (storeBook.categories) {
		assert.equal(storeBook.categories.length, response.data.categories.length)

		for (let key of response.data.categories) {
			assert(constants.categories.find(c => c.key == key) != null)
		}
	} else {
		assert.equal(0, response.data.categories.length)
	}

	assert.isFalse(response.data.in_library)
	assert.isFalse(response.data.purchased)

	// Check if the store book was updated on the server
	let objResponse = await TableObjectsController.GetTableObject({
		accessToken: ownerAccessToken ?? accessToken,
		uuid: storeBook.uuid
	})

	if (objResponse.status != 200) {
		assert.fail()
	}

	assert.equal(storeBook.uuid, objResponse.data.Uuid)
	assert.equal(storeBook.title, objResponse.data.GetPropertyValue("title"))
	assert.equal(storeBook.description, objResponse.data.GetPropertyValue("description"))
	assert.equal(language, objResponse.data.GetPropertyValue("language"))
	assert.equal(storeBook.price, objResponse.data.GetPropertyValue("price"))
}

async function testShouldNotUpdateLanguageOfStoreBook(storeBook, accessToken) {
	let language = "fr"

	try {
		await axios.default({
			method: 'put',
			url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
			headers: {
				Authorization: accessToken,
				'Content-Type': 'application/json'
			},
			data: {
				language
			}
		})
	} catch (error) {
		assert.equal(422, error.response.status)
		assert.equal(1, error.response.data.errors.length)
		assert.equal(1501, error.response.data.errors[0].code)
		return
	}

	assert.fail()
}

async function testShouldUpdatePriceOfStoreBook(collection, storeBook, accessToken, ownerAccessToken) {
	resetStoreBooks = true
	let price = 23
	let response

	try {
		response = await axios.default({
			method: 'put',
			url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
			headers: {
				Authorization: accessToken,
				'Content-Type': 'application/json'
			},
			data: {
				price
			}
		})
	} catch (error) {
		assert.fail()
	}

	assert.equal(200, response.status)
	assert.equal(storeBook.uuid, response.data.uuid)
	assert.equal(collection.uuid, response.data.collection)
	assert.equal(storeBook.title, response.data.title)
	assert.equal(storeBook.description, response.data.description)
	assert.equal(storeBook.language, response.data.language)
	assert.equal(price, response.data.price)
	assert.equal(storeBook.isbn, response.data.isbn)
	assert.equal(storeBook.status ?? "unpublished", response.data.status)
	assert.equal(storeBook.cover != null, response.data.cover)
	assert.equal(storeBook.coverAspectRatio, response.data.cover_aspect_ratio)
	assert.equal(storeBook.coverBlurhash, response.data.cover_blurhash)
	assert.equal(storeBook.file != null, response.data.file)
	assert.equal(storeBook.fileName, response.data.file_name)

	if (storeBook.categories) {
		assert.equal(storeBook.categories.length, response.data.categories.length)

		for (let key of response.data.categories) {
			assert(constants.categories.find(c => c.key == key) != null)
		}
	} else {
		assert.equal(0, response.data.categories.length)
	}

	assert.isFalse(response.data.in_library)
	assert.isFalse(response.data.purchased)

	// Check if the store book was updated on the server
	let objResponse = await TableObjectsController.GetTableObject({
		accessToken: ownerAccessToken ?? accessToken,
		uuid: storeBook.uuid
	})

	if (objResponse.status != 200) {
		assert.fail()
	}

	assert.equal(storeBook.uuid, objResponse.data.Uuid)
	assert.equal(storeBook.title, objResponse.data.GetPropertyValue("title"))
	assert.equal(storeBook.description, objResponse.data.GetPropertyValue("description"))
	assert.equal(storeBook.language, objResponse.data.GetPropertyValue("language"))
	assert.equal(price, objResponse.data.GetPropertyValue("price"))
}

async function testShouldNotUpdatePriceOfStoreBook(storeBook, accessToken) {
	let price = 354

	try {
		await axios.default({
			method: 'put',
			url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
			headers: {
				Authorization: accessToken,
				'Content-Type': 'application/json'
			},
			data: {
				price
			}
		})
	} catch (error) {
		assert.equal(422, error.response.status)
		assert.equal(1, error.response.data.errors.length)
		assert.equal(1502, error.response.data.errors[0].code)
		return
	}

	assert.fail()
}

async function testShouldUpdateIsbnOfStoreBook(collection, storeBook, accessToken, ownerAccessToken) {
	resetStoreBooks = true
	let isbn = "1234567890123"
	let response

	try {
		response = await axios.default({
			method: 'put',
			url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
			headers: {
				Authorization: accessToken,
				'Content-Type': 'application/json'
			},
			data: {
				isbn
			}
		})
	} catch (error) {
		assert.fail()
	}

	assert.equal(200, response.status)
	assert.equal(storeBook.uuid, response.data.uuid)
	assert.equal(collection.uuid, response.data.collection)
	assert.equal(storeBook.title, response.data.title)
	assert.equal(storeBook.description, response.data.description)
	assert.equal(storeBook.language, response.data.language)
	assert.equal(storeBook.price ?? 0, response.data.price)
	assert.equal(isbn, response.data.isbn)
	assert.equal(storeBook.status ?? "unpublished", response.data.status)
	assert.equal(storeBook.cover != null, response.data.cover)
	assert.equal(storeBook.coverAspectRatio, response.data.cover_aspect_ratio)
	assert.equal(storeBook.coverBlurhash, response.data.cover_blurhash)
	assert.equal(storeBook.file != null, response.data.file)
	assert.equal(storeBook.fileName, response.data.file_name)

	if (storeBook.categories) {
		assert.equal(storeBook.categories.length, response.data.categories.length)

		for (let key of response.data.categories) {
			assert(constants.categories.find(c => c.key == key) != null)
		}
	} else {
		assert.equal(0, response.data.categories.length)
	}

	assert.isFalse(response.data.in_library)
	assert.isFalse(response.data.purchased)

	// Check if the store book was updated on the server
	let objResponse = await TableObjectsController.GetTableObject({
		accessToken: ownerAccessToken ?? accessToken,
		uuid: storeBook.uuid
	})

	if (objResponse.status != 200) {
		assert.fail()
	}

	assert.equal(storeBook.uuid, objResponse.data.Uuid)
	assert.equal(storeBook.title, objResponse.data.GetPropertyValue("title"))
	assert.equal(storeBook.description, objResponse.data.GetPropertyValue("description"))
	assert.equal(storeBook.language, objResponse.data.GetPropertyValue("language"))
	assert.equal(isbn, objResponse.data.GetPropertyValue("isbn"))

	// Remove isbn with empty string
	try {
		response = await axios.default({
			method: 'put',
			url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
			headers: {
				Authorization: accessToken,
				'Content-Type': 'application/json'
			},
			data: {
				isbn: ""
			}
		})
	} catch (error) {
		assert.fail()
	}

	assert.equal(200, response.status)
	assert.equal(storeBook.uuid, response.data.uuid)
	assert.equal(collection.uuid, response.data.collection)
	assert.equal(storeBook.title, response.data.title)
	assert.equal(storeBook.description, response.data.description)
	assert.equal(storeBook.language, response.data.language)
	assert.equal(storeBook.price ?? 0, response.data.price)
	assert.isNull(response.data.isbn)
	assert.equal(storeBook.status ?? "unpublished", response.data.status)
	assert.equal(storeBook.cover != null, response.data.cover)
	assert.equal(storeBook.coverAspectRatio, response.data.cover_aspect_ratio)
	assert.equal(storeBook.coverBlurhash, response.data.cover_blurhash)
	assert.equal(storeBook.file != null, response.data.file)
	assert.equal(storeBook.fileName, response.data.file_name)

	if (storeBook.categories) {
		assert.equal(storeBook.categories.length, response.data.categories.length)

		for (let key of response.data.categories) {
			assert(constants.categories.find(c => c.key == key) != null)
		}
	} else {
		assert.equal(0, response.data.categories.length)
	}

	assert.isFalse(response.data.in_library)
	assert.isFalse(response.data.purchased)

	// Check if the store book was updated on the server
	objResponse = await TableObjectsController.GetTableObject({
		accessToken: ownerAccessToken ?? accessToken,
		uuid: storeBook.uuid
	})

	if (objResponse.status != 200) {
		assert.fail()
	}

	assert.equal(storeBook.uuid, objResponse.data.Uuid)
	assert.equal(storeBook.title, objResponse.data.GetPropertyValue("title"))
	assert.equal(storeBook.description, objResponse.data.GetPropertyValue("description"))
	assert.equal(storeBook.language, objResponse.data.GetPropertyValue("language"))
	assert.isNull(objResponse.data.GetPropertyValue("isbn"))
}

async function testShouldNotUpdateIsbnOfStoreBook(storeBook, accessToken) {
	let isbn = "3210987654321"

	try {
		await axios.default({
			method: 'put',
			url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
			headers: {
				Authorization: accessToken,
				'Content-Type': 'application/json'
			},
			data: {
				isbn
			}
		})
	} catch (error) {
		assert.equal(422, error.response.status)
		assert.equal(1, error.response.data.errors.length)
		assert.equal(1505, error.response.data.errors[0].code)
		return
	}

	assert.fail()
}

async function testShouldUpdateStatusOfStoreBook(collection, storeBook, accessToken, ownerAccessToken) {
	resetStoreBooks = true
	let status = storeBook.status == "published" ? "hidden" : "published"
	let response

	try {
		response = await axios.default({
			method: 'put',
			url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
			headers: {
				Authorization: accessToken,
				'Content-Type': 'application/json'
			},
			data: {
				status
			}
		})
	} catch (error) {
		assert.fail()
	}

	assert.equal(200, response.status)
	assert.equal(storeBook.uuid, response.data.uuid)
	assert.equal(collection.uuid, response.data.collection)
	assert.equal(storeBook.title, response.data.title)
	assert.equal(storeBook.description, response.data.description)
	assert.equal(storeBook.language, response.data.language)
	assert.equal(storeBook.price ?? 0, response.data.price)
	assert.equal(storeBook.isbn, response.data.isbn)
	assert.equal(status, response.data.status)
	assert.equal(storeBook.cover != null, response.data.cover)
	assert.equal(storeBook.coverAspectRatio, response.data.cover_aspect_ratio)
	assert.equal(storeBook.coverBlurhash, response.data.cover_blurhash)
	assert.equal(storeBook.file != null, response.data.file)
	assert.equal(storeBook.fileName, response.data.file_name)

	if (storeBook.categories) {
		assert.equal(storeBook.categories.length, response.data.categories.length)

		for (let key of response.data.categories) {
			assert(constants.categories.find(c => c.key == key) != null)
		}
	} else {
		assert.equal(0, response.data.categories.length)
	}

	assert.isFalse(response.data.in_library)
	assert.isFalse(response.data.purchased)

	// Check if the store book was updated on the server
	let objResponse = await TableObjectsController.GetTableObject({
		accessToken: ownerAccessToken ?? accessToken,
		uuid: storeBook.uuid
	})

	if (objResponse.status != 200) {
		assert.fail()
	}

	assert.equal(storeBook.uuid, objResponse.data.Uuid)
	assert.equal(storeBook.title, objResponse.data.GetPropertyValue("title"))
	assert.equal(storeBook.description, objResponse.data.GetPropertyValue("description"))
	assert.equal(storeBook.language, objResponse.data.GetPropertyValue("language"))
	assert.equal(storeBook.price, objResponse.data.GetPropertyValue("price"))
	assert.equal(status, objResponse.data.GetPropertyValue("status"))
}

async function testShouldUpdateCategoriesOfStoreBook(collection, storeBook, accessToken, ownerAccessToken) {
	resetStoreBooks = true
	let categories = [constants.categories[0].key, constants.categories[2].key]
	let categoryUuids = [constants.categories[0].uuid, constants.categories[2].uuid]
	let response

	try {
		response = await axios.default({
			method: 'put',
			url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
			headers: {
				Authorization: accessToken,
				'Content-Type': 'application/json'
			},
			data: {
				categories
			}
		})
	} catch (error) {
		assert.fail()
	}

	assert.equal(200, response.status)
	assert.equal(storeBook.uuid, response.data.uuid)
	assert.equal(collection.uuid, response.data.collection)
	assert.equal(storeBook.title, response.data.title)
	assert.equal(storeBook.description, response.data.description)
	assert.equal(storeBook.language, response.data.language)
	assert.equal(storeBook.price ?? 0, response.data.price)
	assert.equal(storeBook.isbn, response.data.isbn)
	assert.equal(storeBook.status ?? "unpublished", response.data.status)

	assert.equal(categories.length, response.data.categories.length)

	let i = 0
	for (let key of response.data.categories) {
		assert.equal(categories[i], key)
		i++
	}

	assert.equal(storeBook.cover != null, response.data.cover)
	assert.equal(storeBook.coverAspectRatio, response.data.cover_aspect_ratio)
	assert.equal(storeBook.coverBlurhash, response.data.cover_blurhash)
	assert.equal(storeBook.file != null, response.data.file)
	assert.equal(storeBook.fileName, response.data.file_name)

	// Check if the store book was updated on the server
	let objResponse = await TableObjectsController.GetTableObject({
		accessToken: ownerAccessToken ?? accessToken,
		uuid: storeBook.uuid
	})

	if (objResponse.status != 200) {
		assert.fail()
	}

	assert.equal(storeBook.uuid, objResponse.data.Uuid)
	assert.equal(storeBook.title, objResponse.data.GetPropertyValue("title"))
	assert.equal(storeBook.description, objResponse.data.GetPropertyValue("description"))
	assert.equal(storeBook.language, objResponse.data.GetPropertyValue("language"))
	assert.equal(storeBook.price, objResponse.data.GetPropertyValue("price"))
	assert.equal(categoryUuids.join(','), objResponse.data.GetPropertyValue("categories"))
}