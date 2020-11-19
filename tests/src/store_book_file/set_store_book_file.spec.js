import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import path from 'path'
import url from 'url'
const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
import fs from 'fs'
import constants from '../constants.js'
import * as utils from '../utils.js'

const setStoreBookFileEndpointUrl = `${constants.apiBaseUrl}/api/1/call/store/book/{0}/file`
var resetStoreBooksAndStoreBookFiles = false

afterEach(async () => {
	if(resetStoreBooksAndStoreBookFiles){
		await utils.resetStoreBooks()
		await utils.resetStoreBookFiles()
		resetStoreBooksAndStoreBookFiles = false
	}
})

describe("SetStoreBookFile endpoint", () => {
	it("should not set store book file without jwt", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setStoreBookFileEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid)
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2101, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not set store book file with invalid jwt", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setStoreBookFileEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: "blablabla",
					'Content-Type': 'application/pdf'
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

	it("should not set store book file if jwt is for another app", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setStoreBookFileEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: constants.davClassLibraryTestUserTestAppJWT,
					'Content-Type': 'application/epub+zip'
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

	it("should not set store book file without supported ebook content type", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setStoreBookFileEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
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

	it("should not set store book file for store book that does not exist", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setStoreBookFileEndpointUrl.replace('{0}', "blablabla"),
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/pdf'
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

	it("should not set store book file for store book that does not belong to the author", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setStoreBookFileEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/epub+zip'
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

	it("should not set store book file for published store book", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setStoreBookFileEndpointUrl.replace('{0}', constants.authorUser.author.collections[1].books[1].uuid),
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/pdf'
				},
				data: "Hello World"
			});
		}catch(error){
			assert.equal(422, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(1504, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not set store book cover for hidden store book", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setStoreBookFileEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[1].uuid),
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/pdf'
				},
				data: "Hello World"
			});
		}catch(error){
			assert.equal(422, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(1504, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should create and update store book file", async () => {
		await testCreateAndUpdateStoreBookFile(constants.authorUser.author.collections[2].books[0], constants.authorUser.jwt);

		// Tidy up
		resetStoreBooksAndStoreBookFiles = true;
	});

	it("should not set store book file for published store book of admin", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setStoreBookFileEndpointUrl.replace('{0}', constants.davUser.authors[0].collections[0].books[0].uuid),
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/pdf'
				},
				data: "Hello World"
			});
		}catch(error){
			assert.equal(422, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(1504, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not set store book file for hidden store book of admin", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setStoreBookFileEndpointUrl.replace('{0}', constants.davUser.authors[0].collections[1].books[0].uuid),
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/pdf'
				},
				data: "Hello World"
			});
		}catch(error){
			assert.equal(422, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(1504, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should create and update store book file of store book of an admin", async () => {
		await testCreateAndUpdateStoreBookFile(constants.davUser.authors[0].collections[0].books[2], constants.davUser.jwt);

		// Tidy up
		resetStoreBooksAndStoreBookFiles = true;
	});

	async function testCreateAndUpdateStoreBookFile(storeBook, jwt){
		// Get the store book table object
		let getStoreBookObjResponse;

		try{
			getStoreBookObjResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${storeBook.uuid}`,
				headers: {
					Authorization: jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		// The store book should not have a file
		assert.equal(null, getStoreBookObjResponse.data.properties.file);

		// Upload the file (1)
		let fileName = "animal_farm.pdf"
		let filePath = path.resolve(__dirname, `../files/${fileName}`)
		let firstFileContent = fs.readFileSync(filePath)
		let firstFileType = "application/pdf"
		let firstFileExt = "pdf"

		try{
			await axios.default({
				method: 'put',
				url: setStoreBookFileEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: jwt,
					'Content-Type': firstFileType,
					'Content-Disposition': `attachment; filename="${fileName}"`
				},
				data: firstFileContent
			})
		}catch(error){
			assert.fail()
		}

		// Get the store book table object
		let getStoreBookObjResponse2

		try{
			getStoreBookObjResponse2 = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${storeBook.uuid}`,
				headers: {
					Authorization: jwt
				}
			})
		}catch(error){
			assert.fail()
		}

		// The store book should now have a file
		let fileUuid = getStoreBookObjResponse2.data.properties.file
		assert.isNotNull(fileUuid)
		assert.equal(fileName, getStoreBookObjResponse2.data.properties.file_name)

		// Get the file table object file (1)
		let getFileFileObjResponse

		try{
			getFileFileObjResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${fileUuid}`,
				params: {
					file: true
				},
				headers: {
					Authorization: jwt
				}
			})
		}catch(error){
			assert.fail()
		}

		assert.equal(getFileFileObjResponse.data, firstFileContent)

		// Get the file table object (1)
		let getFileObjResponse

		try{
			getFileObjResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${fileUuid}`,
				headers: {
					Authorization: jwt
				}
			})
		}catch(error){
			assert.fail()
		}

		assert.equal(firstFileType, getFileObjResponse.data.properties.type)
		assert.equal(firstFileExt, getFileObjResponse.data.properties.ext)

		// Update the file (2)
		let secondFileName = "test.epub"
		let secondFileType = "application/epub+zip"
		let secondFileExt = "epub"
		let secondFileContent = "Labore dicta cupiditate culpa cum harum. Corporis voluptatem debitis eos nam nisi esse in vitae. Molestiae rerum nesciunt sunt sed et dolorum."

		try{
			await axios.default({
				method: 'put',
				url: setStoreBookFileEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: jwt,
					'Content-Type': secondFileType,
					'Content-Disposition': `attachment; filename="${secondFileName}"`
				},
				data: secondFileContent
			})
		}catch(error){
			assert.fail()
		}

		// Get the file table object file (2)
		let getFileFileObjResponse2

		try{
			getFileFileObjResponse2 = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${fileUuid}`,
				params: {
					file: true
				},
				headers: {
					Authorization: jwt
				}
			})
		}catch(error){
			assert.fail()
		}

		assert.equal(getFileFileObjResponse2.data, secondFileContent)

		// Get the file table object (2)
		let getFileObjResponse2

		try{
			getFileObjResponse2 = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${fileUuid}`,
				headers: {
					Authorization: jwt
				}
			})
		}catch(error){
			assert.fail()
		}

		assert.equal(secondFileType, getFileObjResponse2.data.properties.type)
		assert.equal(secondFileExt, getFileObjResponse2.data.properties.ext)
	}
});