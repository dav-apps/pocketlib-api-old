import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'
import * as ErrorCodes from '../errorCodes.js'

const getBooksOfAuthorEndpointUrl = `${constants.apiBaseUrl}/author/{0}/books`

describe("GetStoreBooksOfAuthor endpoint", () => {
	it("should not return store books of author that does not exist", async () => {
		try {
			await axios({
				method: 'get',
				url: getBooksOfAuthorEndpointUrl.replace('{0}', "asdasdasd")
			})
		} catch (error) {
			assert.equal(error.response.status, 404)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.AuthorDoesNotExist)
			return
		}

		assert.fail()
	})

	it("should not return store books of author if the table object is not an author", async () => {
		try {
			await axios({
				method: 'get',
				url: getBooksOfAuthorEndpointUrl.replace('{0}', constants.davUser.authors[0].bios[0].uuid)
			})
		} catch (error) {
			assert.equal(error.response.status, 403)
			assert.equal(error.response.data.errors.length, 1)
			assert.equal(error.response.data.errors[0].code, ErrorCodes.ActionNotAllowed)
			return
		}

		assert.fail()
	})

	it("should not return author with store books with not supported language", async () => {
		try {
			await axios({
				method: 'get',
				url: getBooksOfAuthorEndpointUrl.replace('{0}', constants.authorUser.author.uuid),
				params: {
					languages: "asd"
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

	it("should return store books of author", async () => {
		await testGetStoreBooksOfAuthor(constants.authorUser.author)
	})

	it("should return store books of author with specified language", async () => {
		await testGetStoreBooksOfAuthor(constants.authorUser.author, ["de"])
	})

	it("should return store books of author with specified languages", async () => {
		await testGetStoreBooksOfAuthor(constants.authorUser.author, ["en", "de"])
	})

	it("should return store books of author of admin", async () => {
		await testGetStoreBooksOfAuthor(constants.davUser.authors[0])
	})

	it("should return store books of author of admin with specified language", async () => {
		await testGetStoreBooksOfAuthor(constants.davUser.authors[0], ["de"])
	})

	it("should return store books of author of admin with specified languages", async () => {
		await testGetStoreBooksOfAuthor(constants.davUser.authors[0], ["en", "de"])
	})

	async function testGetStoreBooksOfAuthor(author, languages) {
		let response

		try {
			let options = {
				method: 'get',
				url: getBooksOfAuthorEndpointUrl.replace('{0}', author.uuid),
				params: {
					fields: "*"
				}
			}

			if (languages) {
				options.params["languages"] = languages.join(',')
			}

			response = await axios(options)
		} catch (error) {
			assert.fail()
		}

		if (!languages) {
			languages = ["en"]
		}

		// Find the store books
		let storeBooks = []
		for (let collection of author.collections) {
			for (let storeBook of collection.books) {
				if (
					storeBook.status == "published"
					&& languages.includes(storeBook.language)
					&& storeBook.releases.length > 0
				) {
					storeBooks.push(storeBook)
				}
			}
		}

		assert.equal(response.status, 200)

		for (let book of response.data.books) {
			let storeBook = storeBooks.find(sBook => sBook.uuid == book.uuid)
			assert.isNotNull(storeBook)

			let storeBookRelease = storeBook.releases[storeBook.releases.length - 1]
			assert.isNotNull(storeBookRelease)

			let coverItem = storeBookRelease.coverItem
			assert.isNotNull(coverItem)

			assert.equal(book.uuid, storeBook.uuid)
			assert.equal(book.title, storeBookRelease.title)
			assert.equal(book.description, storeBookRelease.description)
			assert.equal(book.language, storeBook.language)
			assert.equal(book.cover_aspect_ratio, coverItem.aspectRatio)
			assert.equal(book.cover_blurhash, coverItem.blurhash)
		}
	}	
})