import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import { TableObjectsController } from 'dav-js'
import constants from '../constants.js'
import * as utils from '../utils.js'
import * as ErrorCodes from '../errorCodes.js'

const updateStoreBookEndpointUrl = `${constants.apiBaseUrl}/store/book/{0}`
var resetStoreBooks = false
var resetStoreBookReleases = false

afterEach(async () => {
	if (resetStoreBooks) {
		await utils.resetStoreBooks()
		resetStoreBooks = false
	}

	if (resetStoreBookReleases) {
		await utils.resetStoreBookReleases()
		resetStoreBookReleases = false
	}
})

describe("UpdateStoreBook endpoint", () => {
	it("should not update store book without access token", async () => {
		try {
			await axios({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid)
			})
		} catch (error) {
			assert.equal(error.response.status, 401)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.AuthorizationHeaderMissing)
			return
		}

		assert.fail()
	})

	it("should not update store book with access token for session that does not exist", async () => {
		try {
			await axios({
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
			assert.equal(error.response.status, 404)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.SessionDoesNotExist)
			return
		}

		assert.fail()
	})

	it("should not update store book without Content-Type json", async () => {
		try {
			await axios({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
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

	it("should not update store book that does not exist", async () => {
		try {
			await axios({
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
			assert.equal(error.response.status, 404)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.StoreBookDoesNotExist)
			return
		}

		assert.fail()
	})

	it("should not update store book with properties with wrong types", async () => {
		try {
			await axios({
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
					status: true,
					categories: [123]
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 7)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.TitleWrongType)
			assert.equal(error.response.data.errors[1].code, ErrorCodes.DescriptionWrongType)
			assert.equal(error.response.data.errors[2].code, ErrorCodes.LanguageWrongType)
			assert.equal(error.response.data.errors[3].code, ErrorCodes.PriceWrongType)
			assert.equal(error.response.data.errors[4].code, ErrorCodes.IsbnWrongType)
			assert.equal(error.response.data.errors[5].code, ErrorCodes.StatusWrongType)
			assert.equal(error.response.data.errors[6].code, ErrorCodes.CategoriesWrongType)
			return
		}

		assert.fail()
	})

	it("should not update store book with status with wrong type as admin", async () => {
		try {
			await axios({
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.StatusWrongType)
			return
		}

		assert.fail()
	})

	it("should not update store book with too short properties", async () => {
		try {
			await axios({
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 2)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.TitleTooShort)
			assert.equal(error.response.data.errors[1].code, ErrorCodes.DescriptionTooShort)
			return
		}

		assert.fail()
	})

	it("should not update store book with too long properties", async () => {
		try {
			await axios({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					title: "a".repeat(150),
					description: "a".repeat(6000)
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 2)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.TitleTooLong)
			assert.equal(error.response.data.errors[1].code, ErrorCodes.DescriptionTooLong)
			return
		}

		assert.fail()
	})

	it("should not update store book with not supported language", async () => {
		try {
			await axios({
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.LanguageNotSupported)
			return
		}

		assert.fail()
	})

	it("should not update store book with invalid price", async () => {
		try {
			await axios({
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.PriceInvalid)
			return
		}

		assert.fail()
	})

	it("should not update store book with invalid isbn", async () => {
		try {
			await axios({
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.IsbnInvalid)
			return
		}

		assert.fail()
	})

	it("should not update store book with too many categories", async () => {
		try {
			await axios({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					categories: ["tragedy", "dystopia", "adventure", "childrens"]
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.TooManyCategoriesForStoreBook)
			return
		}

		assert.fail()
	})

	it("should not update store book with not supported status", async () => {
		try {
			await axios({
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
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.StatusNotSupported)
			return
		}

		assert.fail()
	})

	it("should update title of unpublished store book", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[0]

		await testShouldUpdateTitleOfStoreBook(storeBook, constants.authorUser.accessToken)
	})

	it("should update title of store book in review", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[0]

		await testShouldUpdateTitleOfStoreBook(storeBook, constants.authorUser.accessToken)
	})

	it("should update title of published store book", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[1]

		await testShouldUpdateTitleOfStoreBook(storeBook, constants.authorUser.accessToken)
	})

	it("should update title of hidden store book", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[1]

		await testShouldUpdateTitleOfStoreBook(storeBook, constants.authorUser.accessToken)
	})

	it("should update description of unpublished store book", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[0]

		await testShouldUpdateDescriptionOfStoreBook(storeBook, constants.authorUser.accessToken)
	})

	it("should update description of store book in review", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[0]

		await testShouldUpdateDescriptionOfStoreBook(storeBook, constants.authorUser.accessToken)
	})

	it("should update description of published store book", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[1]

		await testShouldUpdateDescriptionOfStoreBook(storeBook, constants.authorUser.accessToken)
	})

	it("should update description of hidden store book", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[1]

		await testShouldUpdateDescriptionOfStoreBook(storeBook, constants.authorUser.accessToken)
	})

	it("should update language of unpublished store book", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[0]

		await testShouldUpdateLanguageOfStoreBook(storeBook, constants.authorUser.accessToken)
	})

	it("should update language of store book in review", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[0]

		await testShouldUpdateLanguageOfStoreBook(storeBook, constants.authorUser.accessToken)
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

		await testShouldUpdatePriceOfStoreBook(storeBook, constants.authorUser.accessToken)
	})

	it("should update price of store book in review", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[0]

		await testShouldUpdatePriceOfStoreBook(storeBook, constants.authorUser.accessToken)
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

		await testShouldUpdateIsbnOfStoreBook(storeBook, constants.authorUser.accessToken)
	})

	it("should update isbn of store book in review", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[0]

		await testShouldUpdateIsbnOfStoreBook(storeBook, constants.authorUser.accessToken)
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

		await testShouldUpdateCategoriesOfStoreBook(storeBook, constants.authorUser.accessToken)
	})

	it("should update categories of store book in review", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[0]

		await testShouldUpdateCategoriesOfStoreBook(storeBook, constants.authorUser.accessToken)
	})

	it("should update categories of published store book", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[1]

		await testShouldUpdateCategoriesOfStoreBook(storeBook, constants.authorUser.accessToken)
	})

	it("should update categories of hidden store book", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[1]

		await testShouldUpdateCategoriesOfStoreBook(storeBook, constants.authorUser.accessToken)
	})

	it("should update title of unpublished store book of admin", async () => {
		let collection = constants.davUser.authors[0].collections[1]
		let storeBook = collection.books[1]

		await testShouldUpdateTitleOfStoreBook(storeBook, constants.davUser.accessToken)
	})

	it("should update title of store book in review of admin", async () => {
		let collection = constants.davUser.authors[0].collections[0]
		let storeBook = collection.books[1]

		await testShouldUpdateTitleOfStoreBook(storeBook, constants.davUser.accessToken)
	})

	it("should update title of published store book of admin", async () => {
		let collection = constants.davUser.authors[0].collections[0]
		let storeBook = collection.books[0]

		await testShouldUpdateTitleOfStoreBook(storeBook, constants.davUser.accessToken)
	})

	it("should update title of hidden store book of admin", async () => {
		let collection = constants.davUser.authors[0].collections[1]
		let storeBook = collection.books[1]

		await testShouldUpdateTitleOfStoreBook(storeBook, constants.davUser.accessToken)
	})

	it("should update description of unpublished store book of admin", async () => {
		let collection = constants.davUser.authors[0].collections[1]
		let storeBook = collection.books[1]

		await testShouldUpdateDescriptionOfStoreBook(storeBook, constants.davUser.accessToken)
	})

	it("should update description of store book in review of admin", async () => {
		let collection = constants.davUser.authors[0].collections[0]
		let storeBook = collection.books[1]

		await testShouldUpdateDescriptionOfStoreBook(storeBook, constants.davUser.accessToken)
	})

	it("should update description of published store book of admin", async () => {
		let collection = constants.davUser.authors[0].collections[0]
		let storeBook = collection.books[0]

		await testShouldUpdateDescriptionOfStoreBook(storeBook, constants.davUser.accessToken)
	})

	it("should update description of hidden store book of admin", async () => {
		let collection = constants.davUser.authors[0].collections[1]
		let storeBook = collection.books[1]

		await testShouldUpdateDescriptionOfStoreBook(storeBook, constants.davUser.accessToken)
	})

	it("should update language of unpublished store book of admin", async () => {
		let collection = constants.davUser.authors[0].collections[1]
		let storeBook = collection.books[1]

		await testShouldUpdateLanguageOfStoreBook(storeBook, constants.davUser.accessToken)
	})

	it("should update language of store book in review of admin", async () => {
		let collection = constants.davUser.authors[0].collections[0]
		let storeBook = collection.books[1]

		await testShouldUpdateLanguageOfStoreBook(storeBook, constants.davUser.accessToken)
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

		await testShouldUpdatePriceOfStoreBook(storeBook, constants.davUser.accessToken)
	})

	it("should update price of store book in review of admin", async () => {
		let collection = constants.davUser.authors[0].collections[0]
		let storeBook = collection.books[1]

		await testShouldUpdatePriceOfStoreBook(storeBook, constants.davUser.accessToken)
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

		await testShouldUpdateIsbnOfStoreBook(storeBook, constants.davUser.accessToken)
	})

	it("should update isbn of store book in review of admin", async () => {
		let collection = constants.davUser.authors[0].collections[0]
		let storeBook = collection.books[1]

		await testShouldUpdateIsbnOfStoreBook(storeBook, constants.davUser.accessToken)
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

		await testShouldUpdateCategoriesOfStoreBook(storeBook, constants.davUser.accessToken)
	})

	it("should update categories of store book in review of admin", async () => {
		let collection = constants.davUser.authors[0].collections[0]
		let storeBook = collection.books[1]

		await testShouldUpdateCategoriesOfStoreBook(storeBook, constants.davUser.accessToken)
	})

	it("should update categories of published store book of admin", async () => {
		let collection = constants.davUser.authors[0].collections[0]
		let storeBook = collection.books[0]

		await testShouldUpdateCategoriesOfStoreBook(storeBook, constants.davUser.accessToken)
	})

	it("should update categories of hidden store book of admin", async () => {
		let collection = constants.davUser.authors[0].collections[1]
		let storeBook = collection.books[0]

		await testShouldUpdateCategoriesOfStoreBook(storeBook, constants.davUser.accessToken)
	})

	it("should update title of unpublished store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[0]

		await testShouldUpdateTitleOfStoreBook(storeBook, constants.davUser.accessToken, constants.authorUser.accessToken)
	})

	it("should update title of store book in review of author as admin", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[0]

		await testShouldUpdateTitleOfStoreBook(storeBook, constants.davUser.accessToken, constants.authorUser.accessToken)
	})

	it("should update title of published store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[1]

		await testShouldUpdateTitleOfStoreBook(storeBook, constants.davUser.accessToken, constants.authorUser.accessToken)
	})

	it("should update title of hidden store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[1]

		await testShouldUpdateTitleOfStoreBook(storeBook, constants.davUser.accessToken, constants.authorUser.accessToken)
	})

	it("should update description of unpublished store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[0]

		await testShouldUpdateDescriptionOfStoreBook(storeBook, constants.davUser.accessToken, constants.authorUser.accessToken)
	})

	it("should update description of store book in review of author as admin", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[0]

		await testShouldUpdateDescriptionOfStoreBook(storeBook, constants.davUser.accessToken, constants.authorUser.accessToken)
	})

	it("should update description of published store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[1]

		await testShouldUpdateDescriptionOfStoreBook(storeBook, constants.davUser.accessToken, constants.authorUser.accessToken)
	})

	it("should update description of hidden store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[1]

		await testShouldUpdateDescriptionOfStoreBook(storeBook, constants.davUser.accessToken, constants.authorUser.accessToken)
	})

	it("should update language of unpublished store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[0]

		await testShouldUpdateLanguageOfStoreBook(storeBook, constants.davUser.accessToken, constants.authorUser.accessToken)
	})

	it("should update language of store book in review of author as admin", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[0]

		await testShouldUpdateLanguageOfStoreBook(storeBook, constants.davUser.accessToken, constants.authorUser.accessToken)
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

		await testShouldUpdatePriceOfStoreBook(storeBook, constants.davUser.accessToken, constants.authorUser.accessToken)
	})

	it("should update price of store book in review of author as admin", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[0]

		await testShouldUpdatePriceOfStoreBook(storeBook, constants.davUser.accessToken, constants.authorUser.accessToken)
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

		await testShouldUpdateIsbnOfStoreBook(storeBook, constants.davUser.accessToken, constants.authorUser.accessToken)
	})

	it("should update isbn of store book in review of author as admin", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[0]

		await testShouldUpdateIsbnOfStoreBook(storeBook, constants.davUser.accessToken, constants.authorUser.accessToken)
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

		await testShouldUpdateStatusOfStoreBook(storeBook, constants.davUser.accessToken, constants.authorUser.accessToken)
	})

	it("should update status of store book in review of author as admin", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[0]

		await testShouldUpdateStatusOfStoreBook(storeBook, constants.davUser.accessToken, constants.authorUser.accessToken)
	})

	it("should update status of published store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[1]

		await testShouldUpdateStatusOfStoreBook(storeBook, constants.davUser.accessToken, constants.authorUser.accessToken)
	})

	it("should update status of hidden store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[1]

		await testShouldUpdateStatusOfStoreBook(storeBook, constants.davUser.accessToken, constants.authorUser.accessToken)
	})

	it("should update categories of unpublished store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[0]

		await testShouldUpdateCategoriesOfStoreBook(storeBook, constants.davUser.accessToken, constants.authorUser.accessToken)
	})

	it("should update categories of store book in review of author as admin", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[0]

		await testShouldUpdateCategoriesOfStoreBook(storeBook, constants.davUser.accessToken, constants.authorUser.accessToken)
	})

	it("should update categories of published store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[1]

		await testShouldUpdateCategoriesOfStoreBook(storeBook, constants.davUser.accessToken, constants.authorUser.accessToken)
	})

	it("should update categories of hidden store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[1]

		await testShouldUpdateCategoriesOfStoreBook(storeBook, constants.davUser.accessToken, constants.authorUser.accessToken)
	})

	it("should not publish store book without description", async () => {
		resetStoreBooks = true
		resetStoreBookReleases = true
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[0]
		let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]

		// Set the status of the store book to unpublished
		let storeBookResponse = await TableObjectsController.UpdateTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: storeBook.uuid,
			properties: {
				status: "unpublished"
			}
		})

		assert.equal(storeBookResponse.status, 200)

		// Remove the description property from the store book release
		let storeBookReleaseResponse = await TableObjectsController.UpdateTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: storeBookRelease.uuid,
			properties: {
				description: "",
				status: "unpublished"
			}
		})

		assert.equal(storeBookReleaseResponse.status, 200)

		// Try to publish the store book
		try {
			await axios({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					status: "review"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 422)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.CannotPublishStoreBookWitoutDescription)
			return
		}

		assert.fail()
	})

	it("should not publish store book without cover", async () => {
		resetStoreBooks = true
		resetStoreBookReleases = true
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[0]
		let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]

		// Set the status of the store book to unpublished
		let storeBookResponse = await TableObjectsController.UpdateTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: storeBook.uuid,
			properties: {
				status: "unpublished"
			}
		})

		assert.equal(storeBookResponse.status, 200)

		// Remove the cover property from the store book release
		let storeBookReleaseResponse = await TableObjectsController.UpdateTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: storeBookRelease.uuid,
			properties: {
				cover_item: "",
				status: "unpublished"
			}
		})

		assert.equal(storeBookReleaseResponse.status, 200)

		// Try to publish the store book
		try {
			await axios({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					status: "review"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 422)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.CannotPublishStoreBookWithoutCover)
			return
		}

		assert.fail()
	})

	it("should not publish store book without file", async () => {
		resetStoreBooks = true
		resetStoreBookReleases = true
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[0]
		let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]

		// Set the status of the store book to unpublished
		let storeBookResponse = await TableObjectsController.UpdateTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: storeBook.uuid,
			properties: {
				status: "unpublished"
			}
		})

		assert.equal(storeBookResponse.status, 200)

		// Remove the file property from the store book release
		let storeBookReleaseResponse = await TableObjectsController.UpdateTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: storeBookRelease.uuid,
			properties: {
				file_item: "",
				status: "unpublished"
			}
		})

		assert.equal(storeBookReleaseResponse.status, 200)

		// Try to publish the store book
		try {
			await axios({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					status: "review"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 422)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.CannotPublishStoreBookWithoutFile)
			return
		}

		assert.fail()
	})

	it("should publish store book", async () => {
		resetStoreBooks = true
		resetStoreBookReleases = true
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[0]
		let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]

		// Set the store book to unpublished
		let updateResponse = await TableObjectsController.UpdateTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: storeBook.uuid,
			properties: {
				status: "unpublished"
			}
		})

		assert.equal(updateResponse.status, 200)

		// Try to publish the store book
		let response

		try {
			response = await axios({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					status: "review"
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(response.data.uuid, storeBook.uuid)
		assert.equal(response.data.title, storeBookRelease.title)
		assert.equal(response.data.description, storeBookRelease.description)
		assert.equal(response.data.language, storeBook.language)
		assert.equal(response.data.price, storeBook.price ?? 0)
		assert.equal(response.data.isbn, storeBook.isbn)
		assert.equal(response.data.status, "review")

		if (storeBookRelease.categories) {
			assert.equal(response.data.categories.length, storeBookRelease.categories.length)

			for (let key of response.data.categories) {
				assert.isNotNull(constants.categories.find(c => c.key == key))
			}
		} else {
			assert.equal(response.data.categories.length, 0)
		}

		// Get the store book table object
		let storeBookObjResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: storeBook.uuid
		})

		assert.equal(storeBookObjResponse.status, 200)
		assert.equal(storeBookObjResponse.data.tableObject.Uuid, storeBook.uuid)
		assert.equal(storeBookObjResponse.data.tableObject.GetPropertyValue("status"), "review")
	})

	it("should publish hidden store book", async () => {
		resetStoreBooks = true
		resetStoreBookReleases = true
		let collection = constants.authorUser.author.collections[0]
		let storeBook = collection.books[1]
		let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]

		// Try to publish the store book
		let response

		try {
			response = await axios({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					status: "published"
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(response.data.uuid, storeBook.uuid)
		assert.equal(response.data.title, storeBookRelease.title)
		assert.equal(response.data.description, storeBookRelease.description)
		assert.equal(response.data.language, storeBook.language)
		assert.equal(response.data.price, storeBook.price ?? 0)
		assert.equal(response.data.isbn, storeBook.isbn)
		assert.equal(response.data.status, "published")

		if (storeBookRelease.categories) {
			assert.equal(response.data.categories.length, storeBookRelease.categories.length)

			for (let key of response.data.categories) {
				assert.isNotNull(constants.categories.find(c => c.key == key))
			}
		} else {
			assert.equal(response.data.categories.length, 0)
		}

		// Get the store book table object
		let storeBookObjResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: storeBook.uuid
		})

		assert.equal(storeBookObjResponse.status, 200)
		assert.equal(storeBookObjResponse.data.tableObject.Uuid, storeBook.uuid)
		assert.equal(storeBookObjResponse.data.tableObject.GetPropertyValue("status"), "published")
	})

	it("should hide published store book", async () => {
		resetStoreBooks = true
		resetStoreBookReleases = true
		let collection = constants.authorUser.author.collections[1]
		let storeBook = collection.books[1]
		let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
		let response

		try {
			response = await axios({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					status: "hidden"
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(response.data.uuid, storeBook.uuid)
		assert.equal(response.data.title, storeBookRelease.title)
		assert.equal(response.data.description, storeBookRelease.description)
		assert.equal(response.data.language, storeBook.language)
		assert.equal(response.data.price, storeBook.price ?? 0)
		assert.equal(response.data.isbn, storeBook.isbn)
		assert.equal(response.data.status, "hidden")

		if (storeBookRelease.categories) {
			assert.equal(response.data.categories.length, storeBookRelease.categories.length)

			for (let key of response.data.categories) {
				assert.isNotNull(constants.categories.find(c => c.key == key))
			}
		} else {
			assert.equal(response.data.categories.length, 0)
		}

		// Check if the store book was updated on the server
		let storeBookObjResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: storeBook.uuid
		})

		assert.equal(storeBookObjResponse.status, 200)
		assert.equal(storeBookObjResponse.data.tableObject.Uuid, storeBook.uuid)
		assert.equal(storeBookObjResponse.data.tableObject.GetPropertyValue("status"), "hidden")
	})

	it("should not publish store book of admin without description", async () => {
		resetStoreBooks = true
		resetStoreBookReleases = true
		let collection = constants.davUser.authors[0].collections[0]
		let storeBook = collection.books[0]
		let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]

		// Set the status of the store book to unpublished
		let storeBookResponse = await TableObjectsController.UpdateTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: storeBook.uuid,
			properties: {
				status: "unpublished"
			}
		})

		assert.equal(storeBookResponse.status, 200)

		// Remove the description property from the store book release
		let storeBookReleaseResponse = await TableObjectsController.UpdateTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: storeBookRelease.uuid,
			properties: {
				description: "",
				status: "unpublished"
			}
		})

		assert.equal(storeBookReleaseResponse.status, 200)

		// Try to publish the store book
		try {
			await axios({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					status: "published"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 422)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.CannotPublishStoreBookWitoutDescription)
			return
		}

		assert.fail()
	})

	it("should not publish store book of admin without cover", async () => {
		resetStoreBooks = true
		resetStoreBookReleases = true
		let collection = constants.davUser.authors[0].collections[0]
		let storeBook = collection.books[0]
		let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]

		// Set the status of the store book to unpublished
		let storeBookResponse = await TableObjectsController.UpdateTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: storeBook.uuid,
			properties: {
				status: "unpublished"
			}
		})

		assert.equal(storeBookResponse.status, 200)

		// Remove the cover item property from the store book release
		let storeBookReleaseResponse = await TableObjectsController.UpdateTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: storeBookRelease.uuid,
			properties: {
				cover_item: "",
				status: "unpublished"
			}
		})

		assert.equal(storeBookReleaseResponse.status, 200)

		// Try to publish the store book
		try {
			await axios({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					status: "published"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 422)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.CannotPublishStoreBookWithoutCover)
			return
		}

		assert.fail()
	})

	it("should not publish store book of admin without file", async () => {
		resetStoreBooks = true
		resetStoreBookReleases = true
		let collection = constants.davUser.authors[0].collections[0]
		let storeBook = collection.books[0]
		let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]

		// Set the status of the store book to unpublished
		let storeBookResponse = await TableObjectsController.UpdateTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: storeBook.uuid,
			properties: {
				status: "unpublished"
			}
		})

		assert.equal(storeBookResponse.status, 200)

		// Remove the file item property from the store book release
		let storeBookReleaseResponse = await TableObjectsController.UpdateTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: storeBookRelease.uuid,
			properties: {
				file_item: "",
				status: "unpublished"
			}
		})

		assert.equal(storeBookReleaseResponse.status, 200)

		// Try to publish the store book
		try {
			await axios({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					status: "published"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 422)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.CannotPublishStoreBookWithoutFile)
			return
		}

		assert.fail()
	})

	it("should publish store book of admin", async () => {
		resetStoreBooks = true
		resetStoreBookReleases = true
		let collection = constants.davUser.authors[0].collections[0]
		let storeBook = collection.books[0]
		let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]

		// Set the status of the store book to unpublished
		let updateResponse = await TableObjectsController.UpdateTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: storeBook.uuid,
			properties: {
				status: "unpublished"
			}
		})
		
		assert.equal(updateResponse.status, 200)

		// Try to publish the store book
		let response

		try {
			response = await axios({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					status: "review"
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(response.data.uuid, storeBook.uuid)
		assert.equal(response.data.title, storeBookRelease.title)
		assert.equal(response.data.description, storeBookRelease.description)
		assert.equal(response.data.language, storeBook.language)
		assert.equal(response.data.price, storeBook.price ?? 0)
		assert.equal(response.data.isbn, storeBook.isbn)
		assert.equal(response.data.status, "review")

		if (storeBookRelease.categories) {
			assert.equal(response.data.categories.length, storeBookRelease.categories.length)

			for (let key of response.data.categories) {
				assert.isNotNull(constants.categories.find(c => c.key == key))
			}
		} else {
			assert.equal(response.data.categories.length, 0)
		}

		// Check if the store book was updated on the server
		let storeBookObjResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: storeBook.uuid
		})

		assert.equal(storeBookObjResponse.status, 200)
		assert.equal(storeBookObjResponse.data.tableObject.Uuid, storeBook.uuid)
		assert.equal(storeBookObjResponse.data.tableObject.GetPropertyValue("status"), "review")
	})

	it("should publish hidden store book of admin", async () => {
		resetStoreBooks = true
		resetStoreBookReleases = true
		let collection = constants.davUser.authors[0].collections[1]
		let storeBook = collection.books[0]
		let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]

		// Try to publish the store book
		let response

		try {
			response = await axios({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					status: "published"
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(response.data.uuid, storeBook.uuid)
		assert.equal(response.data.title, storeBookRelease.title)
		assert.equal(response.data.description, storeBookRelease.description)
		assert.equal(response.data.language, storeBook.language)
		assert.equal(response.data.price, storeBook.price ?? 0)
		assert.equal(response.data.isbn, storeBook.isbn)
		assert.equal(response.data.status, "published")

		if (storeBookRelease.categories) {
			assert.equal(response.data.categories.length, storeBookRelease.categories.length)

			for (let key of response.data.categories) {
				assert.isNotNull(constants.categories.find(c => c.key == key))
			}
		} else {
			assert.equal(response.data.categories.length, 0)
		}

		// Check if the store book was updated on the server
		let storeBookObjResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: storeBook.uuid
		})

		assert.equal(storeBookObjResponse.status, 200)
		assert.equal(storeBookObjResponse.data.tableObject.Uuid, storeBook.uuid)
		assert.equal(storeBookObjResponse.data.tableObject.GetPropertyValue("status"), "published")
	})

	it("should hide store book of admin", async () => {
		resetStoreBooks = true
		resetStoreBookReleases = true
		let collection = constants.davUser.authors[0].collections[0]
		let storeBook = collection.books[0]
		let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
		let response

		try {
			response = await axios({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.davUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					status: "hidden"
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 200)
		assert.equal(response.data.uuid, storeBook.uuid)
		assert.equal(response.data.title, storeBookRelease.title)
		assert.equal(response.data.description, storeBookRelease.description)
		assert.equal(response.data.language, storeBook.language)
		assert.equal(response.data.price, storeBook.price ?? 0)
		assert.equal(response.data.isbn, storeBook.isbn)
		assert.equal(response.data.status, "hidden")

		if (storeBookRelease.categories) {
			assert.equal(response.data.categories.length, storeBookRelease.categories.length)

			for (let key of response.data.categories) {
				assert.isNotNull(constants.categories.find(c => c.key == key))
			}
		} else {
			assert.equal(response.data.categories.length, 0)
		}

		// Check if the store book was updated on the server
		let storeBookObjResponse = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: storeBook.uuid
		})

		assert.equal(storeBookObjResponse.status, 200)
		assert.equal(storeBookObjResponse.data.tableObject.Uuid, storeBook.uuid)
		assert.equal(storeBookObjResponse.data.tableObject.GetPropertyValue("status"), "hidden")
	})
})

async function testShouldUpdateTitleOfStoreBook(storeBook, accessToken, ownerAccessToken) {
	resetStoreBooks = true
	resetStoreBookReleases = true
	let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
	let title = "Updated title"
	let response

	try {
		response = await axios({
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

	assert.equal(response.status, 200)
	assert.equal(response.data.uuid, storeBook.uuid)
	assert.equal(response.data.title, title)
	assert.equal(response.data.description, storeBookRelease.description)
	assert.equal(response.data.language, storeBook.language)
	assert.equal(response.data.price, storeBook.price ?? 0)
	assert.equal(response.data.isbn, storeBook.isbn)
	assert.equal(response.data.status, storeBook.status ?? "unpublished")

	if (storeBookRelease.categories) {
		assert.equal(response.data.categories.length, storeBookRelease.categories.length)

		for (let key of response.data.categories) {
			assert.isNotNull(constants.categories.find(c => c.key == key))
		}
	} else {
		assert.equal(response.data.categories.length, 0)
	}

	// Get the store book table object
	let storeBookObjResponse = await TableObjectsController.GetTableObject({
		accessToken: ownerAccessToken ?? accessToken,
		uuid: storeBook.uuid
	})

	assert.equal(storeBookObjResponse.status, 200)
	assert.equal(storeBookObjResponse.data.tableObject.Uuid, storeBook.uuid)

	// Get the store book release table object
	let releaseUuid = storeBookObjResponse.data.tableObject.GetPropertyValue("releases").split(',').pop()

	let releaseObjResponse = await TableObjectsController.GetTableObject({
		accessToken: ownerAccessToken ?? accessToken,
		uuid: releaseUuid
	})

	assert.equal(releaseObjResponse.status, 200)
	assert.equal(releaseObjResponse.data.tableObject.Uuid, releaseUuid)
	assert.equal(releaseObjResponse.data.tableObject.GetPropertyValue("title"), title)
	assert.equal(releaseObjResponse.data.tableObject.GetPropertyValue("status") ?? "unpublished", "unpublished")
}

async function testShouldUpdateDescriptionOfStoreBook(storeBook, accessToken, ownerAccessToken) {
	resetStoreBooks = true
	resetStoreBookReleases = true
	let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
	let description = "Updated description"
	let response

	try {
		response = await axios({
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

	assert.equal(response.status, 200)
	assert.equal(response.data.uuid, storeBook.uuid)
	assert.equal(response.data.title, storeBookRelease.title)
	assert.equal(response.data.description, description)
	assert.equal(response.data.language, storeBook.language)
	assert.equal(response.data.price, storeBook.price ?? 0)
	assert.equal(response.data.isbn, storeBook.isbn)
	assert.equal(response.data.status, storeBook.status ?? "unpublished")

	if (storeBookRelease.categories) {
		assert.equal(response.data.categories.length, storeBookRelease.categories.length)

		for (let key of response.data.categories) {
			assert.isNotNull(constants.categories.find(c => c.key == key))
		}
	} else {
		assert.equal(response.data.categories.length, 0)
	}

	// Get the store book table object
	let storeBookObjResponse = await TableObjectsController.GetTableObject({
		accessToken: ownerAccessToken ?? accessToken,
		uuid: storeBook.uuid
	})

	assert.equal(storeBookObjResponse.status, 200)
	assert.equal(storeBookObjResponse.data.tableObject.Uuid, storeBook.uuid)

	// Get the store book release table object
	let releaseUuid = storeBookObjResponse.data.tableObject.GetPropertyValue("releases").split(',').pop()
	
	let releaseObjResponse = await TableObjectsController.GetTableObject({
		accessToken: ownerAccessToken ?? accessToken,
		uuid: releaseUuid
	})

	assert.equal(releaseObjResponse.status, 200)
	assert.equal(releaseObjResponse.data.tableObject.Uuid, releaseUuid)
	assert.equal(releaseObjResponse.data.tableObject.GetPropertyValue("description"), description)
	assert.equal(releaseObjResponse.data.tableObject.GetPropertyValue("status") ?? "unpublished", "unpublished")
}

async function testShouldUpdateLanguageOfStoreBook(storeBook, accessToken, ownerAccessToken) {
	resetStoreBooks = true
	resetStoreBookReleases = true
	let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
	let language = "fr"
	let response

	try {
		response = await axios({
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

	assert.equal(response.status, 200)
	assert.equal(response.data.uuid, storeBook.uuid)
	assert.equal(response.data.title, storeBookRelease.title)
	assert.equal(response.data.description, storeBookRelease.description)
	assert.equal(response.data.language, language)
	assert.equal(response.data.price, storeBook.price ?? 0)
	assert.equal(response.data.isbn, storeBook.isbn)
	assert.equal(response.data.status, storeBook.status ?? "unpublished")

	if (storeBookRelease.categories) {
		assert.equal(response.data.categories.length, storeBookRelease.categories.length)

		for (let key of response.data.categories) {
			assert.isNotNull(constants.categories.find(c => c.key == key))
		}
	} else {
		assert.equal(response.data.categories.length, 0)
	}

	// Get the store book table object
	let storeBookObjResponse = await TableObjectsController.GetTableObject({
		accessToken: ownerAccessToken ?? accessToken,
		uuid: storeBook.uuid
	})

	assert.equal(storeBookObjResponse.status, 200)
	assert.equal(storeBookObjResponse.data.tableObject.Uuid, storeBook.uuid)
	assert.equal(storeBookObjResponse.data.tableObject.GetPropertyValue("language"), language)
}

async function testShouldNotUpdateLanguageOfStoreBook(storeBook, accessToken) {
	let language = "fr"

	try {
		await axios({
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
		assert.equal(error.response.status, 422)
		assert.equal(error.response.data.errors.length, 1)
		assert.equal(error.response.data.errors[0].code, ErrorCodes.CannotUpdateLanguageOfPublishedStoreBook)
		return
	}

	assert.fail()
}

async function testShouldUpdatePriceOfStoreBook(storeBook, accessToken, ownerAccessToken) {
	resetStoreBooks = true
	resetStoreBookReleases = true
	let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
	let price = 23
	let response

	try {
		response = await axios({
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

	assert.equal(response.status, 200)
	assert.equal(response.data.uuid, storeBook.uuid)
	assert.equal(response.data.title, storeBookRelease.title)
	assert.equal(response.data.description, storeBookRelease.description)
	assert.equal(response.data.language, storeBook.language)
	assert.equal(response.data.price, price)
	assert.equal(response.data.isbn, storeBook.isbn)
	assert.equal(response.data.status, storeBook.status ?? "unpublished")

	if (storeBookRelease.categories) {
		assert.equal(response.data.categories.length, storeBookRelease.categories.length)

		for (let key of response.data.categories) {
			assert.isNotNull(constants.categories.find(c => c.key == key))
		}
	} else {
		assert.equal(response.data.categories.length, 0)
	}

	// Get the store book table object
	let storeBookObjResponse = await TableObjectsController.GetTableObject({
		accessToken: ownerAccessToken ?? accessToken,
		uuid: storeBook.uuid
	})

	assert.equal(storeBookObjResponse.status, 200)
	assert.equal(storeBookObjResponse.data.tableObject.Uuid, storeBook.uuid)
	assert.equal(storeBookObjResponse.data.tableObject.GetPropertyValue("price"), price)
}

async function testShouldNotUpdatePriceOfStoreBook(storeBook, accessToken) {
	let price = 354

	try {
		await axios({
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
		assert.equal(error.response.status, 422)
		assert.equal(error.response.data.errors.length, 1)
		assert.equal(error.response.data.errors[0].code, ErrorCodes.CannotUpdatePriceOfPublishedStoreBook)
		return
	}

	assert.fail()
}

async function testShouldUpdateIsbnOfStoreBook(storeBook, accessToken, ownerAccessToken) {
	resetStoreBooks = true
	resetStoreBookReleases = true
	let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
	let isbn = "1234567890123"
	let response

	try {
		response = await axios({
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

	assert.equal(response.status, 200)
	assert.equal(response.data.uuid, storeBook.uuid)
	assert.equal(response.data.title, storeBookRelease.title)
	assert.equal(response.data.description, storeBookRelease.description)
	assert.equal(response.data.language, storeBook.language)
	assert.equal(response.data.price, storeBook.price ?? 0)
	assert.equal(response.data.isbn, isbn)
	assert.equal(response.data.status, storeBook.status ?? "unpublished")

	if (storeBookRelease.categories) {
		assert.equal(response.data.categories.length, storeBookRelease.categories.length)

		for (let key of response.data.categories) {
			assert(constants.categories.find(c => c.key == key) != null)
		}
	} else {
		assert.equal(response.data.categories.length, 0)
	}

	// Get the store book table object
	let storeBookObjResponse = await TableObjectsController.GetTableObject({
		accessToken: ownerAccessToken ?? accessToken,
		uuid: storeBook.uuid
	})

	assert.equal(storeBookObjResponse.status, 200)
	assert.equal(storeBookObjResponse.data.tableObject.Uuid, storeBook.uuid)
	assert.equal(storeBookObjResponse.data.tableObject.GetPropertyValue("isbn"), isbn)

	// Remove isbn with empty string
	try {
		response = await axios({
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

	assert.equal(response.status, 200)
	assert.equal(response.data.uuid, storeBook.uuid)
	assert.equal(response.data.title, storeBookRelease.title)
	assert.equal(response.data.description, storeBookRelease.description)
	assert.equal(response.data.language, storeBook.language)
	assert.equal(response.data.price, storeBook.price ?? 0)
	assert.isNull(response.data.isbn)
	assert.equal(response.data.status, storeBook.status ?? "unpublished")

	if (storeBookRelease.categories) {
		assert.equal(response.data.categories.length, storeBookRelease.categories.length)

		for (let key of response.data.categories) {
			assert(constants.categories.find(c => c.key == key) != null)
		}
	} else {
		assert.equal(response.data.categories.length, 0)
	}

	// Get the store book table object
	storeBookObjResponse = await TableObjectsController.GetTableObject({
		accessToken: ownerAccessToken ?? accessToken,
		uuid: storeBook.uuid
	})

	assert.equal(storeBookObjResponse.status, 200)
	assert.equal(storeBookObjResponse.data.tableObject.Uuid, storeBook.uuid)
	assert.isNull(storeBookObjResponse.data.tableObject.GetPropertyValue("isbn"))
}

async function testShouldNotUpdateIsbnOfStoreBook(storeBook, accessToken) {
	let isbn = "3210987654321"

	try {
		await axios({
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
		assert.equal(error.response.status, 422)
		assert.equal(error.response.data.errors.length, 1)
		assert.equal(error.response.data.errors[0].code, ErrorCodes.CannotUpdateIsbnOfPublishedStoreBook)
		return
	}

	assert.fail()
}

async function testShouldUpdateStatusOfStoreBook(storeBook, accessToken, ownerAccessToken) {
	resetStoreBooks = true
	resetStoreBookReleases = true
	let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
	let status = storeBook.status == "published" ? "hidden" : "published"
	let response

	try {
		response = await axios({
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

	assert.equal(response.status, 200)
	assert.equal(response.data.uuid, storeBook.uuid)
	assert.equal(response.data.title, storeBookRelease.title)
	assert.equal(response.data.description, storeBookRelease.description)
	assert.equal(response.data.language, storeBook.language)
	assert.equal(response.data.price, storeBook.price ?? 0)
	assert.equal(response.data.isbn, storeBook.isbn)
	assert.equal(response.data.status, status)

	if (storeBookRelease.categories) {
		assert.equal(response.data.categories.length, storeBookRelease.categories.length)

		for (let key of response.data.categories) {
			assert.isNotNull(constants.categories.find(c => c.key == key))
		}
	} else {
		assert.equal(response.data.categories.length, 0)
	}

	// Get the store book table object
	let storeBookObjResponse = await TableObjectsController.GetTableObject({
		accessToken: ownerAccessToken ?? accessToken,
		uuid: storeBook.uuid
	})

	assert.equal(storeBookObjResponse.status, 200)
	assert.equal(storeBookObjResponse.data.tableObject.Uuid, storeBook.uuid)
	assert.equal(storeBookObjResponse.data.tableObject.GetPropertyValue("status"), status)
}

async function testShouldUpdateCategoriesOfStoreBook(storeBook, accessToken, ownerAccessToken) {
	resetStoreBooks = true
	resetStoreBookReleases = true
	let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
	let categories = [constants.categories[0].key, constants.categories[2].key]
	let categoryUuids = [constants.categories[0].uuid, constants.categories[2].uuid]
	let response

	try {
		response = await axios({
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

	assert.equal(response.status, 200)
	assert.equal(response.data.uuid, storeBook.uuid)
	assert.equal(response.data.title, storeBookRelease.title)
	assert.equal(response.data.description, storeBookRelease.description)
	assert.equal(response.data.language, storeBook.language)
	assert.equal(response.data.price, storeBook.price ?? 0)
	assert.equal(response.data.isbn, storeBook.isbn)
	assert.equal(response.data.status, storeBook.status ?? "unpublished")
	assert.equal(response.data.categories.length, categories.length)

	let i = 0
	for (let key of response.data.categories) {
		assert.equal(categories[i], key)
		i++
	}

	// Get the store book table object
	let storeBookObjResponse = await TableObjectsController.GetTableObject({
		accessToken: ownerAccessToken ?? accessToken,
		uuid: storeBook.uuid
	})

	assert.equal(storeBookObjResponse.status, 200)
	assert.equal(storeBookObjResponse.data.tableObject.Uuid, storeBook.uuid)

	// Get the store book release table object
	let releaseUuid = storeBookObjResponse.data.tableObject.GetPropertyValue("releases").split(',').pop()
	
	let releaseObjResponse = await TableObjectsController.GetTableObject({
		accessToken: ownerAccessToken ?? accessToken,
		uuid: releaseUuid
	})

	assert.equal(releaseObjResponse.status, 200)
	assert.equal(releaseObjResponse.data.tableObject.Uuid, releaseUuid)
	assert.equal(releaseObjResponse.data.tableObject.GetPropertyValue("categories"), categoryUuids.join(','))
	assert.equal(releaseObjResponse.data.tableObject.GetPropertyValue("status") ?? "unpublished", "unpublished")
}