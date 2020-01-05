var axios = require('axios');
var constants = require('./constants');

async function resetDatabase(){
	// Delete Authors
	await deleteAuthors(constants.davUserJWT);
	await deleteAuthors(constants.davClassLibraryTestUserPocketLibJWT);

	// Reset the Author of author user
	await resetAuthorUserAuthor();

	// Delete StoreBooks
	await deleteStoreBooks(constants.davUserJWT);
	await deleteStoreBooks(constants.davClassLibraryTestUserPocketLibJWT);

	// Reset the StoreBooks of author user
	await resetAuthorUserStoreBooks();

	// Delete Covers
	await deleteStoreBookCovers(constants.davUserJWT);
	await deleteStoreBookCovers(constants.davClassLibraryTestUserPocketLibJWT);

	// Reset the Covers
	await resetAuthorUserStoreBookCovers();

	// Delete files
	await deleteStoreBookFiles(constants.davUserJWT);
	await deleteStoreBookFiles(constants.davClassLibraryTestUserPocketLibJWT);

	// Reset the Files
	await resetAuthorUserStoreBookFiles();
}

async function resetAuthorUserAuthor(){
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
				bio: constants.authorUserAuthor.bio,
				books: [constants.authorUserAuthor.books[0].uuid, constants.authorUserAuthor.books[1].uuid].join(',')
			}
		});
	}catch(error){
		console.log("Error in resetting the author of author user");
		console.log(error.response.data);
	}
}

async function resetAuthorUserStoreBooks(){
	for(let book of constants.authorUserAuthor.books){
		// Reset the StoreBook
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
					language: book.language,
					cover: book.cover ? book.cover : "",
					file: book.file ? book.file : "",
					status: book.status ? book.status : ""
				}
			});
		}catch(error){
			console.log("Error in resetting a store book");
			console.log(error.response.data);
		}
	}

	// Get the StoreBook table
	let response;
	let storeBooks = [];

	try{
		response = await axios.default({
			method: 'get',
			url: `${constants.apiBaseUrl}/apps/table/${constants.storeBookTableId}`,
			headers: {
				Authorization: constants.authorUserJWT
			}
		});

		storeBooks = response.data.table_objects;
	}catch(error){
		console.log("Error in getting the store book table");
		console.log(error.response.data);
	}

	// Delete each store book that is not part of the test database
	for(let storeBook of storeBooks){
		if(storeBook.uuid == constants.authorUserAuthor.books[0].uuid) continue;
		if(storeBook.uuid == constants.authorUserAuthor.books[1].uuid) continue;

		// Delete the store book
		await deleteTableObject(storeBook.uuid, constants.authorUserJWT);
	}
}

async function resetAuthorUserStoreBookCovers(){
	// Get the cover table
	let response;
	let covers = [];
	let coverExists = false;

	try{
		response = await axios.default({
			method: 'get',
			url: `${constants.apiBaseUrl}/apps/table/${constants.storeBookCoverTableId}`,
			headers: {
				Authorization: constants.authorUserJWT
			}
		});

		covers = response.data.table_objects;
	}catch(error){
		console.log("Error in getting the store book cover table");
		console.log(error.response.data);
	}

	// Delete each cover that is not part of the test database
	for(let cover of covers){
		if(cover.uuid == constants.authorUserAuthor.covers[0].uuid){
			coverExists = true;
		}else{
			// Delete the cover
			await deleteTableObject(cover.uuid, constants.authorUserJWT)
		}
	}

	if(!coverExists){
		// Create the cover
		try{
			await axios.default({
				method: 'post',
				url: `${constants.apiBaseUrl}/apps/object`,
				params: {
					uuid: constants.authorUserAuthor.covers[0].uuid,
					table_id: constants.storeBookCoverTableId,
					app_id: constants.pocketlibAppId,
					ext: "png"
				},
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': 'image/png'
				},
				data: "Hello World"
			});
		}catch(error){
			console.log("Error in creating cover");
			console.log(error.response.data);
		}
	}
}

async function resetAuthorUserStoreBookFiles(){
	// Get the file table
	let response;
	let files = [];
	let fileExists = false;

	try{
		response = await axios.default({
			method: 'get',
			url: `${constants.apiBaseUrl}/apps/table/${constants.storeBookFileTableId}`,
			headers: {
				Authorization: constants.authorUserJWT
			}
		});

		files = response.data.table_objects;
	}catch(error){
		console.log("Error in getting the store book file table");
		console.log(error.response.data);
	}

	// Delete each file that is not part of the test database
	for(let file of files){
		if(file.uuid == constants.authorUserAuthor.files[0].uuid){
			fileExists = true;
		}else{
			// Delete the file
			await deleteTableObject(file.uuid, constants.authorUserJWT);
		}
	}

	if(!fileExists){
		// Create the file
		try{
			await axios.default({
				method: 'post',
				url: `${constants.apiBaseUrl}/apps/object`,
				params: {
					uuid: constants.authorUserAuthor.files[0].uuid,
					table_id: constants.storeBookFileTableId,
					app_id: constants.pocketlibAppId,
					ext: "pdf"
				},
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/pdf'
				},
				data: "Hello World"
			});
		}catch(error){
			console.log("Error in creating file");
			console.log(error.response.data);
		}
	}
}

async function deleteAuthors(jwt){
	// Get the author table
	let response;
	let authors = [];

	try{
		response = await axios.default({
			method: 'get',
			url: `${constants.apiBaseUrl}/apps/table/${constants.authorTableId}`,
			headers: {
				Authorization: jwt
			}
		});

		authors = response.data.table_objects;
	}catch(error){
		console.log("Error in getting the author table");
		console.log(error.response.status);
	}

	// Delete each author
	for(let author of authors){
		await deleteTableObject(author.uuid, jwt);
	}
}

async function deleteStoreBooks(jwt){
	// Get the store book table
	let response;
	let storeBooks = [];

	try{
		response = await axios.default({
			method: 'get',
			url: `${constants.apiBaseUrl}/apps/table/${constants.storeBookTableId}`,
			headers: {
				Authorization: jwt
			}
		});

		storeBooks = response.data.table_objects;
	}catch(error){
		console.log("Error in getting the store book table");
		console.log(error.response.data);
	}

	// Delete each store book
	for(let storeBook of storeBooks){
		await deleteTableObject(storeBook.uuid, jwt);
	}
}

async function deleteStoreBookCovers(jwt){
	// Get the cover table
	let response;
	let covers = [];

	try{
		response = await axios.default({
			method: 'get',
			url: `${constants.apiBaseUrl}/apps/table/${constants.storeBookCoverTableId}`,
			headers: {
				Authorization: jwt
			}
		});

		covers = response.data.table_objects;
	}catch(error){
		console.log("Error in getting the store book cover table");
		console.log(error.response.data);
	}

	// Delete each cover
	for(let cover of covers){
		await deleteTableObject(cover.uuid, jwt);
	}
}

async function deleteStoreBookFiles(jwt){
	// Get the file table
	let response;
	let files = [];

	try{
		response = await axios.default({
			method: 'get',
			url: `${constants.apiBaseUrl}/apps/table/${constants.storeBookFileTableId}`,
			headers: {
				Authorization: jwt
			}
		});

		files = response.data.table_objects;
	}catch(error){
		console.log("Error in getting the store book cover table");
		console.log(error.response.data);
	}

	// Delete each file
	for(let file of files){
		await deleteTableObject(file.uuid);
	}
}

async function deleteTableObject(uuid, jwt){
	try{
		await axios.default({
			method: 'delete',
			url: `${constants.apiBaseUrl}/apps/object/${uuid}`,
			headers: {
				Authorization: jwt
			}
		});
	}catch(error){
		console.log("Error in deleting a TableObject");
		console.log(error.response.data);
	}
}

module.exports = {
	resetDatabase
}