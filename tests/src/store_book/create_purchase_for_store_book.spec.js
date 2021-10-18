import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import { PurchasesController } from 'dav-js'
import constants from '../constants.js'
import * as ErrorCodes from '../errorCodes.js'

const createPurchaseForStoreBookEndpointUrl = `${constants.apiBaseUrl}/api/1/call/store/book/{0}/purchase`
var purchasesToRemove = []

afterEach(async () => {
	// Remove each purchase
	for (let purchase of purchasesToRemove) {
		await PurchasesController.DeletePurchase(purchase)
	}

	purchasesToRemove = []
})

describe("CreatePurchaseForStoreBook endpoint", () => {
	it("should not create purchase for store book without access token", async () => {
		try {
			await axios({
				method: 'post',
				url: createPurchaseForStoreBookEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					'Content-Type': 'application/json'
				}
			})
		} catch (error) {
			assert.equal(401, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.AuthorizationHeaderMissing, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not create purchase for store book with access token for session that does not exist", async () => {
		try {
			await axios({
				method: 'post',
				url: createPurchaseForStoreBookEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: "asdasdasd.asdasd",
					'Content-Type': 'application/json'
				},
				data: {
					"currency": "eur"
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

	it("should not create purchase for store book without Content-Type json", async () => {
		try {
			await axios({
				method: 'post',
				url: createPurchaseForStoreBookEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: constants.authorUser.accessToken
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

	it("should not create purchase for store book with access token for another app", async () => {
		try {
			await axios({
				method: 'post',
				url: createPurchaseForStoreBookEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: constants.testUserTestAppAccessToken,
					'Content-Type': 'application/json'
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

	it("should not create purchase for store book without required properties", async () => {
		try {
			await axios({
				method: 'post',
				url: createPurchaseForStoreBookEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.CurrencyMissing, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not create purchase for store book with properties with wrong types", async () => {
		try {
			await axios({
				method: 'post',
				url: createPurchaseForStoreBookEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					currency: true
				}
			})
		} catch (error) {
			assert.equal(400, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.CurrencyWrongType, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not create purchase for store book that does not exist", async () => {
		try {
			await axios({
				method: 'post',
				url: createPurchaseForStoreBookEndpointUrl.replace('{0}', "shodhosdhosdf"),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					currency: "eur"
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

	it("should not create purchase for store book if the user already purchased the store book", async () => {
		try {
			await axios({
				method: 'post',
				url: createPurchaseForStoreBookEndpointUrl.replace('{0}', constants.davUser.authors[0].collections[0].books[0].uuid),
				headers: {
					Authorization: constants.testUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					currency: "eur"
				}
			})
		} catch (error) {
			assert.equal(422, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.UserAlreadyPurchasedThisStoreBook, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not create purchase for store book that is not published", async () => {
		try {
			await axios({
				method: 'post',
				url: createPurchaseForStoreBookEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: constants.testUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					currency: "eur"
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

	it("should not create purchase for store book without TableObjectPrice", async () => {
		try {
			await axios({
				method: 'post',
				url: createPurchaseForStoreBookEndpointUrl.replace('{0}', constants.authorUser.author.collections[2].books[1].uuid),
				headers: {
					Authorization: constants.testUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					currency: "eur"
				}
			})
		} catch (error) {
			assert.equal(404, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.TableObjectPriceDoesNotExist, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should not create purchase for store book whose user is not a provider", async () => {
		try {
			await axios({
				method: 'post',
				url: createPurchaseForStoreBookEndpointUrl.replace('{0}', constants.davUser.authors[0].collections[0].books[0].uuid),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					currency: "eur"
				}
			})
		} catch (error) {
			assert.equal(412, error.response.status)
			assert.equal(1, error.response.data.errors.length)
			assert.equal(ErrorCodes.UserOfStoreBookMustHaveProvider, error.response.data.errors[0].code)
			return
		}

		assert.fail()
	})

	it("should create purchase for store book", async () => {
		let author = constants.authorUser.author
		let storeBook = author.collections[1].books[1]
		let response

		try {
			response = await axios({
				method: 'post',
				url: createPurchaseForStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.klausUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					currency: "eur"
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(201, response.status)
		assert.equal(constants.klausUser.id, response.data.user_id)
		assert.isNotNull(response.data.uuid)
		assert.isNotNull(response.data.payment_intent)
		assert.equal(`${author.firstName} ${author.lastName}`, response.data.provider_name)
		assert.equal(`${constants.apiBaseUrl}/api/1/call/author/${author.uuid}/profile_image`, response.data.provider_image)
		assert.equal(storeBook.title, response.data.product_name)
		assert.equal(`${constants.apiBaseUrl}/api/1/call/store/book/${storeBook.uuid}/cover`, response.data.product_image)
		assert.equal(storeBook.price, response.data.price)
		assert.equal("eur", response.data.currency)
		assert.isFalse(response.data.completed)

		purchasesToRemove.push({
			uuid: response.data.uuid,
			accessToken: constants.klausUser.accessToken
		})

		// Check the purchase on the backend
		let purchaseResponse = await PurchasesController.GetPurchase({
			auth: constants.davDev,
			uuid: response.data.uuid
		})

		assert.equal(200, purchaseResponse.status)
		assert.equal(response.data.id, purchaseResponse.data.Id)
		assert.equal(response.data.user_id, purchaseResponse.data.UserId)
		assert.equal(response.data.payment_intent_id, purchaseResponse.data.PaymentIntentId)
		assert.equal(response.data.provider_name, purchaseResponse.data.ProviderName)
		assert.equal(response.data.provider_image, purchaseResponse.data.ProviderImage)
		assert.equal(response.data.product_name, purchaseResponse.data.ProductName)
		assert.equal(response.data.product_image, purchaseResponse.data.ProductImage)
		assert.equal(response.data.price, purchaseResponse.data.Price)
		assert.equal(response.data.currency, purchaseResponse.data.Currency)
		assert.equal(response.data.completed, purchaseResponse.data.Completed)
	})

	it("should create purchase for own store book", async () => {
		let author = constants.authorUser.author
		let storeBook = author.collections[1].books[1]
		let response

		try {
			response = await axios({
				method: 'post',
				url: createPurchaseForStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					currency: "eur"
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(201, response.status)
		assert.equal(constants.authorUser.id, response.data.user_id)
		assert.isNotNull(response.data.uuid)
		assert.isNull(response.data.payment_intent_id)
		assert.equal(`${author.firstName} ${author.lastName}`, response.data.provider_name)
		assert.equal(`${constants.apiBaseUrl}/api/1/call/author/${author.uuid}/profile_image`, response.data.provider_image)
		assert.equal(storeBook.title, response.data.product_name)
		assert.equal(`${constants.apiBaseUrl}/api/1/call/store/book/${storeBook.uuid}/cover`, response.data.product_image)
		assert.equal(0, response.data.price)
		assert.equal("eur", response.data.currency)
		assert.isTrue(response.data.completed)

		purchasesToRemove.push({
			uuid: response.data.uuid,
			accessToken: constants.authorUser.accessToken
		})

		// Check the purchase on the backend
		let purchaseResponse = await PurchasesController.GetPurchase({
			auth: constants.davDev,
			uuid: response.data.uuid
		})

		assert.equal(200, purchaseResponse.status)
		assert.equal(response.data.id, purchaseResponse.data.Id)
		assert.equal(response.data.user_id, purchaseResponse.data.UserId)
		assert.equal(response.data.payment_intent_id, purchaseResponse.data.PaymentIntentId)
		assert.equal(response.data.provider_name, purchaseResponse.data.ProviderName)
		assert.equal(response.data.provider_image, purchaseResponse.data.ProviderImage)
		assert.equal(response.data.product_name, purchaseResponse.data.ProductName)
		assert.equal(response.data.product_image, purchaseResponse.data.ProductImage)
		assert.equal(response.data.price, purchaseResponse.data.Price)
		assert.equal(response.data.currency, purchaseResponse.data.Currency)
		assert.equal(response.data.completed, purchaseResponse.data.Completed)
	})
})