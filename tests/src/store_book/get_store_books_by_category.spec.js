var assert = require('assert');
var axios = require('axios');
var constants = require("../constants");

const getStoreBooksByCategoryEndpointUrl = `${constants.apiBaseUrl}/api/1/call/store/books/category/{0}`;

describe("GetStoreBooksByCategory endpoint", async () => {
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
			if(!collection.categories.includes(category.uuid)) continue;

			for(let storeBook of collection.books){
				if(storeBook.language == "en" && storeBook.status == "published"){
					storeBooks.push(storeBook);
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
			if(!collection.categories.includes(category.uuid)) continue;

			for(let storeBook of collection.books){
				if(storeBook.language == language && storeBook.status == "published"){
					storeBooks.push(storeBook);
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