import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'

const getLatestStoreBooksEndpointUrl = `${constants.apiBaseUrl}/api/1/call/store/books/latest`

describe("GetLatestStoreBooks endpoint", async () => {
	it("should not return latest store books with not supported language", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getLatestStoreBooksEndpointUrl,
				params: {
					language: "asdasd"
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

	it("should return latest store books", async () => {
		let response;

		try{
			response = await axios.default({
				method: 'get',
				url: getLatestStoreBooksEndpointUrl
			})
		}catch(error){
			assert.fail();
		}

		// Find all published store books with language = en
		let storeBooks = [];
		for(let collection of constants.authorUser.author.collections){
			for(let storeBook of collection.books){
				if(storeBook.language == "en" && storeBook.status == "published"){
					storeBooks.push(storeBook);
				}
			}
		}
		
		for(let author of constants.davUser.authors){
			for(let collection of author.collections){
				for(let storeBook of collection.books){
					if(storeBook.language == "en" && storeBook.status == "published"){
						storeBooks.push(storeBook);
					}
				}
			}
		}

		storeBooks = storeBooks.reverse();

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

	it("should return latest store books with specified language", async () => {
		let response;
		let language = "de";

		try{
			response = await axios.default({
				method: 'get',
				url: getLatestStoreBooksEndpointUrl,
				params: {
					language
				}
			});
		}catch(error){
			assert.fail();
		}

		// Find all published store books with the language
		let storeBooks = [];
		for(let collection of constants.authorUser.author.collections){
			for(let storeBook of collection.books){
				if(storeBook.language == language && storeBook.status == "published"){
					storeBooks.push(storeBook);
				}
			}
		}
		
		for(let author of constants.davUser.authors){
			for(let collection of author.collections){
				for(let storeBook of collection.books){
					if(storeBook.language == language && storeBook.status == "published"){
						storeBooks.push(storeBook);
					}
				}
			}
		}

		storeBooks = storeBooks.reverse();

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