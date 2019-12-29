var axios = require('axios');
var constants = require('./constants');

async function resetAuthors(){
	// Delete the author of dav user
	// Get the author table
	let response;
	let authorObjUuid;

	try{
		response = await axios.default({
			method: 'get',
			url: `${constants.apiBaseUrl}/apps/table/${constants.authorTableId}`,
			headers: {
				Authorization: constants.davUserJWT
			}
		});

		if(response.data.table_objects.length > 0){
			authorObjUuid = response.data.table_objects[0].uuid;
		}
	}catch(error){
		console.log("Error in trying to get the author table");
		console.log(error.response.data);
	}

	if(authorObjUuid){
		// Delete the author object
		try{
			await axios.default({
				method: 'delete',
				url: `${constants.apiBaseUrl}/apps/object/${authorObjUuid}`,
				headers: {
					Authorization: constants.davUserJWT
				}
			});
		}catch(error){
			console.log("Error in trying to delete the author object");
			console.log(error.response.data);
		}
	}

	// Reset the author of author user
	try{
		await axios.default({
			method: 'put',
			url: `${constants.apiBaseUrl}/apps/object/${constants.authorUserAuthor.uuid}`,
			headers: {
				Authorization: constants.authorUserJWT,
				'Content-Type': 'application/json'
			},
			data: {
				first_name: constants.authorUserAuthor.firstName,
				last_name: constants.authorUserAuthor.lastName,
				bio: constants.authorUserAuthor.bio
			}
		});
	}catch(error){
		console.log("Error in resetting the author of the author user");
		console.log(error.response.data);
	}
}

async function resetStoreBooks(){
	// Delete all store books that are not part of the default test database
	let response;
	let storeBookObjects;

	try{
		response = await axios.default({
			method: 'get',
			url: `${constants.apiBaseUrl}/apps/table/${constants.storeBookTableId}`,
			headers: {
				Authorization: constants.authorUserJWT
			}
		});

		storeBookObjects = response.data.table_objects;
	}catch(error){
		console.log("Error in trying the get the store book table");
		console.log(error.response.data);
	}

	if(storeBookObjects){
		for(let tableObject of storeBookObjects){
			if(tableObject.uuid == constants.authorUserAuthor.books[0].uuid) continue;

			// Delete the table object
			try{
				await axios.default({
					method: 'delete',
					url: `${constants.apiBaseUrl}/apps/object/${tableObject.uuid}`,
					headers: {
						Authorization: constants.authorUserJWT
					}
				});
			}catch(error){
				console.log("Error in trying to delete a store book object");
				console.log(error.response.data);
			}
		}
	}

	// Reset the store books
	let bookUuids = [];

	for(let book of constants.authorUserAuthor.books){
		bookUuids.push(book.uuid);

		try{
			await axios.default({
				method: 'put',
				url: `${constants.apiBaseUrl}/apps/object/${book.uuid}`,
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					author: constants.authorUserAuthor.uuid,
					title: book.title,
					description: book.description,
					language: book.language
				}
			});
		}catch(error){
			console.log("Error in resetting a store book");
			console.log(error.response.data);
		}
	}

	// Reset the books property of the author
	try{
		await axios.default({
			method: 'put',
			url: `${constants.apiBaseUrl}/apps/object/${constants.authorUserAuthor.uuid}`,
			headers: {
				Authorization: constants.authorUserJWT,
				'Content-Type': 'application/json'
			},
			data: {
				books: bookUuids.join(',')
			}
		});
	}catch(error){
		console.log("Error in resetting the books property of the author");
		console.log(error.response.data);
	}
}

module.exports = {
	resetAuthors,
	resetStoreBooks
}