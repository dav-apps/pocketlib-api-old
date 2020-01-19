var assert = require('assert');
var axios = require('axios');
var constants = require('../constants');
var utils = require('../utils');

const getStoreBookCollectionEndpointUrl = `${constants.apiBaseUrl}/api/1/call/store/collection/{0}`;

before(async () => {
	await utils.resetDatabase();
});

describe("GetStoreBookCollection endpoint", async () => {
	it("should not return store book collection without jwt", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getStoreBookCollectionEndpointUrl.replace('{0}', constants.authorUserAuthor.collections[0].uuid)
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2101, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not return store book collection with invalid jwt", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getStoreBookCollectionEndpointUrl.replace('{0}', constants.authorUserAuthor.collections[0].uuid),
				headers: {
					Authorization: "sdaaasdasd"
				}
			});
		}catch(error){
			assert.equal(401, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(1302, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not return store book collection if jwt is for another app", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getStoreBookCollectionEndpointUrl.replace('{0}', constants.authorUserAuthor.collections[0].uuid),
				headers: {
					Authorization: constants.davClassLibraryTestUserTestAppJWT
				}
			});
		}catch(error){
			assert.equal(403, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(1102, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not return store book collection if the store book collection does not exist", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getStoreBookCollectionEndpointUrl.replace('{0}', "asdasdasd"),
				headers: {
					Authorization: constants.authorUserJWT
				}
			});
		}catch(error){
			assert.equal(404, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2803, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should return store book collection with all store books if the user is the author", async () => {
		let author = constants.authorUserAuthor;
		let collection = author.collections[1];
		let response;

		try{
			response = await axios.default({
				method: 'get',
				url: getStoreBookCollectionEndpointUrl.replace('{0}', collection.uuid),
				headers: {
					Authorization: constants.authorUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(collection.uuid, response.data.uuid);
		assert.equal(author.uuid, response.data.author);
		
		assert.equal(collection.names.length, response.data.names.length);
		
		for(let i = 0; i < collection.names.length; i++){
			let collectionName = collection.names[i];
			let responseCollectionName = response.data.names[i];

			assert.equal(collectionName.name, responseCollectionName.name);
			assert.equal(collectionName.language, responseCollectionName.language);
		}

		assert.equal(collection.books.length, response.data.books.length);

		for(let i = 0; i < collection.books.length; i++){
			let book = collection.books[i];
			let responseBook = response.data.books[i];

			assert.equal(book.uuid, responseBook.uuid);
			assert.equal(book.title, responseBook.title);
			assert.equal(book.description, responseBook.description);
			assert.equal(book.language, responseBook.language);
			assert.equal(book.status, responseBook.status);
			assert.equal(book.cover != null, responseBook.cover);
			assert.equal(book.file != null, responseBook.file);
		}
	});

	it("should return store book collection with all store books if the user is an admin", async () => {
		let author = constants.authorUserAuthor;
		let collection = author.collections[1];
		let response;

		try{
			response = await axios.default({
				method: 'get',
				url: getStoreBookCollectionEndpointUrl.replace('{0}', collection.uuid),
				headers: {
					Authorization: constants.davUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(collection.uuid, response.data.uuid);
		assert.equal(author.uuid, response.data.author);

		assert.equal(collection.names.length, response.data.names.length);
		
		for(let i = 0; i < collection.names.length; i++){
			let collectionName = collection.names[i];
			let responseCollectionName = response.data.names[i];

			assert.equal(collectionName.name, responseCollectionName.name);
			assert.equal(collectionName.language, responseCollectionName.language);
		}

		assert.equal(collection.books.length, response.data.books.length);

		for(let i = 0; i < collection.books.length; i++){
			let book = collection.books[i];
			let responseBook = response.data.books[i];

			assert.equal(book.uuid, responseBook.uuid);
			assert.equal(book.title, responseBook.title);
			assert.equal(book.description, responseBook.description);
			assert.equal(book.language, responseBook.language);
			assert.equal(book.status, responseBook.status);
			assert.equal(book.cover != null, responseBook.cover);
			assert.equal(book.file != null, responseBook.file);
		}
	});

	it("should return store book collection with published store books if the user is not the author", async () => {
		let author = constants.authorUserAuthor;
		let collection = author.collections[1];
		let response;

		try{
			response = await axios.default({
				method: 'get',
				url: getStoreBookCollectionEndpointUrl.replace('{0}', collection.uuid),
				headers: {
					Authorization: constants.davClassLibraryTestUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(collection.uuid, response.data.uuid);
		assert.equal(author.uuid, response.data.author);

		assert.equal(collection.names.length, response.data.names.length);

		for(let i = 0; i < collection.names.length; i++){
			let collectionName = collection.names[i];
			let responseCollectionName = response.data.names[i];

			assert.equal(collectionName.name, responseCollectionName.name);
			assert.equal(collectionName.language, responseCollectionName.language);
		}

		let booksCount = 0;

		for(let i = 0; i < collection.books.length; i++){
			let book = collection.books[i];
			let responseBook = response.data.books[booksCount];

			if(book.status != "published") continue;
			booksCount++;

			assert.equal(book.uuid, responseBook.uuid);
			assert.equal(book.title, responseBook.title);
			assert.equal(book.description, responseBook.description);
			assert.equal(book.language, responseBook.language);
			assert.equal(book.status, responseBook.status);
			assert.equal(book.cover != null, responseBook.cover);
			assert.equal(book.file != null, responseBook.file);
		}

		assert.equal(booksCount, response.data.books.length);
	});

	it("should return store book collection of admin with all store books if the user is the author", async () => {
		let author = constants.davUserAuthors[0];
		let collection = author.collections[0];
		let response;

		try{
			response = await axios.default({
				method: 'get',
				url: getStoreBookCollectionEndpointUrl.replace('{0}', collection.uuid),
				headers: {
					Authorization: constants.davUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(collection.uuid, response.data.uuid);
		assert.equal(author.uuid, response.data.author);

		assert.equal(collection.names.length, response.data.names.length);

		for(let i = 0; i < collection.names.length; i++){
			let collectionName = collection.names[i];
			let responseCollectionName = response.data.names[i];

			assert.equal(collectionName.name, responseCollectionName.name);
			assert.equal(collectionName.language, responseCollectionName.language);
		}

		assert.equal(collection.books.length, response.data.books.length);

		for(let i = 0; i < collection.books.length; i++){
			let book = collection.books[i];
			let responseBook = response.data.books[i];

			assert.equal(book.uuid, responseBook.uuid);
			assert.equal(book.title, responseBook.title);
			assert.equal(book.description, responseBook.description);
			assert.equal(book.language, responseBook.language);
			assert.equal(book.status, responseBook.status);
			assert.equal(book.cover != null, responseBook.cover);
			assert.equal(book.file != null, responseBook.file);
		}
	});

	it("should return store book collection of admin with published store books if the user is not the author", async () => {
		let author = constants.davUserAuthors[0];
		let collection = author.collections[0];
		let response;

		try{
			response = await axios.default({
				method: 'get',
				url: getStoreBookCollectionEndpointUrl.replace('{0}', collection.uuid),
				headers: {
					Authorization: constants.davClassLibraryTestUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(collection.uuid, response.data.uuid);
		assert.equal(author.uuid, response.data.author);

		assert.equal(collection.names.length, response.data.names.length);

		for(let i = 0; i < collection.names.length; i++){
			let collectionName = collection.names[i];
			let responseCollectionName = response.data.names[i];

			assert.equal(collectionName.name, responseCollectionName.name);
			assert.equal(collectionName.language, responseCollectionName.language);
		}

		let booksCount = 0;

		for(let i = 0; i < collection.books.length; i++){
			let book = collection.books[i];
			let responseBook = response.data.books[booksCount];

			if(book.status != "published") continue;
			booksCount++;

			assert.equal(book.uuid, responseBook.uuid);
			assert.equal(book.title, responseBook.title);
			assert.equal(book.description, responseBook.description);
			assert.equal(book.language, responseBook.language);
			assert.equal(book.status, responseBook.status);
			assert.equal(book.cover != null, responseBook.cover);
			assert.equal(book.file != null, responseBook.file);
		}

		assert.equal(booksCount, response.data.books.length);
	});
});