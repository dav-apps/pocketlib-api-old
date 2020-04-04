var assert = require('assert');
var axios = require('axios');
var constants = require('../constants');
var utils = require('../utils');

const updateStoreBookEndpointUrl = `${constants.apiBaseUrl}/api/1/call/store/book/{0}`;
var resetStoreBooks = false;

afterEach(async () => {
	if(resetStoreBooks){
		await utils.resetStoreBooks();
		resetStoreBooks = false;
	}
});

describe("UpdateStoreBook endpoint", () => {
	it("should not update store book without jwt", async () => {
		try{
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid)
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2101, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not update store book with invalid jwt", async () => {
		try{
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: "asdasdasdasdsda",
					'Content-Type': 'application/json'
				},
				data: {
					title: "Blabla"
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

	it("should not update store book without content type json", async () => {
		try{
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
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

	it("should not update store book that does not exist", async () => {
		try{
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', "blabla"),
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					title: "Hello World",
					description: "Hello World"
				}
			});
		}catch(error){
			assert.equal(404, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2807, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not update store book with properties with wrong types", async () => {
		try{
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					title: 23,
					description: false,
					language: 2.2,
					price: "Hello World",
					published: "Hello"
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(5, error.response.data.errors.length);
			assert.equal(2204, error.response.data.errors[0].code);
			assert.equal(2205, error.response.data.errors[1].code);
			assert.equal(2206, error.response.data.errors[2].code);
			assert.equal(2211, error.response.data.errors[3].code);
			assert.equal(2207, error.response.data.errors[4].code);
			return;
		}

		assert.fail();
	});

	it("should not update store book with status with wrong type as admin", async () => {
		try{
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					status: 73
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2214, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not update store book with too short properties", async () => {
		try{
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: constants.authorUser.jwt,
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

	it("should not update store book with too long properties", async () => {
		try{
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					title: "a".repeat(150),
					description: "a".repeat(2010)
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

	it("should not update store book with not supported language", async () => {
		try{
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					language: "blablabla"
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

	it("should not update store book with invalid price", async () => {
		try{
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					price: -100
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2501, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not update store book with not supported status as admin", async () => {
		try{
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', constants.davUser.authors[0].collections[0].books[0].uuid),
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					status: "asdasd"
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(1113, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should update title of unpublished store book", async () => {
		let collection = constants.authorUser.author.collections[1];
		let storeBook = collection.books[0];

		await testShouldUpdateTitleOfStoreBook(collection, storeBook, constants.authorUser.jwt);
	});

	it("should update title of store book in review", async () => {
		let collection = constants.authorUser.author.collections[0];
		let storeBook = collection.books[0];
		
		await testShouldUpdateTitleOfStoreBook(collection, storeBook, constants.authorUser.jwt);
	});

	it("should update title of published store book", async () => {
		let collection = constants.authorUser.author.collections[1];
		let storeBook = collection.books[1];

		await testShouldUpdateTitleOfStoreBook(collection, storeBook, constants.authorUser.jwt);
	});

	it("should update title of hidden store book", async () => {
		let collection = constants.authorUser.author.collections[0];
		let storeBook = collection.books[1];

		await testShouldUpdateTitleOfStoreBook(collection, storeBook, constants.authorUser.jwt);
	});

	it("should update description of unpublished store book", async () => {
		let collection = constants.authorUser.author.collections[1];
		let storeBook = collection.books[0];

		await testShouldUpdateDescriptionOfStoreBook(collection, storeBook, constants.authorUser.jwt);
	});

	it("should update description of store book in review", async () => {
		let collection = constants.authorUser.author.collections[0];
		let storeBook = collection.books[0];

		await testShouldUpdateDescriptionOfStoreBook(collection, storeBook, constants.authorUser.jwt);
	});

	it("should update description of published store book", async () => {
		let collection = constants.authorUser.author.collections[1];
		let storeBook = collection.books[1];

		await testShouldUpdateDescriptionOfStoreBook(collection, storeBook, constants.authorUser.jwt);
	});

	it("should update description of hidden store book", async () => {
		let collection = constants.authorUser.author.collections[0];
		let storeBook = collection.books[1];

		await testShouldUpdateDescriptionOfStoreBook(collection, storeBook, constants.authorUser.jwt);
	});

	it("should update language of unpublished store book", async () => {
		let collection = constants.authorUser.author.collections[1];
		let storeBook = collection.books[0];

		await testShouldUpdateLanguageOfStoreBook(collection, storeBook, constants.authorUser.jwt);
	});

	it("should update language of store book in review", async () => {
		let collection = constants.authorUser.author.collections[0];
		let storeBook = collection.books[0];

		await testShouldUpdateLanguageOfStoreBook(collection, storeBook, constants.authorUser.jwt);
	});

	it("should not update language of published store book", async () => {
		let collection = constants.authorUser.author.collections[1];
		let storeBook = collection.books[1];

		await testShouldNotUpdateLanguageOfStoreBook(storeBook, constants.authorUser.jwt);
	});

	it("should not update language of hidden store book", async () => {
		let collection = constants.authorUser.author.collections[0];
		let storeBook = collection.books[1];

		await testShouldNotUpdateLanguageOfStoreBook(storeBook, constants.authorUser.jwt);
	});

	it("should update price of unpublished store book", async () => {
		let collection = constants.authorUser.author.collections[1];
		let storeBook = collection.books[0];

		await testShouldUpdatePriceOfStoreBook(collection, storeBook, constants.authorUser.jwt);
	});

	it("should update price of store book in review", async () => {
		let collection = constants.authorUser.author.collections[0];
		let storeBook = collection.books[0];

		await testShouldUpdatePriceOfStoreBook(collection, storeBook, constants.authorUser.jwt);
	});

	it("should not update price of published store book", async () => {
		let collection = constants.authorUser.author.collections[1];
		let storeBook = collection.books[1];

		await testShouldNotUpdatePriceOfStoreBook(storeBook, constants.authorUser.jwt);
	});

	it("should not update price of hidden store book", async () => {
		let collection = constants.authorUser.author.collections[0];
		let storeBook = collection.books[1];

		await testShouldNotUpdatePriceOfStoreBook(storeBook, constants.authorUser.jwt);
	});

	it("should update title of unpublished store book of admin", async () => {
		let collection = constants.davUser.authors[0].collections[1];
		let storeBook = collection.books[1];

		await testShouldUpdateTitleOfStoreBook(collection, storeBook, constants.davUser.jwt);
	});

	it("should update title of store book in review of admin", async () => {
		let collection = constants.davUser.authors[0].collections[0];
		let storeBook = collection.books[1];

		await testShouldUpdateTitleOfStoreBook(collection, storeBook, constants.davUser.jwt);
	});

	it("should update title of published store book of admin", async () => {
		let collection = constants.davUser.authors[0].collections[0];
		let storeBook = collection.books[0];

		await testShouldUpdateTitleOfStoreBook(collection, storeBook, constants.davUser.jwt);
	});

	it("should update title of hidden store book of admin", async () => {
		let collection = constants.davUser.authors[0].collections[1];
		let storeBook = collection.books[1];

		await testShouldUpdateTitleOfStoreBook(collection, storeBook, constants.davUser.jwt);
	});

	it("should update description of unpublished store book of admin", async () => {
		let collection = constants.davUser.authors[0].collections[1];
		let storeBook = collection.books[1];

		await testShouldUpdateDescriptionOfStoreBook(collection, storeBook, constants.davUser.jwt);
	});

	it("should update description of store book in review of admin", async () => {
		let collection = constants.davUser.authors[0].collections[0];
		let storeBook = collection.books[1];

		await testShouldUpdateDescriptionOfStoreBook(collection, storeBook, constants.davUser.jwt);
	});

	it("should update description of published store book of admin", async () => {
		let collection = constants.davUser.authors[0].collections[0];
		let storeBook = collection.books[0];

		await testShouldUpdateDescriptionOfStoreBook(collection, storeBook, constants.davUser.jwt);
	});

	it("should update description of hidden store book of admin", async () => {
		let collection = constants.davUser.authors[0].collections[1];
		let storeBook = collection.books[1];

		await testShouldUpdateDescriptionOfStoreBook(collection, storeBook, constants.davUser.jwt);
	});

	it("should update language of unpublished store book of admin", async () => {
		let collection = constants.davUser.authors[0].collections[1];
		let storeBook = collection.books[1];

		await testShouldUpdateLanguageOfStoreBook(collection, storeBook, constants.davUser.jwt);
	});

	it("should update language of store book in review of admin", async () => {
		let collection = constants.davUser.authors[0].collections[0];
		let storeBook = collection.books[1];

		await testShouldUpdateLanguageOfStoreBook(collection, storeBook, constants.davUser.jwt);
	});

	it("should not update language of published store book of admin", async () => {
		let collection = constants.davUser.authors[0].collections[0];
		let storeBook = collection.books[0];

		await testShouldNotUpdateLanguageOfStoreBook(storeBook, constants.davUser.jwt);
	});

	it("should not update language of hidden store book of admin", async () => {
		let collection = constants.davUser.authors[0].collections[1];
		let storeBook = collection.books[0];

		await testShouldNotUpdateLanguageOfStoreBook(storeBook, constants.davUser.jwt);
	});

	it("should update title of unpublished store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[1];
		let storeBook = collection.books[0];

		await testShouldUpdateTitleOfStoreBook(collection, storeBook, constants.davUser.jwt, constants.authorUser.jwt);
	});

	it("should update title of store book in review of author as admin", async () => {
		let collection = constants.authorUser.author.collections[0];
		let storeBook = collection.books[0];

		await testShouldUpdateTitleOfStoreBook(collection, storeBook, constants.davUser.jwt, constants.authorUser.jwt);
	});

	it("should update title of published store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[1];
		let storeBook = collection.books[1];

		await testShouldUpdateTitleOfStoreBook(collection, storeBook, constants.davUser.jwt, constants.authorUser.jwt);
	});

	it("should update title of hidden store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[0];
		let storeBook = collection.books[1];

		await testShouldUpdateTitleOfStoreBook(collection, storeBook, constants.davUser.jwt, constants.authorUser.jwt);
	});

	it("should update description of unpublished store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[1];
		let storeBook = collection.books[0];

		await testShouldUpdateDescriptionOfStoreBook(collection, storeBook, constants.davUser.jwt, constants.authorUser.jwt);
	});

	it("should update description of store book in review of author as admin", async () => {
		let collection = constants.authorUser.author.collections[0];
		let storeBook = collection.books[0];

		await testShouldUpdateDescriptionOfStoreBook(collection, storeBook, constants.davUser.jwt, constants.authorUser.jwt);
	});

	it("should update description of published store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[1];
		let storeBook = collection.books[1];

		await testShouldUpdateDescriptionOfStoreBook(collection, storeBook, constants.davUser.jwt, constants.authorUser.jwt);
	});

	it("should update description of hidden store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[0];
		let storeBook = collection.books[1];

		await testShouldUpdateDescriptionOfStoreBook(collection, storeBook, constants.davUser.jwt, constants.authorUser.jwt);
	});

	it("should update language of unpublished store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[1];
		let storeBook = collection.books[0];

		await testShouldUpdateLanguageOfStoreBook(collection, storeBook, constants.davUser.jwt, constants.authorUser.jwt);
	});

	it("should update language of store book in review of author as admin", async () => {
		let collection = constants.authorUser.author.collections[0];
		let storeBook = collection.books[0];

		await testShouldUpdateLanguageOfStoreBook(collection, storeBook, constants.davUser.jwt, constants.authorUser.jwt);
	});

	it("should not update language of published store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[1];
		let storeBook = collection.books[1];

		await testShouldNotUpdateLanguageOfStoreBook(storeBook, constants.davUser.jwt);
	});

	it("should not update language of hidden store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[0];
		let storeBook = collection.books[1];

		await testShouldNotUpdateLanguageOfStoreBook(storeBook, constants.davUser.jwt);
	});

	it("should update price of unpublished store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[1];
		let storeBook = collection.books[0];

		await testShouldUpdatePriceOfStoreBook(collection, storeBook, constants.davUser.jwt, constants.authorUser.jwt);
	});

	it("should update price of store book in review of author as admin", async () => {
		let collection = constants.authorUser.author.collections[0];
		let storeBook = collection.books[0];

		await testShouldUpdatePriceOfStoreBook(collection, storeBook, constants.davUser.jwt, constants.authorUser.jwt);
	});

	it("should not update price of published store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[1];
		let storeBook = collection.books[1];

		await testShouldNotUpdatePriceOfStoreBook(storeBook, constants.davUser.jwt);
	});

	it("should not update price of hidden store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[0];
		let storeBook = collection.books[1];

		await testShouldNotUpdatePriceOfStoreBook(storeBook, constants.davUser.jwt);
	});

	it("should update status of unpublished store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[1];
		let storeBook = collection.books[0];

		await testShouldUpdateStatusOfStoreBook(collection, storeBook, constants.davUser.jwt, constants.authorUser.jwt);
	});

	it("should update status of store book in review of author as admin", async () => {
		let collection = constants.authorUser.author.collections[0];
		let storeBook = collection.books[0];

		await testShouldUpdateStatusOfStoreBook(collection, storeBook, constants.davUser.jwt, constants.authorUser.jwt);
	});

	it("should update status of published store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[1];
		let storeBook = collection.books[1];

		await testShouldUpdateStatusOfStoreBook(collection, storeBook, constants.davUser.jwt, constants.authorUser.jwt);
	});

	it("should update status of hidden store book of author as admin", async () => {
		let collection = constants.authorUser.author.collections[0];
		let storeBook = collection.books[1];

		await testShouldUpdateStatusOfStoreBook(collection, storeBook, constants.davUser.jwt, constants.authorUser.jwt);
	});

	it("should not publish store book without description", async () => {
		let collection = constants.authorUser.author.collections[0];
		let storeBook = collection.books[0];

		// Remove the description property from the store book
		try{
			await axios.default({
				method: 'put',
				url: `${constants.apiBaseUrl}/apps/object/${storeBook.uuid}`,
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					description: "",
					status: "unpublished"
				}
			});
		}catch(error){
			assert.fail();
		}

		// Try to publish the store book
		try{
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					published: true
				}
			});
		}catch(error){
			assert.equal(422, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(1401, error.response.data.errors[0].code);

			// Tidy up
			resetStoreBooks = true;
			return;
		}

		assert.fail();
	});

	it("should not publish store book without cover", async () => {
		let collection = constants.authorUser.author.collections[0];
		let storeBook = collection.books[0];

		// Remove the cover property from the store book
		try{
			await axios.default({
				method: 'put',
				url: `${constants.apiBaseUrl}/apps/object/${storeBook.uuid}`,
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					cover: "",
					status: "unpublished"
				}
			});
		}catch(error){
			assert.fail();
		}

		// Try to publish the store book
		try{
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					published: true
				}
			});
		}catch(error){
			assert.equal(422, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(1402, error.response.data.errors[0].code);

			// Tidy up
			resetStoreBooks = true;
			return;
		}

		assert.fail();
	});

	it("should not publish store book without file", async () => {
		let collection = constants.authorUser.author.collections[0];
		let storeBook = collection.books[0];

		// Remove the file property from the store book
		try{
			await axios.default({
				method: 'put',
				url: `${constants.apiBaseUrl}/apps/object/${storeBook.uuid}`,
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					file: "",
					status: "unpublished"
				}
			});
		}catch(error){
			assert.fail();
		}

		// Try to publish the store book
		try{
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					published: true
				}
			});
		}catch(error){
			assert.equal(422, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(1403, error.response.data.errors[0].code);

			// Tidy up
			resetStoreBooks = true;
			return;
		}

		assert.fail();
	});

	it("should publish store book", async () => {
		let collection = constants.authorUser.author.collections[0];
		let storeBook = collection.books[0];

		// Set the store book to unpublished
		try{
			await axios.default({
				method: 'put',
				url: `${constants.apiBaseUrl}/apps/object/${storeBook.uuid}`,
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					status: "unpublished"
				}
			});
		}catch(error){
			assert.fail();
		}

		// Try to publish the store book
		let response;

		try{
			response = await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					published: true
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(storeBook.uuid, response.data.uuid);
		assert.equal(collection.uuid, response.data.collection);
		assert.equal(storeBook.title, response.data.title);
		assert.equal(storeBook.description, response.data.description);
		assert.equal(storeBook.language, response.data.language);
		assert.equal("review", response.data.status);
		assert.equal(true, response.data.cover);
		assert.equal(true, response.data.file);
		assert.equal(false, response.data.in_library);
		assert.equal(false, response.data.purchased);

		// Check if the store book was updated on the server
		let objResponse;
		try{
			objResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${storeBook.uuid}`,
				headers: {
					Authorization: constants.authorUser.jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(storeBook.uuid, objResponse.data.uuid);
		assert.equal(storeBook.title, objResponse.data.properties.title);
		assert.equal(storeBook.description, objResponse.data.properties.description);
		assert.equal(storeBook.language, objResponse.data.properties.language);
		assert.equal("review", objResponse.data.properties.status);

		// Tidy up
		resetStoreBooks = true;
	});

	it("should publish hidden store book", async () => {
		let collection = constants.authorUser.author.collections[0];
		let storeBook = collection.books[1];

		// Try to publish the store book
		let response;

		try{
			response = await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					published: true
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(storeBook.uuid, response.data.uuid);
		assert.equal(collection.uuid, response.data.collection);
		assert.equal(storeBook.title, response.data.title);
		assert.equal(storeBook.description, response.data.description);
		assert.equal(storeBook.language, response.data.language);
		assert.equal("published", response.data.status);
		assert.equal(storeBook.cover != null, response.data.cover);
		assert.equal(storeBook.file != null, response.data.file);
		assert.equal(false, response.data.in_library);
		assert.equal(false, response.data.purchased);

		// Check if the store book was updated on the server
		let objResponse;
		try{
			objResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${storeBook.uuid}`,
				headers: {
					Authorization: constants.authorUser.jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(storeBook.uuid, objResponse.data.uuid);
		assert.equal(storeBook.title, objResponse.data.properties.title);
		assert.equal(storeBook.description, objResponse.data.properties.description);
		assert.equal(storeBook.language, objResponse.data.properties.language);
		assert.equal("published", objResponse.data.properties.status);

		// Tidy up
		resetStoreBooks = true;
	});

	it("should unpublish store book", async () => {
		let collection = constants.authorUser.author.collections[1];
		let storeBook = collection.books[1];
		let response;

		try{
			response = await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					published: false
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(storeBook.uuid, response.data.uuid);
		assert.equal(collection.uuid, response.data.collection);
		assert.equal(storeBook.title, response.data.title);
		assert.equal(storeBook.description, response.data.description);
		assert.equal(storeBook.language, response.data.language);
		assert.equal("hidden", response.data.status);
		assert.equal(storeBook.cover != null, response.data.cover);
		assert.equal(storeBook.file != null, response.data.file);
		assert.equal(false, response.data.in_library);
		assert.equal(false, response.data.purchased);

		// Check if the store book was updated on the server
		let objResponse;
		try{
			objResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${storeBook.uuid}`,
				headers: {
					Authorization: constants.authorUser.jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(storeBook.uuid, objResponse.data.uuid);
		assert.equal(storeBook.title, objResponse.data.properties.title);
		assert.equal(storeBook.description, objResponse.data.properties.description);
		assert.equal(storeBook.language, objResponse.data.properties.language);
		assert.equal("hidden", objResponse.data.properties.status);

		// Tidy up
		resetStoreBooks = true;
	});

	it("should not publish store book of admin without description", async () => {
		let collection = constants.davUser.authors[0].collections[0];
		let storeBook = collection.books[0];

		// Remove the description property from the store book
		try{
			await axios.default({
				method: 'put',
				url: `${constants.apiBaseUrl}/apps/object/${storeBook.uuid}`,
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					description: "",
					status: "unpublished"
				}
			});
		}catch(error){
			assert.fail();
		}

		// Try to publish the store book
		try{
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					published: true
				}
			});
		}catch(error){
			assert.equal(422, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(1401, error.response.data.errors[0].code);

			// Tidy up
			resetStoreBooks = true;
			return;
		}

		assert.fail();
	});

	it("should not publish store book of admin without cover", async () => {
		let collection = constants.davUser.authors[0].collections[0];
		let storeBook = collection.books[0];

		// Remove the cover property from the store book
		try{
			await axios.default({
				method: 'put',
				url: `${constants.apiBaseUrl}/apps/object/${storeBook.uuid}`,
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					cover: "",
					status: "unpublished"
				}
			});
		}catch(error){
			assert.fail();
		}

		// Try to publish the store book
		try{
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					published: true
				}
			});
		}catch(error){
			assert.equal(422, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(1402, error.response.data.errors[0].code);

			// Tidy up
			resetStoreBooks = true;
			return;
		}

		assert.fail();
	});

	it("should not publish store book of admin without file", async () => {
		let collection = constants.davUser.authors[0].collections[0];
		let storeBook = collection.books[0];

		// Remove the cover property from the store book
		try{
			await axios.default({
				method: 'put',
				url: `${constants.apiBaseUrl}/apps/object/${storeBook.uuid}`,
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					file: "",
					status: "unpublished"
				}
			});
		}catch(error){
			assert.fail();
		}

		// Try to publish the store book
		try{
			await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					published: true
				}
			});
		}catch(error){
			assert.equal(422, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(1403, error.response.data.errors[0].code);

			// Tidy up
			resetStoreBooks = true;
			return;
		}

		assert.fail();
	});

	it("should publish store book of admin", async () => {
		let collection = constants.davUser.authors[0].collections[0];
		let storeBook = collection.books[0];

		// Set the store book to unpublished
		try{
			await axios.default({
				method: 'put',
				url: `${constants.apiBaseUrl}/apps/object/${storeBook.uuid}`,
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					status: "unpublished"
				}
			});
		}catch(error){
			assert.fail();
		}

		// Try to publish the store book
		let response;

		try{
			response = await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					published: true
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(storeBook.uuid, response.data.uuid);
		assert.equal(collection.uuid, response.data.collection);
		assert.equal(storeBook.title, response.data.title);
		assert.equal(storeBook.description, response.data.description);
		assert.equal(storeBook.language, response.data.language);
		assert.equal("review", response.data.status);
		assert.equal(true, response.data.cover);
		assert.equal(true, response.data.file);
		assert.equal(false, response.data.in_library);
		assert.equal(false, response.data.purchased);

		// Check if the store book was updated on the server
		let objResponse;
		try{
			objResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${storeBook.uuid}`,
				headers: {
					Authorization: constants.davUser.jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(storeBook.uuid, objResponse.data.uuid);
		assert.equal(storeBook.title, objResponse.data.properties.title);
		assert.equal(storeBook.description, objResponse.data.properties.description);
		assert.equal(storeBook.language, objResponse.data.properties.language);
		assert.equal("review", objResponse.data.properties.status);

		// Tidy up
		resetStoreBooks = true;
	});

	it("should publish hidden store book of admin", async () => {
		let collection = constants.davUser.authors[0].collections[1];
		let storeBook = collection.books[0];

		// Try to publish the store book
		let response;

		try{
			response = await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					published: true
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(storeBook.uuid, response.data.uuid);
		assert.equal(collection.uuid, response.data.collection);
		assert.equal(storeBook.title, response.data.title);
		assert.equal(storeBook.description, response.data.description);
		assert.equal(storeBook.language, response.data.language);
		assert.equal("published", response.data.status);
		assert.equal(storeBook.cover != null, response.data.cover);
		assert.equal(storeBook.file != null, response.data.file);
		assert.equal(false, response.data.in_library);
		assert.equal(false, response.data.purchased);

		// Check if the store book was updated on the server
		let objResponse;
		try{
			objResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${storeBook.uuid}`,
				headers: {
					Authorization: constants.davUser.jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(storeBook.uuid, objResponse.data.uuid);
		assert.equal(storeBook.title, objResponse.data.properties.title);
		assert.equal(storeBook.description, objResponse.data.properties.description);
		assert.equal(storeBook.language, objResponse.data.properties.language);
		assert.equal("published", objResponse.data.properties.status);

		// Tidy up
		resetStoreBooks = true;
	});

	it("should unpublish store book of admin", async () => {
		let collection = constants.davUser.authors[0].collections[0];
		let storeBook = collection.books[0];
		let response;

		try{
			response = await axios.default({
				method: 'put',
				url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					published: false
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(storeBook.uuid, response.data.uuid);
		assert.equal(collection.uuid, response.data.collection);
		assert.equal(storeBook.title, response.data.title);
		assert.equal(storeBook.description, response.data.description);
		assert.equal(storeBook.language, response.data.language);
		assert.equal("hidden", response.data.status);
		assert.equal(true, response.data.cover);
		assert.equal(true, response.data.file);
		assert.equal(false, response.data.in_library);
		assert.equal(false, response.data.purchased);

		// Check if the store book was updated on the server
		let objResponse;
		try{
			objResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${storeBook.uuid}`,
				headers: {
					Authorization: constants.davUser.jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(storeBook.uuid, objResponse.data.uuid);
		assert.equal(storeBook.title, objResponse.data.properties.title);
		assert.equal(storeBook.description, objResponse.data.properties.description);
		assert.equal(storeBook.language, objResponse.data.properties.language);
		assert.equal("hidden", objResponse.data.properties.status);

		// Tidy up
		resetStoreBooks = true;
	});
});

async function testShouldUpdateTitleOfStoreBook(collection, storeBook, jwt, ownerJwt){
	let title = "Updated title";
	let response;

	try{
		response = await axios.default({
			method: 'put',
			url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
			headers: {
				Authorization: jwt,
				'Content-Type': 'application/json'
			},
			data: {
				title
			}
		});
	}catch(error){
		assert.fail();
	}

	assert.equal(200, response.status);
	assert.equal(storeBook.uuid, response.data.uuid);
	assert.equal(collection.uuid, response.data.collection);
	assert.equal(title, response.data.title);
	assert.equal(storeBook.description, response.data.description);
	assert.equal(storeBook.language, response.data.language);
	assert.equal(storeBook.price || 0, response.data.price);
	assert.equal(storeBook.status || "unpublished", response.data.status);
	assert.equal(storeBook.cover != null, response.data.cover);
	assert.equal(storeBook.file != null, response.data.file);
	assert.equal(false, response.data.in_library);
	assert.equal(false, response.data.purchased);

	// Check if the store book was updated on the server
	let objResponse;
	try{
		objResponse = await axios.default({
			method: 'get',
			url: `${constants.apiBaseUrl}/apps/object/${storeBook.uuid}`,
			headers: {
				Authorization: ownerJwt ? ownerJwt : jwt
			}
		});
	}catch(error){
		assert.fail();
	}

	assert.equal(storeBook.uuid, objResponse.data.uuid);
	assert.equal(title, objResponse.data.properties.title);
	assert.equal(storeBook.description, objResponse.data.properties.description);
	assert.equal(storeBook.language, objResponse.data.properties.language);
	assert.equal(storeBook.price, objResponse.data.properties.price);

	// Tidy up
	resetStoreBooks = true;
}

async function testShouldUpdateDescriptionOfStoreBook(collection, storeBook, jwt, ownerJwt){
	let description = "Updated description";
	let response;

	try{
		response = await axios.default({
			method: 'put',
			url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
			headers: {
				Authorization: jwt,
				'Content-Type': 'application/json'
			},
			data: {
				description
			}
		});
	}catch(error){
		assert.fail();
	}

	assert.equal(200, response.status);
	assert.equal(storeBook.uuid, response.data.uuid);
	assert.equal(collection.uuid, response.data.collection);
	assert.equal(storeBook.title, response.data.title);
	assert.equal(description, response.data.description);
	assert.equal(storeBook.language, response.data.language);
	assert.equal(storeBook.price || 0, response.data.price);
	assert.equal(storeBook.status || "unpublished", response.data.status);
	assert.equal(storeBook.cover != null, response.data.cover);
	assert.equal(storeBook.file != null, response.data.file);
	assert.equal(false, response.data.in_library);
	assert.equal(false, response.data.purchased);

	// Check if the store book was updated on the server
	let objResponse;
	try{
		objResponse = await axios.default({
			method: 'get',
			url: `${constants.apiBaseUrl}/apps/object/${storeBook.uuid}`,
			headers: {
				Authorization: ownerJwt ? ownerJwt : jwt
			}
		});
	}catch(error){
		assert.fail();
	}

	assert.equal(storeBook.uuid, objResponse.data.uuid);
	assert.equal(storeBook.title, objResponse.data.properties.title);
	assert.equal(description, objResponse.data.properties.description);
	assert.equal(storeBook.language, objResponse.data.properties.language);
	assert.equal(storeBook.price, objResponse.data.properties.price);

	// Tidy up
	resetStoreBooks = true;
}

async function testShouldUpdateLanguageOfStoreBook(collection, storeBook, jwt, ownerJwt){
	let language = "fr";
	let response;

	try{
		response = await axios.default({
			method: 'put',
			url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
			headers: {
				Authorization: jwt,
				'Content-Type': 'application/json'
			},
			data: {
				language
			}
		});
	}catch(error){
		assert.fail();
	}

	assert.equal(200, response.status);
	assert.equal(storeBook.uuid, response.data.uuid);
	assert.equal(collection.uuid, response.data.collection);
	assert.equal(storeBook.title, response.data.title);
	assert.equal(storeBook.description, response.data.description);
	assert.equal(language, response.data.language);
	assert.equal(storeBook.price || 0, response.data.price);
	assert.equal(storeBook.status || "unpublished", response.data.status);
	assert.equal(storeBook.cover != null, response.data.cover);
	assert.equal(storeBook.file != null, response.data.file);
	assert.equal(false, response.data.in_library);
	assert.equal(false, response.data.purchased);

	// Check if the store book was updated on the server
	let objResponse;
	try{
		objResponse = await axios.default({
			method: 'get',
			url: `${constants.apiBaseUrl}/apps/object/${storeBook.uuid}`,
			headers: {
				Authorization: ownerJwt ? ownerJwt : jwt
			}
		});
	}catch(error){
		assert.fail();
	}

	assert.equal(storeBook.uuid, objResponse.data.uuid);
	assert.equal(storeBook.title, objResponse.data.properties.title);
	assert.equal(storeBook.description, objResponse.data.properties.description);
	assert.equal(language, objResponse.data.properties.language);
	assert.equal(storeBook.price, objResponse.data.properties.price);

	// Tidy up
	resetStoreBooks = true;
}

async function testShouldNotUpdateLanguageOfStoreBook(storeBook, jwt){
	let language = "fr";
	
	try{
		await axios.default({
			method: 'put',
			url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
			headers: {
				Authorization: jwt,
				'Content-Type': 'application/json'
			},
			data: {
				language
			}
		});
	}catch(error){
		assert.equal(422, error.response.status);
		assert.equal(1, error.response.data.errors.length);
		assert.equal(1501, error.response.data.errors[0].code);
		return;
	}

	assert.fail();
}

async function testShouldUpdatePriceOfStoreBook(collection, storeBook, jwt, ownerJwt){
	let price = 23;
	let response;

	try{
		response = await axios.default({
			method: 'put',
			url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
			headers: {
				Authorization: jwt,
				'Content-Type': 'application/json'
			},
			data: {
				price
			}
		});
	}catch(error){
		assert.fail();
	}

	assert.equal(200, response.status);
	assert.equal(storeBook.uuid, response.data.uuid);
	assert.equal(collection.uuid, response.data.collection);
	assert.equal(storeBook.title, response.data.title);
	assert.equal(storeBook.description, response.data.description);
	assert.equal(storeBook.language, response.data.language);
	assert.equal(price, response.data.price);
	assert.equal(storeBook.status || "unpublished", response.data.status);
	assert.equal(storeBook.cover != null, response.data.cover);
	assert.equal(storeBook.file != null, response.data.file);
	assert.equal(false, response.data.in_library);
	assert.equal(false, response.data.purchased);

	// Check if the store book was updated on the server
	let objResponse;
	try{
		objResponse = await axios.default({
			method: 'get',
			url: `${constants.apiBaseUrl}/apps/object/${storeBook.uuid}`,
			headers: {
				Authorization: ownerJwt ? ownerJwt : jwt
			}
		});
	}catch(error){
		assert.fail();
	}

	assert.equal(storeBook.uuid, objResponse.data.uuid);
	assert.equal(storeBook.title, objResponse.data.properties.title);
	assert.equal(storeBook.description, objResponse.data.properties.description);
	assert.equal(storeBook.language, objResponse.data.properties.language);
	assert.equal(price, objResponse.data.properties.price);

	// Tidy up
	resetStoreBooks = true;
}

async function testShouldNotUpdatePriceOfStoreBook(storeBook, jwt){
	let price = 354;

	try{
		await axios.default({
			method: 'put',
			url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
			headers: {
				Authorization: jwt,
				'Content-Type': 'application/json'
			},
			data: {
				price
			}
		});
	}catch(error){
		assert.equal(422, error.response.status);
		assert.equal(1, error.response.data.errors.length);
		assert.equal(1502, error.response.data.errors[0].code);
		return;
	}

	assert.fail();
}

async function testShouldUpdateStatusOfStoreBook(collection, storeBook, jwt, ownerJwt){
	let status = storeBook.status == "published" ? "hidden" : "published";
	let response;

	try{
		response = await axios.default({
			method: 'put',
			url: updateStoreBookEndpointUrl.replace('{0}', storeBook.uuid),
			headers: {
				Authorization: jwt,
				'Content-Type': 'application/json'
			},
			data: {
				status
			}
		});
	}catch(error){
		assert.fail();
	}

	assert.equal(200, response.status);
	assert.equal(storeBook.uuid, response.data.uuid);
	assert.equal(collection.uuid, response.data.collection);
	assert.equal(storeBook.title, response.data.title);
	assert.equal(storeBook.description, response.data.description);
	assert.equal(storeBook.language, response.data.language);
	assert.equal(storeBook.price || 0, response.data.price);
	assert.equal(status, response.data.status);
	assert.equal(storeBook.cover != null, response.data.cover);
	assert.equal(storeBook.file != null, response.data.file);
	assert.equal(false, response.data.in_library);
	assert.equal(false, response.data.purchased);

	// Check if the store book was updated on the server
	let objResponse;
	try{
		objResponse = await axios.default({
			method: 'get',
			url: `${constants.apiBaseUrl}/apps/object/${storeBook.uuid}`,
			headers: {
				Authorization: ownerJwt ? ownerJwt : jwt
			}
		});
	}catch(error){
		assert.fail();
	}

	assert.equal(storeBook.uuid, objResponse.data.uuid);
	assert.equal(storeBook.title, objResponse.data.properties.title);
	assert.equal(storeBook.description, objResponse.data.properties.description);
	assert.equal(storeBook.language, objResponse.data.properties.language);
	assert.equal(storeBook.price, objResponse.data.properties.price);
	assert.equal(status, objResponse.data.properties.status);

	// Tidy up
	resetStoreBooks = true;
}