import chai from 'chai'
const assert = chai.assert
import axios from 'axios'
import path from 'path'
import url from 'url'
const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
import fs from 'fs'
import constants from '../constants.js'
import * as utils from '../utils.js'

const setProfileImageOfAuthorOfUserEndpointUrl = `${constants.apiBaseUrl}/api/1/call/author/profile_image`
let resetAuthorsAndAuthorProfileImages = false

afterEach(async () => {
	if(resetAuthorsAndAuthorProfileImages){
		await utils.resetAuthors()
		await utils.resetAuthorProfileImages()
		resetAuthorsAndAuthorProfileImages = false
	}
})

describe("SetProfileImageOfAuthorOfUser endpoint", () => {
	it("should not set profile image without jwt", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setProfileImageOfAuthorOfUserEndpointUrl
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2101, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not set profile image with invalid jwt", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setProfileImageOfAuthorOfUserEndpointUrl,
				headers: {
					Authorization: "cblaasdasag",
					'Content-Type': "image/png"
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

	it("should not set profile image if jwt is for another app", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setProfileImageOfAuthorOfUserEndpointUrl,
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

	it("should not set profile image without supported image content type", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setProfileImageOfAuthorOfUserEndpointUrl,
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

	it("should not set profile image if the user is not an author", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setProfileImageOfAuthorOfUserEndpointUrl,
				headers: {
					Authorization: constants.davClassLibraryTestUser.jwt,
					'Content-Type': 'image/png'
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

	it("should not set profile image if the user is an admin", async () => {
		try{
			await axios.default({
				method: 'put',
				url: setProfileImageOfAuthorOfUserEndpointUrl,
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'image/png'
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

	it("should create and update profile image", async () => {
		let author = constants.authorUser.author;
		let jwt = constants.authorUser.jwt;

		// Get the author table object
		let getAuthorObjResponse;

		try{
			getAuthorObjResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${author.uuid}`,
				headers: {
					Authorization: jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		// The author should have a profile image
		assert.isNotNull(getAuthorObjResponse.data.properties.profile_image);

		// Remove the profile image uuid from the author table object
		let updateAuthorObjResponse;

		try{
			updateAuthorObjResponse = await axios.default({
				method: 'put',
				url: `${constants.apiBaseUrl}/apps/object/${author.uuid}`,
				headers: {
					Authorization: jwt,
					'Content-Type': 'application/json'
				},
				data: {
					profile_image: ""
				}
			});
		}catch(error){
			assert.fail();
		}

		// The author now should not have a profile image
		assert.equal(null, updateAuthorObjResponse.data.properties.profile_image);

		// Upload the profile image (1)
		let filePath = path.resolve(__dirname, '../files/cover.png');
		let firstFileContent = fs.readFileSync(filePath);
		let firstFileType = "image/png";
		let firstFileExt = "png";

		try{
			await axios.default({
				method: 'put',
				url: setProfileImageOfAuthorOfUserEndpointUrl,
				headers: {
					Authorization: jwt,
					'Content-Type': firstFileType
				},
				data: firstFileContent
			});
		}catch(error){
			assert.fail();
		}

		// Get the author table object
		let getAuthorObjResponse2;

		try{
			getAuthorObjResponse2 = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${author.uuid}`,
				headers: {
					Authorization: jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		// The author should now have a profile image
		let profileImageUuid = getAuthorObjResponse2.data.properties.profile_image;
		assert(profileImageUuid != null);

		// Get the profile image table object file (1)
		let getProfileImageFileObjResponse;

		try{
			getProfileImageFileObjResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${profileImageUuid}`,
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

		assert.equal(getProfileImageFileObjResponse.data, firstFileContent);

		// Get the profile image table object (1)
		let getProfileImageObjResponse;

		try{
			getProfileImageObjResponse = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${profileImageUuid}`,
				headers: {
					Authorization: jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(firstFileType, getProfileImageObjResponse.data.properties.type);
		assert.equal(firstFileExt, getProfileImageObjResponse.data.properties.ext);

		// Update the profile image (2)
		let secondFileType = "image/jpeg";
		let secondFileExt = "jpg";
		let secondFileContent = "Labore dicta cupiditate culpa cum harum. Corporis voluptatem debitis eos nam nisi esse in vitae. Molestiae rerum nesciunt sunt sed et dolorum.";

		try{
			await axios.default({
				method: 'put',
				url: setProfileImageOfAuthorOfUserEndpointUrl,
				headers: {
					Authorization: jwt,
					'Content-Type': secondFileType
				},
				data: secondFileContent
			});
		}catch(error){
			assert.fail();
		}

		// Get the profile image table object file (2)
		let getProfileImageFileObjResponse2;

		try{
			getProfileImageFileObjResponse2 = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${profileImageUuid}`,
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

		assert.equal(getProfileImageFileObjResponse2.data, secondFileContent);

		// Get the profile image table object (2)
		let getProfileImageObjResponse2;

		try{
			getProfileImageObjResponse2 = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${profileImageUuid}`,
				headers: {
					Authorization: jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		assert.equal(secondFileType, getProfileImageObjResponse2.data.properties.type);
		assert.equal(secondFileExt, getProfileImageObjResponse2.data.properties.ext);

		// Tidy up
		resetAuthorsAndAuthorProfileImages = true;
	});
});