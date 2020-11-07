import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import constants from '../constants.js'

const getAuthorOfUserEndpointUrl = `${constants.apiBaseUrl}/api/1/call/author`

describe("GetAuthorOfUser endpoint", () => {
	it("should not return author without jwt", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getAuthorOfUserEndpointUrl
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2101, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not return author with invalid jwt", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getAuthorOfUserEndpointUrl,
				headers: {
					Authorization: "asdasdasdasdasd"
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

	it("should not return author if jwt is for another app", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getAuthorOfUserEndpointUrl,
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

	it("should not return author if the user is not an author", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getAuthorOfUserEndpointUrl,
				headers: {
					Authorization: constants.davClassLibraryTestUser.jwt
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

	it("should return the author", async () => {
		let response

		try{
			response = await axios.default({
				method: 'get',
				url: getAuthorOfUserEndpointUrl,
				headers: {
					Authorization: constants.authorUser.jwt
				}
			})
		}catch(error){
			assert.fail()
		}

		assert.equal(200, response.status)
		assert.equal(constants.authorUser.author.uuid, response.data.uuid)
		assert.equal(constants.authorUser.author.firstName, response.data.first_name)
		assert.equal(constants.authorUser.author.lastName, response.data.last_name)
		assert.equal(constants.authorUser.author.bios.length, response.data.bios.length)
		assert.equal(constants.authorUser.author.collections.length, response.data.collections.length)
		assert.isNull(response.data.profile_image_blurhash)
		assert.isTrue(response.data.profile_image)

		for(let i = 0; i < constants.authorUser.author.bios.length; i++){
			let bio = constants.authorUser.author.bios[i]
			let responseBio = response.data.bios[i]

			assert.isUndefined(responseBio.uuid)
			assert.equal(bio.bio, responseBio.bio)
			assert.equal(bio.language, responseBio.language)
		}

		for(let i = 0; i < constants.authorUser.author.collections.length; i++){
			let collection = constants.authorUser.author.collections[i]
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
	});

	it("should return all authors of the user if the user is an admin", async () => {
		let response;

		try{
			response = await axios.default({
				method: 'get',
				url: getAuthorOfUserEndpointUrl,
				headers: {
					Authorization: constants.davUser.jwt
				}
			})
		}catch(error){
			assert.fail()
		}

		assert.equal(200, response.status)
		
		for(let i = 0; i < constants.davUser.authors.length; i++){
			let author = constants.davUser.authors[i]
			let responseAuthor = response.data.authors[i]

			assert.equal(author.uuid, responseAuthor.uuid)
			assert.equal(author.firstName, responseAuthor.first_name)
			assert.equal(author.lastName, responseAuthor.last_name)
			assert.equal(author.bios.length, responseAuthor.bios.length)
			assert.equal(author.collections.length, responseAuthor.collections.length)
			assert.isNull(responseAuthor.profile_image_blurhash)
			assert.equal(author.profileImage != null, responseAuthor.profile_image)

			for(let i = 0; i < author.bios.length; i++){
				let bio = author.bios[i]
				let responseBio = responseAuthor.bios[i]

				assert.isUndefined(responseBio.uuid)
				assert.equal(bio.bio, responseBio.bio)
				assert.equal(bio.language, responseBio.language)
			}

			for(let j = 0; j < author.collections.length; j++){
				let collection = author.collections[j]
				let responseCollection = responseAuthor.collections[j]

				assert.equal(collection.uuid, responseCollection.uuid)

				for(let k = 0; k < collection.names.length; k++){
					let name = collection.names[k]
					let responseName = responseCollection.names[k]

					assert.isUndefined(responseName.uuid)
					assert.equal(name.name, responseName.name)
					assert.equal(name.language, responseName.language)
				}
			}
		}
	});
});