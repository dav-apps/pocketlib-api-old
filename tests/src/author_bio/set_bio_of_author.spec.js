var assert = require('assert');
var axios = require('axios');
var constants = require('../constants');
var utils = require('../utils');

const setBioOfAuthorEndpointUrl = `${constants.apiBaseUrl}/api/1/call/author/{0}/bio/{1}`;
resetAuthorsAndAuthorBios = false;

afterEach(async () => {
	if(resetAuthorsAndAuthorBios){
		await utils.resetAuthors();
		await utils.resetAuthorBios();
		resetAuthorsAndAuthorBios = false;
	}
});

describe("SetBioOfAuthor endpoint", () => {
	it("should not set bio without jwt", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setBioOfAuthorEndpointUrl.replace('{0}', constants.davUser.authors[0].uuid).replace('{1}', "en")
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2101, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not set bio with invalid jwt", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setBioOfAuthorEndpointUrl.replace('{0}', constants.davUser.authors[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: "a",
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

	it("should not set bio without content type json", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setBioOfAuthorEndpointUrl.replace('{0}', constants.davUser.authors[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/xml'
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

	it("should not set bio if jwt is for another app", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setBioOfAuthorEndpointUrl.replace('{0}', constants.davUser.authors[0].uuid).replace('{1}', "en"),
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

	it("should not set bio if the author does not belong to the user", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setBioOfAuthorEndpointUrl.replace('{0}', constants.authorUser.author.uuid).replace('{1}', "en"),
				headers: {
					Authorization: constants.davUser.jwt,
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

	it("should not set bio if the user is not an admin", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setBioOfAuthorEndpointUrl.replace('{0}', constants.davUser.authors[0].uuid).replace('{1}', "en"),
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

	it("should not set bio without required properties", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setBioOfAuthorEndpointUrl.replace('{0}', constants.davUser.authors[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2104, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not set bio with properties with wrong types", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setBioOfAuthorEndpointUrl.replace('{0}', constants.davUser.authors[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					bio: 12
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2203, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not set bio with too short properties", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setBioOfAuthorEndpointUrl.replace('{0}', constants.davUser.authors[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					bio: "a"
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2303, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not set bio with too long properties", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setBioOfAuthorEndpointUrl.replace('{0}', constants.davUser.authors[0].uuid).replace('{1}', "en"),
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					bio: "a".repeat(2100)
				}
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2403, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not set bio for not supported language", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setBioOfAuthorEndpointUrl.replace('{0}', constants.davUser.authors[0].uuid).replace('{1}', "bl"),
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					bio: "Hello World!!"
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

	it("should create author bio", async () => {
		let response;
		let author = constants.davUser.authors[0];
		let language = "fr";
		let bio = "Hello World";

		try{
			response = await axios.default({
				method: 'put',
				url: setBioOfAuthorEndpointUrl.replace('{0}', author.uuid).replace('{1}', language),
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					bio
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(bio, response.data.bio);
		assert.equal(language, response.data.language);

		// Check if the data was correctly saved on the server
		// Get the author
		let authorResponse;

		try{
			authorResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${author.uuid}`,
				headers: {
					Authorization: constants.davUser.jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		let responseAuthorBios = authorResponse.data.properties.bios;
		let responseAuthorBioUuids = responseAuthorBios.split(',');

		let authorBioUuids = [];
		author.bios.forEach(bio => authorBioUuids.push(bio.uuid));
		authorBioUuids.push(responseAuthorBioUuids[responseAuthorBioUuids.length - 1]);
		let authorBios = authorBioUuids.join(',');

		assert.equal(authorBioUuids.length, responseAuthorBioUuids.length);
		assert.equal(authorBios, responseAuthorBios);

		// Get the AuthorBio
		let authorBioResponse;
		let newAuthorBioUuid = responseAuthorBioUuids[responseAuthorBioUuids.length - 1];

		try{
			authorBioResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${newAuthorBioUuid}`,
				headers: {
					Authorization: constants.davUser.jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(newAuthorBioUuid, authorBioResponse.data.uuid);
		assert.equal(bio, authorBioResponse.data.properties.bio);
		assert.equal(language, authorBioResponse.data.properties.language);

		// Tidy up
		resetAuthorsAndAuthorBios = true;
	});

	it("should update author bio", async () => {
		let response;
		let author = constants.davUser.authors[0];
		let authorBio = author.bios[0];
		let authorBioUuid = authorBio.uuid;
		let language = authorBio.language;
		let bio = "Updated bio";

		try{
			response = await axios.default({
				method: 'put',
				url: setBioOfAuthorEndpointUrl.replace('{0}', author.uuid).replace('{1}', language),
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					bio
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(bio, response.data.bio);
		assert.equal(language, response.data.language);

		// Check if the data was correctly updated on the server
		// Get the author
		let authorResponse;

		try{
			authorResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${author.uuid}`,
				headers: {
					Authorization: constants.davUser.jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		let responseAuthorBios = authorResponse.data.properties.bios;
		let responseAuthorBioUuids = responseAuthorBios.split(',');

		let authorBioUuids = [];
		author.bios.forEach(bio => authorBioUuids.push(bio.uuid));
		let authorBios = authorBioUuids.join(',');

		assert.equal(authorBioUuids.length, responseAuthorBioUuids.length);
		assert.equal(authorBios, responseAuthorBios);

		// Get the AuthorBio
		let authorBioResponse;

		try{
			authorBioResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${authorBioUuid}`,
				headers: {
					Authorization: constants.davUser.jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(authorBioUuid, authorBioResponse.data.uuid);
		assert.equal(bio, authorBioResponse.data.properties.bio);
		assert.equal(language, authorBioResponse.data.properties.language);

		// Tidy up
		resetAuthorsAndAuthorBios = true;
	});
});