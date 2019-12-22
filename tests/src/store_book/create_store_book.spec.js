var assert = require('assert');
var axios = require('axios');
var constants = require("../constants");

const createStoreBookEndpointUrl = `${constants.apiBaseUrl}/api/1/call/store/book`;

beforeEach(async () => {
	await resetStoreBooks();
});

afterEach(async () => {
	await resetStoreBooks();
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

	it("should not create store book without content type json", async () => {
		try{
			await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUserJWT
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
					Authorization: constants.davClassLibraryTestUserJWT,
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
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/json'
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2105, error.response.data.errors[0].code);
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
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					title: false
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2204, error.response.data.errors[0].code);
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
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					title: 12,
					description: true
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(2, error.response.data.errors.length);
			assert.equal(2204, error.response.data.errors[0].code);
			assert.equal(2205, error.response.data.errors[1].code);
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
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					title: "a"
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2304, error.response.data.errors[0].code);
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
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					title: "a",
					description: "a"
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(2, error.response.data.errors.length);
			assert.equal(2304, error.response.data.errors[0].code);
			assert.equal(2305, error.response.data.errors[1].code);
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
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					title: "a".repeat(50)
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2404, error.response.data.errors[0].code);
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
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					title: "a".repeat(50),
					description: "a".repeat(510)
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(2, error.response.data.errors.length);
			assert.equal(2404, error.response.data.errors[0].code);
			assert.equal(2405, error.response.data.errors[1].code);
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
					Authorization: constants.davUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					title: "Hello World"
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

	it("should create store book", async () => {
		let title = "Hello World";
		let response;

		try{
			response = await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					title
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(201, response.status);
		assert(response.data.uuid != null);
		assert.equal(title, response.data.title);

		// Check if the data was correctly saved in the database
		// Get the author
		let authorObjResponse;
		try{
			authorObjResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${constants.authorUserAuthor.uuid}`,
				headers: {
					Authorization: constants.authorUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}
		
		assert.equal([constants.authorUserAuthor.books[0].uuid, response.data.uuid].join(','), authorObjResponse.data.properties.books);
		
		// Get the store book
		let storeBookObjResponse;
		try{
			storeBookObjResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${response.data.uuid}`,
				headers: {
					Authorization: constants.authorUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(response.data.uuid, storeBookObjResponse.data.uuid);
		assert.equal(title, storeBookObjResponse.data.properties.title);
		assert.equal(constants.authorUserAuthor.uuid, storeBookObjResponse.data.properties.author);
	});

	it("should create store book with optional properties", async () => {
		let title = "Hello World";
		let description = "Hello World";
		let response;

		try{
			response = await axios.default({
				method: 'post',
				url: createStoreBookEndpointUrl,
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					title,
					description
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(201, response.status);
		assert(response.data.uuid != null);
		assert.equal(title, response.data.title);
		assert.equal(description, response.data.description);

		// Check if the data was correctly saved in the database
		// Get the author
		let authorObjResponse;
		try{
			authorObjResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${constants.authorUserAuthor.uuid}`,
				headers: {
					Authorization: constants.authorUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal([constants.authorUserAuthor.books[0].uuid, response.data.uuid].join(','), authorObjResponse.data.properties.books);

		// Get the store book
		let storeBookObjResponse;
		try{
			storeBookObjResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${response.data.uuid}`,
				headers: {
					Authorization: constants.authorUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(response.data.uuid, storeBookObjResponse.data.uuid);
		assert.equal(title, storeBookObjResponse.data.properties.title);
		assert.equal(description, storeBookObjResponse.data.properties.description);
		assert.equal(constants.authorUserAuthor.uuid, storeBookObjResponse.data.properties.author);
	});
});

async function resetStoreBooks(){
	// Delete all store books that are not part of the default test database
	let response;
	let storeBookObjects;

	try{
		response = await axios.default({
			method: 'get',
			url: `${constants.apiBaseUrl}/apps/table/${constants.storeBookTableId}`,
			headers: {
				Authorization: constants.authorUserJWT
			}
		});

		storeBookObjects = response.data.table_objects;
	}catch(error){
		console.log("Error in trying the get the store book table");
		console.log(error.response.data);
	}

	if(storeBookObjects){
		for(let tableObject of storeBookObjects){
			if(tableObject.uuid == constants.authorUserAuthor.books[0].uuid) continue;

			// Delete the table object
			try{
				await axios.default({
					method: 'delete',
					url: `${constants.apiBaseUrl}/apps/object/${tableObject.uuid}`,
					headers: {
						Authorization: constants.authorUserJWT
					}
				});
			}catch(error){
				console.log("Error in trying to delete a store book object");
				console.log(error.response.data);
			}
		}
	}

	// Reset the store books
	let bookUuids = [];

	for(let book of constants.authorUserAuthor.books){
		bookUuids.push(book.uuid);

		try{
			await axios.default({
				method: 'put',
				url: `${constants.apiBaseUrl}/apps/object/${book.uuid}`,
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					author: constants.authorUserAuthor.uuid,
					title: book.title
				}
			});
		}catch(error){
			console.log("Error in resetting a store book");
			console.log(error.response.data);
		}
	}

	// Reset the books property of the author
	try{
		await axios.default({
			method: 'put',
			url: `${constants.apiBaseUrl}/apps/object/${constants.authorUserAuthor.uuid}`,
			headers: {
				Authorization: constants.authorUserJWT,
				'Content-Type': 'application/json'
			},
			data: {
				books: bookUuids.join(',')
			}
		});
	}catch(error){
		console.log("Error in resetting the books property of the author");
		console.log(error.response.data);
	}
}