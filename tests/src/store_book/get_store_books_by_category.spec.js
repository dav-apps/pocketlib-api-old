import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'

const getStoreBooksByCategoryEndpointUrl = `${constants.apiBaseUrl}/api/1/call/store/books/category/{0}`

describe("GetStoreBooksByCategory endpoint", () => {
	it("should not return store books by category that does not exist", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getStoreBooksByCategoryEndpointUrl.replace('{0}', "asd")
			});
		}catch(error){
			assert.equal(404, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2810, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not return store books by category with not supported language", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getStoreBooksByCategoryEndpointUrl.replace('{0}', constants.categories[0].key),
				params: {
					language: "bla"
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(1107, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should return store books by category", async () => {
		let response;
		let category = constants.categories[0];

		try{
			response = await axios.default({
				method: 'get',
				url: getStoreBooksByCategoryEndpointUrl.replace('{0}', category.key)
			});
		}catch(error){
			assert.fail();
		}

		// Find all store books with the category and language = en
		let storeBooks = [];
		for(let collection of constants.authorUser.author.collections){
			for(let storeBook of collection.books){
				if (
					storeBook.language == "en" &&
					storeBook.status == "published" &&
					storeBook.categories &&
					storeBook.categories.includes(category.uuid)
				) {
					storeBooks.push(storeBook);
				}
			}
		}

		assert.equal(200, response.status);
		assert.equal(storeBooks.length, response.data.books.length);

		let i = 0;
		for (let book of response.data.books) {
			let storeBook = storeBooks[i];
			assert.equal(storeBook.uuid, book.uuid);
			assert.equal(storeBook.title, book.title);
			assert.equal(storeBook.description, book.description);
			assert.equal(storeBook.language, book.language);
			assert.equal(storeBook.status, book.status);
			assert.equal(storeBook.cover != null, book.cover);
			assert.equal(storeBook.file != null, book.file);

			if (storeBook.categories) {
				assert.equal(storeBook.categories.length, book.categories.length);

				for (let key of book.categories) {
					assert(constants.categories.find(c => c.key == key) != null);
				}
			} else {
				assert.equal(0, book.categories.length);
			}

			i++;
		}
	});

	it("should return store books by category with specified language", async () => {
		let response;
		let category = constants.categories[0];
		let language = "de";

		try{
			response = await axios.default({
				method: 'get',
				url: getStoreBooksByCategoryEndpointUrl.replace('{0}', category.key),
				params: {
					language
				}
			});
		}catch(error){
			assert.fail();
		}

		// Find all store books with the category and the language
		let storeBooks = [];
		for(let collection of constants.authorUser.author.collections){
			for(let storeBook of collection.books){
				if (
					storeBook.language == language &&
					storeBook.status == "published" &&
					storeBook.categories &&
					storeBook.categories.includes(category.uuid)
				) {
					storeBooks.push(storeBook);
				}
			}
		}

		assert.equal(200, response.status);
		assert.equal(storeBooks.length, response.data.books.length);

		let i = 0;
		for (let book of response.data.books) {
			let storeBook = storeBooks[i];
			assert.equal(storeBook.uuid, book.uuid);
			assert.equal(storeBook.title, book.title);
			assert.equal(storeBook.description, book.description);
			assert.equal(storeBook.language, book.language);
			assert.equal(storeBook.status, book.status);
			assert.equal(storeBook.cover != null, book.cover);
			assert.equal(storeBook.file != null, book.file);

			if (storeBook.categories) {
				assert.equal(storeBook.categories.length, book.categories.length);

				for (let key of book.categories) {
					assert(constants.categories.find(c => c.key == key) != null);
				}
			} else {
				assert.equal(0, book.categories.length);
			}

			i++;
		}
	});
});