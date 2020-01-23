var assert = require('assert');
var axios = require('axios');
var constants = require("../constants");
var utils = require('../utils');

const getProfileImageOfAuthorEndpoint = `${constants.apiBaseUrl}/api/1/call/author/{0}/profile_image`;
var resetAuthorProfileImages = false;

before(async () => {
	await utils.resetDatabase();
});

afterEach(async () => {
	if(resetAuthorProfileImages){
		await utils.resetAuthorProfileImages();
		resetAuthorProfileImages = false;
	}
});

describe("GetProfileImageOfAuthor", async () => {
	it("should not return profile image without jwt", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getProfileImageOfAuthorEndpoint.replace('{0}', constants.davUserAuthors[0].uuid)
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
				url: getProfileImageOfAuthorEndpoint.replace('{0}', constants.davUserAuthors[0].uuid),
				headers: {
					Authorization: "asdasfasfad.sadasdas"
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

	it("should not return profile image if jwt is for another app", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getProfileImageOfAuthorEndpoint.replace('{0}', constants.davUserAuthors[0].uuid),
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
		try{
			await axios.default({
				method: 'get',
				url: getProfileImageOfAuthorEndpoint.replace('{0}', constants.davUserAuthors[1].uuid),
				headers: {
					Authorization: constants.authorUserJWT
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

	it("should not return profile image if the author does not exist", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getProfileImageOfAuthorEndpoint.replace('{0}', "adasdasdasdasad"),
				headers: {
					Authorization: constants.davUserJWT
				}
			});
		}catch(error){
			assert.equal(404, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2802, error.response.data.errors[0].code);
			return;
		}
	});

	it("should return profile image as admin", async () => {
		let author = constants.davUserAuthors[0];
		let profileImageContent = "Lorem ipsum dolor sit amet";
		let profileImageType = "image/jpeg";

		// Set the profile image
		await setProfileImageOfAuthor(constants.davUserJWT, author.uuid, profileImageType, profileImageContent);

		// Try to get the profile image
		let response;

		try{
			response = await axios.default({
				method: 'get',
				url: getProfileImageOfAuthorEndpoint.replace('{0}', author.uuid),
				headers: {
					Authorization: constants.davUserJWT
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

	it("should return profile image as another author", async () => {
		let author = constants.davUserAuthors[0];
		let profileImageContent = "Lorem ipsum dolor sit amet";
		let profileImageType = "image/jpeg";

		// Set the profile image
		await setProfileImageOfAuthor(constants.davUserJWT, author.uuid, profileImageType, profileImageContent);

		// Try to get the profile image
		let response;

		try{
			response = await axios.default({
				method: 'get',
				url: getProfileImageOfAuthorEndpoint.replace('{0}', author.uuid),
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

	it("should return profile image as normal user", async () => {
		let author = constants.davUserAuthors[0];
		let profileImageContent = "Lorem ipsum dolor sit amet";
		let profileImageType = "image/jpeg";

		// Set the profile image
		await setProfileImageOfAuthor(constants.davUserJWT, author.uuid, profileImageType, profileImageContent);

		// Try to get the profile image
		let response;

		try{
			response = await axios.default({
				method: 'get',
				url: getProfileImageOfAuthorEndpoint.replace('{0}', author.uuid),
				headers: {
					Authorization: constants.davClassLibraryTestUserJWT
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

	it("should return profile image of author of user as admin", async () => {
		let author = constants.authorUserAuthor;
		let profileImageContent = "Lorem ipsum dolor sit amet";
		let profileImageType = "image/jpeg";

		// Set the profile image
		await setProfileImageOfAuthorOfUser(constants.authorUserJWT, profileImageType, profileImageContent);

		// Try to get the profile image
		let response;

		try{
			response = await axios.default({
				method: 'get',
				url: getProfileImageOfAuthorEndpoint.replace('{0}', author.uuid),
				headers: {
					Authorization: constants.davUserJWT
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

	it("should return profile image of author of user as author", async () => {
		let author = constants.authorUserAuthor;
		let profileImageContent = "Lorem ipsum dolor sit amet";
		let profileImageType = "image/jpeg";

		// Set the profile image
		await setProfileImageOfAuthorOfUser(constants.authorUserJWT, profileImageType, profileImageContent);

		// Try to get the profile image
		let response;

		try{
			response = await axios.default({
				method: 'get',
				url: getProfileImageOfAuthorEndpoint.replace('{0}', author.uuid),
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

	it("should return profile image of author of user as normal user", async () => {
		let author = constants.authorUserAuthor;
		let profileImageContent = "Lorem ipsum dolor sit amet";
		let profileImageType = "image/jpeg";

		// Set the profile image
		await setProfileImageOfAuthorOfUser(constants.authorUserJWT, profileImageType, profileImageContent);

		// Try to get the profile image
		let response;

		try{
			response = await axios.default({
				method: 'get',
				url: getProfileImageOfAuthorEndpoint.replace('{0}', author.uuid),
				headers: {
					Authorization: constants.davClassLibraryTestUserJWT
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

async function setProfileImageOfAuthor(jwt, uuid, type, content){
	try{
		await axios.default({
			method: 'put',
			url: getProfileImageOfAuthorEndpoint.replace('{0}', uuid),
			headers: {
				Authorization: jwt,
				'Content-Type': type
			},
			data: content
		});
	}catch(error){
		assert.fail();
	}
}

async function setProfileImageOfAuthorOfUser(jwt, type, content){
	try{
		await axios.default({
			method: 'put',
			url: `${constants.apiBaseUrl}/api/1/call/author/profile_image`,
			headers: {
				Authorization: jwt,
				'Content-Type': type
			},
			data: content
		});
	}catch(error){
		assert.fail();
	}
}