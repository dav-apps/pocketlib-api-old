var assert = require('assert');
var axios = require('axios');
var constants = require('../constants');
var utils = require('../utils');

const createStoreBookEndpointUrl = `${constants.apiBaseUrl}/api/1/call/store/book`;
var resetStoreBooksAndCollections = false;

afterEach(async () => {
	if(resetStoreBooksAndCollections){
		await utils.resetStoreBooks();
		await utils.resetStoreBookCollections();
		resetStoreBooks = false;
	}
});

describe("CreateStoreBook endpoint", () => {
	it("should not create store book without jwt", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2101, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not create store book with invalid jwt", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: "asdasdasd.asdasd",
					'Content-Type': 'application/json'
				},
				data: {
					collection: "blabla",
					title: "Hello World",
					language: "de"
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

	it("should not create store book without content type json", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUser.jwt
				}
			});
		}catch(error){
			assert.equal(415, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(1104, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not create store book if jwt is for another app", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
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

	it("should not create store book without required properties", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(3, error.response.data.errors.length);
			assert.equal(2109, error.response.data.errors[0].code);
			assert.equal(2105, error.response.data.errors[1].code);
			assert.equal(2106, error.response.data.errors[2].code);
			return;
		}

		assert.fail();
	});

	it("should not create store book with properties with wrong types", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					collection: 12.2,
					title: false,
					language: 23
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(3, error.response.data.errors.length);
			assert.equal(2210, error.response.data.errors[0].code);
			assert.equal(2204, error.response.data.errors[1].code);
			assert.equal(2206, error.response.data.errors[2].code);
			return;
		}

		assert.fail();
	});

	it("should not create store book with optional properties with wrong types", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					collection: 12.23,
					title: 12,
					description: true,
					language: false,
					price: "123"
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(5, error.response.data.errors.length);
			assert.equal(2210, error.response.data.errors[0].code);
			assert.equal(2204, error.response.data.errors[1].code);
			assert.equal(2205, error.response.data.errors[2].code);
			assert.equal(2206, error.response.data.errors[3].code);
			assert.equal(2211, error.response.data.errors[4].code);
			return;
		}

		assert.fail();
	});

	it("should not create store book with too short properties", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					collection: "a",
					title: "a",
					language: "en"
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(2, error.response.data.errors.length);
			assert.equal(2308, error.response.data.errors[0].code);
			assert.equal(2304, error.response.data.errors[1].code);
			return;
		}

		assert.fail();
	});

	it("should not create store book with too short optional properties", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					collection: "a",
					title: "a",
					description: "a",
					language: "en"
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(3, error.response.data.errors.length);
			assert.equal(2308, error.response.data.errors[0].code);
			assert.equal(2304, error.response.data.errors[1].code);
			assert.equal(2305, error.response.data.errors[2].code);
			return;
		}

		assert.fail();
	});

	it("should not create store book with too long properties", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					collection: "a".repeat(220),
					title: "a".repeat(150),
					language: "en"
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(2, error.response.data.errors.length);
			assert.equal(2408, error.response.data.errors[0].code);
			assert.equal(2404, error.response.data.errors[1].code);
			return;
		}

		assert.fail();
	});

	it("should not create store book with too long optional properties", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					collection: "a".repeat(220),
					title: "a".repeat(150),
					description: "a".repeat(2010),
					language: "de"
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(3, error.response.data.errors.length);
			assert.equal(2408, error.response.data.errors[0].code);
			assert.equal(2404, error.response.data.errors[1].code);
			assert.equal(2405, error.response.data.errors[2].code);
			return;
		}

		assert.fail();
	});

	it("should not create store book with not supported language", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					collection: constants.authorUser.author.collections[0].uuid,
					title: "Hello World",
					language: "blabla"
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

	it("should not create store book with invalid price", async () => {
		try {
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					collection: constants.authorUser.author.collections[0].uuid,
					title: "Hello World",
					language: "en",
					price: -123
				}
			});
		} catch (error) {
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2501, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not create store book if the user is not an author", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.davClassLibraryTestUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					collection: "adsadasdasd",
					title: "Hello World",
					language: "de"
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(1105, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not create store book for collection that is not a collection", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					collection: constants.authorUser.author.uuid,
					title: "Hallo Welt",
					language: "de"
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

	it("should not create store book for collection that does not belong to the author", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					collection: constants.davUser.authors[0].collections[0].uuid,
					title: "Hallo Welt",
					description: "Hallo Welt",
					language: "de"
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

	it("should not create store book for collection that does not exist", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					collection: "asdasdasddas",
					title: "Hello World",
					description: "Hello World",
					language: "en"
				}
			});
		}catch(error){
			assert.equal(404, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2805, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should create store book", async () => {
		let collection = constants.authorUser.author.collections[0];
		let title = "Hello World";
		let language = "de";
		let response;

		// Create the store book
		try{
			response = await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					collection: collection.uuid,
					title,
					language
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(201, response.status);
		assert(response.data.uuid != null);
		assert.equal(collection.uuid, response.data.collection);
		assert.equal(title, response.data.title);
		assert.equal(null, response.data.description);
		assert.equal(language, response.data.language);
		assert.equal(0, response.data.price);
		assert.equal("unpublished", response.data.status);
		assert.equal(false, response.data.cover);
		assert.equal(false, response.data.file);
		assert.equal(false, response.data.in_library);
		assert.equal(false, response.data.purchased);

		// Check if the data was correctly saved in the database
		// Get the collection
		let collectionObjResponse;
		try{
			collectionObjResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${collection.uuid}`,
				headers: {
					Authorization: constants.authorUser.jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		let storeBookUuids = [];
		for(let book of collection.books) storeBookUuids.push(book.uuid);
		storeBookUuids.push(response.data.uuid);
		
		assert.equal(storeBookUuids.join(','), collectionObjResponse.data.properties.books);
		
		// Get the store book
		let storeBookObjResponse;
		try{
			storeBookObjResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${response.data.uuid}`,
				headers: {
					Authorization: constants.authorUser.jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(response.data.uuid, storeBookObjResponse.data.uuid);
		assert.equal(collection.uuid, storeBookObjResponse.data.properties.collection);
		assert.equal(title, storeBookObjResponse.data.properties.title);
		assert.equal(null, storeBookObjResponse.data.properties.description);
		assert.equal(language, storeBookObjResponse.data.properties.language);

		// Tidy up
		resetStoreBooksAndCollections = true;
	});

	it("should create store book with optional properties", async () => {
		let collection = constants.authorUser.author.collections[1];
		let title = "Hello World";
		let description = "Hello World";
		let language = "en";
		let price = 444;
		let response;

		// Create the store book
		try{
			response = await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					collection: collection.uuid,
					title,
					description,
					language,
					price
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(201, response.status);
		assert(response.data.uuid != null);
		assert.equal(collection.uuid, response.data.collection);
		assert.equal(title, response.data.title);
		assert.equal(description, response.data.description);
		assert.equal(language, response.data.language);
		assert.equal(price, response.data.price);
		assert.equal("unpublished", response.data.status);
		assert.equal(false, response.data.cover);
		assert.equal(false, response.data.file);
		assert.equal(false, response.data.in_library);
		assert.equal(false, response.data.purchased);

		// Check if the data was correctly saved in the database
		// Get the author
		let collectionObjResponse;
		try{
			collectionObjResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${collection.uuid}`,
				headers: {
					Authorization: constants.authorUser.jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		let storeBookUuids = [];
		for(let book of collection.books) storeBookUuids.push(book.uuid);
		storeBookUuids.push(response.data.uuid);

		assert.equal(storeBookUuids.join(','), collectionObjResponse.data.properties.books);

		// Get the store book
		let storeBookObjResponse;
		try{
			storeBookObjResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${response.data.uuid}`,
				headers: {
					Authorization: constants.authorUser.jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(response.data.uuid, storeBookObjResponse.data.uuid);
		assert.equal(collection.uuid, storeBookObjResponse.data.properties.collection);
		assert.equal(title, storeBookObjResponse.data.properties.title);
		assert.equal(description, storeBookObjResponse.data.properties.description);
		assert.equal(language, storeBookObjResponse.data.properties.language);
		assert.equal(price.toString(), storeBookObjResponse.data.properties.price);

		// Tidy up
		resetStoreBooksAndCollections = true;
	});
});