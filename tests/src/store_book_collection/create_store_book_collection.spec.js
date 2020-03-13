var assert = require('assert');
var axios = require('axios');
var constants = require('../constants');
var utils = require('../utils');

const createStoreBookCollectionEndpointUrl = `${constants.apiBaseUrl}/api/1/call/store/collection`;
var resetStoreBookCollectionsAndAuthors = false;

afterEach(async () => {
	if(resetStoreBookCollectionsAndAuthors){
		await utils.resetStoreBookCollections();
		await utils.resetStoreBookCollectionNames();
		await utils.resetAuthors();
		resetStoreBookCollectionsAndAuthors = false;
	}
});

describe("CreateStoreBookCollection endpoint", () => {
	it("should not create store book collection without jwt", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createStoreBookCollectionEndpointUrl
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2101, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not create store book collection with invalid jwt", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createStoreBookCollectionEndpointUrl,
				headers: {
					Authorization: "adasdasd.asdasd.asdasdsda.3",
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

	it("should not create store book collection without content type json", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createStoreBookCollectionEndpointUrl,
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

	it("should not create store book collection if jwt is for another app", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createStoreBookCollectionEndpointUrl,
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

	it("should not create store book collection without required properties", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createStoreBookCollectionEndpointUrl,
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(2, error.response.data.errors.length);
			assert.equal(2108, error.response.data.errors[0].code);
			assert.equal(2106, error.response.data.errors[1].code);
			return;
		}

		assert.fail();
	});

	it("should not create store book collection with properties with wrong types", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createStoreBookCollectionEndpointUrl,
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					name: 12,
					language: true
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(2, error.response.data.errors.length);
			assert.equal(2209, error.response.data.errors[0].code);
			assert.equal(2206, error.response.data.errors[1].code);
			return;
		}

		assert.fail();
	});

	it("should not create store book collection with too short properties", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createStoreBookCollectionEndpointUrl,
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					name: "a",
					language: "en"
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2307, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not create store book collection with too long properties", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createStoreBookCollectionEndpointUrl,
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					name: "a".repeat(200),
					language: "de"
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2407, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not create store book collection with not supported language", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createStoreBookCollectionEndpointUrl,
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					name: "Hello World",
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

	it("should not create store book collection as admin without required properties", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createStoreBookCollectionEndpointUrl,
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(3, error.response.data.errors.length);
			assert.equal(2107, error.response.data.errors[0].code);
			assert.equal(2108, error.response.data.errors[1].code);
			assert.equal(2106, error.response.data.errors[2].code);
			return;
		}

		assert.fail();
	});

	it("should not create store book collection as admin with properties with wrong types", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createStoreBookCollectionEndpointUrl,
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					author: false,
					name: 20,
					language: 23.4
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(3, error.response.data.errors.length);
			assert.equal(2208, error.response.data.errors[0].code);
			assert.equal(2209, error.response.data.errors[1].code);
			assert.equal(2206, error.response.data.errors[2].code);
			return;
		}

		assert.fail();
	});

	it("should not create store book collection as admin with too short properties", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createStoreBookCollectionEndpointUrl,
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					author: "a",
					name: "a",
					language: "en"
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(2, error.response.data.errors.length);
			assert.equal(2306, error.response.data.errors[0].code);
			assert.equal(2307, error.response.data.errors[1].code);
			return;
		}

		assert.fail();
	});

	it("should not create store book collection as admin with too long properties", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createStoreBookCollectionEndpointUrl,
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					author: "a".repeat(210),
					name: "a".repeat(200),
					language: "de"
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(2, error.response.data.errors.length);
			assert.equal(2406, error.response.data.errors[0].code);
			assert.equal(2407, error.response.data.errors[1].code);
			return;
		}

		assert.fail();
	});

	it("should not create store book collection as admin with not supported language", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createStoreBookCollectionEndpointUrl,
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					author: "asdads",
					name: "Hello World",
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

	it("should not create store book collection as admin for author that does not exist", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createStoreBookCollectionEndpointUrl,
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					author: "blabla",
					name: "Hello World",
					language: "en"
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

	it("should not create store book collection if the user is not an author or admin", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createStoreBookCollectionEndpointUrl,
				headers: {
					Authorization: constants.davClassLibraryTestUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					name: "Hello World",
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

	it("should create store book collection", async () => {
		let response;
		let name = "TestBook";
		let language = "de";

		// Create the store book collection
		try{
			response = await axios.default({
				method: 'post',
				url: createStoreBookCollectionEndpointUrl,
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					name,
					language
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(201, response.status);
		assert(response.data.uuid != null);
		assert.equal(constants.authorUser.author.uuid, response.data.author);
		assert.equal(1, response.data.names.length);
		assert.equal(name, response.data.names[0].name);
		assert.equal(language, response.data.names[0].language);
		assert.equal(0, response.data.books.length);

		// Check if the data was correctly saved on the server
		// Get the store book collection
		let collectionResponse;

		try{
			collectionResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${response.data.uuid}`,
				headers: {
					Authorization: constants.authorUser.jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(constants.authorUser.author.uuid, collectionResponse.data.properties.author);
		assert(collectionResponse.data.properties.names != null);

		// Get the store book collection name
		let collectionNameResponse;

		try{
			collectionNameResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${collectionResponse.data.properties.names}`,
				headers: {
					Authorization: constants.authorUser.jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(collectionResponse.data.properties.names, collectionNameResponse.data.uuid);
		assert.equal(name, collectionNameResponse.data.properties.name);
		assert.equal(language, collectionNameResponse.data.properties.language);

		// Get the author
		let authorResponse;

		try{
			authorResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${constants.authorUser.author.uuid}`,
				headers: {
					Authorization: constants.authorUser.jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		let collections = [];
		for(let collection of constants.authorUser.author.collections) collections.push(collection.uuid);
		collections.push(collectionResponse.data.uuid);

		assert.equal(collections.join(','), authorResponse.data.properties.collections);

		// Tidy up
		resetStoreBookCollectionsAndAuthors = true;
	});

	it("should create store book collection as admin", async () => {
		let response;
		let author = constants.davUser.authors[0].uuid;
		let name = "TestBook";
		let language = "en";

		// Create the store book collection
		try{
			response = await axios.default({
				method: 'post',
				url: createStoreBookCollectionEndpointUrl,
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					author,
					name,
					language
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(201, response.status);
		assert(response.data.uuid != null);
		assert.equal(author, response.data.author);
		assert.equal(1, response.data.names.length);
		assert.equal(name, response.data.names[0].name);
		assert.equal(language, response.data.names[0].language);
		assert.equal(0, response.data.books.length);

		// Check if the data was correctly saved on the server
		// Get the store book collection
		let collectionResponse;

		try{
			collectionResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${response.data.uuid}`,
				headers: {
					Authorization: constants.davUser.jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(author, collectionResponse.data.properties.author);
		assert(collectionResponse.data.properties.names != null);

		// Get the store book collection name
		let collectionNameResponse;

		try{
			collectionNameResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${collectionResponse.data.properties.names}`,
				headers: {
					Authorization: constants.davUser.jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(collectionResponse.data.properties.names, collectionNameResponse.data.uuid);
		assert.equal(name, collectionNameResponse.data.properties.name);
		assert.equal(language, collectionNameResponse.data.properties.language);

		// Get the author
		let authorResponse;

		try{
			authorResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${author}`,
				headers: {
					Authorization: constants.davUser.jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		let collections = [];
		for(let author of constants.davUser.authors) for(let collection of author.collections) collections.push(collection.uuid);
		collections.push(collectionResponse.data.uuid);

		assert.equal(collections.join(','), authorResponse.data.properties.collections);

		// Tidy up
		resetStoreBookCollectionsAndAuthors = true;
	});
});