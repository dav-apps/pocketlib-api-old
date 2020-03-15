var assert = require('assert');
var axios = require('axios');
var constants = require("../constants");

const getLatestStoreBooksEndpointUrl = `${constants.apiBaseUrl}/api/1/call/store/books/latest`;

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

		assert.equal(200, response.status);
		assert.equal(storeBooks.length, response.data.books.length);

		let i = 0;
		for(let book of response.data.books){
			assert.equal(book.uuid, storeBooks[i].uuid);
			assert.equal(book.title, storeBooks[i].title);
			assert.equal(book.description, storeBooks[i].description);
			assert.equal(book.language, storeBooks[i].language);
			assert.equal(book.status, storeBooks[i].status);
			assert.equal(book.cover, storeBooks[i].cover != null);
			assert.equal(book.file, storeBooks[i].file != null);

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

		assert.equal(200, response.status);
		assert.equal(storeBooks.length, response.data.books.length);

		let i = 0;
		for(let book of response.data.books){
			assert.equal(book.uuid, storeBooks[i].uuid);
			assert.equal(book.title, storeBooks[i].title);
			assert.equal(book.description, storeBooks[i].description);
			assert.equal(book.language, storeBooks[i].language);
			assert.equal(book.status, storeBooks[i].status);
			assert.equal(book.cover, storeBooks[i].cover != null);
			assert.equal(book.file, storeBooks[i].file != null);

			i++;
		}
	});
});