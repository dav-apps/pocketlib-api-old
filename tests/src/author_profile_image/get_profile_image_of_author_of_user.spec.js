var assert = require('assert');
var axios = require('axios');
var constants = require("../constants");
var utils = require('../utils');

const getProfileImageOfAuthorOfUserEndpoint = `${constants.apiBaseUrl}/api/1/call/author/profile_image`;
var resetAuthors = false;
var resetAuthorProfileImages = false;

before(async () => {
	await utils.resetDatabase();
});

afterEach(async () => {
	if(resetAuthors){
		await utils.resetAuthors();
		resetAuthors = false;
	}

	if(resetAuthorProfileImages){
		await utils.resetAuthorProfileImages();
		resetAuthorProfileImages = false;
	}
});

describe("GetProfileImageOfAuthorOfUser endpoint", async () => {
	it("should not return profile image without jwt", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getProfileImageOfAuthorOfUserEndpoint
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2101, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not return profile image with invalid jwt", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getProfileImageOfAuthorOfUserEndpoint,
				headers: {
					Authorization: "asdasdasdads"
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

	it("should should not return profile image if jwt is for another app", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getProfileImageOfAuthorOfUserEndpoint,
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

	it("should not return profile image if the author has no profile image", async () => {
		// Remove the profile image uuid from the author table object
		try{
			await axios.default({
				method: 'put',
				url: `${constants.apiBaseUrl}/apps/object/${constants.authorUserAuthor.uuid}`,
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					profile_image: ""
				}
			});
		}catch(error){
			assert.fail();
		}

		try{
			await axios.default({
				method: 'get',
				url: getProfileImageOfAuthorOfUserEndpoint,
				headers: {
					Authorization: constants.authorUserJWT
				}
			});
		}catch(error){
			assert.equal(404, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2803, error.response.data.errors[0].code);
			return;
		}finally{
			// Tidy up
			resetAuthors = true;
		}

		assert.fail();
	});

	it("should not return profile image if the user is not an author", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getProfileImageOfAuthorOfUserEndpoint,
				headers: {
					Authorization: constants.davClassLibraryTestUserJWT
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

	it("should not return profile image if the user is an admin", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getProfileImageOfAuthorOfUserEndpoint,
				headers: {
					Authorization: constants.davUserJWT
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

	it("should return profile image", async () => {
		let profileImageContent = "Lorem ipsum dolor sit amet";
		let profileImageType = "image/jpeg";

		// Set the profile image
		try{
			await axios.default({
				method: 'put',
				url: getProfileImageOfAuthorOfUserEndpoint,
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': profileImageType
				},
				data: profileImageContent
			});
		}catch(error){
			assert.fail();
		}

		// Try to get the profile image
		let response;

		try{
			response = await axios.default({
				method: 'get',
				url: getProfileImageOfAuthorOfUserEndpoint,
				headers: {
					Authorization: constants.authorUserJWT
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(200, response.status);
		assert.equal(profileImageType, response.headers['content-type']);
		assert.equal(profileImageContent, response.data);

		// Tidy up
		resetAuthorProfileImages = true;
	});
});