import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import { PurchasesController } from 'dav-js'
import constants from '../constants.js'
import * as ErrorCodes from '../errorCodes.js'

const createPurchaseEndpointUrl = `${constants.apiBaseUrl}/purchases`
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
				url: createPurchaseEndpointUrl,
				headers: {
					'Content-Type': 'application/json'
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 401)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.AuthorizationHeaderMissing)
			return
		}

		assert.fail()
	})

	it("should not create purchase for store book with access token for session that does not exist", async () => {
		try {
			await axios({
				method: 'post',
				url: createPurchaseEndpointUrl,
				headers: {
					Authorization: "asdasdasd.asdasd",
					'Content-Type': 'application/json'
				},
				data: {
					store_book: constants.authorUser.author.collections[0].books[0].uuid,
					currency: "eur"
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

	it("should not create purchase for store book without Content-Type json", async () => {
		try {
			await axios({
				method: 'post',
				url: createPurchaseEndpointUrl,
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

	it("should not create purchase for store book with access token for another app", async () => {
		try {
			await axios({
				method: 'post',
				url: createPurchaseEndpointUrl,
				headers: {
					Authorization: constants.testUserTestAppAccessToken,
					'Content-Type': 'application/json'
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

	it("should not create purchase for store book without required properties", async () => {
		try {
			await axios({
				method: 'post',
				url: createPurchaseEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 2)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.StoreBookMissing)
			assert.equal(error.response.data.errors[1].code, ErrorCodes.CurrencyMissing)
			return
		}

		assert.fail()
	})

	it("should not create purchase for store book with properties with wrong types", async () => {
		try {
			await axios({
				method: 'post',
				url: createPurchaseEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					store_book: 234,
					currency: true
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 400)
			assert.equal(error.response.data.errors.length, 2)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.StoreBookWrongType)
			assert.equal(error.response.data.errors[1].code, ErrorCodes.CurrencyWrongType)
			return
		}

		assert.fail()
	})

	it("should not create purchase for store book that does not exist", async () => {
		try {
			await axios({
				method: 'post',
				url: createPurchaseEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					store_book: "asdasasdsd",
					currency: "eur"
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

	it("should not create purchase for store book if the user already purchased the store book", async () => {
		try {
			await axios({
				method: 'post',
				url: createPurchaseEndpointUrl,
				headers: {
					Authorization: constants.testUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					store_book: constants.davUser.authors[0].collections[0].books[0].uuid,
					currency: "eur"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 422)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.UserAlreadyPurchasedThisStoreBook)
			return
		}

		assert.fail()
	})

	it("should not create purchase for store book that is not published", async () => {
		try {
			await axios({
				method: 'post',
				url: createPurchaseEndpointUrl,
				headers: {
					Authorization: constants.testUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					store_book: constants.authorUser.author.collections[0].books[0].uuid,
					currency: "eur"
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

	it("should not create purchase for store book without TableObjectPrice", async () => {
		try {
			await axios({
				method: 'post',
				url: createPurchaseEndpointUrl,
				headers: {
					Authorization: constants.testUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					store_book: constants.authorUser.author.collections[2].books[1].uuid,
					currency: "eur"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 404)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.TableObjectPriceDoesNotExist)
			return
		}

		assert.fail()
	})

	it("should not create purchase for store book whose user is not a provider", async () => {
		try {
			await axios({
				method: 'post',
				url: createPurchaseEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				data: {
					store_book: constants.davUser.authors[0].collections[0].books[0].uuid,
					currency: "eur"
				}
			})
		} catch (error) {
			assert.equal(error.response.status, 412)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.UserOfStoreBookMustHaveProvider)
			return
		}

		assert.fail()
	})

	it("should create purchase for store book", async () => {
		let author = constants.authorUser.author
		let storeBook = author.collections[1].books[1]
		let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
		let response

		try {
			response = await axios({
				method: 'post',
				url: createPurchaseEndpointUrl,
				headers: {
					Authorization: constants.klausUser.accessToken,
					'Content-Type': 'application/json'
				},
				params: {
					fields: "*"
				},
				data: {
					store_book: storeBook.uuid,
					currency: "eur"
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 201)
		assert.equal(Object.keys(response.data).length, 11)
		assert.equal(response.data.user_id, constants.klausUser.id)
		assert.isNotNull(response.data.uuid)
		assert.isNotNull(response.data.payment_intent)
		assert.equal(response.data.provider_name, `${author.firstName} ${author.lastName}`)
		assert.equal(response.data.provider_image, `${constants.apiBaseUrl}/author/${author.uuid}/profile_image`)
		assert.equal(response.data.product_name, storeBook.releases[0].title)
		assert.equal(response.data.product_image, `${constants.apiBaseUrl}/store/book/${storeBook.uuid}/cover`)
		assert.equal(response.data.price, storeBookRelease.price)
		assert.equal(response.data.currency, "eur")
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

		assert.equal(purchaseResponse.status, 200)
		assert.equal(purchaseResponse.data.Id, response.data.id)
		assert.equal(purchaseResponse.data.UserId, response.data.user_id)
		assert.equal(purchaseResponse.data.PaymentIntentId, response.data.payment_intent_id)
		assert.equal(purchaseResponse.data.ProviderName, response.data.provider_name)
		assert.equal(purchaseResponse.data.ProviderImage, response.data.provider_image)
		assert.equal(purchaseResponse.data.ProductName, response.data.product_name)
		assert.equal(purchaseResponse.data.ProductImage, response.data.product_image)
		assert.equal(purchaseResponse.data.Price, response.data.price)
		assert.equal(purchaseResponse.data.Currency, response.data.currency)
		assert.equal(purchaseResponse.data.Completed, response.data.completed)
	})

	it("should create purchase for own store book", async () => {
		let author = constants.authorUser.author
		let storeBook = author.collections[1].books[1]
		let response

		try {
			response = await axios({
				method: 'post',
				url: createPurchaseEndpointUrl,
				headers: {
					Authorization: constants.authorUser.accessToken,
					'Content-Type': 'application/json'
				},
				params: {
					fields: "*"
				},
				data: {
					store_book: storeBook.uuid,
					currency: "eur"
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(response.status, 201)
		assert.equal(Object.keys(response.data).length, 11)
		assert.equal(response.data.user_id, constants.authorUser.id)
		assert.isNotNull(response.data.uuid)
		assert.isNull(response.data.payment_intent_id)
		assert.equal(response.data.provider_name, `${author.firstName} ${author.lastName}`)
		assert.equal(response.data.provider_image, `${constants.apiBaseUrl}/author/${author.uuid}/profile_image`)
		assert.equal(response.data.product_name, storeBook.releases[0].title)
		assert.equal(response.data.product_image, `${constants.apiBaseUrl}/store/book/${storeBook.uuid}/cover`)
		assert.equal(response.data.price, 0)
		assert.equal(response.data.currency, "eur")
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

		assert.equal(purchaseResponse.status, 200)
		assert.equal(purchaseResponse.data.Id, response.data.id)
		assert.equal(purchaseResponse.data.UserId, response.data.user_id)
		assert.equal(purchaseResponse.data.PaymentIntentId, response.data.payment_intent_id)
		assert.equal(purchaseResponse.data.ProviderName, response.data.provider_name)
		assert.equal(purchaseResponse.data.ProviderImage, response.data.provider_image)
		assert.equal(purchaseResponse.data.ProductName, response.data.product_name)
		assert.equal(purchaseResponse.data.ProductImage, response.data.product_image)
		assert.equal(purchaseResponse.data.Price, response.data.price)
		assert.equal(purchaseResponse.data.Currency, response.data.currency)
		assert.equal(purchaseResponse.data.Completed, response.data.completed)
	})
})