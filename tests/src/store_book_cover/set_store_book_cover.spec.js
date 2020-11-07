import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import path from 'path'
import url from 'url'
const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
import fs from 'fs'
import constants from '../constants.js'
import * as utils from '../utils.js'

const setStoreBookCoverEndpointUrl = `${constants.apiBaseUrl}/api/1/call/store/book/{0}/cover`
var resetStoreBooksAndStoreBookCovers = false

afterEach(async () => {
	if(resetStoreBooksAndStoreBookCovers){
		await utils.resetStoreBooks()
		await utils.resetStoreBookCovers()
		resetStoreBooksAndStoreBookCovers = false
	}
})

describe("SetStoreBookCover endpoint", () => {
	it("should not set store book cover without jwt", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setStoreBookCoverEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid)
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2101, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not set store book cover with invalid jwt", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setStoreBookCoverEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: "blablabla",
					'Content-Type': 'image/png'
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

	it("should not set store book cover if jwt is for another app", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setStoreBookCoverEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: constants.davClassLibraryTestUserTestAppJWT,
					'Content-Type': 'image/jpeg'
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

	it("should not set store book cover without supported image content type", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setStoreBookCoverEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
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

	it("should not set store book cover for store book that does not exist", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setStoreBookCoverEndpointUrl.replace('{0}', "blablabla"),
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'image/png'
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

	it("should not set store book cover for store book that does not belong to the author", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setStoreBookCoverEndpointUrl.replace('{0}', constants.authorUser.author.collections[0].books[0].uuid),
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'image/jpeg'
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

	it("should set store book cover for published store book", async () => {
		await testUpdateStoreBookCover(constants.authorUser.author.collections[1].books[1], constants.authorUser.jwt)

		// Tidy up
		resetStoreBooksAndStoreBookCovers = true;
	})

	it("should set store book cover for hidden store book", async () => {
		await testUpdateStoreBookCover(constants.authorUser.author.collections[0].books[1], constants.authorUser.jwt)

		// Tidy up
		resetStoreBooksAndStoreBookCovers = true;
	})

	it("should create and update store book cover", async () => {
		await testCreateAndUpdateStoreBookCover(constants.authorUser.author.collections[2].books[0], constants.authorUser.jwt);

		// Tidy up
		resetStoreBooksAndStoreBookCovers = true;
	});

	it("should set store book cover for published store book of admin", async () => {
		await testUpdateStoreBookCover(constants.davUser.authors[0].collections[0].books[0], constants.davUser.jwt)

		// Tidy up
		resetStoreBooksAndStoreBookCovers = true;
	});

	it("should set store book cover for hidden store book of admin", async () => {
		await testCreateAndUpdateStoreBookCover(constants.davUser.authors[0].collections[1].books[0], constants.davUser.jwt)

		// Tidy up
		resetStoreBooksAndStoreBookCovers = true;
	});

	it("should create and update store book cover of store book of an admin", async () => {
		await testCreateAndUpdateStoreBookCover(constants.davUser.authors[0].collections[0].books[1], constants.davUser.jwt);

		// Tidy up
		resetStoreBooksAndStoreBookCovers = true;
	});

	async function testCreateAndUpdateStoreBookCover(storeBook, jwt){
		// Get the store book table object (1)
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

		// The store book should not have a cover
		assert.equal(null, getStoreBookObjResponse.data.properties.cover);

		// Upload the cover (1)
		let filePath = path.resolve(__dirname, '../files/cover.png');
		let firstFileContent = fs.readFileSync(filePath);
		let firstFileType = "image/png";
		let firstFileExt = "png";

		try{
			await axios.default({
				method: 'put',
				url: setStoreBookCoverEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: jwt,
					'Content-Type': firstFileType
				},
				data: firstFileContent
			});
		}catch(error){
			assert.fail();
		}

		// Get the store book table object (2)
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

		// The store book should now have a cover and a cover_blurhash
		let coverUuid = getStoreBookObjResponse2.data.properties.cover
		assert.isNotNull(coverUuid)
		assert.isNotNull(getStoreBookObjResponse2.data.properties.cover_blurhash)

		// Get the cover table object file (1)
		let getCoverFileObjResponse;

		try{
			getCoverFileObjResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${coverUuid}`,
				params: {
					file: true
				},
				headers: {
					Authorization: jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(getCoverFileObjResponse.data, firstFileContent);

		// Get the cover table object (1)
		let getCoverObjResponse;

		try{
			getCoverObjResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${coverUuid}`,
				headers: {
					Authorization: jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(firstFileType, getCoverObjResponse.data.properties.type);
		assert.equal(firstFileExt, getCoverObjResponse.data.properties.ext);

		// Update the cover (2)
		let secondFileType = "image/jpeg";
		let secondFileExt = "jpg";
		let secondFileContent = "Labore dicta cupiditate culpa cum harum. Corporis voluptatem debitis eos nam nisi esse in vitae. Molestiae rerum nesciunt sunt sed et dolorum.";

		try{
			await axios.default({
				method: 'put',
				url: setStoreBookCoverEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: jwt,
					'Content-Type': secondFileType
				},
				data: secondFileContent
			});
		}catch(error){
			assert.fail();
		}

		// Get the store book table object (3)
		let getStoreBookObjResponse3

		try {
			getStoreBookObjResponse3 = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${storeBook.uuid}`,
				headers: {
					Authorization: jwt
				}
			})
		} catch (error) {
			assert.fail()
		}

		// The cover_blurhash of the store book should be null
		assert.equal(coverUuid, getStoreBookObjResponse3.data.properties.cover)
		assert.isNull(getStoreBookObjResponse3.data.properties.cover_blurhash)

		// Get the cover table object file (2)
		let getCoverFileObjResponse2;

		try{
			getCoverFileObjResponse2 = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${coverUuid}`,
				params: {
					file: true
				},
				headers: {
					Authorization: jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(getCoverFileObjResponse2.data, secondFileContent);

		// Get the cover table object (2)
		let getCoverObjResponse2;

		try{
			getCoverObjResponse2 = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${coverUuid}`,
				headers: {
					Authorization: jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(secondFileType, getCoverObjResponse2.data.properties.type)
		assert.equal(secondFileExt, getCoverObjResponse2.data.properties.ext)
	}

	async function testUpdateStoreBookCover(storeBook, jwt) {
		// Get the store book table object (1)
		let getStoreBookObjResponse

		try {
			getStoreBookObjResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${storeBook.uuid}`,
				headers: {
					Authorization: jwt
				}
			})
		} catch (error) {
			assert.fail()
		}

		// The store book should have a cover
		let coverUuid = getStoreBookObjResponse.data.properties.cover
		assert.isNotNull(coverUuid)

		// Upload the cover (1)
		let filePath = path.resolve(__dirname, '../files/cover.png');
		let firstFileContent = fs.readFileSync(filePath);
		let firstFileType = "image/png";
		let firstFileExt = "png";

		try {
			await axios.default({
				method: 'put',
				url: setStoreBookCoverEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: jwt,
					'Content-Type': firstFileType
				},
				data: firstFileContent
			})
		} catch (error) {
			assert.fail()
		}

		// Get the store book table object (2)
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

		// The store book should have the cover and a cover_blurhash
		assert.equal(coverUuid, getStoreBookObjResponse2.data.properties.cover)
		assert.isNotNull(getStoreBookObjResponse2.data.properties.cover_blurhash)

		// Get the cover table object file (1)
		let getCoverFileObjResponse

		try {
			getCoverFileObjResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${coverUuid}`,
				params: {
					file: true
				},
				headers: {
					Authorization: jwt
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(getCoverFileObjResponse.data, firstFileContent);

		// Get the cover table object (1)
		let getCoverObjResponse;

		try {
			getCoverObjResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${coverUuid}`,
				headers: {
					Authorization: jwt
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(firstFileType, getCoverObjResponse.data.properties.type)
		assert.equal(firstFileExt, getCoverObjResponse.data.properties.ext)

		// Update the cover (2)
		let secondFileType = "image/jpeg";
		let secondFileExt = "jpg";
		let secondFileContent = "Labore dicta cupiditate culpa cum harum. Corporis voluptatem debitis eos nam nisi esse in vitae. Molestiae rerum nesciunt sunt sed et dolorum.";

		try {
			await axios.default({
				method: 'put',
				url: setStoreBookCoverEndpointUrl.replace('{0}', storeBook.uuid),
				headers: {
					Authorization: jwt,
					'Content-Type': secondFileType
				},
				data: secondFileContent
			})
		} catch (error) {
			assert.fail()
		}

		// Get the store book table object (3)
		let getStoreBookObjResponse3

		try {
			getStoreBookObjResponse3 = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${storeBook.uuid}`,
				headers: {
					Authorization: jwt
				}
			})
		} catch (error) {
			assert.fail()
		}

		// The cover_blurhash of the store book should be null
		assert.equal(coverUuid, getStoreBookObjResponse3.data.properties.cover)
		assert.isNull(getStoreBookObjResponse3.data.properties.cover_blurhash)

		// Get the cover table object file (2)
		let getCoverFileObjResponse2

		try {
			getCoverFileObjResponse2 = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${coverUuid}`,
				params: {
					file: true
				},
				headers: {
					Authorization: jwt
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(getCoverFileObjResponse2.data, secondFileContent)

		// Get the cover table object (2)
		let getCoverObjResponse2

		try {
			getCoverObjResponse2 = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${coverUuid}`,
				headers: {
					Authorization: jwt
				}
			})
		} catch (error) {
			assert.fail()
		}

		assert.equal(secondFileType, getCoverObjResponse2.data.properties.type)
		assert.equal(secondFileExt, getCoverObjResponse2.data.properties.ext)
	}
});