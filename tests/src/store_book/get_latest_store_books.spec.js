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
			assert.equal(storeBooks[i].uuid, book.uuid);
			assert.equal(storeBooks[i].title, book.title);
			assert.equal(storeBooks[i].description, book.description);
			assert.equal(storeBooks[i].language, book.language);
			assert.equal(storeBooks[i].status, book.status);
			assert.equal(storeBooks[i].cover != null, book.cover);
			assert.equal(storeBooks[i].file != null, book.file);

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
			assert.equal(storeBooks[i].uuid, book.uuid);
			assert.equal(storeBooks[i].title, book.title);
			assert.equal(storeBooks[i].description, book.description);
			assert.equal(storeBooks[i].language, book.language);
			assert.equal(storeBooks[i].status, book.status);
			assert.equal(storeBooks[i].cover != null, book.cover);
			assert.equal(storeBooks[i].file != null, book.file);

			i++;
		}
	});
});