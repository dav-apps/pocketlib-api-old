import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'

const getAuthorEndpointUrl = `${constants.apiBaseUrl}/api/1/call/author/{0}`

describe("GetAuthor endpoint", async () => {
	it("should not return author that does not exist", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getAuthorEndpointUrl.replace('{0}', "asdasdasd")
			});
		}catch(error){
			assert.equal(404, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2803, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not return author if the table object is not an author", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getAuthorEndpointUrl.replace('{0}', constants.davUser.authors[0].bios[0].uuid)
			});
		}catch(error){
			assert.equal(403, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(1102, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not return author with books with not supported language", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getAuthorEndpointUrl.replace('{0}', constants.authorUser.author.uuid),
				params: {
					books: true,
					language: "asd"
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

	it("should return author", async () => {
		await testGetAuthor(constants.authorUser.author);
	});

	it("should return author of admin", async () => {
		await testGetAuthor(constants.davUser.authors[0]);
	});

	it("should return author with books", async () => {
		await testGetAuthorWithBooks(constants.authorUser.author);
	});

	it("should return author with books with specified language", async () => {
		await testGetAuthorWithBooks(constants.authorUser.author, "de");
	});

	it("should return author of admin with books", async () => {
		await testGetAuthorWithBooks(constants.davUser.authors[0]);
	});

	it("should return author of admin with books with specified language", async () => {
		await testGetAuthorWithBooks(constants.davUser.authors[0], "de");
	});
});

async function testGetAuthor(author){
	let response

	try{
		response = await axios.default({
			method: 'get',
			url: getAuthorEndpointUrl.replace('{0}', author.uuid)
		})
	}catch(error){
		assert.fail()
	}

	assert.equal(200, response.status)
	assert.equal(author.uuid, response.data.uuid)
	assert.equal(author.firstName, response.data.first_name)
	assert.equal(author.lastName, response.data.last_name)
	assert.equal(author.bios.length, response.data.bios.length)
	assert.equal(author.collections.length, response.data.collections.length)
	assert.isNull(response.data.profile_image_blurhash)
	assert.equal(author.profileImage != null, response.data.profile_image)

	for(let i = 0; i < author.bios.length; i++){
		let bio = author.bios[i]
		let responseBio = response.data.bios[i]

		assert.isUndefined(responseBio.uuid)
		assert.equal(bio.bio, responseBio.bio)
		assert.equal(bio.language, responseBio.language)
	}

	for(let i = 0; i < author.collections.length; i++){
		let collection = author.collections[i]
		let responseCollection = response.data.collections[i]

		assert.equal(collection.uuid, responseCollection.uuid)

		for(let j = 0; j < collection.names.length; j++){
			let name = collection.names[j]
			let responseName = responseCollection.names[j]

			assert.isUndefined(responseName.uuid)
			assert.equal(name.name, responseName.name)
			assert.equal(name.language, responseName.language)
		}
	}
}

async function testGetAuthorWithBooks(author, language){
	let response;

	try{
		let options = {
			method: 'get',
			url: getAuthorEndpointUrl.replace('{0}', author.uuid),
			params: {
				books: true
			}
		}

		if(language){
			options.params["language"] = language;
		}

		response = await axios.default(options);
	}catch(error){
		assert.fail();
	}

	if(!language){
		language = "en";
	}

	// Find the store books
	let storeBooks = [];
	for(let collection of author.collections){
		for(let storeBook of collection.books){
			if(storeBook.status == "published" && storeBook.language == language){
				storeBooks.push(storeBook);
			}
		}
	}

	assert.equal(200, response.status)
	assert.equal(author.uuid, response.data.uuid)
	assert.equal(author.firstName, response.data.first_name)
	assert.equal(author.lastName, response.data.last_name)
	assert.equal(author.bios.length, response.data.bios.length)
	assert.equal(storeBooks.length, response.data.books.length)
	assert.isNull(response.data.profile_image_blurhash)
	assert.equal(author.profileImage != null, response.data.profile_image)

	for(let i = 0; i < author.bios.length; i++){
		let bio = author.bios[i]
		let responseBio = response.data.bios[i]

		assert.isUndefined(responseBio.uuid)
		assert.equal(bio.bio, responseBio.bio)
		assert.equal(bio.language, responseBio.language)
	}

	let i = 0
	for (let book of response.data.books) {
		assert.equal(storeBooks[i].uuid, book.uuid)
		assert.equal(storeBooks[i].title, book.title)
		assert.equal(storeBooks[i].description, book.description)
		assert.equal(storeBooks[i].language, book.language)
		assert.equal(storeBooks[i].status, book.status)
		assert.isNull(book.cover_blurhash)
		assert.equal(storeBooks[i].cover != null, book.cover)
		assert.equal(storeBooks[i].file != null, book.file)

		i++
	}
}