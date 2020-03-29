var assert = require('assert');
var axios = require('axios');
var constants = require('../constants');
var utils = require('../utils');

const createBookEndpointUrl = `${constants.apiBaseUrl}/api/1/call/book`;
var resetBooks = false;

afterEach(async () => {
	if(resetBooks){
		await utils.resetBooks();
		resetBooks = false;
	}
});

describe("CreateBook endpoint", () => {
	it("should not create book without jwt", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createBookEndpointUrl
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2101, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not create book with invalid jwt", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createBookEndpointUrl,
				headers: {
					Authorization: "asdasdasd",
					'Content-Type': 'application/json'
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

	it("should not create book without supported content type", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createBookEndpointUrl,
				headers: {
					Authorization: constants.klausUser.jwt,
					'Content-Type': 'application/xml'
				}
			});
		}catch(error){
			assert.equal(415, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(1104, error.response.data.errors[0].code);
			return;
		}
	});

	it("should not create book if jwt is for another app", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createBookEndpointUrl,
				headers: {
					Authorization: constants.davClassLibraryTestUserTestAppJWT,
					'Content-Type': 'application/json'
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

	it("should not create book from store book without required fields", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createBookEndpointUrl,
				headers: {
					Authorization: constants.klausUser.jwt,
					'Content-Type': 'application/json'
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2110, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not create book from store book with properties with wrong types", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createBookEndpointUrl,
				headers: {
					Authorization: constants.klausUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					store_book: false
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2212, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not create book from store book with too short properties", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createBookEndpointUrl,
				headers: {
					Authorization: constants.klausUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					store_book: "a"
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2309, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not create book from store book with too long properties", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createBookEndpointUrl,
				headers: {
					Authorization: constants.klausUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					store_book: "a".repeat(210)
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2409, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not create book from store book without dav Pro", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createBookEndpointUrl,
				headers: {
					Authorization: constants.davClassLibraryTestUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					store_book: constants.davUser.authors[0].collections[0].books[0].uuid
				}
			});
		}catch(error){
			assert.equal(422, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(1110, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not create book from free store book", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createBookEndpointUrl,
				headers: {
					Authorization: constants.klausUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					store_book: constants.davUser.authors[0].collections[1].books[2].uuid
				}
			});
		}catch(error){
			assert.equal(422, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(1111, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not create book from store book if the store book is already in the library of the user", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createBookEndpointUrl,
				headers: {
					Authorization: constants.klausUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					store_book: constants.davUser.authors[0].collections[0].books[0].uuid
				}
			});
		}catch(error){
			assert.equal(422, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(1112, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});
	
	it("should not create book from purchase with properties with wrong types", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createBookEndpointUrl,
				headers: {
					Authorization: constants.klausUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					purchase: "asd"
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2215, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not create book from purchase if the store book is already in the library of the user", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createBookEndpointUrl,
				headers: {
					Authorization: constants.davClassLibraryTestUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					purchase: constants.purchases[0].id
				}
			});
		}catch(error){
			assert.equal(422, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(1112, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not create book from purchase that does not exist", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createBookEndpointUrl,
				headers: {
					Authorization: constants.davClassLibraryTestUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					purchase: -12
				}
			});
		}catch(error){
			assert.equal(404, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2812, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not create book from purchase for table object that is not a store book", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createBookEndpointUrl,
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					purchase: constants.purchases[2].id
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

	it("should not create book from not completed purchase", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createBookEndpointUrl,
				headers: {
					Authorization: constants.davClassLibraryTestUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					purchase: constants.purchases[1].id
				}
			})
		}catch(error){
			assert.equal(403, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(1102, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not create book from purchase that belongs to another user", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createBookEndpointUrl,
				headers: {
					Authorization: constants.davClassLibraryTestUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					purchase: constants.purchases[3].id
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


	it("should create book from unpublished store book as the author", async () => {
		await testShouldCreateBookFromStoreBook(constants.authorUser.jwt, constants.authorUser.author.collections[1].books[0]);
	});

	it("should create book from store book in review as the author", async () => {
		await testShouldCreateBookFromStoreBook(constants.authorUser.jwt, constants.authorUser.author.collections[0].books[0]);
	});

	it("should create book from published store book as the author", async () => {
		await testShouldCreateBookFromStoreBook(constants.authorUser.jwt, constants.authorUser.author.collections[1].books[1]);
	});

	it("should create book from hidden store book as the author", async () => {
		await testShouldCreateBookFromStoreBook(constants.authorUser.jwt, constants.authorUser.author.collections[0].books[1]);
	});


	it("should create book from unpublished store book as admin", async () => {
		await testShouldCreateBookFromStoreBook(constants.davUser.jwt, constants.authorUser.author.collections[1].books[0]);
	});

	it("should create book from store book in review as admin", async () => {
		await testShouldCreateBookFromStoreBook(constants.davUser.jwt, constants.authorUser.author.collections[0].books[0]);
	});

	it("should create book from published store book as admin", async () => {
		await testShouldCreateBookFromStoreBook(constants.davUser.jwt, constants.authorUser.author.collections[1].books[1]);
	});

	it("should create book from hidden store book as admin", async () => {
		await testShouldCreateBookFromStoreBook(constants.davUser.jwt, constants.authorUser.author.collections[0].books[1]);
	});


	it("should not create book from unpublished store book as dav Pro user", async () => {
		await testShouldNotCreateBookFromStoreBook(constants.klausUser.jwt, constants.authorUser.author.collections[1].books[0]);
	});

	it("should not create book from store book in review as dav Pro user", async () => {
		await testShouldNotCreateBookFromStoreBook(constants.klausUser.jwt, constants.authorUser.author.collections[0].books[0]);
	});

	it("should create book from published store book as dav Pro user", async () => {
		await testShouldCreateBookFromStoreBook(constants.klausUser.jwt, constants.authorUser.author.collections[1].books[1]);
	});

	it("should not create book from hidden store book as dav Pro user", async () => {
		await testShouldNotCreateBookFromStoreBook(constants.klausUser.jwt, constants.authorUser.author.collections[0].books[1]);
	});


	it("should create book from purchase", async () => {
		let purchase = constants.purchases[3];
		let storeBook = constants.davUser.authors[0].collections[1].books[2];
		let jwt = constants.authorUser.jwt;

		// Create the book
		let response;
		try{
			response = await axios.default({
				method: 'post',
				url: createBookEndpointUrl,
				headers: {
					Authorization: jwt,
					'Content-Type': 'application/json'
				},
				data: {
					purchase: purchase.id
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(201, response.status);
		assert(response.data.uuid != null);
		assert.equal(response.data.store_book, purchase.tableObjectUuid);
		assert(response.data.file != null);

		// Get the store book file table object
		let storeBookFileObjResponse;
		try{
			storeBookFileObjResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${response.data.file}`,
				headers: {
					Authorization: jwt,
					'Content-Type': 'application/json'
				}
			});
		}catch(error){
			assert.fail();
		}

		if(storeBookFileObjResponse.data.properties.type == "application/pdf"){
			// PDF Book
			assert.equal(storeBook.title, response.data.title);
			assert.equal(0, response.data.page);
			assert.equal(0, response.data.bookmarks.length);
		}else{
			// EPUB Book
			assert.equal(0, response.data.chapter);
			assert.equal(0, response.data.progress);
		}

		// Check if the book was correctly created on the server
		let bookObjResponse;
		try{
			bookObjResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${response.data.uuid}`,
				headers: {
					Authorization: jwt,
					'Content-Type': 'application/json'
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(response.data.store_book, bookObjResponse.data.properties.store_book);
		assert.equal(response.data.file, bookObjResponse.data.properties.file);

		if(storeBookFileObjResponse.data.properties.type == "application/pdf"){
			// PDF Book
			assert.equal(response.data.title, bookObjResponse.data.properties.title);
			assert(bookObjResponse.data.properties.page == null);
			assert(bookObjResponse.data.properties.bookmarks == null);
		}else{
			// EPUB Book
			assert(bookObjResponse.data.properties.chapter == null);
			assert(bookObjResponse.data.properties.progress == null);
		}

		// Tidy up
		resetBooks = true;
	});


	async function testShouldCreateBookFromStoreBook(jwt, storeBook){
		// Create the book
		let response;
		try{
			response = await axios.default({
				method: 'post',
				url: createBookEndpointUrl,
				headers: {
					Authorization: jwt,
					'Content-Type': 'application/json'
				},
				data: {
					store_book: storeBook.uuid
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(201, response.status);
		assert(response.data.uuid != null);
		assert.equal(response.data.store_book, storeBook.uuid);
		assert(response.data.file != null);

		// Get the store book file table object
		let storeBookFileObjResponse;
		try{
			storeBookFileObjResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${response.data.file}`,
				headers: {
					Authorization: jwt,
					'Content-Type': 'application/json'
				}
			});
		}catch(error){
			assert.fail();
		}

		if(storeBookFileObjResponse.data.properties.type == "application/pdf"){
			// PDF Book
			assert.equal(storeBook.title, response.data.title);
			assert.equal(0, response.data.page);
			assert.equal(0, response.data.bookmarks.length);
		}else{
			// EPUB Book
			assert.equal(0, response.data.chapter);
			assert.equal(0, response.data.progress);
		}

		// Check if the book was correctly created on the server
		let bookObjResponse;
		try{
			bookObjResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${response.data.uuid}`,
				headers: {
					Authorization: jwt,
					'Content-Type': 'application/json'
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(response.data.store_book, bookObjResponse.data.properties.store_book);
		assert.equal(response.data.file, bookObjResponse.data.properties.file);

		if(storeBookFileObjResponse.data.properties.type == "application/pdf"){
			// PDF Book
			assert.equal(response.data.title, bookObjResponse.data.properties.title);
			assert(bookObjResponse.data.properties.page == null);
			assert(bookObjResponse.data.properties.bookmarks == null);
		}else{
			// EPUB Book
			assert(bookObjResponse.data.properties.chapter == null);
			assert(bookObjResponse.data.properties.progress == null);
		}

		// Tidy up
		resetBooks = true;
	}

	async function testShouldNotCreateBookFromStoreBook(jwt, storeBook){
		try{
			await axios.default({
				method: 'post',
				url: createBookEndpointUrl,
				headers: {
					Authorization: jwt,
					'Content-Type': 'application/json'
				},
				data: {
					store_book: storeBook.uuid
				}
			});
		}catch(error){
			assert.equal(403, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(1102, error.response.data.errors[0].code);
			return;
		}
		
		assert.fail();
	}
});