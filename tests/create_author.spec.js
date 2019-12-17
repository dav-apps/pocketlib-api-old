var assert = require('assert');
var axios = require('axios');

describe("CreateAuthor endpoint", () => {
	it("should not create author without jwt", async () => {
		try{
			await axios.default({
				method: 'post',
				url: 'http://localhost:3111/v1/api/1/call/author'
			});

			assert.fail();
		}catch(error){
			assert.equal(2102, error.response.data.errors[0].code);
		}
	});
});